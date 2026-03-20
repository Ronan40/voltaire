const API_URL = "http://localhost:3000/products";
const AUTH_URL = "http://localhost:3000/auth/login";

let currentEditId = null;

// Récupère le token JWT stocké localement.
function getToken() {
  return localStorage.getItem("token") || "";
}

// Construit les headers d'authentification pour les appels API protégés.
function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Ouvre la page détail d'un produit à partir de son id.
function openProductDetails(id) {
  if (!id) return;
  window.location.href = `product.html?id=${encodeURIComponent(id)}`;
}

// Charge les produits depuis l'API et met à jour la liste affichée.
async function fetchProducts() {
  const res = await fetch(API_URL, { headers: authHeaders() });

  if (res.status === 401) {
    localStorage.removeItem("token");
    showLoggedOut();
    return;
  }

  const products = await res.json();

  const list = document.getElementById("productList");
  list.innerHTML = "";

  if (!Array.isArray(products) || products.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = "Aucun produit pour le moment.";
    list.appendChild(empty);
    return;
  }

  products.forEach(p => {
    const li = document.createElement("li");
    li.className = "product-item";
    li.innerHTML = `
      <div class="product-main">
        <div class="product-name">${p.name}</div>
        <div class="product-meta">${p.category} · Stock: ${p.stock}</div>
      </div>
      <div class="product-right">
        <div class="product-price">${p.price}€</div>
        <button class="btn btn-ghost" onclick="openProductDetails('${p._id}')">Voir plus</button>
        <button class="btn btn-ghost" onclick="beginEdit('${p._id}')">Modifier</button>
        <button class="btn btn-danger" onclick="deleteProduct('${p._id}')">Supprimer</button>
      </div>
    `;
    list.appendChild(li);
  });
}

// Affiche l'interface connectée (liste produits + bouton logout).
function showLoggedIn() {
  const productsSection = document.getElementById("productsSection");
  if (productsSection) productsSection.style.display = "block";

  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.style.display = "none";

  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) logoutButton.style.display = "inline-block";
}

// Affiche l'interface déconnectée (formulaire login uniquement).
function showLoggedOut() {
  const productsSection = document.getElementById("productsSection");
  if (productsSection) productsSection.style.display = "none";

  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.style.display = "block";

  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) logoutButton.style.display = "none";

  const tokenInfo = document.getElementById("tokenInfo");
  if (tokenInfo) tokenInfo.textContent = "";
}

document.getElementById("productForm").addEventListener("submit", async e => {
  e.preventDefault();


  const nameInput = document.getElementById("name");
  const categoryInput = document.getElementById("category");
  const priceInput = document.getElementById("price");
  const stockInput = document.getElementById("stock");

  const product = {
    name: (nameInput?.value || "").trim(),
    category: (categoryInput?.value || "").trim(),
    price: Number(priceInput?.value),
    stock: Number(stockInput?.value)
  };

  if (!product.name || !product.category || !Number.isFinite(product.price) || !Number.isFinite(product.stock)) {
    alert("Veuillez remplir correctement tous les champs (nom, catégorie, prix, stock).");
    return;
  }

  console.log("Submitting product payload:", product);

  const isEdit = !!currentEditId;
  const url = isEdit ? `${API_URL}/${currentEditId}` : API_URL;
  const method = isEdit ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(product),
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    showLoggedOut();
    return;
  }

  currentEditId = null;
  updateEditUI(false);
  clearProductForm();

  fetchProducts();
});

// Vide les champs du formulaire produit.
function clearProductForm() {
  const nameInput = document.getElementById("name");
  const categoryInput = document.getElementById("category");
  const priceInput = document.getElementById("price");
  const stockInput = document.getElementById("stock");

  if (nameInput) nameInput.value = "";
  if (categoryInput) categoryInput.value = "";
  if (priceInput) priceInput.value = "";
  if (stockInput) stockInput.value = "";
}

// Met à jour l'UI selon le mode création ou édition.
function updateEditUI(isEditMode) {
  const editInfo = document.getElementById("editInfo");
  const submitButton = document.getElementById("submitProductButton");
  const cancelButton = document.getElementById("cancelEditButton");

  if (editInfo) {
    editInfo.textContent = isEditMode ? "Mode édition : modifiez puis validez." : "";
  }

  if (submitButton) {
    submitButton.textContent = isEditMode ? "Modifier" : "Ajouter";
  }

  if (cancelButton) {
    cancelButton.style.display = isEditMode ? "inline-block" : "none";
  }
}

document.getElementById("cancelEditButton").addEventListener("click", () => {
  currentEditId = null;
  updateEditUI(false);
  clearProductForm();
});

// Charge un produit existant et pré-remplit le formulaire pour l'édition.
async function beginEdit(id) {
  currentEditId = id;
  updateEditUI(true);

  const res = await fetch(`${API_URL}/${id}`, { headers: authHeaders() });
  if (res.status === 401) {
    localStorage.removeItem("token");
    showLoggedOut();
    currentEditId = null;
    updateEditUI(false);
    return;
  }

  if (!res.ok) {
    alert("Impossible de charger le produit à modifier.");
    currentEditId = null;
    updateEditUI(false);
    return;
  }

  const p = await res.json();

  document.getElementById("name").value = p.name ?? "";
  document.getElementById("category").value = p.category ?? "";
  document.getElementById("price").value = p.price ?? "";
  document.getElementById("stock").value = p.stock ?? "";
}

// Supprime un produit puis recharge la liste.
async function deleteProduct(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: authHeaders() });
  fetchProducts();
}

document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  const token = data.token;

  if (!res.ok || !token) {
    document.getElementById("tokenInfo").textContent = data.message || "Erreur d'auth";
    return;
  }

  localStorage.setItem("token", token);
  document.getElementById("tokenInfo").textContent = "Connexion OK. Token enregistré.";
  showLoggedIn();
  fetchProducts();
});

if (getToken()) {
  showLoggedIn();
  fetchProducts();
} else {
  showLoggedOut();
}

const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    showLoggedOut();
  });
}