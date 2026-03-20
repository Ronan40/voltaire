const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // Permet d'activer/désactiver l'obligation d'authentification via .env
  const requireAuth = process.env.REQUIRE_AUTH === "true";

  if (!authHeader) {
    return requireAuth ? res.status(401).json({ message: "Token missing" }) : next();
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  // Extrait uniquement la partie token de l'en-tête "Bearer <token>"
  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({ message: "JWT_SECRET is not configured" });
  }

  try {
    // Vérifie la signature du JWT puis stocke le payload dans req.user
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};