import type { BlogContent } from "./en";

export const ptBr: BlogContent = {
  metadata: {
    title: "Blog - TremTec",
    description:
      "Ideias sobre excelência em engenharia, desenvolvimento orientado por IA e escala de times de alta performance.",
    postTitle: (title) => `${title} - TremTec`,
  },
  rss: {
    title: "Blog da TremTec",
    description:
      "Ideias de engenharia sobre desenvolvimento orientado por IA, escala de times e como entregar software confiável mais rápido.",
  },
  hero: {
    eyebrow: "Nosso Blog",
    title: "Ideias e Insights",
    subtitle:
      "Excelência em engenharia, desenvolvimento orientado por IA e lições de quem escala times de alta performance.",
  },
  latest: "Mais recente",
  readArticle: "Ler artigo",
  moreArticles: "Mais artigos",
  backToBlog: "Voltar ao Blog",
  previous: "← Anterior",
  next: "Próximo →",
  cta: {
    title: "Quer trabalhar com a gente?",
    subtitle:
      "Ajudamos empresas em crescimento acelerado a construir software confiável mais rápido.",
    button: "Começar",
  },
};
