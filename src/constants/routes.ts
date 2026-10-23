import { T } from "@/lib/i18n";

export const paths = {
  home: "/",
  properties: "/prona",
  property: (slug: string) => `/prona/${slug}`,
  contact: "/kontakt",
} as const;

export const navLinks = [
  { to: paths.home, label: T("Kreu", "Home") },
  { to: paths.properties, label: T("Pronat", "Properties") },
  { to: `${paths.home}#sherbimet`, label: T("Shërbimet", "Services") },
  { to: `${paths.home}#vleresimet`, label: T("Vlerësimet", "Reviews") },
  { to: paths.contact, label: T("Kontakt", "Contact") },
];
