import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/server";
import { createAtlasServer } from "@/mcp/create-server";

export const dynamic = "force-dynamic";

async function handle(request: Request) {
  const server = createAtlasServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  await server.connect(transport);
  return transport.handleRequest(request);
}

export const GET = handle;
export const POST = handle;
export const DELETE = handle;
