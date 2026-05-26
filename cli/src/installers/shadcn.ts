import path from "path";
import fs from "fs-extra";

import { PKG_ROOT } from "~/consts.js";
import { type Installer } from "~/installers/index.js";
import { addPackageDependency } from "~/utils/addPackageDependency.js";

export const shadcnInstaller: Installer = ({
  projectDir,
}) => {
  addPackageDependency({
    projectDir,
    dependencies: [
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
      "lucide-react",
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-aspect-ratio",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-label",
      "@radix-ui/react-menubar",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group",
      "@radix-ui/react-tooltip",
      "sonner",
    ],
    devMode: false,
  });

  const extrasDir = path.join(PKG_ROOT, "template/extras");

  // Copy utils
  const utilsSrc = path.join(extrasDir, "src/lib/utils.ts");
  const utilsDest = path.join(projectDir, "src/lib/utils.ts");
  fs.copySync(utilsSrc, utilsDest);

  // Copy components.json
  const componentJsonSrc = path.join(extrasDir, "components.json");
  const componentJsonDest = path.join(projectDir, "components.json");
  fs.copySync(componentJsonSrc, componentJsonDest);

  // Copy all UI components
  const uiSrc = path.join(extrasDir, "src/components/ui");
  const uiDest = path.join(projectDir, "src/components/ui");

  if (fs.existsSync(uiSrc)) {
    fs.copySync(uiSrc, uiDest);
  }
};
