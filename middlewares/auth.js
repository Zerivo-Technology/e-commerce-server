const { decodeToken } = require('../helpers/jwt');

module.exports = {
    authenticateToken: async (req, res, next) => {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (token == null) return res.sendStatus(401);

            const user = decodeToken(token, process.env.JWT_SECRET);
            if (!user) return res.sendStatus(403);

            req.user = user;
            next();
        } catch (error) {
            res.status(500).json({ message: "Unauthorized" });
        }
    },

    authorizationOnlyAdmin: async (req, res, next) => {
        try {
            let role = req.user.role;
            if (role !== "admin") {
                return res.status(403).json({ message: "You have no access" });
            }
            next();
        } catch (error) {
            res.status(500).json({ message: "Only admin" });
        }
    }
};
