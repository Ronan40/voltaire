const jwt = require("jsonwebtoken");


// POST /auth/login
async function login(req, res) {
    const { username, password } = req.body || {};

    // Récupère les identifiants attendus depuis les variables d'environnement
    const expectedUsername = process.env.STATIC_USERNAME || "admin";
    const expectedPassword = process.env.STATIC_PASSWORD || "admin";
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }

    // Vérifie les identifiants username et password
    const matches =
        username === expectedUsername &&
        password === expectedPassword;


    if (!matches) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Génère un JWT valide pendant une durée configurable
    const token = jwt.sign(
        {
            sub: username,
        },
        jwtSecret,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1h",
        }
    );

    // Retourne le token au client après authentification réussie
    return res.json({ token });
}

module.exports = {
    login,
};

