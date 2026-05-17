const { supabase } = require('../config/database');

exports.craftItem = async (req, res) => {
    const { userId, itemId } = req.body;

    // 1. Definisi Resep Crafting (Harus Sama dengan Global.gd)
    const craftDatabase = {
        "PLANK": { price: 60, materials: { "WOOD": 5 } },
        "IRON_BAR": { price: 150, materials: { "IRON_ORE": 3 } },
        "COPPER_BAR": { price: 100, materials: { "COPPER_ORE": 3 } },
        "GOLD_BAR": { price: 500, materials: { "GOLD_ORE": 3 } },
        "IRON_PLATE": { price: 350, materials: { "IRON_BAR": 2 } },
        "GEAR": { price: 250, materials: { "IRON_BAR": 1, "PLANK": 1 } },
        "WIRE": { price: 120, materials: { "COPPER_BAR": 1 } },
        "PCB": { price: 500, materials: { "WIRE": 2, "RESIN": 1 } },
        "COMPONENT": { price: 1000, materials: { "PCB": 1, "GEAR": 1 } }
    };

    const itemKey = itemId.toUpperCase();
    const recipe = craftDatabase[itemKey];

    if (!recipe) {
        return res.status(400).json({ success: false, message: "Resep tidak ditemukan." });
    }

    try {
        // 2. Ambil SEMUA resource user untuk pengecekan bahan
        const { data: userResources, error: fetchError } = await supabase
            .from('resources')
            .select('resource_type, amount')
            .eq('user_id', userId);

        if (fetchError || !userResources) throw fetchError;

        // Ubah array resource menjadi dictionary agar mudah dicek
        const inventory = {};
        userResources.forEach(r => inventory[r.resource_type.toUpperCase()] = parseFloat(r.amount));

        // 3. Validasi Bahan Baku (Pengecekan Ketat)
        for (const mat in recipe.materials) {
            const requiredAmount = recipe.materials[mat];
            const ownedAmount = inventory[mat] || 0;

            if (ownedAmount < requiredAmount) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Bahan tidak cukup! Butuh ${requiredAmount} ${mat}, cuma punya ${ownedAmount.toFixed(1)}` 
                });
            }
        }

        // 4. Eksekusi Transaksi (Gunakan Loop untuk Update Database)
        // A. Kurangi Bahan Baku
        for (const mat in recipe.materials) {
            const newAmount = inventory[mat] - recipe.materials[mat];
            await supabase.from('resources')
                .update({ amount: newAmount })
                .eq('user_id', userId)
                .eq('resource_type', mat);
        }

        // B. Tambah Item Hasil Crafting
        const currentItemAmount = inventory[itemKey] || 0;
        const { error: addError } = await supabase.from('resources')
        .update({ amount: currentItemAmount + 1 })
        .eq('user_id', userId)
        .eq('resource_type', itemKey); // itemKey sudah .toUpperCase()
        if (addError) throw addError;

        // 5. Ambil data terbaru untuk sinkronisasi Godot
        const { data: freshResources } = await supabase
            .from('resources')
            .select('*')
            .eq('user_id', userId);

        return res.status(200).json({ 
            success: true, 
            message: `Berhasil membuat ${itemId}!`,
            data: { resources: freshResources }
        });

    } catch (err) {
        console.error("Crafting Error:", err.message);
        return res.status(500).json({ success: false, message: "Gagal memproses crafting." });
    }
};