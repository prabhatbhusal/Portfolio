// plain, serialisable data — built on the server from the database and
// handed to the client navbar as a prop

export type NavIcon = "user" | "layers" | "image" | "help" | "mail" | "live";

export interface NavChild {
  title: string;
  description: string;
  url: string;
  /* small chips under the item, like the reference's service tags */
  tags?: string[];
  /* the tile beside the title: an image, an icon, or a few characters */
  thumb?: string;
  icon?: NavIcon;
  tile?: string;
}

/* the dark card on the right of a panel */
export interface NavFeature {
  eyebrow: string;
  title: string;
  cta: string;
  url: string;
  image?: string;
}

export interface NavItem {
  title: string;
  url: string;
  children?: NavChild[];
  feature?: NavFeature;
  /* label for the "see everything" link at the foot of the panel */
  more?: string;
}
