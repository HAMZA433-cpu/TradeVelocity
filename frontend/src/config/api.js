// Configuration de l'URL de l'API backend
// En développement: utilise localhost
// En production: utilise la variable d'environnement VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Log pour debug (uniquement en développement)
if (import.meta.env.DEV) {
    console.log('API Base URL:', API_BASE_URL);
}

export default API_BASE_URL;
