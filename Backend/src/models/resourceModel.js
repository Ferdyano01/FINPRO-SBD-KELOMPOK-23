const { supabase } = require('../config/database');

const ResourceModel = {
  // Ambil semua resource milik satu user
  getByUserId: async (userId) => {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  },

  // Update jumlah resource setelah kalkulasi produksi
  updateAmount: async (userId, resourceType, newAmount) => {
    const { data, error } = await supabase
      .from('resources')
      .update({ 
        amount: newAmount, 
        updated_at: new Date() // Penting untuk 'Lazy Calculation' nanti
      })
      .eq('user_id', userId)
      .eq('resource_type', resourceType)
      .select();

    if (error) throw error;
    return data[0];
  }
};

module.exports = ResourceModel;