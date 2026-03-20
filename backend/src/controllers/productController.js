const Product = require("../models/Product");

// GET /products
async function getProducts(req, res, next) {
    try {
        const products = await Product.find(filter);
        return res.json(products);
    } catch (err) {
        return next(err);
    }
}

// GET /products/:id
async function getProduct(req, res, next) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        return res.json(product);
    } catch (err) {
        return next(err);
    }
}

// POST /products
async function createProduct(req, res, next) {
    try {
        const { name, category, price, stock, description } = req.body;
        const product = await Product.create({ name, category, price, stock, description });
        return res.status(201).json(product);
    } catch (err) {
        return next(err);
    }
}

// PUT /products/:id
async function updateProduct(req, res, next) {
    try {
        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updated) return res.status(404).json({ message: "Product not found" });
        return res.json(updated);
    } catch (err) {
        return next(err);
    }
}

// DELETE /products/:id
async function deleteProduct(req, res, next) {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Product not found" });
        return res.status(204).send();
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
};
