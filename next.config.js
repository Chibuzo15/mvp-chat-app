/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for bcrypt and other native modules
    if (isServer) {
      config.externals.push({
        'bcrypt': 'commonjs bcrypt',
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      })
    }
    
    return config
  },
}

module.exports = nextConfig

