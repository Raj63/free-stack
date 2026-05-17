"use client";

import { useMemo, useState, useCallback } from "react";
import {
  Layers,
  Globe,
  Server,
  Database,
  ShieldCheck,
  Shield,
  BarChart3,
  ScrollText,
  Activity,
  Clock,
  Check,
  Square,
  ExternalLink,
  Copy,
  CheckCheck,
  Sparkles,
  Zap,
  ChevronRight,
  Info,
} from "lucide-react";

interface Platform {
  name: string;
  url: string;
  category: string;
  score: number;
  options: string[];
}

interface StackConfig {
  title: string;
  icon: React.ReactNode;
  description: string;
  platforms: Platform[];
}

const stacks: Record<string, StackConfig> = {
  fullstack: {
    title: "Modern Fullstack Startup",
    icon: <Zap className="w-6 h-6" />,
    description:
      "Battle-tested infrastructure stack for launching SaaS and AI products on free tiers.",
    platforms: [
      {
        name: "Cloudflare Pages",
        url: "https://pages.cloudflare.com/",
        category: "Frontend Hosting",
        score: 96,
        options: [
          "Unlimited bandwidth",
          "Global edge CDN",
          "Workers support",
          "500 builds/month",
          "Custom domains",
        ],
      },
      {
        name: "Railway",
        url: "https://railway.com/",
        category: "Backend Compute",
        score: 91,
        options: [
          "Docker deployments",
          "Background workers",
          "Managed Postgres",
          "Usage-based free credits",
        ],
      },
      {
        name: "Neon",
        url: "https://neon.tech/",
        category: "Serverless Postgres",
        score: 93,
        options: [
          "3GB Postgres",
          "Database branching",
          "Autoscaling",
          "pgvector support",
        ],
      },
      {
        name: "Clerk",
        url: "https://clerk.com/",
        category: "Authentication",
        score: 94,
        options: [
          "10K MAU",
          "Social login",
          "Passkeys",
          "User management",
        ],
      },
      {
        name: "Cloudflare",
        url: "https://cloudflare.com/",
        category: "WAF + Security",
        score: 97,
        options: [
          "DDoS protection",
          "WAF",
          "Bot protection",
          "Global CDN",
        ],
      },
      {
        name: "PostHog",
        url: "https://posthog.com/",
        category: "Analytics + Replay",
        score: 90,
        options: [
          "1M events/month",
          "Session replay",
          "Feature flags",
          "Funnels",
        ],
      },
      {
        name: "Axiom",
        url: "https://axiom.co/",
        category: "Logs + Audit",
        score: 88,
        options: [
          "Structured logs",
          "Audit trails",
          "Searchable events",
          "Developer observability",
        ],
      },
      {
        name: "Sentry",
        url: "https://sentry.io/",
        category: "Tracing + Monitoring",
        score: 92,
        options: [
          "Error monitoring",
          "Performance tracing",
          "Session replay",
          "Alerts",
        ],
      },
      {
        name: "Trigger.dev",
        url: "https://trigger.dev/",
        category: "Background Jobs",
        score: 87,
        options: [
          "Async workflows",
          "Retries",
          "Cron jobs",
          "Long-running tasks",
        ],
      },
      {
        name: "Upstash Redis",
        url: "https://upstash.com/",
        category: "Cache + Rate Limit",
        score: 89,
        options: [
          "10K requests/day",
          "Serverless Redis",
          "Global edge cache",
          "REST APIs",
        ],
      },
    ],
  },
};

const categoryIcon = (category: string): React.ReactNode => {
  const map: Record<string, React.ReactNode> = {
    "Frontend Hosting": <Globe className="w-5 h-5" />,
    "Backend Compute": <Server className="w-5 h-5" />,
    "Serverless Postgres": <Database className="w-5 h-5" />,
    Authentication: <ShieldCheck className="w-5 h-5" />,
    "WAF + Security": <Shield className="w-5 h-5" />,
    "Analytics + Replay": <BarChart3 className="w-5 h-5" />,
    "Logs + Audit": <ScrollText className="w-5 h-5" />,
    "Tracing + Monitoring": <Activity className="w-5 h-5" />,
    "Background Jobs": <Clock className="w-5 h-5" />,
    "Cache + Rate Limit": <Layers className="w-5 h-5" />,
  };
  return map[category] ?? <Zap className="w-5 h-5" />;
};

const scoreColor = (score: number): string => {
  if (score >= 95) return "from-emerald-500 to-teal-400";
  if (score >= 90) return "from-blue-500 to-cyan-400";
  if (score >= 85) return "from-violet-500 to-purple-400";
  return "from-amber-500 to-orange-400";
};

interface BucketedOption {
  platform: string;
  option: string;
  category: string;
  bucket: string;
  bucketOrder: number;
}

