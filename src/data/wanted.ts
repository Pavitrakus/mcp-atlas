export type WantedSeed = {
  slug: string;
  title: string;
  wish: string;
  service?: string;
  platform?: string;
  workflow?: string;
  hosting?: string;
};

export const wantedSeeds: WantedSeed[] = [
  {
    slug: "hinge",
    title: "Hinge, with consent",
    wish: "I want an assistant to help me organize and draft replies in Hinge, through an official or explicitly permitted interface.",
    service: "Hinge",
    workflow: "Read conversations I already have, suggest a reply, and wait for me to send it.",
    hosting: "remote",
  },
  {
    slug: "arduino-serial",
    title: "Arduino serial",
    wish: "I want an assistant to read serial output from a board on my desk and send a command I have already decided is safe.",
    service: "Arduino",
    platform: "local serial",
    workflow: "Show the last lines from the serial monitor and let me approve a single command.",
    hosting: "local",
  },
  {
    slug: "blender-assets",
    title: "Blender asset library",
    wish: "I want an assistant to search a local Blender asset library and append an asset into the open file.",
    service: "Blender",
    workflow: "Search by name, preview the asset, append it after I confirm.",
    hosting: "local",
  },
  {
    slug: "freecad",
    title: "FreeCAD",
    wish: "I want an assistant to inspect a FreeCAD document and change a named constraint without redrawing the part from scratch.",
    service: "FreeCAD",
    hosting: "local",
  },
  {
    slug: "qgis",
    title: "QGIS",
    wish: "I want an assistant to inspect layers in a local QGIS project and answer questions about the attributes.",
    service: "QGIS",
    hosting: "local",
  },
  {
    slug: "octoprint",
    title: "3D printer",
    wish: "I want an assistant to read the status of a printer I run and pause it, through OctoPrint or an equivalent local API.",
    service: "OctoPrint",
    workflow: "Report temperatures and progress. Pause only after I confirm.",
    hosting: "local",
  },
  {
    slug: "caldav",
    title: "CalDAV calendar",
    wish: "I want an assistant to read a calendar I host myself, over CalDAV, without a Google account.",
    service: "CalDAV",
    hosting: "local",
  },
  {
    slug: "google-maps",
    title: "Google Maps",
    wish: "I want an assistant to look up a place, a route, and travel time with my own Google Maps key.",
    service: "Google Maps",
    hosting: "remote",
  },
  {
    slug: "lab-notebook",
    title: "Laboratory notebook",
    wish: "I want an assistant to append an observation to a local lab notebook, with the date and the instrument I name.",
    hosting: "local",
  },
  {
    slug: "robot-arm",
    title: "Robot arm, with a fence",
    wish: "I want an assistant to jog a robot arm inside limits I configure, and refuse any move outside that fence.",
    service: "A local robot controller",
    workflow: "Read joint angles. Propose a move. Execute only after confirmation, and never outside the configured bounds.",
    hosting: "local",
  },
  {
    slug: "internal-warehouse",
    title: "Internal warehouse, read only",
    wish: "I want an assistant to answer questions from my company's warehouse using a read-only role, and no write path at all.",
    hosting: "local",
  },
  {
    slug: "sheet-music",
    title: "Sheet music",
    wish: "I want an assistant to read a MusicXML file on disk and describe the harmony.",
    hosting: "local",
  },
];
