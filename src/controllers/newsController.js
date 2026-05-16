exports.getDailyNews = async (req, res, next) => {
    try {
        // TODO (Pilar 3): Tarik berita hari ini dari Redis Cache
        
        res.status(200).json({
            status: 'success',
            data: {
                news: {
                    title: "Krisis Energi Global Meningkat",
                    content: "Pasokan energi dunia menurun akibat cuaca ekstrem...",
                    affected_resource: "ENERGY",
                    effect_type: "DEBUFF",
                    multiplier: 0.8
                }
            }
        });
    } catch (error) {
        next(error);
    }
};