export const dashboardContent = {
  nav: {
    workspace: [
      { label: "Dashboard", href: "/dashboard", icon: "heroicons:squares-2x2" },
    ],
    admin: [
      { label: "Users", href: "/dashboard/users", icon: "heroicons:users" },
    ],
  },
  products: [
    {
      id: "kyc",
      name: "KYC",
      tagline: "Know Your Customer",
      description:
        "Identity verification and onboarding checks that keep your sign-ups compliant without slowing them down.",
      icon: "heroicons:identification",
      gradient: "from-sky-500/30 via-blue-500/10 to-transparent",
      accent: "text-sky-500",
    },
    {
      id: "triple-a",
      name: "Triple-A",
      tagline: "Authentication, Authorization, Accounting",
      description:
        "Centralised access control with a full audit trail of who did what, and when.",
      icon: "heroicons:key",
      gradient: "from-violet-500/30 via-fuchsia-500/10 to-transparent",
      accent: "text-violet-500",
    },
    {
      id: "ldpg",
      name: "LDPG",
      tagline: "Data protection",
      description:
        "Data protection tooling to map personal data, track consent and answer requests.",
      icon: "heroicons:shield-check",
      gradient: "from-emerald-500/30 via-teal-500/10 to-transparent",
      accent: "text-emerald-500",
    },
  ],
} as const;
