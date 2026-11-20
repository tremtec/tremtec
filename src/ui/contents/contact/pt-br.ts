import type { ContactContent } from "./en";

export const ptBr: ContactContent = {
  metadata: {
    title: "Fale Conosco - TremTec",
    description:
      "Entre em contato com a TremTec. Vamos conversar sobre os seus desafios de engenharia.",
  },
  hero: {
    title: "Vamos Construir Algo Grande Juntos",
    subtitle:
      "Conte para nós os seus desafios de engenharia. Respondemos em até 24 horas.",
  },
  form: {
    fields: {
      name: {
        label: "Nome Completo",
        placeholder: "Seu nome",
        required: true,
      },
      email: {
        label: "E-mail",
        placeholder: "voce@empresa.com",
        required: true,
      },
      company: {
        label: "Empresa",
        placeholder: "Empresa (opcional)",
        required: false,
      },
      service: {
        label: "Serviço de Interesse",
        placeholder: "Selecione um serviço...",
        required: true,
        options: [
          { value: "implementation", label: "Squad de Implementação" },
          { value: "diagnostics", label: "CTO Fracionado" },
          { value: "mentoring", label: "Mentoria e Coaching" },
          { value: "other", label: "Outro / Não tenho certeza" },
        ],
      },
      message: {
        label: "Mensagem",
        placeholder: "Conte sobre o seu projeto...",
        required: true,
        hint: "Mínimo de 10 caracteres",
      },
    },
    submit: "Iniciar a Conversa",
    success: "Obrigado! Entraremos em contato em até 24 horas.",
    error: "Algo deu errado. Tente novamente ou escreva para hello@tremtec.com",
    retry: "Tentar novamente",
  },
  trustSignals: [
    {
      icon: "clock",
      title: "Resposta em 24h",
      description: "Respondemos em até um dia útil",
      color: "primary",
    },
    {
      icon: "shield",
      title: "Sem Compromisso",
      description: "Consultoria gratuita, sem pressão",
      color: "secondary",
    },
    {
      icon: "lock",
      title: "Privacidade Protegida",
      description: "Suas informações estão seguras conosco",
      color: "accent",
    },
  ],
};
