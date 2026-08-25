import { MCPServer } from "@/lib/types";

export const churnsolutionServer: MCPServer = {
  slug: "churnsolution",
  title: "Churn Solution",
  description: "Query subscription retention analytics — cancellation-flow metrics, save rates, recovered revenue, offer performance, and customer feedback — for B2C subscription businesses on Stripe. Read-only.",
  tags: ["churn", "retention", "subscriptions", "stripe", "analytics"],
  author: {
    name: "Churn Solution",
    url: "https://churnsolution.com",
  },
  repoUrl: "https://github.com/Churnsolution/Churnsolution-MCP",
  docsUrl: "https://churnsolution.com/docs/mcp-server",
  installCommand: "claude mcp add --transport http churnsolution https://mcp.churnsolution.com",
  config: `{
  "mcpServers": {
    "churnsolution": {
      "type": "http",
      "url": "https://mcp.churnsolution.com"
    }
  }
}`,
};
