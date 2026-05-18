const ResourceService = require('../services/resourceService');
const { supabase } = require('../config/database');
const NewsService = require('../services/newsService');
const LeaderboardService = require('../services/leaderboardService');

const ResourceController = {
  /**
   * Endpoint untuk sinkronisasi sumber daya pemain (Logic Database)
   */
  syncResources: async (req, res) => {
    try {
      const authUser = req.user || {};
      const authUserId = authUser.id;
      const bodyUserId = req.body.userId;
      if (authUserId && bodyUserId && String(authUserId) !== String(bodyUserId)) {
        return res.status(403).json({ success: false, message: "User ID tidak valid untuk token ini." });
      }

      const userId = authUserId || bodyUserId;
      const username = authUser.username || `user_${userId}`;
      if (!userId) return res.status(400).json({ success: false, message: "User ID diperlukan." });

      const activeNews = await NewsService.generateDailyNews();
      
      const { data: resources, error: fetchError } = await supabase
        .from('resources')
        .select('*')
        .eq('user_id', userId);

      if (fetchError) throw fetchError;

      const now = new Date();
      
      // Update semua resource ke database
      for (const item of (resources || [])) {
        if (parseFloat(item.base_production_rate) > 0) {
            const lastUpdate = new Date(item.updated_at || item.created_at || now.toISOString());
            const safeLastUpdateMs = Number.isNaN(lastUpdate.getTime()) ? now.getTime() : lastUpdate.getTime();
            const secondsPassed = Math.max(0, (now.getTime() - safeLastUpdateMs) / 1000);
            
            // Debugging: Pastikan secondsPassed > 0
            //console.log(`Resource: ${item.resource_type}, Seconds Passed: ${secondsPassed}`);
    
            let multiplier = 1.0;
            if (activeNews && activeNews.affected_resource === item.resource_type) {
              const parsedMultiplier = parseFloat(activeNews.multiplier);
              multiplier = Number.isFinite(parsedMultiplier) ? parsedMultiplier : 1.0;
            }
    
            // Hitung gain (per jam)
            const speedFactor = 100.0; // Naikkan angka ini untuk mempercepat produksi
            const gain = (secondsPassed / 3600) * parseFloat(item.base_production_rate) * multiplier * speedFactor;
            const newAmount = parseFloat(item.amount) + gain;
            
            // PENTING: Gunakan await dan pastikan updated_at adalah 'now'
            const { error: updateError } = await supabase
                .from('resources')
                .update({ 
                    amount: newAmount,
                    updated_at: now.toISOString() // Sinkronkan waktu update
                })
                .eq('id', item.id);
    
            if (updateError) throw updateError;
        }
    }

      // Ambil data terbaru SETELAH update selesai
      const { data: updated, error: updatedError } = await supabase
        .from('resources')
        .select('*')
        .eq('user_id', userId);
      if (updatedError) throw updatedError;

      // --- LOGIKA LEADERBOARD: PANGGIL SEKALI SAJA DI SINI ---
      const goldData = (updated || []).find(r => r.resource_type === 'GOLD');
      if (goldData) {
        await LeaderboardService.updateScore(userId, username, goldData.amount);
      }
      
      return res.status(200).json({ 
        success: true, 
        data: { resources: updated, activeNews: activeNews } 
      });

    } catch (error) {
      console.error("Sync Error:", error.message);
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  /**
   * Endpoint untuk menjual resource (1 Unit per klik)
   */
  sellResource: async (req, res) => {
    const authUserId = req.user && req.user.id;
    const bodyUserId = req.body.userId;
    if (authUserId && bodyUserId && String(authUserId) !== String(bodyUserId)) {
      return res.status(403).json({ success: false, message: "User ID tidak valid untuk token ini." });
    }

    const userId = authUserId || bodyUserId;
    const { itemId } = req.body;
    if (!userId || !itemId) {
      return res.status(400).json({ success: false, message: "User ID dan item ID diperlukan." });
    }

    const itemKey = itemId.toUpperCase();
    const prices = { 
      "WOOD": 5, 
      "STONE": 10,
      "SAND": 10, 
      "IRON_ORE": 15,
      "COPPER_ORE": 12,
      "GOLD_ORE": 50,
      "OIL": 100,
      "RESIN": 100,
      "PLANK": 60,       // Sama dengan harga di Godot
      "IRON_BAR": 150, 
      "GEAR": 250, 
      "COMPONENT": 1000,
      "HOUSE": 50000 
    };
      const sellPrice = prices[itemKey] || 1;

    try {
        const { data: itemRes, error: itemError } = await supabase.from('resources')
          .select('amount').eq('user_id', userId).eq('resource_type', itemKey).single();
        if (itemError) throw itemError;

        if (!itemRes || parseFloat(itemRes.amount) < 1) {
            return res.status(400).json({ success: false, message: "Barang tidak cukup!" });
        }

        // Kurangi 1 barang & Tambah Gold
        const { error: sellUpdateError } = await supabase.from('resources').update({ amount: parseFloat(itemRes.amount) - 1 })
          .eq('user_id', userId).eq('resource_type', itemKey);
        if (sellUpdateError) throw sellUpdateError;

        const { data: goldRes, error: goldFetchError } = await supabase.from('resources')
            .select('amount').eq('user_id', userId).eq('resource_type', 'GOLD').single();
        if (goldFetchError) throw goldFetchError;

        if (!goldRes) {
          return res.status(400).json({ success: false, message: "Resource GOLD tidak ditemukan." });
        }

        const { error: goldUpdateError } = await supabase.from('resources').update({ amount: parseFloat(goldRes.amount) + sellPrice })
            .eq('user_id', userId).eq('resource_type', 'GOLD');
        if (goldUpdateError) throw goldUpdateError;

        const { data: updated, error: updatedError } = await supabase.from('resources').select('*').eq('user_id', userId);
        if (updatedError) throw updatedError;
        return res.status(200).json({ success: true, data: { resources: updated } });

    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
  },

  getSnapshot: async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ success: false, message: "User ID diperlukan." });
      }

      if (req.user && req.user.id && String(req.user.id) !== String(userId)) {
        return res.status(403).json({ success: false, message: "Akses snapshot user lain tidak diizinkan." });
      }

      const { data, error } = await supabase.from('resources').select('*').eq('user_id', userId);
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  getTodayNews: async (req, res) => {
    try {
        // Mengambil semua berita yang active_date-nya hari ini atau yang status is_active-nya true
        const { data: newsList, error } = await supabase
            .from('news')
            .select('*')
            .eq('is_active', true)
            .order('active_date', { ascending: false });

        if (error) throw error;

        return res.status(200).json({
            success: true,
            data: newsList // Sekarang mengirimkan Array, bukan Object tunggal
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
  },

  getLeaderboard: async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('resources')
            .select(`
                amount,
                user_id,
                users ( username )
            `)
            .eq('resource_type', 'GOLD')
            .order('amount', { ascending: false })
            .limit(10);

        if (error) throw error;

        const leaderboard = data.map((item, index) => ({
            rank: index + 1,
            username: item.users ? item.users.username : "Unknown",
            gold: Math.floor(parseFloat(item.amount || 0))
        }));

        // Pastikan mengirimkan JSON yang valid
        return res.status(200).json({
            success: true,
            data: leaderboard
        });
    } catch (error) {
        console.error("Leaderboard Error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

};

// EKSPOR UTAMA
module.exports = ResourceController;