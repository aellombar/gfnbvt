/** @type {import('next').NextConfig} */

/**
 * GitHub Pages serves this repo at https://aellombar.github.io/gfnbvt/,
 * so production builds need a `/gfnbvt` base path. Local `next dev` stays
 * at `/` so you can still open http://localhost:3000.
 */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/gfnbvt" : "";

const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  reactStrictMode: true,
  // Next generates AGENTS.md / CLAUDE.md by default; this repo doesn't want them.
  agentRules: false,
};

export default nextConfig;
