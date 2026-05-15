const ResourceModel = require('../models/resource.model.js');
const NewsModel = require('../models/newsModel');

const ResourceService = {
  /**
   * Menghitung dan memperbarui saldo sumber daya pemain
   * Logika: Saldo Baru = Saldo Lama + (Selisih Waktu * Produksi per Jam * Multiplier Berita)
   */
  calculateCurrentResources: async (userId) => {
    // 1. Ambil semua resource pemain
    const resources = await ResourceModel.getByUserId(userId);
    
    // 2. Ambil berita aktif untuk mendapatkan multiplier
    const activeNews = await NewsModel.getActiveNews();
    
    const now = new Date();
    const updatedResources = [];

    for (const res of resources) {
      const lastUpdate = new Date(res.updated_at || res.created_at);
      const hoursPassed = (now - lastUpdate) / (1000 * 60 * 60); // Konversi milidetik ke jam
      
      // Tentukan multiplier berdasarkan berita
      let currentMultiplier = 1.0;
      if (activeNews && activeNews.affected_resource === res.resource_type) {
        currentMultiplier = parseFloat(activeNews.multiplier);
      }

      // Rumus Produksi: (Base Rate * Multiplier)
      const productionPerHour = parseFloat(res.base_production_rate) * currentMultiplier;
      const earned = hoursPassed * productionPerHour;
      const newAmount = parseFloat(res.amount) + earned;

      // 3. Simpan perubahan ke database agar timestamp 'updated_at' menjadi 'now'
      const updatedData = await ResourceModel.updateAmount(userId, res.resource_type, newAmount);
      updatedResources.push(updatedData);
    }

    return {
      resources: updatedResources,
      applied_news: activeNews ? activeNews.title : "Tidak ada berita berdampak hari ini"
    };
  }
};

module.exports = ResourceService;