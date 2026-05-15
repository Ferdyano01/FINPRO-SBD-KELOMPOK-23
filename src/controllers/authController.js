exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        // TODO (Pilar 2): Insert data ke PostgreSQL, hash password dengan bcrypt
        
        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: { user: { id: "dummy-uuid", username, email } }
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // TODO (Pilar 2): Cek email dan password ke PostgreSQL
        // TODO (Pilar 1): Generate JWT Token
        
        const dummyToken = "dummy.jwt.token.here";
        
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            token: dummyToken,
            data: { user: { id: "dummy-uuid", username: "Player1" } }
        });
    } catch (error) {
        next(error);
    }
};