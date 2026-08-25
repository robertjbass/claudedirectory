import { MCPServer } from "@/lib/types";

export const vibekitServer: MCPServer = {
  slug: "vibekit",
  title: "VibeKit",
  description:
    "Deploy and operate hosted web apps from Claude Code: ship a GitHub repo or starter template to a live URL, tail logs, set env vars, attach Postgres, and message each app's built-in coding agent. Hosted server at mcp.vibekit.bot (Bearer key). Distinct from the unrelated superagent-ai/vibekit sandbox SDK.",
  tags: ["hosting", "deployment", "devops", "agents", "community"],
  author: {
    name: "VibeKit",
    url: "https://github.com/VibeKit-Bot",
  },
  repoUrl: "https://github.com/VibeKit-Bot/vibekit-mcp",
  docsUrl: "https://vibekit.bot/mcp-server",
  installCommand:
    'claude mcp add --transport http vibekit https://mcp.vibekit.bot/mcp --header "Authorization: Bearer vk_your_api_key"',
  config: `{
  "mcpServers": {
    "vibekit": {
      "type": "http",
      "url": "https://mcp.vibekit.bot/mcp",
      "headers": {
        "Authorization": "Bearer vk_your_api_key"
      }
    }
  }
}`,
};
