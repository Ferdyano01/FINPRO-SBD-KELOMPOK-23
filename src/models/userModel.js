// const db = require('../config/database'); // Akan di-uncomment di Pilar 2

exports.findUserByEmail = async (email) => {
    // TODO: SELECT * FROM users WHERE email = $1
    return { id: 'dummy-uuid', email: email, username: 'Player1' };
};

exports.createUser = async (userData) => {
    // TODO: INSERT INTO users ... RETURNING *
    return { id: 'new-dummy-uuid', ...userData };
};