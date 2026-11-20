export const en = {
  metadata: {
    title: "Blog - TremTec",
    description:
      "Insights on engineering excellence, AI-driven development, and scaling high-performance teams.",
    postTitle: (title: string) => `${title} - TremTec`,
  },
  rss: {
    title: "TremTec Blog",
    description:
      "Engineering insights on AI-driven development, team scaling, and building trustworthy software faster.",
  },
  hero: {
    eyebrow: "Our Blog",
    title: "Ideas & Insights",
    subtitle:
      "Engineering excellence, AI-driven development, and lessons from scaling high-performance teams.",
  },
  latest: "Latest",
  readArticle: "Read article",
  moreArticles: "More Articles",
  backToBlog: "Back to Blog",
  previous: "← Previous",
  next: "Next →",
  cta: {
    title: "Want to work with us?",
    subtitle:
      "We help high-growth companies build trustworthy software faster.",
    button: "Get Started",
  },
};

export type BlogContent = typeof en;
