const mongoose = require("mongoose");

// Définit la structure d'un document Product dans MongoDB.
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});

// Ajout d'un champ `id`
productSchema.virtual("id").get(function () {
  return this._id.toString();
});

productSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);