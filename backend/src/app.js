
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Active CORS sur localhost:8080.
app.use(
    cors({
        origin: "http://localhost:8080",
    })
);

// Parse les JSON des requêtes entrantes.
app.use(express.json());

app.use("/auth", require("./routes/auth"));
app.use("/products", require("./routes/products"));

// Middleware de gestion d'erreurs.
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