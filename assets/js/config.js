// Unsplash API configuration
const apiConfig = {
  unsplash: {
    endpoint: 'https://unsplash-proxy-app-fb6c8f079fb7.herokuapp.com/search' // Proxy endpoint to hide API key
    /**
     * Using Heroku proxy for production to secure API key:
     * 1. API key is stored as environment variable on Heroku
     * 2. Proxy handles authentication with Unsplash
     * 3. Frontend only makes requests to our proxy endpoint
     */
  }
};