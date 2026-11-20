export const en = {
  metadata: {
    title: "Pricing - TremTec",
  },
  hero: {
    title: "Flexible Engineering. Built for Your Pace.",
    subtitle:
      "We scale our team to match your project, timeline, and budget. No fixed roles. No long-term commitments. Just the right people, the right time.",
  },
  investment: "Investment",
  popular: "MOST POPULAR",
  teamLabel: "Team:",
  plans: [
    {
      id: "fractional-cto",
      icon: "🔍",
      title: "Fractional CTO",
      summary:
        "Uncover where you're actually slow. Get a clear velocity roadmap.",
      price: "$5K–$15K",
      duration: "1–2 weeks",
      features: [
        "SDLC deep dive",
        "Bottleneck identification",
        "Recommended roadmap",
      ],
      team: "1 Senior Engineer (lead) + optional specialists",
      cta: "Schedule a call →",
      popular: false,
    },
    {
      id: "implementation",
      icon: "⚙️",
      title: "Implementation",
      summary:
        "Build reproducible SDLCs with AI. Your team learns sustainable patterns.",
      price: "$25K–$75K",
      duration: "4–8 weeks",
      features: [
        "Dedicated engineering squad",
        "Full SDLC setup + AI integration",
        "Knowledge transfer (your team learns)",
        "Independent after engagement",
      ],
      team: "1 Lead + 1–3 Engineers (scales with scope)",
      cta: "Get a quote →",
      popular: true,
    },
    {
      id: "mentoring",
      icon: "🎓",
      title: "Mentoring",
      summary: "Ongoing coaching for AI mastery and sustainable velocity.",
      price: "$5K–$8K/mo",
      duration: "Month-to-month",
      features: [
        "Monthly strategy sessions",
        "On-demand technical guidance",
        "Pattern refinement & optimization",
      ],
      team: "1 Senior Engineer (flexible hours)",
      cta: "Learn more →",
      popular: false,
    },
  ],
  stats: {
    title: "Why Teams Choose TremTec",
    items: [
      { value: "40%", label: "Average velocity gain in first month" },
      { value: "0", label: "Monthly retainers after engagement" },
      { value: "1 week", label: "Average ramp-up for new hires" },
      { value: "100%", label: "Knowledge ownership by your team" },
    ],
  },
  flexibility: {
    title: "Resources That Flex With You",
    composition: {
      title: "Team Composition",
      intro:
        'We don\'t force a standard "squad." Depending on your project, we might allocate:',
      items: [
        { term: "Full-stack engineers", text: "for end-to-end features" },
        { term: "Architects", text: "for complex system design" },
        { term: "DevOps/Infrastructure", text: "for deployment & scaling" },
        { term: "AI specialists", text: "for LLM integration" },
        { term: "Product coaches", text: "for process design" },
      ],
    },
    engagement: {
      title: "Engagement Models",
      intro: "Choose what fits your constraints:",
      items: [
        {
          term: "Embedded",
          text: "— Squad works in your office/timezone",
        },
        {
          term: "Remote",
          text: "— Async-first, flexible async overlap",
        },
        {
          term: "Hybrid",
          text: "— Key people co-located, rest remote",
        },
        {
          term: "Part-time",
          text: "— We flex hours based on your needs",
        },
        {
          term: "Full-time",
          text: "— Dedicated squad for sprint duration",
        },
      ],
    },
  },
  drivers: {
    title: "What Shapes Your Investment",
    items: [
      {
        title: "Scope",
        question: "What are we building?",
        points: [
          "Single feature vs. full SDLC overhaul",
          "Team size (5 engineers vs. 50)",
          "Technical complexity (legacy code vs. greenfield)",
          "Integration requirements",
        ],
      },
      {
        title: "Timeline",
        question: "How fast do you need results?",
        points: [
          "4-week sprint vs. 12-week program",
          "Intensity (half-time vs. full-time)",
          "Ramp-up and knowledge transfer overlap",
        ],
      },
      {
        title: "Team Composition",
        question: "Who do you need?",
        points: [
          "Senior architect vs. full-stack team",
          "Specialized expertise (DevOps, AI, etc.)",
          "Seniority levels",
        ],
      },
      {
        title: "Support Model",
        question: "What happens after?",
        points: [
          "Standalone engagement vs. + mentoring",
          "Hand-off readiness (docs, training)",
          "Ongoing optimization retainer",
        ],
      },
    ],
  },
  cta: {
    title: "Let's Talk About Your Project",
    description:
      "Every project is different. We'll listen to your constraints, scope, and timeline—then propose a flexible staffing model that actually fits.",
    bookCall: {
      label: "Book a 30-min call",
      href: "mailto:hello@tremtec.com?subject=Inquiry%20about%20services",
    },
    caseStudies: "See case studies",
    emailPrefix: "Or email",
    email: "hello@tremtec.com",
    emailSuffix: "with your project details.",
  },
  faq: {
    title: "Frequently Asked",
    items: [
      {
        question: "Is this replacing our team?",
        answer:
          "No. We teach your team to master modern practices. The goal is independence—after our engagement, you own the process. We're not a permanent dependency.",
      },
      {
        question: "Can we scale the team up or down mid-project?",
        answer:
          "Yes. We adjust staffing based on actual needs. If you discover scope changes or hit a roadblock, we flex. There's no penalty for rightsizing.",
      },
      {
        question: "What if we need ongoing support?",
        answer:
          "Add our Mentoring tier ($5K–$8K/month). Your lead engineer stays involved for strategy, reviews, and pattern refinement. Very different from a fractional CTO retainer—this is coaching, not substitution.",
      },
      {
        question: "Do you work remote?",
        answer:
          "Yes. Full remote, embedded, hybrid—whatever works for you. We design engagement models around your constraints, not ours.",
      },
      {
        question: "What's included in knowledge transfer?",
        answer:
          "Documentation of patterns, code walkthroughs, team training sessions, and overlap time with your engineers. You'll have ownership + understanding by the end, not just handed-off code.",
      },
      {
        question: "How is this different from hiring a Fractional CTO?",
        answer:
          "Fractional CTOs ($5K–$10K/month) lead your tech indefinitely. You stay dependent. TremTec Implementation ($25K–$75K upfront, 4–8 weeks) teaches your team sustainable practices, then you operate independently. If you want ongoing support, add Mentoring—but your team is steering, not us.",
      },
    ],
  },
};

export type ServicesContent = typeof en;
