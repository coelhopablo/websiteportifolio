export type PortfolioCategory = {
  number: string;
  title: string;
  description: string;
  image: string;
  href: string;
  accent: string;
};

export type GalleryItem = {
  full: string;
  thumb: string;
  alt: string;
};

const image = (path: string) => `/${path}`;

export const categories: PortfolioCategory[] = [
  {
    number: "01",
    title: "Illustration",
    description: "Characters, worlds and images built by hand.",
    image: image("illustration/illustration 2.jpg"),
    href: "#gallery/illustration",
    accent: "lime",
  },
  {
    number: "02",
    title: "Oil painting",
    description: "Figurative painting, material and light in layers.",
    image: image("paintings/oil (1).jpg"),
    href: "#gallery/painting",
    accent: "coral",
  },
  {
    number: "03",
    title: "Scenic art",
    description: "Image, scenery and visual direction for narratives.",
    image: image("scenic/scenic (1).jpg"),
    href: "#gallery/scenic",
    accent: "sky",
  },
  {
    number: "04",
    title: "Animation",
    description: "Movement, timing and drawing for storytelling.",
    image: image("illustration/ilus (4).jpg"),
    href: "#gallery/animation",
    accent: "yellow",
  },
  {
    number: "05",
    title: "Comics",
    description: "The universe of Comics Hut and The Moonyman.",
    image: image("comics/themoonyman (1).jpg"),
    href: "#gallery/comics",
    accent: "pink",
  },
  {
    number: "06",
    title: "Web design",
    description: "Digital projects, interfaces and experiences in progress.",
    image: image("illustration/illustration 5.jpg"),
    href: "#gallery/web",
    accent: "blue",
  },
];

const numberedImages = (
  folder: string,
  prefix: string,
  count: number,
  thumbFolder = folder,
  thumbPrefix = prefix,
): GalleryItem[] =>
  Array.from({ length: count }, (_, index) => {
    const number = index + 1;
    return {
      full: image(`${folder}/${prefix} (${number}).jpg`),
      thumb: image(`${thumbFolder}/${thumbPrefix} (${number}).jpg`),
      alt: `${prefix} ${number}`,
    };
  });

export const galleries: Record<string, GalleryItem[]> = {
  illustration: [
    ...Array.from({ length: 5 }, (_, index) => {
      const number = index + 1;
      return {
        full: image(`illustration/illustration ${number}.jpg`),
        thumb: image(`illustrationthumbs/illustrationthumb (${number}).jpg`),
        alt: `Illustration ${number}`,
      };
    }),
    {
      full: image("illustration/10.jpg"),
      thumb: image("illustrationthumbs/illustrationthumb (16).jpg"),
      alt: "Illustration 6",
    },
    {
      full: image("illustration/1600992_832567650103162_1660306313_n.jpg"),
      thumb: image("illustrationthumbs/illustrationthumb (17).jpg"),
      alt: "Illustration 7",
    },
    ...numberedImages(
      "illustration",
      "sketch",
      4,
      "illustrationthumbs",
      "illustrationthumb",
    ).map((item, index) => ({
      ...item,
      full: image(`illustration/sketch ${index + 1}.jpg`),
      thumb: image(`illustrationthumbs/illustrationthumb (${index + 11}).jpg`),
      alt: `Sketch ${index + 1}`,
    })),
  ],
  painting: numberedImages("paintings", "oil", 12, "oilthumbs", "oilthumb 1"),
  scenic: [
    ...Array.from({ length: 19 }, (_, index) => index + 1),
    ...Array.from({ length: 16 }, (_, index) => index + 21),
  ].map((number) => ({
    full: image(`scenic/scenic (${number}).jpg`),
    thumb: image(`scenicthumbs/scenic (${number})-min.jpg`),
    alt: `Scenic artwork ${number}`,
  })),
  comics: Array.from({ length: 31 }, (_, index) => {
    const number = index + 1;
    return {
      full: image(`comics/themoonyman (${number}).jpg`),
      thumb: image(`comicsthumb/themoonyman (${number})-min.jpg`),
      alt: `The Moonyman comic ${number}`,
    };
  }),
};

export const videos = [
  "J8FTVXAFAMw",
  "pxsE5ACnX9M",
  "KhQxHcAP4x0",
  "4eYwLjWKWoc",
];