const categoryToBucket = (category: string): { bucket: string; order: number } => {
  const map: Record<string, { bucket: string; order: number }> = {
    "Frontend Hosting": { bucket: "Hosting", order: 1 },
    "Backend Compute": { bucket: "Compute", order: 2 },
    "Serverless Postgres": { bucket: "Database", order: 3 },
    "Cache + Rate Limit": { bucket: "Cache & Storage", order: 4 },
    Authentication: { bucket: "Auth & Security", order: 5 },
    "WAF + Security": { bucket: "Security", order: 6 },
    "Background Jobs": { bucket: "Background Jobs", order: 7 },
    "Analytics + Replay": { bucket: "Observability", order: 8 },
    "Logs + Audit": { bucket: "Observability", order: 8 },
    "Tracing + Monitoring": { bucket: "Observability", order: 8 },
  };
  return map[category] ?? { bucket: category, order: 99 };
};

export default function FreeTierStackBuilder() {
  const [selectedStack, setSelectedStack] =
    useState<keyof typeof stacks>("fullstack");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const current = stacks[selectedStack];

  const avgScore = useMemo(() => {
    return Math.round(
      current.platforms.reduce((a, b) => a + b.score, 0) /
        current.platforms.length
    );
  }, [current.platforms]);

  const stackScore = useMemo(() => {
    return Math.min(100, 50 + Math.round(selectedOptions.length * 2.8));
  }, [selectedOptions]);

  const bucketedOptions = useMemo<BucketedOption[]>(() => {
    return selectedOptions
      .map((opt) => {
        const [platformName, ...optionParts] = opt.split(": ");
        const option = optionParts.join(": ");
        const platform = current.platforms.find((p) => p.name === platformName);
        const { bucket, order } = categoryToBucket(platform?.category ?? "");
        return {
          platform: platformName,
          option,
          category: platform?.category ?? "",
          bucket,
          bucketOrder: order,
        };
      })
      .sort((a, b) => {
        if (a.bucketOrder !== b.bucketOrder) return a.bucketOrder - b.bucketOrder;
        if (a.platform !== b.platform) return a.platform.localeCompare(b.platform);
        return a.option.localeCompare(b.option);
      });
  }, [selectedOptions, current.platforms]);

  const consolidatedStack = useMemo(() => {
    if (bucketedOptions.length === 0) {
      return "// Select features above to build your infrastructure prompt";
    }

    const lines: string[] = [
      `# Infrastructure Stack — ${current.title}`,
      "",
      `Stack Score: ${stackScore}%`,
      `Platforms: ${current.platforms.length}`,
      `Selected Features: ${selectedOptions.length}`,
      "",
      "Use this prompt with your AI coding agent (Cursor, Windsurf, Claude, ChatGPT) to scaffold the infrastructure.",
      "",
    ];

    let currentBucket = "";
    for (const item of bucketedOptions) {
      if (item.bucket !== currentBucket) {
        currentBucket = item.bucket;
        lines.push(`## ${currentBucket}`);
        lines.push("");
      }
      lines.push(`- **${item.platform}** [${item.category}]: ${item.option}`);
    }

    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push("> Tip: Ask your AI agent to generate Terraform/Pulumi configs, Docker Compose files, or deployment scripts based on this stack."
    );

    return lines.join("\n");
  }, [bucketedOptions, current.title, current.platforms.length, stackScore, selectedOptions.length]);

  const toggleOption = useCallback((platform: string, option: string) => {
    const value = `${platform}: ${option}`;
    setSelectedOptions((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  }, []);

  const toggleAll = useCallback(
    (platform: Platform) => {
      const allValues = platform.options.map((o) => `${platform.name}: ${o}`);
      const allSelected = allValues.every((v) => selectedOptions.includes(v));

      setSelectedOptions((prev) => {
        if (allSelected) {
          return prev.filter((v) => !allValues.includes(v));
        }
        const next = new Set(prev);
        allValues.forEach((v) => next.add(v));
        return Array.from(next);
      });
    },
    [selectedOptions]
  );

  const copyStack = useCallback(async () => {
    if (selectedOptions.length === 0) return;
    await navigator.clipboard.writeText(consolidatedStack);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [consolidatedStack, selectedOptions.length]);

  const platformSelectedCount = useCallback(
    (platform: Platform) => {
      return platform.options.filter((o) =>
        selectedOptions.includes(`${platform.name}: ${o}`)
      ).length;
    },
    [selectedOptions]
  );

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-50">
      {/* Hero */}
      <header className="relative border-b border-slate-800/60 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-400 tracking-wide uppercase">
              Infrastructure Curator
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-slate-50 via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Free Tier Stack Builder
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl leading-relaxed">
            Curated, production-ready infrastructure stacks for SaaS, AI apps,
            and startups. Explore the best free-tier services for hosting,
            databases, auth, security, analytics, and more — then copy your
            selections into any AI coding agent.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Stack Selector */}
        <section aria-label="Stack selector" className="mb-10">
          <div className="flex flex-wrap gap-3">
            {Object.entries(stacks).map(([key, stack]) => {
              const active = selectedStack === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedStack(key as keyof typeof stacks)}
                  className={`
                    inline-flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm
                    transition-all duration-200 border
                    ${
                      active
                        ? "bg-blue-500/10 border-blue-500/40 text-blue-300 shadow-[0_0_0_1px_rgba(59,130,246,0.15)]"
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                    }
                  `}
                  aria-pressed={active}
                >
                  {stack.icon}
                  {stack.title}
                  {active && (
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Stack Overview */}
        <section className="mb-10">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {current.icon}
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-50">
                    {current.title}
                  </h2>
                </div>
                <p className="text-slate-400 max-w-2xl leading-relaxed">
                  {current.description}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-center px-5 py-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Platforms
                  </div>
                  <div className="text-2xl font-bold text-slate-200">
                    {current.platforms.length}
                  </div>
                </div>
                <div className="text-center px-5 py-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Avg Score
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {avgScore}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Cards */}
        <section
          aria-label="Platform cards"
          className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-12"
        >
          {current.platforms.map((platform) => {
            const selectedCount = platformSelectedCount(platform);
            const allCount = platform.options.length;
            const allSelected = selectedCount === allCount && allCount > 0;

            return (
              <article
                key={platform.name}
                className="group bg-slate-900/40 border border-slate-800 rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/60"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="text-slate-500">
                        {categoryIcon(platform.category)}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {platform.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 truncate">
                      {platform.name}
                    </h3>
                  </div>

                  <div
                    className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${scoreColor(
                      platform.score
                    )} flex items-center justify-center shadow-lg`}
                    aria-label={`Score: ${platform.score} percent`}
                  >
                    <span className="text-white font-black text-lg">
                      {platform.score}
                    </span>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2 mb-5">
                  {platform.options.map((option) => {
                    const value = `${platform.name}: ${option}`;
                    const active = selectedOptions.includes(value);

                    return (
                      <button
                        key={option}
                        onClick={() => toggleOption(platform.name, option)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm
                          transition-all duration-150 border
                          ${
                            active
                              ? "bg-emerald-500/8 border-emerald-500/30 text-emerald-100"
                              : "bg-slate-950/40 border-slate-800/60 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                          }
                        `}
                        role="checkbox"
                        aria-checked={active}
                      >
                        <span className="shrink-0">
                          {active ? (
                            <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-white" />
                            </div>
                          ) : (
                            <Square className="w-5 h-5 text-slate-600" />
                          )}
                        </span>
                        <span className="leading-snug">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    View Pricing
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => toggleAll(platform)}
                    className={`
                      text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors
                      ${
                        allSelected
                          ? "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15"
                          : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                      }
                    `}
                  >
                    {allSelected
                      ? "Deselect All"
                      : selectedCount > 0
                      ? `${selectedCount}/${allCount} Selected`
                      : "Select All"}
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        {/* AI Prompt Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-blue-500/5 rounded-3xl" />

          <div className="relative bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-50">
                    AI Agent Infrastructure Prompt
                  </h2>
                </div>
                <p className="text-slate-400 max-w-2xl leading-relaxed">
                  Select the capabilities you need above, then copy this prompt
                  into Cursor, Windsurf, ChatGPT, Claude, or any AI coding
                  agent to scaffold your infrastructure.
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-center px-5 py-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Selected
                  </div>
                  <div className="text-2xl font-bold text-slate-200">
                    {selectedOptions.length}
                  </div>
                </div>
                <div className="text-center px-5 py-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Stack Score
                  </div>
                  <div className="text-2xl font-bold text-violet-400">
                    {stackScore}%
                  </div>
                </div>
              </div>
            </div>

            {/* Textarea */}
            <div className="relative mb-6">
              <textarea
                value={consolidatedStack}
                readOnly
                className="w-full h-64 sm:h-72 bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm text-slate-300 font-mono leading-relaxed resize-none focus:outline-none focus:border-slate-700"
                aria-label="Generated infrastructure prompt"
              />
              {selectedOptions.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Info className="w-4 h-4" />
                    <span className="text-sm">
                      Select features from the cards above to build your prompt
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={copyStack}
                disabled={selectedOptions.length === 0}
                className={`
                  inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm
                  transition-all duration-200
                  ${
                    selectedOptions.length === 0
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : copied
                      ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
                      : "bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
                  }
                `}
              >
                {copied ? (
                  <>
                    <CheckCheck className="w-4 h-4" />
                    Copied to Clipboard
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Stack for AI Agent
                  </>
                )}
              </button>

              {selectedOptions.length > 0 && !copied && (
                <span className="text-sm text-slate-500">
                  {selectedOptions.length} feature
                  {selectedOptions.length !== 1 ? "s" : ""} selected
                </span>
              )}

              {copied && (
                <span className="text-sm text-emerald-400 animate-pulse">
                  Ready to paste into your AI agent
                </span>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Free Tier Stack Builder</span>
            </div>
            <p>
              Curated for indie hackers and startup founders. No affiliation
              with listed providers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
