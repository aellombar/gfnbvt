/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next generates AGENTS.md / CLAUDE.md by default; this repo doesn't want them.
  agentRules: false,
};

export default nextConfig;
