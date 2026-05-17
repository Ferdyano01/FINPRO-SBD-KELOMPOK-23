const { supabase } = require('../config/database');

const NewsModel = {
  // Mengambil berita yang aktif hari ini
  getActiveNews: async () => {
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('active_date', today)
      .single();

    // Jika tidak ada berita hari ini, kembalikan null atau default multiplier 1.0
    if (error && error.code !== 'PGRST116') throw error; 
    return data || null;
  },

  // Mendapatkan riwayat berita (untuk fitur News Feed di Godot)
  getNewsHistory: async (limit = 10) => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('active_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
};

module.exports = NewsModel;