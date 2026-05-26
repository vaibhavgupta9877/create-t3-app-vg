import fs from "fs-extra";
import path from "path";

export interface ThemeVars {
  light: Record<string, string>;
  dark: Record<string, string>;
}

// Default zinc theme (fallback if fetch fails)
const DEFAULT_ZINC_THEME: ThemeVars = {
  light: {
    "--background": "0 0% 100%",
    "--foreground": "240 10% 3.9%",
    "--card": "0 0% 100%",
    "--card-foreground": "240 10% 3.9%",
    "--popover": "0 0% 100%",
    "--popover-foreground": "240 10% 3.9%",
    "--primary": "240 5.9% 10%",
    "--primary-foreground": "0 0% 98%",
    "--secondary": "240 4.8% 95.9%",
    "--secondary-foreground": "240 5.9% 10%",
    "--muted": "240 4.8% 95.9%",
    "--muted-foreground": "240 3.8% 46.1%",
    "--accent": "240 4.8% 95.9%",
    "--accent-foreground": "240 5.9% 10%",
    "--destructive": "0 84.2% 60.2%",
    "--destructive-foreground": "0 0% 98%",
    "--border": "240 5.9% 90%",
    "--input": "240 5.9% 90%",
    "--ring": "240 5.9% 10%",
  },
  dark: {
    "--background": "240 10% 3.9%",
    "--foreground": "0 0% 98%",
    "--card": "240 10% 3.9%",
    "--card-foreground": "0 0% 98%",
    "--popover": "240 10% 3.9%",
    "--popover-foreground": "0 0% 98%",
    "--primary": "0 0% 98%",
    "--primary-foreground": "240 5.9% 10%",
    "--secondary": "240 3.7% 15.9%",
    "--secondary-foreground": "0 0% 98%",
    "--muted": "240 3.7% 15.9%",
    "--muted-foreground": "240 5% 64.9%",
    "--accent": "240 3.7% 15.9%",
    "--accent-foreground": "0 0% 98%",
    "--destructive": "0 62.8% 30.6%",
    "--destructive-foreground": "0 0% 98%",
    "--border": "240 3.7% 15.9%",
    "--input": "240 3.7% 15.9%",
    "--ring": "240 4.9% 83.9%",
  },
};

async function fetchTweakcnTheme(slug: string): Promise<ThemeVars> {
  try {
    const response = await fetch(`https://tweakcn.com/r/themes/${slug}.json`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return data as ThemeVars;
  } catch {
    // Fallback to default zinc if fetch fails
    return DEFAULT_ZINC_THEME;
  }
}

function generateCssVariableBlock(
  vars: Record<string, string>,
  selector: string
): string {
  const lines = Object.entries(vars)
    .map(([key, value]) => `    ${key}: ${value};`)
    .join("\n");

  return `  ${selector} {\n${lines}\n  }`;
}

export async function applyTheme(
  projectDir: string,
  themeSlug: string
): Promise<void> {
  const globalsPath = path.join(projectDir, "src/styles/globals.css");

  if (!fs.existsSync(globalsPath)) {
    return;
  }

  const themeVars = await fetchTweakcnTheme(themeSlug);
  let cssContent = fs.readFileSync(globalsPath, "utf-8");

  // Replace :root variables
  const rootBlock = generateCssVariableBlock(themeVars.light, ":root");
  const darkBlock = generateCssVariableBlock(themeVars.dark, ".dark");

  // Find and replace the CSS variable blocks
  const rootRegex = /  :root \{[\s\S]*?  \}/;
  const darkRegex = /  \.dark \{[\s\S]*?  \}/;

  cssContent = cssContent.replace(rootRegex, rootBlock);
  cssContent = cssContent.replace(darkRegex, darkBlock);

  fs.writeFileSync(globalsPath, cssContent);
}
