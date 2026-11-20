import type { UsersContent } from "./en";

export const ptBr: UsersContent = {
  errors: {
    self: "Você não pode alterar a sua própria conta",
    notFound: "Usuário não encontrado",
  },
  toast: {
    fallback: "Algo deu errado",
  },
  page: {
    title: "Usuários | TremTec",
    heading: "Usuários",
    subtitle: "Aprove novos cadastros, defina funções e suspenda acessos.",
    count: {
      zero: "{count} usuários",
      one: "{count} usuário",
      other: "{count} usuários",
    },
    countFiltered: {
      zero: "{count} usuários encontrados",
      one: "{count} usuário encontrado",
      other: "{count} usuários encontrados",
    },
  },
  filters: {
    searchPlaceholder: "Buscar por nome, e-mail ou login",
    roleLabel: "Filtrar por função",
    allRoles: "Todas as funções",
    statusLabel: "Filtrar por status",
    allStatuses: "Todos os status",
    apply: "Aplicar",
    clear: "Limpar",
  },
  table: {
    user: "Usuário",
    provider: "Provedor",
    role: "Função",
    status: "Status",
    lastActive: "Última atividade",
    actions: "Ações",
    you: "Você",
    roleFor: (name) => `Função de ${name}`,
    statusFor: (name) => `Status de ${name}`,
    deleteLabel: (name) => `Excluir ${name}`,
    deleteTitle: "Excluir usuário",
    deleteConfirm: (name) =>
      `Excluir ${name}? A pessoa pode se cadastrar de novo, mas começará como pendente.`,
    empty: {
      title: "Nenhum usuário encontrado",
      hint: "Tente outra busca ou limpe os filtros.",
    },
  },
  pagination: {
    showing: (from, to, total) => `Mostrando ${from}–${to} de ${total}`,
    previous: "Página anterior",
    next: "Próxima página",
  },
};
