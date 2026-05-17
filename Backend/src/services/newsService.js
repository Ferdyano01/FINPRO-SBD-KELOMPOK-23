// src/services/newsService.js
const { supabase } = require('../config/database');

const NewsService = {
  // Data berita dari dokumen balance_game_news_content.html
  events: [
    { title: "Krisis energi melanda Eropa", resource: "ENERGY", type: "DEBUFF", mult: 0.7 },
    { title: "Terobosan panel surya baru", resource: "ENERGY", type: "BUFF", mult: 1.4 },
    { title: "Harga emas menyentuh rekor", resource: "GOLD", type: "BUFF", mult: 1.5 },
    { title: "Resesi ekonomi mengancam", resource: "GOLD", type: "DEBUFF", mult: 0.6 },
    { title: "Penemuan deposit mineral", resource: "MATERIAL", type: "BUFF", mult: 1.6 },
    { title: "AI percepat riset sains", resource: "TECH", type: "BUFF", mult: 2.0 },
    { title: "Serangan siber massal", resource: "TECH", type: "DEBUFF", mult: 0.55 },
    { title: "Chip 2nm produksi massal", resource: "TECH", type: "BUFF", mult: 1.7 }
  ],

  generateDailyNews: async () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Cek apakah hari ini sudah ada berita
    const { data: existingNews } = await supabase
      .from('news')
      .select('*')
      .eq('active_date', today)
      .eq('is_active', true)
      .single();

    if (existingNews) return existingNews;

    // Jika belum ada, pilih secara acak dari database dummy
    const randomEvent = NewsService.events[Math.floor(Math.random() * NewsService.events.length)];

    const { data: insertedNews, error } = await supabase
      .from('news')
      .insert([{
        title: randomEvent.title,
        content: "Berita ekonomi global hari ini memengaruhi sektor " + randomEvent.resource,
        affected_resource: randomEvent.resource,
        effect_type: randomEvent.type,
        multiplier: randomEvent.mult,
        active_date: today,
        is_active: true
      }])
      .select()
      .single();

    if (error) throw error;
    return insertedNews;
  }
};

module.exports = NewsService;