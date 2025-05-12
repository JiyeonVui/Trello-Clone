let apiRoot = ''
console.log('import.meta', import.meta.env)
console.log('BUILD_MODE', process.env.BUILD_MODE)
console.log('API_ROOT', apiRoot)

if (process.env.BUILD_MODE === 'production' ) {
  apiRoot = 'https://trello-api-msgv.onrender.com'
}

if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}

export const API_ROOT = apiRoot
