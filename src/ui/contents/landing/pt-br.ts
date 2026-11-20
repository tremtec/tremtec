import type { LandingContent } from "./en";

export const ptBr: LandingContent = {
  metadata: {
    title: "TremTec - Construa Software Confiável Mais Rápido",
    description:
      "Times de engenharia flexíveis que escalam com o seu projeto. Construa software confiável mais rápido com desenvolvimento orientado por IA e times especialistas.",
    defaultDescription: "TremTec Soluções em Software",
    rssTitle: "Feed RSS do Blog da TremTec",
  },
  navbar: {
    logo: "TremTec",
    logoAlt: "Logo da TremTec",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    languageLabel: "Idioma",
    links: [
      { label: "Início", href: "/" },
      { label: "Serviços", href: "/services" },
      { label: "Produtos", href: "/products" },
      { label: "Blog", href: "/blog" },
    ],
    cta: {
      login: "Entrar",
      getStarted: "Começar",
    },
  },
  hero: {
    title: "Engenharia Flexível. No Seu Ritmo.",
    description:
      "Traga o time certo para o seu projeto quando precisar. Sem funções fixas. Sem compromissos de longo prazo. Apenas especialistas que escalam com o seu escopo, prazo e orçamento — e depois entregam a propriedade completa ao seu time.",
    cta: {
      demo: "Comece o Seu Projeto",
      howItWorks: "Veja Como Funciona",
    },
    imageAlt: "Times de engenharia flexíveis para empresas em alto crescimento",
  },
  trustedBy: {
    title: "Confiança de empresas em alto crescimento",
    companies: ["PodCodar", "Devopness", "Plantar Me", "MeHabilite"],
  },
  testimonials: {
    title: "Resultados Comprovados",
    description:
      "Resultados reais de empresas em alto crescimento com as quais fizemos parceria",
    items: [
      {
        company: "MeHabilite",
        service: "Terceirização com IA",
        outcome: "75% de redução no Time-to-Market",
        icon: "heroicons:rocket-launch",
      },
      {
        company: "PodCodar",
        service: "Terceirização e formação",
        outcome: "Mais de 40 pessoas qualificadas do zero ao mercado em 3 anos",
        icon: "heroicons:users",
      },
      {
        company: "Devopness",
        service: "Terceirização + Consultoria em Excelência de Engenharia",
        outcomes: ["MVP 56% mais barato", "Entrega 36% mais rápida"],
        icon: "heroicons:chart-bar-square",
      },
    ],
  },
  services: {
    badge: "Alocação Flexível",
    title: "Três formas de escalar com o seu projeto",
    description:
      "Seja uma análise rápida do seu SDLC, uma implementação prática com um squad dedicado ou uma mentoria contínua enquanto você domina novas práticas — ajustamos o nosso time ao seu escopo, prazo e restrições.",
    items: [
      {
        id: "implementation",
        title: "Squad de Implementação",
        description:
          "Um time dedicado (1 líder + 1–3 engenheiros) que constrói SDLCs reproduzíveis e transfere todo o conhecimento ao seu time. Após 4–8 semanas, você opera de forma independente. Sem contrato recorrente.",
        icon: "heroicons:cpu-chip",
        bgIcon: "heroicons:code-bracket-square",
        linkText: "Ver preços",
      },
      {
        id: "fractional-cto",
        title: "CTO Fracionado",
        description:
          "Análise de 1–2 semanas que revela os seus gargalos reais, os motores de velocidade e um roteiro claro daqui para frente. Clareza rápida, sem um ano de contrato.",
        icon: "heroicons:chart-bar-square",
        bgIcon: "heroicons:magnifying-glass",
      },
      {
        id: "mentoring",
        title: "Mentoria e Coaching",
        description:
          "Parceria contínua (mês a mês) em que o seu time conduz e nós orientamos. Sessões mensais de estratégia, orientação sob demanda e otimização contínua de padrões.",
        icon: "heroicons:academic-cap",
        badges: [
          "Domínio de IA",
          "Orientação de Arquitetura",
          "Otimização de Performance",
        ],
      },
    ],
    codeSnippet: `
defmodule HighPerformanceTeam do
  use Expertise

  def scale(team) do
    team
    |> Mentorship.boost()
    |> Process.optimize()
    |> Output.maximize()
  end
end`,
  },
  methodology: {
    badge: "Como Trabalhamos",
    title: "Times flexíveis. Engajamento flexível.",
    description:
      "Adaptamos a nossa abordagem às suas restrições — escopo, prazo, localização, composição do time e nível de envolvimento.",
    features: [
      {
        title: "As Pessoas Certas, na Hora Certa",
        description:
          "Alocamos arquitetos, engenheiros, DevOps ou especialistas em IA conforme o que o seu projeto realmente precisa — e não um squad pré-definido.",
        icon: "heroicons:users",
      },
      {
        title: "As Suas Restrições Importam",
        description:
          "Remoto, presencial, híbrido. Meio período, período integral. Sprint curto, engajamento longo. Nós nos ajustamos à sua realidade.",
        icon: "heroicons:adjustments-horizontal",
      },
      {
        title: "Transferência de Conhecimento Incluída",
        description:
          "O seu time é dono do resultado. Documentamos padrões, orientamos enquanto construímos e entregamos o entendimento completo — não apenas código.",
        icon: "heroicons:shield-check",
      },
    ],
  },
  about: {
    title: "Escalamos recursos de acordo com a sua realidade.",
    description:
      "Nem todo projeto precisa de um CTO fracionado. Nem todo time quer uma dependência de longo prazo. Trazemos squads flexíveis que ensinam, implementam e entregam — para que você seja dono do resultado e opere de forma independente.",
    mission: {
      title: "Nossa Missão",
      paragraphs: [
        "Construir software confiável mais rápido, com o seu time no controle. Trazemos expertise quando você precisa, escalamos recursos conforme as suas restrições e garantimos a transferência completa de conhecimento para que você opere de forma independente.",
        "Acreditamos que empresas em alto crescimento merecem parceiros de engenharia que se ajustem a elas — e não fornecedores que as prendem em contratos recorrentes. Velocidade que permanece. Padrões que você entende. Times que crescem. Isso é a TremTec.",
      ],
    },
  },
  cta: {
    title: "Pronto para flexibilizar a sua engenharia?",
    description:
      "Vamos conversar sobre o seu projeto. Ouvimos as suas restrições, escopo e prazo — e propomos um modelo de alocação flexível que realmente se encaixa na sua realidade.",
    button: "Agendar uma Conversa",
    features: [
      {
        title: "Sem Funções Fixas",
        description:
          "Não impomos um squad padrão. Alocamos de acordo com o que o seu projeto realmente precisa.",
        icon: "heroicons:users",
      },
      {
        title: "O Seu Time É Dono",
        description:
          "Transferência de conhecimento, não apenas entrega. Após o engajamento, o seu time opera de forma independente, com entendimento completo.",
        icon: "heroicons:shield-check",
      },
    ],
  },
  footer: {
    description:
      "Times de engenharia flexíveis que escalam com o seu projeto. Seu time no controle.",
    sections: [
      {
        title: "Serviços",
        links: [
          { label: "Squad de Implementação", href: "/services" },
          { label: "CTO Fracionado", href: "/services" },
          { label: "Mentoria e Coaching", href: "/services" },
        ],
      },
      {
        title: "Empresa",
        links: [
          { label: "Sobre Nós", href: "#about" },
          { label: "Como Trabalhamos", href: "#methodology" },
          { label: "Blog", href: "/blog" },
          { label: "Contato", href: "/contact" },
        ],
      },
      {
        title: "Conecte-se",
        socials: [
          {
            label: "GitHub",
            icon: "mdi:github",
            href: "https://github.com/tremtec",
          },
          {
            label: "LinkedIn",
            icon: "mdi:linkedin",
            href: "https://www.linkedin.com/company/tremtec/",
          },
        ],
      },
    ],
    rights: "Todos os direitos reservados à TremTec.",
    legal: [
      { label: "Política de Privacidade", href: "#" },
      { label: "Termos de Serviço", href: "#" },
    ],
  },
};
