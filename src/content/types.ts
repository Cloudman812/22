export type IntroContent = {
  eyebrow: string;
  title: string;
  leadMd: string;
  bullets: string[];
  primaryCta: string;
  secondaryCta?: string;
  footnoteMd?: string;
};

export type MediaItem = {
  type: "image" | "video";
  src: string;
  alt?: string;
  poster?: string;
};

export type StepMoment = {
  kind: "moment";
  title: string;
  bodyMd: string;
  media?: MediaItem[];
};

export type StepGift = {
  kind: "gift";
  title?: string;
  bodyMd?: string;
  gift: {
    hintPoetic: string;
    hintConcrete: string;
    placePhoto?: string | null;
  };
};

export type StepFinale = {
  kind: "finale";
  finale: true;
  title?: string;
  credits: string[];
  codaMd: string;
  physicalHint: string;
  finaleMedia?: { src: string; alt?: string };
};

export type StepDoc = StepMoment | StepGift | StepFinale;

export type SystemMessagesFile = {
  beforeIntro: string[];
  tooEarly: string[];
};
