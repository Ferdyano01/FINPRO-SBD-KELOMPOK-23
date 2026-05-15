// const db = require('../config/database');

exports.getActiveNews = async (date) => {
    // TODO: SELECT * FROM news WHERE active_date = $1
    return {
        title: "Krisis Cip Global",
        affected_resource: "TECH_PARTS",
        effect_type: "DEBUFF",
        multiplier: 0.5
    };
};
