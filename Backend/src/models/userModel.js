const supabase = require('../config/database');

const UserModel = {
  // Mencari user berdasarkan ID
  findById: async (id) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Membuat user baru (biasanya dipanggil saat registrasi)
  create: async (username, email, passwordHash) => {
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, email, password_hash: passwordHash, level: 1 }])
      .select();

    if (error) throw error;
    return data[0];
  }
};

module.exports = UserModel;