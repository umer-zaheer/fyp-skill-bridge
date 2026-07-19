/** Default Unsplash images used across the LMS (catalog, dashboards, marketing). */

const q = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const courseImages = {
  typescript: q("photo-1516116216624-53e697fedbea"),
  webDev: q("photo-1498050108023-c5249f4df085"),
  design: q("photo-1561070791-2526d30994b5"),
  marketing: q("photo-1460925895917-afdab827c52f"),
  dataScience: q("photo-1555949963-aa79dcee981c"),
  python: q("photo-1526374965328-7f61d4dc18c5"),
  react: q("photo-1633356122544-f134324a6cee"),
  photography: q("photo-1554048612-387768052bf7"),
  architecture: q("photo-1503387762-592deb58ef4e", 1200),
  figma: q("photo-1611162617474-5b21e879e113"),
  ads: q("photo-1533750516457-a7f992034fec"),
  systemDesign: q("photo-1558494949-ef010cbdcc31"),
  ux: q("photo-1586717791821-3f44a563fa4c"),
  node: q("photo-1627398242454-45a1465c2479"),
  testing: q("photo-1516321318423-f06f85e504b3"),
  sql: q("photo-1544383835-bda2bc66a55d"),
  product: q("photo-1552664730-d307ca884978"),
  ml: q("photo-1527474305487-b87b222841cc"),
  education: q("photo-1524178232363-1fb2b075b655", 1000),
  preview: q("photo-1516321318423-f06f85e504b3", 1200),
} as const;

export const avatarImages = {
  a: "https://i.pravatar.cc/150?img=11",
  b: "https://i.pravatar.cc/150?img=12",
  c: "https://i.pravatar.cc/150?img=13",
  d: "https://i.pravatar.cc/150?img=32",
  e: "https://i.pravatar.cc/150?img=47",
  f: "https://i.pravatar.cc/150?img=5",
  instructor:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
  instructor2:
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=400&auto=format&fit=crop",
} as const;

/** Stable thumb by course id / index */
export function courseThumb(key: string | number): string {
  const list = Object.values(courseImages);
  if (typeof key === "number") return list[key % list.length]!;
  const hash = [...String(key)].reduce((a, c) => a + c.charCodeAt(0), 0);
  return list[hash % list.length]!;
}

export const defaultCoursePreview = courseImages.preview;
