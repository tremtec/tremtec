import type { ServicesContent } from "./en";

export const ptBr: ServicesContent = {
  metadata: {
    title: "Preços - TremTec",
  },
  hero: {
    title: "Engenharia Flexível. No Seu Ritmo.",
    subtitle:
      "Escalamos o nosso time de acordo com o seu projeto, prazo e orçamento. Sem funções fixas. Sem compromissos de longo prazo. Apenas as pessoas certas, na hora certa.",
  },
  investment: "Investimento",
  popular: "MAIS POPULAR",
  teamLabel: "Time:",
  plans: [
    {
      id: "fractional-cto",
      icon: "🔍",
      title: "CTO Fracionado",
      summary:
        "Descubra onde você realmente está lento. Receba um roteiro claro de velocidade.",
      price: "$5K–$15K",
      duration: "1–2 semanas",
      features: [
        "Análise profunda do SDLC",
        "Identificação de gargalos",
        "Roteiro recomendado",
      ],
      team: "1 Engenheiro Sênior (líder) + especialistas opcionais",
      cta: "Agende uma conversa →",
      popular: false,
    },
    {
      id: "implementation",
      icon: "⚙️",
      title: "Implementação",
      summary:
        "Construa SDLCs reproduzíveis com IA. O seu time aprende padrões sustentáveis.",
      price: "$25K–$75K",
      duration: "4–8 semanas",
      features: [
        "Squad de engenharia dedicado",
        "Setup completo do SDLC + integração com IA",
        "Transferência de conhecimento (o seu time aprende)",
        "Independência após o engajamento",
      ],
      team: "1 Líder + 1–3 Engenheiros (escala com o escopo)",
      cta: "Peça uma proposta →",
      popular: true,
    },
    {
      id: "mentoring",
      icon: "🎓",
      title: "Mentoria",
      summary:
        "Coaching contínuo para dominar IA e manter uma velocidade sustentável.",
      price: "$5K–$8K/mo",
      duration: "Mês a mês",
      features: [
        "Sessões mensais de estratégia",
        "Orientação técnica sob demanda",
        "Refinamento e otimização de padrões",
      ],
      team: "1 Engenheiro Sênior (horas flexíveis)",
      cta: "Saiba mais →",
      popular: false,
    },
  ],
  stats: {
    title: "Por Que os Times Escolhem a TremTec",
    items: [
      { value: "40%", label: "Ganho médio de velocidade no primeiro mês" },
      { value: "0", label: "Contratos mensais após o engajamento" },
      {
        value: "1 semana",
        label: "Tempo médio de adaptação de novos contratados",
      },
      { value: "100%", label: "Conhecimento sob propriedade do seu time" },
    ],
  },
  flexibility: {
    title: "Recursos Que Se Ajustam a Você",
    composition: {
      title: "Composição do Time",
      intro:
        'Não impomos um "squad" padrão. Dependendo do seu projeto, podemos alocar:',
      items: [
        {
          term: "Engenheiros full-stack",
          text: "para funcionalidades de ponta a ponta",
        },
        { term: "Arquitetos", text: "para o design de sistemas complexos" },
        {
          term: "DevOps/Infraestrutura",
          text: "para deploy e escalabilidade",
        },
        { term: "Especialistas em IA", text: "para integração com LLMs" },
        { term: "Coaches de produto", text: "para o desenho de processos" },
      ],
    },
    engagement: {
      title: "Modelos de Engajamento",
      intro: "Escolha o que se encaixa nas suas restrições:",
      items: [
        {
          term: "Presencial",
          text: "— O squad trabalha no seu escritório/fuso horário",
        },
        {
          term: "Remoto",
          text: "— Assíncrono em primeiro lugar, com sobreposição flexível",
        },
        {
          term: "Híbrido",
          text: "— Pessoas-chave no mesmo local, o restante remoto",
        },
        {
          term: "Meio período",
          text: "— Ajustamos as horas conforme a sua necessidade",
        },
        {
          term: "Período integral",
          text: "— Squad dedicado durante toda a sprint",
        },
      ],
    },
  },
  drivers: {
    title: "O Que Define o Seu Investimento",
    items: [
      {
        title: "Escopo",
        question: "O que vamos construir?",
        points: [
          "Uma funcionalidade vs. reformulação completa do SDLC",
          "Tamanho do time (5 engenheiros vs. 50)",
          "Complexidade técnica (código legado vs. projeto novo)",
          "Requisitos de integração",
        ],
      },
      {
        title: "Prazo",
        question: "Com que rapidez você precisa de resultados?",
        points: [
          "Sprint de 4 semanas vs. programa de 12 semanas",
          "Intensidade (meio período vs. período integral)",
          "Adaptação e sobreposição na transferência de conhecimento",
        ],
      },
      {
        title: "Composição do Time",
        question: "De quem você precisa?",
        points: [
          "Arquiteto sênior vs. time full-stack",
          "Expertise especializada (DevOps, IA etc.)",
          "Níveis de senioridade",
        ],
      },
      {
        title: "Modelo de Suporte",
        question: "O que acontece depois?",
        points: [
          "Engajamento isolado vs. + mentoria",
          "Preparo para a entrega (documentação, treinamento)",
          "Contrato contínuo de otimização",
        ],
      },
    ],
  },
  cta: {
    title: "Vamos Conversar Sobre o Seu Projeto",
    description:
      "Cada projeto é diferente. Ouvimos as suas restrições, escopo e prazo — e propomos um modelo de alocação flexível que realmente se encaixa.",
    bookCall: {
      label: "Agende uma conversa de 30 min",
      href: "mailto:hello@tremtec.com?subject=Inquiry%20about%20services",
    },
    caseStudies: "Ver estudos de caso",
    emailPrefix: "Ou escreva para",
    email: "hello@tremtec.com",
    emailSuffix: "com os detalhes do seu projeto.",
  },
  faq: {
    title: "Perguntas Frequentes",
    items: [
      {
        question: "Isso vai substituir o nosso time?",
        answer:
          "Não. Ensinamos o seu time a dominar práticas modernas. O objetivo é a independência — após o nosso engajamento, o processo é seu. Não somos uma dependência permanente.",
      },
      {
        question: "Podemos aumentar ou reduzir o time no meio do projeto?",
        answer:
          "Sim. Ajustamos a equipe de acordo com as necessidades reais. Se o escopo mudar ou surgir um obstáculo, nos adaptamos. Não há multa por redimensionar.",
      },
      {
        question: "E se precisarmos de suporte contínuo?",
        answer:
          "Adicione o nosso nível de Mentoria ($5K–$8K/mês). O seu engenheiro líder continua envolvido em estratégia, revisões e refinamento de padrões. Muito diferente de um contrato de CTO fracionado — aqui é coaching, não substituição.",
      },
      {
        question: "Vocês trabalham remotamente?",
        answer:
          "Sim. Totalmente remoto, presencial, híbrido — o que funcionar para você. Desenhamos os modelos de engajamento em torno das suas restrições, não das nossas.",
      },
      {
        question: "O que está incluído na transferência de conhecimento?",
        answer:
          "Documentação de padrões, walkthroughs de código, sessões de treinamento do time e tempo de sobreposição com os seus engenheiros. Ao final, você terá propriedade + entendimento, não apenas código entregue.",
      },
      {
        question: "Qual a diferença em relação a contratar um CTO Fracionado?",
        answer:
          "CTOs fracionados ($5K–$10K/mês) lideram a sua tecnologia indefinidamente. Você continua dependente. A Implementação da TremTec ($25K–$75K à vista, 4–8 semanas) ensina práticas sustentáveis ao seu time, e depois você opera de forma independente. Se quiser suporte contínuo, adicione Mentoria — mas é o seu time que conduz, não nós.",
      },
    ],
  },
};
