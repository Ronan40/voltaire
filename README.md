# Voltaire Test

Application de gestion de produits, composée de trois briques :
- un frontend statique (HTML/CSS/JS),
- une API REST en Node.js/Express,
- une base MongoDB.

## Démarrage rapide (recommandé)

### Prérequis

- Docker Desktop installé et démarré.

### Lancer

Depuis la racine du projet :

```bash
docker compose up
```

Au premier lancement, les images sont construites automatiquement.

### Accès

- Frontend : http://localhost:8080
- API : http://localhost:3000

Identifiants de test (par défaut) :
- username : `admin`
- password : `admin`

### Arrêter / réinitialiser

Arrêter les services :

```bash
docker compose down
```

Arrêter et réinitialiser la base :

```bash
docker compose down -v
```

## Démarrage sans Docker

### Prérequis

- Node.js installé
- Une instance MongoDB accessible (locale ou distante)

### Backend

Depuis le dossier `backend`, installer les dépendances :

```bash
cd backend
npm install
```

Lancer l’API :

```bash
npm start
```

### Frontend

Dans un autre terminal, servir le dossier `frontend` avec un serveur statique :

```bash
cd frontend
python -m http.server 8080
```

Puis ouvrir :
- Frontend : http://localhost:8080
- API : http://localhost:3000

## Choix techniques

- **Express** : structure claire en routes/controllers/middleware, ce qui facilite la lecture et l’évolution de l’API.
- **MongoDB + Mongoose** : bon compromis pour modéliser vite des produits (schéma simple, opérations CRUD directes).
- **HTML/Vanilla JS** : interface légère, sans build front, suffisante pour démontrer les fonctionnalités demandées.
- **Docker Compose** : lancement en une commande et environnement identique pour l’évaluation.

## Limites connues

- Auth volontairement basique : identifiants statiques (pas de comptes utilisateurs).
- Règles métier minimales : peu de validations avancées et pas de gestion de rôles.
- Tests concentrés sur l’API : couverture partielle (pas de tests d’intégration).
- Pas de rate limiting sur l’API (protection brute‑force).

## Configuration

Le fichier `.env` local ne doit pas être versionné.
On versionne un fichier d’exemple (`.env.example` ou équivalent) sans secrets réels pour documenter les variables attendues.
