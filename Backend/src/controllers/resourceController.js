const ResourceService = require('../services/resourceService');

const ResourceController = {
  /**
   * Endpoint untuk sinkronisasi sumber daya pemain.
   * Biasanya dipanggil Godot saat login atau setiap beberapa menit sekali.
   */
  syncResources: async (req, res) => {
    try {
      // Dalam aplikasi nyata, userId diambil dari middleware JWT (req.user.id)
      // Untuk tahap awal development, kita bisa ambil dari body atau params
      const userId = req.user.id; 

      const result = await ResourceService.calculateCurrentResources(userId);

      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          message: "User ID diperlukan untuk sinkronisasi." 
        });
      }

      return res.status(200).json({
        success: true,
        message: "Sumber daya berhasil diperbarui.",
        data: result
      });
      
    } catch (error) {
      console.error("Error pada ResourceController.syncResources:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server saat menghitung sumber daya.",
        error: error.message
      });
    }
  },

  /**
   * Endpoint opsional hanya untuk melihat data tanpa memicu kalkulasi ulang (Read-only)
   */
  getSnapshot: async (req, res) => {
    try {
      const { userId } = req.params;
      const ResourceModel = require('../models/resource.model.js');
      const data = await ResourceModel.getByUserId(userId);
      
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = ResourceController;