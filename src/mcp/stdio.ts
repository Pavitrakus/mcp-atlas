import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createAtlasServer } from "@/mcp/create-server";

serveStdio(() => createAtlasServer());
