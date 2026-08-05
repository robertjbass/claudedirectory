import { MCPServer } from "@/lib/types";

export const productosMcp: MCPServer = {
  slug: "productos-mcp",
  title: "ProductOS",
  description:
    "Connect an MCP client to a ProductOS project: read live product context (PRD, research, designs) and drive the project's cloud sandbox — files, shell, sandbox lifecycle, Postgres and storage provisioning, GitHub sync, deployments, and a headless browser — across 55 scope-gated tools. Remote-first, so no local clone is required.",
  tags: ["project-management", "coding-agent", "sandbox", "deployment", "database"],
  author: { name: "Shreyash Singh" },
  docsUrl: "https://productos.dev/docs/integrations/mcp-tools",
  featured: false,
  config: `{
  "mcpServers": {
    "productos": {
      "url": "https://beta.productos.dev/api/mcp/connect"
    }
  }
}`,
};
