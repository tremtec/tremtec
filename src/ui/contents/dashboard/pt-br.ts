import type { DashboardContent } from "./en";

export const ptBr: DashboardContent = {
  metadata: {
    title: "Painel | TremTec",
    description: "Painel da TremTec",
    heading: "Painel",
  },
  shell: {
    workspace: "Espaço de trabalho",
    products: "Produtos",
    soon: "Em breve",
    signOut: "Sair",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    language: "Idioma",
  },
  nav: {
    workspace: [
      { label: "Painel", href: "/dashboard", icon: "heroicons:squares-2x2" },
    ],
    admin: [
      { label: "Usuários", href: "/dashboard/users", icon: "heroicons:users" },
    ],
  },
  roles: {
    admin: "Administrador",
    user: "Usuário",
  },
  statuses: {
    active: "Ativo",
    pending: "Pendente",
    suspended: "Suspenso",
  },
  providers: {
    github: "GitHub",
    google: "Google",
  },
  welcome: {
    greeting: "Bem-vindo de volta,",
    admin: "Veja como a sua plataforma está hoje.",
    user: "Veja o que estamos construindo a seguir.",
  },
  pending: {
    title: "Sua conta está aguardando aprovação",
    body: "A equipe da TremTec analisa cada nova conta. Vamos liberar o acesso completo assim que isso terminar.",
  },
  metrics: {
    label: "Principais métricas",
    total: "Total de usuários",
    admins: {
      zero: "{count} administradores",
      one: "{count} administrador",
      other: "{count} administradores",
    },
    active: "Ativos",
    activeHint: "Podem usar a plataforma",
    pending: "Aguardando aprovação",
    pendingHint: "Aguardando análise",
    pendingNone: "Nada para analisar",
    newThisWeek: "Novos esta semana",
    suspended: {
      zero: "{count} suspensos",
      one: "{count} suspenso",
      other: "{count} suspensos",
    },
  },
  signups: {
    title: "Novos usuários",
    subtitle: "Últimos 14 dias",
    total: (count) => `${count} no total`,
    chartLabel: "Novos usuários por dia nos últimos 14 dias",
    point: {
      zero: "{count} novos usuários",
      one: "{count} novo usuário",
      other: "{count} novos usuários",
    },
  },
  provider: {
    title: "Provedor de login",
    subtitle: "Como as pessoas entram",
    chartLabel: "Logins por provedor",
    users: "usuários",
  },
  recent: {
    title: "Cadastros recentes",
    subtitle: "As últimas pessoas a entrar",
    viewAll: "Ver todos",
  },
  roadmap: {
    title: "No roadmap",
    subtitle: "Novos produtos chegando à plataforma",
    comingSoon: "Em breve",
  },
  products: [
    {
      id: "kyc",
      name: "KYC",
      tagline: "Conheça seu cliente",
      description:
        "Verificação de identidade e checagens de onboarding que mantêm seus cadastros em conformidade sem deixá-los mais lentos.",
      icon: "heroicons:identification",
      gradient: "from-sky-500/30 via-blue-500/10 to-transparent",
      accent: "text-sky-500",
    },
    {
      id: "triple-a",
      name: "Triple-A",
      tagline: "Autenticação, Autorização e Contabilização",
      description:
        "Controle de acesso centralizado, com trilha de auditoria completa de quem fez o quê e quando.",
      icon: "heroicons:key",
      gradient: "from-violet-500/30 via-fuchsia-500/10 to-transparent",
      accent: "text-violet-500",
    },
    {
      id: "lgpd",
      name: "LGPD",
      tagline: "Proteção de dados",
      description:
        "Ferramentas de proteção de dados para mapear dados pessoais, registrar consentimentos e responder a solicitações.",
      icon: "heroicons:shield-check",
      gradient: "from-emerald-500/30 via-teal-500/10 to-transparent",
      accent: "text-emerald-500",
    },
  ],
};
