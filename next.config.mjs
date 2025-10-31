 import path from 'node:path'
 import { fileURLToPath } from 'node:url'

 const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    // Ensure the workspace root is this project folder, so env files load from here
    root: __dirname,
  },
}

export default nextConfig
