const { supabase } = require('../config/database');

exports.hireWorker = async (req, res) => {
    const authUserId = req.user && req.user.id;
    const bodyUserId = req.body.userId;
    if (authUserId && bodyUserId && String(authUserId) !== String(bodyUserId)) {
        return res.status(403).json({ success: false, message: "User ID tidak valid untuk token ini." });
    }

    const userId = authUserId || bodyUserId;
    const { workerId } = req.body;
    if (!userId || !workerId) {
        return res.status(400).json({ success: false, message: "User ID dan worker ID diperlukan." });
    }

    const workerKey = typeof workerId === 'string' ? workerId.toUpperCase() : '';
    
    // Database Worker tetap sama seperti kode Anda
    const workerDatabase = {
        "LUMBERJACK": { price: 50, target: "WOOD", rate: 2.0, materials: {} },
        "FARMER": { target: ["APPLE", "CORN", "STRAWBERRY"], rate: 1.5, materials: { "WOOD": 100 } },
        "FISHERMAN": { target: ["ANCHOVY", "BASS"], rate: 1.2, materials: { "WOOD": 250 } },
        "MINER": { target: ["COPPER_ORE", "IRON_ORE", "GOLD_ORE"], rate: 0.8, materials: { "WOOD": 500 } },
        "OIL_DRILL": { price: 2000, target: "OIL", rate: 0.5, materials: {} } // Hanya ini yang pakai Gold
    };

    const worker = workerDatabase[workerKey];
    if (!worker) return res.status(400).json({ success: false, message: "Worker tidak valid." });

    try {
        // 1. Ambil semua resource user untuk validasi
        const { data: userResources, error: fetchError } = await supabase
            .from('resources')
            .select('*')
            .eq('user_id', userId);
        if (fetchError) throw fetchError;
        if (!userResources) {
            return res.status(404).json({ success: false, message: "Data resource user tidak ditemukan." });
        }

        // 2. Validasi Material (Looping pengecekan sebelum memotong)
        for (const [mat, reqQty] of Object.entries(worker.materials)) {
            const matRes = userResources.find(r => r.resource_type === mat);
            if (!matRes || parseFloat(matRes.amount) < reqQty) {
                return res.status(400).json({ success: false, message: `Material ${mat} tidak cukup!` });
            }
        }

        // 3. Validasi Gold (Hanya jika worker punya 'price' > 0, misal Oil Rig)
        if (worker.price && worker.price > 0) {
            const goldRes = userResources.find(r => r.resource_type === 'GOLD');
            if (!goldRes || parseFloat(goldRes.amount) < worker.price) {
                return res.status(403).json({ success: false, message: "Gold tidak cukup untuk Oil Rig!" });
            }
            // Potong Gold
            await supabase.from('resources').update({ amount: parseFloat(goldRes.amount) - worker.price })
                .eq('user_id', userId).eq('resource_type', 'GOLD');
        }

        // 4. Potong Material yang dibutuhkan
        for (const [mat, reqQty] of Object.entries(worker.materials)) {
            const matRes = userResources.find(r => r.resource_type === mat);
            await supabase.from('resources').update({ amount: parseFloat(matRes.amount) - reqQty })
                .eq('user_id', userId).eq('resource_type', mat);
        }

        // 5. Update Production Rate (Target bisa Array atau String tunggal)
        const targets = Array.isArray(worker.target) ? worker.target : [worker.target];
        const now = new Date().toISOString();
        for (const resType of targets) {
            const targetRes = userResources.find(r => r.resource_type === resType);
            const oldRate = targetRes ? parseFloat(targetRes.base_production_rate) : 0.0;
            
            await supabase
            .from('resources')
            .update({ 
                base_production_rate: oldRate + worker.rate,
                updated_at: now
            })
            .eq('user_id', userId)
            .eq('resource_type', resType);
        }

        return res.status(200).json({ success: true, message: `Berhasil hire ${workerId}` });

    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};