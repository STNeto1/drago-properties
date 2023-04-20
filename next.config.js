/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
   domains: ['cdn.stneto.dev'] 
  },
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['mysql2']
  },
}

module.exports = nextConfig
