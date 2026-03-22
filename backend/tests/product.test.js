const request = require("supertest");

// Bypass de l'auth dans ces tests unitaires d'API produits.
jest.mock("../src/middleware/auth", () => (req, res, next) => next());

// Mock complet du modèle Product pour éviter tout accès réel à MongoDB.
jest.mock("../src/models/Product", () => ({
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));


const Product = require("../src/models/Product");
const app = require("../src/app");

// Groupe de tests API produits.
describe("Products API", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Vérifie la création d'un produit via POST /products.
  it("should create a product", async () => {
    
    Product.create.mockResolvedValue({
      _id: "1",
      name: "Test",
      category: "TestCat",
      price: 10,
      stock: 5,
      created_at: new Date("2020-01-01T00:00:00.000Z"),
    });

    // Envoie une requête HTTP vers l'API en test.
    const res = await request(app).post("/products").send({
      name: "Test",
      category: "TestCat",
      price: 10,
      stock: 5,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Test");
  });

  it("should filter products by category", async () => {
    Product.find.mockResolvedValue([]);

    const res = await request(app).get("/products?category=TestCat");

    expect(res.statusCode).toBe(200);
    expect(Product.find).toHaveBeenCalledWith({ category: "TestCat" });
  });

  // Vérifie la suppression d'un produit via DELETE /products/:id.
  it("should delete a product", async () => {
    Product.findByIdAndDelete.mockResolvedValue({
      _id: "1",
      name: "Test",
      category: "TestCat",
      price: 10,
      stock: 5,
      created_at: new Date("2020-01-01T00:00:00.000Z"),
    });

    const res = await request(app).delete("/products/1");

    expect(res.statusCode).toBe(204);
    expect(Product.findByIdAndDelete).toHaveBeenCalledWith("1");
  });
});