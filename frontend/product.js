const API_URL = "http://localhost:3000/products";


// Récupère le token JWT sauvegardé dans le navigateur.
function getToken() {
  return localStorage.getItem("token") || "";
}


// Prépare les headers d'authentification pour les appels API.
function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Lit l'id produit dans les paramètres de l'URL.
function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Met à jour le status sur la page de détail.
function setStatus(message) {
  const status = document.getElementById("detailStatus");
  if (status) status.textContent = message;
}

// Affiche les informations du produit dans les champs de détail.
function setProductDetail(product) {
  const detail = document.getElementById("productDetail");
  if (!detail) return;

  document.getElementById("detailName").textContent = product.name ?? "-";
  document.getElementById("detailCategory").textContent = product.category ?? "-";
  document.getElementById("detailPrice").textContent = `${product.price ?? "-"} EUR`;
  document.getElementById("detailStock").textContent = String(product.stock ?? "-");
  document.getElementById("detailId").textContent = product._id ?? "-";
  detail.hidden = false;
}

// Charge le produit demandé et gère les cas d'erreur d'accès.
async function loadProductDetail() {
  const productId = getProductIdFromUrl();
  if (!productId) {
    setStatus("ID produit manquant dans l'URL.");
    return;
  }

  const token = getToken();
  if (!token) {
    setStatus("Vous devez etre connecte pour voir ce produit.");
    return;
  }

  setStatus("Chargement du produit...");

  const res = await fetch(`${API_URL}/${encodeURIComponent(productId)}`, {
    headers: authHeaders()
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    setStatus("Session expiree. Merci de vous reconnecter.");
    return;
  }

  if (!res.ok) {
    setStatus("Impossible de charger ce produit.");
    return;
  }

  const product = await res.json();
  setStatus("");
  setProductDetail(product);
}

loadProductDetail();
