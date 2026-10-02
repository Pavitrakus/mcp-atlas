export type Plate = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const plates = {
  observatory: {
    src: "/plates/observatory.jpg",
    alt: "An engraving of a stone observatory and a brass telescope on a ridge.",
    width: 1280,
    height: 720,
  },
  archive: {
    src: "/plates/archive.jpg",
    alt: "An engraving of a library wall of shelves and a single ladder.",
    width: 1280,
    height: 720,
  },
  loom: {
    src: "/plates/loom.jpg",
    alt: "An engraving of a Jacquard loom with a row of punched cards.",
    width: 1152,
    height: 864,
  },
  arm: {
    src: "/plates/arm.jpg",
    alt: "An engraving of a brass mechanical arm on a stone block.",
    width: 1152,
    height: 864,
  },
  window: {
    src: "/plates/window.jpg",
    alt: "An engraving of a many-paned window in a stone study.",
    width: 1152,
    height: 864,
  },
  herbarium: {
    src: "/plates/herbarium.jpg",
    alt: "An engraving of pressed plants on a herbarium table.",
    width: 1152,
    height: 864,
  },
  ledger: {
    src: "/plates/ledger.jpg",
    alt: "An engraving of a counting house desk with scales and closed books.",
    width: 1152,
    height: 864,
  },
  house: {
    src: "/plates/house.jpg",
    alt: "An engraving of a domestic room with a small mechanical bird.",
    width: 1152,
    height: 864,
  },
  film: {
    src: "/plates/film.jpg",
    alt: "An engraving of a film bench with two metal reels.",
    width: 1152,
    height: 864,
  },
  studio: {
    src: "/plates/studio.jpg",
    alt: "An engraving of a sculptor's studio and an unfinished figure.",
    width: 1152,
    height: 864,
  },
  chart: {
    src: "/plates/chart.jpg",
    alt: "An engraving of a chart table with dividers and an unlabeled coast.",
    width: 1152,
    height: 864,
  },
  laboratory: {
    src: "/plates/laboratory.jpg",
    alt: "An engraving of a laboratory bench with glass retorts.",
    width: 1280,
    height: 720,
  },
} as const satisfies Record<string, Plate>;

export type PlateId = keyof typeof plates;

const byCategory: Record<string, PlateId> = {
  search: "observatory",
  research: "laboratory",
  science: "laboratory",
  knowledge: "archive",
  databases: "archive",
  code: "loom",
  computation: "loom",
  browsers: "window",
  design: "studio",
  "creative-tools": "studio",
  media: "film",
  communication: "film",
  "local-systems": "house",
  automation: "house",
  finance: "ledger",
  productivity: "ledger",
  games: "chart",
  geospatial: "chart",
  robotics: "arm",
  security: "arm",
  devops: "loom",
  social: "house",
  other: "observatory",
};

export function plateForCategories(slugs: string[]): Plate {
  for (const slug of slugs) {
    const id = byCategory[slug];
    if (id) return plates[id];
  }
  return plates.observatory;
}

export function plateForCategory(slug: string): Plate {
  return plateForCategories([slug]);
}
