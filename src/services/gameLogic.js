/**
 * Menghitung total produksi sumber daya setelah dipengaruhi berita harian
 * @param {number} baseRate - Rate produksi dasar bangunan/pemain
 * @param {number} multiplier - Efek berita (cth: 1.2 untuk +20%, 0.8 untuk -20%)
 * @returns {number} - Total produksi akhir
 */
exports.calculateProduction = (baseRate, multiplier = 1.0) => {
    // Memastikan tidak ada nilai negatif atau tidak masuk akal
    if (baseRate < 0) return 0;
    
    const finalProduction = baseRate * multiplier;
    // Mengembalikan nilai dengan 2 angka di belakang koma
    return parseFloat(finalProduction.toFixed(2));
};