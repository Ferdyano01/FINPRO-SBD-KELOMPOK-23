exports.syncState = async (req, res, next) => {
    try {
        const userId = req.user.id; // Didapat dari authMiddleware
        
        // TODO (Pilar 2 & 3): Ambil resources dari PostgreSQL & baca multiplier dari Redis
        
        res.status(200).json({
            status: 'success',
            message: 'Game state synchronized',
            data: {
                resources: [
                    { type: 'ENERGY', amount: 1500, production_rate: 100 },
                    { type: 'GOLD', amount: 300, production_rate: 10 }
                ],
                buildings: [
                    { type: 'POWER_PLANT', level: 2, status: 'ACTIVE' }
                ],
                active_multiplier: {
                    ENERGY: 0.8 // Efek berita krisis energi (-20%)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.playerAction = async (req, res, next) => {
    try {
        const { action_type, payload } = req.body;
        const userId = req.user.id;
        
        // TODO: Validasi action, update PostgreSQL, catat di transactions_log
        
        res.status(200).json({
            status: 'success',
            message: `Action ${action_type} executed successfully`,
            data: { updated_state: "OK" }
        });
    } catch (error) {
        next(error);
    }
};