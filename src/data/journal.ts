export type Note = {
  slug: string;
  number: string;
  title: string;
  deck: string;
  image: string;
  alt: string;
  readTime: string;
  sections: { heading: string; paragraphs: string[] }[];
  sources: { label: string; href: string }[];
};

export const journal: Note[] = [
  {
    slug: "what-is-an-mcp-server",
    number: "01",
    title: "What is an MCP server, really?",
    deck: "A plain English map of the small piece of software between your assistant and the rest of your tools.",
    image: "/plates/window.jpg",
    alt: "An illustrated window looking out toward a larger world",
    readTime: "4 min read",
    sections: [
      { heading: "The short answer", paragraphs: ["MCP stands for Model Context Protocol. It is a common way for AI applications to connect to outside tools and information. An MCP server is the small program that offers those capabilities; the AI application is the client that connects to it.", "For example, an assistant can describe a calendar without access to yours. Connect a calendar MCP server, grant it permission, and the assistant may be able to read events or create them, depending on the tools that server exposes. The server can run on your machine or be hosted remotely."] },
      { heading: "Three things it can expose", paragraphs: ["Tools are functions an assistant may call, such as searching a repository or writing a file. Resources provide material to read, such as a document or a piece of history. Prompts are reusable starting points. These are separate parts of the protocol, and a server can offer one or several.", "The useful question is not ‘Does it have MCP?’ It is ‘Which actions does this particular server expose, and under whose permissions?’"] },
      { heading: "How a request works", paragraphs: ["You ask the assistant to do something. The client shows it the tools available from connected servers. If the assistant chooses one, the client sends a structured request to that server. The server performs the action and returns a result. The assistant then uses that result in its answer.", "A server does not automatically give an assistant every capability on your computer or account. Its actual reach depends on the tools it exposes and the permissions you grant. Read both before installing."] },
      { heading: "How to choose one", paragraphs: ["Start with a task, then inspect the server's tool list and source repository. Check whether it reads or writes, where it runs, how credentials are handled, and which account or folders it can reach. A tiny weather lookup and a server that can run shell commands are very different decisions.", "Atlas links to public project information and gives you a place to start. The publisher's current documentation and the permission screen in your AI client are the final things to check before connecting."] },
    ],
    sources: [{ label: "MCP server overview", href: "https://modelcontextprotocol.io/specification/draft/server/index" }],
  },
  {
    slug: "read-before-you-connect",
    number: "02",
    title: "Read this before you connect a tool.",
    deck: "A five minute inspection habit for a directory full of tempting buttons.",
    image: "/plates/archive.jpg",
    alt: "An illustrated archive filled with records",
    readTime: "5 min read",
    sections: [
      { heading: "Start with the reach", paragraphs: ["A weather lookup and a full terminal do not ask for the same trust. Look at the tools, the folders or accounts they can reach, and whether any action can write or publish. Give a server only the access its job requires.", "A local server without an API key is not automatically narrow. It may inherit everything your user account can see. A remote server with OAuth is bounded by the scopes you grant it."] },
      { heading: "Then read the source", paragraphs: ["Open the publisher's documentation and the repository. Check who maintains it, when it was last touched, what license is present, and whether the install command still points to the same project. A recent push can mean active maintenance, but it does not prove a security review.", "Treat an index entry as a starting point. Live tool lists, prices, and authorization flows can change after an edition is printed."] },
      { heading: "Install deliberately", paragraphs: ["Keep credentials out of copied prompts. Use the client's supported secret handling, review the permission screen, and begin with a low stakes task. If a server surprises you, disconnect it and inspect what happened before trying again."] },
    ],
    sources: [{ label: "Official MCP Registry", href: "https://registry.modelcontextprotocol.io" }, { label: "MCP tools specification", href: "https://modelcontextprotocol.io/specification/draft/server/tools" }],
  },
  {
    slug: "the-strange-shelf",
    number: "03",
    title: "A tour of the strange shelf.",
    deck: "The best argument for an open protocol may be the things nobody thought to ask for.",
    image: "/plates/studio.jpg",
    alt: "An engraving of a sculptor's studio and an unfinished figure",
    readTime: "3 min read",
    sections: [
      { heading: "More than office work", paragraphs: ["MCP directories often lead with tickets, repositories, and databases. Those are useful. The same pattern also reaches a Blender scene, a music studio, a game world, or a smart home. Each one changes what ‘help me with this’ can mean.", "The fun servers are also good tests of judgment. An assistant moving an object in a 3D scene is different from one editing the file that contains the whole project. Look at the exact tools before you give it a live workspace."] },
      { heading: "Small tools count", paragraphs: ["A server that answers the time in another city or fetches a forecast may sound trivial. It can still replace a made up answer with a fresh one. A tiny, well bounded ability is often more useful than a giant all access connector.", "Browse the unusual entries for ideas, then use the same standards you would use for the serious ones: source, permissions, install path, and maintenance."] },
    ],
    sources: [{ label: "Browse the strange servers", href: "/servers?weird=1" }],
  },
];
