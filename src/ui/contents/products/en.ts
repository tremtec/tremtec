import type { ProductCategory } from "~/content.config";

export const en = {
  metadata: {
    title: "Products - TremTec",
    description:
      "Open-source CLI tools for DevOps, Security, and System Automation.",
  },
  hero: {
    eyebrow: "Open-Source Tools",
    title: "CLI Tools That Ship With You",
    subtitle:
      "Battle-tested command-line tools for DevOps, security scanning, system automation, and AI-powered workflows. Built in Go. Open source.",
  },
  categories: {
    "ai-agents": "AI Agents",
    "security-compliance": "Security & Compliance",
    devops: "DevOps",
    observability: "Observability",
    "system-automation": "System Automation",
  } satisfies Record<ProductCategory, string>,
  viewOnGithub: "View on GitHub →",
  cta: {
    title: "Need a Custom Tool?",
    subtitle:
      "We build bespoke CLI tools and automation pipelines tailored to your stack. Let's talk about what you need.",
    button: "Get in touch",
    href: "mailto:hello@tremtec.com?subject=Custom%20Tool%20Inquiry",
  },
};

export type ProductsContent = typeof en;
