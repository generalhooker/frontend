/** @type {import('next').NextConfig} */
const replitDomains = [
  process.env.REPLIT_DEV_DOMAIN,
  ...(process.env.REPLIT_DOMAINS ? process.env.REPLIT_DOMAINS.split(",") : []),
].filter(Boolean)

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  ...(replitDomains.length > 0 && {
    allowedDevOrigins: replitDomains,
  }),
}

export default nextConfig
