let apiRoot = ''

if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-api-msgv.onrender.com'
}

if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}

console.log('API_ROOT', apiRoot)

export const API_ROOT = apiRoot
