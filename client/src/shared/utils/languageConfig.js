import {
  Braces,
  FileCode2,
  FileJson,
  Coffee,
  Binary,
  Rocket,
  Cog,
  Globe,
  Paintbrush,
} from "lucide-react";

export const languageConfig = {
  javascript: {
    short: "JS",
    icon: FileJson,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },

  typescript: {
    short: "TS",
    icon: FileCode2,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },

  python: {
    short: "PY",
    icon: Braces,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },

  java: {
    short: "JV",
    icon: Coffee,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },

  cpp: {
    short: "C++",
    icon: Binary,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },

  go: {
    short: "GO",
    icon: Rocket,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
  },

  rust: {
    short: "RS",
    icon: Cog,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },

  html: {
    short: "HTML",
    icon: Globe,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },

  css: {
    short: "CSS",
    icon: Paintbrush,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
};