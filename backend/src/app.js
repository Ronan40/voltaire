
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Active CORS globalement pour une origine frontend précise.
app.use(
    cors({
        origin: "http://localhost:8080",
    })
);

// Parse automatiquement les corps JSON des requêtes entrantes.
app.use(express.json());

// Middleware de gestion d'erreurs centralisé.
app.use((err, req, res, next) => {
    console.error(err);
    res
        .status(500)
        .json({ message: err?.message || "Internal Server Error" });
});

module.exports = app;

if (require.main === module) {
    (async () => {
        await connectDB();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })();
}