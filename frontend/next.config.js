const withPlugins = require('next-compose-plugins')

const nextConfig = {
  env: {
    API_ROOT: '/api'
  }
}

module.exports = withPlugins([], nextConfig)
