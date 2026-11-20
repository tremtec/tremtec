import type { PluralForms } from "~/lib/format";

export const en = {
  errors: {
    self: "You cannot change your own account",
    notFound: "User not found",
  },
  toast: {
    fallback: "Something went wrong",
  },
  page: {
    title: "Users | TremTec",
    heading: "Users",
    subtitle: "Approve new sign-ups, assign roles and suspend access.",
    count: { one: "{count} user", other: "{count} users" } as PluralForms,
    countFiltered: {
      one: "{count} user found",
      other: "{count} users found",
    } as PluralForms,
  },
  filters: {
    searchPlaceholder: "Search name, email or login",
    roleLabel: "Filter by role",
    allRoles: "All roles",
    statusLabel: "Filter by status",
    allStatuses: "All statuses",
    apply: "Apply",
    clear: "Clear",
  },
  table: {
    user: "User",
    provider: "Provider",
    role: "Role",
    status: "Status",
    lastActive: "Last active",
    actions: "Actions",
    you: "You",
    roleFor: (name: string) => `Role for ${name}`,
    statusFor: (name: string) => `Status for ${name}`,
    deleteLabel: (name: string) => `Delete ${name}`,
    deleteTitle: "Delete user",
    deleteConfirm: (name: string) =>
      `Delete ${name}? They can sign up again, but will start as pending.`,
    empty: {
      title: "No users found",
      hint: "Try a different search or clear the filters.",
    },
  },
  pagination: {
    showing: (from: string, to: string, total: string) =>
      `Showing ${from}–${to} of ${total}`,
    previous: "Previous page",
    next: "Next page",
  },
};

export type UsersContent = typeof en;
