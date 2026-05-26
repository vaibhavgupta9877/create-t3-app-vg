export const topThemes = [
  { value: "default-zinc", label: "Default Zinc" },
  { value: "catppuccin", label: "Catppuccin" },
  { value: "claude", label: "Claude" },
  { value: "vercel", label: "Vercel" },
  { value: "cyberpunk", label: "Cyberpunk" },
  { value: "default-rose", label: "Default Rose" },
] as const;

export const allThemes = [
  ...topThemes,
  { value: "default-blue", label: "Default Blue" },
  { value: "default-gray", label: "Default Gray" },
  { value: "default-green", label: "Default Green" },
  { value: "default-neutral", label: "Default Neutral" },
  { value: "default-orange", label: "Default Orange" },
  { value: "default-red", label: "Default Red" },
  { value: "default-slate", label: "Default Slate" },
  { value: "default-stone", label: "Default Stone" },
  { value: "default-violet", label: "Default Violet" },
  { value: "default-yellow", label: "Default Yellow" },
  { value: "twitter", label: "Twitter" },
  { value: "basecamp", label: "Basecamp" },
  { value: "galactic-glitch", label: "Galactic Glitch" },
  { value: "brutalist-concrete", label: "Brutalist Concrete" },
  { value: "google-modern", label: "Google Modern" },
  { value: "glassmorphism", label: "Glassmorphism" },
  { value: "openai-tts", label: "OpenAI TTS" },
] as const;

export type ThemeSlug = (typeof allThemes)[number]["value"];
