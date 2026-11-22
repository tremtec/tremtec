export const routes = {
  private: {
    dashboard: "/dashboard",
    users: "/dashboard/users",
  },
  public: {
    home: "/",
    login: "/login",
    logout: "/api/auth/logout",
  },
} as const;
