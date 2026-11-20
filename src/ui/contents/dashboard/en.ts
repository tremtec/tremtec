import type { Provider } from "~/domain/shared/provider";
import type { Role, Status } from "~/domain/user/schema";
import type { PluralForms } from "~/lib/format";

export const en = {
  metadata: {
    title: "Dashboard | TremTec",
    description: "TremTec Dashboard",
    heading: "Dashboard",
  },
  shell: {
    workspace: "Workspace",
    products: "Products",
    soon: "Soon",
    signOut: "Sign out",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
  },
  nav: {
    workspace: [
      { label: "Dashboard", href: "/dashboard", icon: "heroicons:squares-2x2" },
    ],
    admin: [
      { label: "Users", href: "/dashboard/users", icon: "heroicons:users" },
    ],
  },
  roles: {
    admin: "Admin",
    user: "User",
  } satisfies Record<Role, string>,
  statuses: {
    active: "Active",
    pending: "Pending",
    suspended: "Suspended",
  } satisfies Record<Status, string>,
  providers: {
    github: "GitHub",
    google: "Google",
  } satisfies Record<Provider, string>,
  welcome: {
    greeting: "Welcome back,",
    admin: "Here's how your platform is doing today.",
    user: "Here's what we're building next.",
  },
  pending: {
    title: "Your account is awaiting approval",
    body: "The TremTec team reviews every new account. We'll enable full access as soon as that's done.",
  },
  metrics: {
    label: "Key metrics",
    total: "Total users",
    admins: {
      one: "{count} admin",
      other: "{count} admins",
    } as PluralForms,
    active: "Active",
    activeHint: "Can use the platform",
    pending: "Pending approval",
    pendingHint: "Waiting for review",
    pendingNone: "Nothing to review",
    newThisWeek: "New this week",
    suspended: {
      one: "{count} suspended",
      other: "{count} suspended",
    } as PluralForms,
  },
  signups: {
    title: "New users",
    subtitle: "Last 14 days",
    total: (count: string) => `${count} total`,
    chartLabel: "New users per day over the last 14 days",
    point: {
      one: "{count} new user",
      other: "{count} new users",
    } as PluralForms,
  },
  provider: {
    title: "Sign-in provider",
    subtitle: "How people join",
    chartLabel: "Sign-ins by provider",
    users: "users",
  },
  recent: {
    title: "Recent sign-ups",
    subtitle: "The latest people to join",
    viewAll: "View all",
  },
  roadmap: {
    title: "On the roadmap",
    subtitle: "New products arriving on the platform",
    comingSoon: "Coming soon",
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
      id: "lgpd",
      name: "LGPD",
      tagline: "Data protection",
      description:
        "Data protection tooling to map personal data, track consent and answer requests.",
      icon: "heroicons:shield-check",
      gradient: "from-emerald-500/30 via-teal-500/10 to-transparent",
      accent: "text-emerald-500",
    },
  ],
};

export type DashboardContent = typeof en;
