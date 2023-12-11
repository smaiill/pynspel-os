const tokens = {
  "fontSizes.xs": {
    "value": ".75rem",
    "variable": "var(--font-sizes-xs)"
  },
  "fontSizes.sm": {
    "value": ".875rem",
    "variable": "var(--font-sizes-sm)"
  },
  "fontSizes.base": {
    "value": "1rem",
    "variable": "var(--font-sizes-base)"
  },
  "fontSizes.lg": {
    "value": "1.125rem",
    "variable": "var(--font-sizes-lg)"
  },
  "fontSizes.xl": {
    "value": "1.25rem",
    "variable": "var(--font-sizes-xl)"
  },
  "fontSizes.2xl": {
    "value": "1.5rem",
    "variable": "var(--font-sizes-2xl)"
  },
  "fontSizes.3xl": {
    "value": "1.875rem",
    "variable": "var(--font-sizes-3xl)"
  },
  "fontSizes.4xl": {
    "value": "2.25rem",
    "variable": "var(--font-sizes-4xl)"
  },
  "fontSizes.5xl": {
    "value": "3rem",
    "variable": "var(--font-sizes-5xl)"
  },
  "fontSizes.6xl": {
    "value": "4rem",
    "variable": "var(--font-sizes-6xl)"
  },
  "colors.current": {
    "value": "currentColor",
    "variable": "var(--colors-current)"
  },
  "colors.dark": {
    "value": "#111",
    "variable": "var(--colors-dark)"
  },
  "colors.black": {
    "value": "#000",
    "variable": "var(--colors-black)"
  },
  "colors.white": {
    "value": "#CFD0C8",
    "variable": "var(--colors-white)"
  },
  "colors.gray.50": {
    "value": "#f9fafb",
    "variable": "var(--colors-gray-50)"
  },
  "colors.gray.100": {
    "value": "#f3f4f6",
    "variable": "var(--colors-gray-100)"
  },
  "colors.gray.200": {
    "value": "#e5e7eb",
    "variable": "var(--colors-gray-200)"
  },
  "colors.gray.300": {
    "value": "#d1d5db",
    "variable": "var(--colors-gray-300)"
  },
  "colors.gray.400": {
    "value": "#9ca3af",
    "variable": "var(--colors-gray-400)"
  },
  "colors.gray.500": {
    "value": "#6b7280",
    "variable": "var(--colors-gray-500)"
  },
  "colors.gray.600": {
    "value": "#4b5563",
    "variable": "var(--colors-gray-600)"
  },
  "colors.gray.700": {
    "value": "#374151",
    "variable": "var(--colors-gray-700)"
  },
  "colors.gray.800": {
    "value": "#1f2937",
    "variable": "var(--colors-gray-800)"
  },
  "colors.gray.900": {
    "value": "#111827",
    "variable": "var(--colors-gray-900)"
  },
  "colors.gray.950": {
    "value": "#030712",
    "variable": "var(--colors-gray-950)"
  },
  "colors.neutral.50": {
    "value": "#fafafa",
    "variable": "var(--colors-neutral-50)"
  },
  "colors.neutral.100": {
    "value": "#f5f5f5",
    "variable": "var(--colors-neutral-100)"
  },
  "colors.neutral.200": {
    "value": "#e5e5e5",
    "variable": "var(--colors-neutral-200)"
  },
  "colors.neutral.300": {
    "value": "#d4d4d4",
    "variable": "var(--colors-neutral-300)"
  },
  "colors.neutral.400": {
    "value": "#a3a3a3",
    "variable": "var(--colors-neutral-400)"
  },
  "colors.neutral.500": {
    "value": "#737373",
    "variable": "var(--colors-neutral-500)"
  },
  "colors.neutral.600": {
    "value": "#525252",
    "variable": "var(--colors-neutral-600)"
  },
  "colors.neutral.700": {
    "value": "#404040",
    "variable": "var(--colors-neutral-700)"
  },
  "colors.neutral.800": {
    "value": "#262626",
    "variable": "var(--colors-neutral-800)"
  },
  "colors.neutral.900": {
    "value": "#171717",
    "variable": "var(--colors-neutral-900)"
  },
  "colors.neutral.950": {
    "value": "#0a0a0a",
    "variable": "var(--colors-neutral-950)"
  },
  "colors.red.50": {
    "value": "#fef2f2",
    "variable": "var(--colors-red-50)"
  },
  "colors.red.100": {
    "value": "#fee2e2",
    "variable": "var(--colors-red-100)"
  },
  "colors.red.200": {
    "value": "#fecaca",
    "variable": "var(--colors-red-200)"
  },
  "colors.red.300": {
    "value": "#fca5a5",
    "variable": "var(--colors-red-300)"
  },
  "colors.red.400": {
    "value": "#f87171",
    "variable": "var(--colors-red-400)"
  },
  "colors.red.500": {
    "value": "#ef4444",
    "variable": "var(--colors-red-500)"
  },
  "colors.red.600": {
    "value": "#dc2626",
    "variable": "var(--colors-red-600)"
  },
  "colors.red.700": {
    "value": "#b91c1c",
    "variable": "var(--colors-red-700)"
  },
  "colors.red.800": {
    "value": "#991b1b",
    "variable": "var(--colors-red-800)"
  },
  "colors.red.900": {
    "value": "#7f1d1d",
    "variable": "var(--colors-red-900)"
  },
  "colors.red.950": {
    "value": "#450a0a",
    "variable": "var(--colors-red-950)"
  },
  "colors.orange.50": {
    "value": "#fff7ed",
    "variable": "var(--colors-orange-50)"
  },
  "colors.orange.100": {
    "value": "#ffedd5",
    "variable": "var(--colors-orange-100)"
  },
  "colors.orange.200": {
    "value": "#fed7aa",
    "variable": "var(--colors-orange-200)"
  },
  "colors.orange.300": {
    "value": "#fdba74",
    "variable": "var(--colors-orange-300)"
  },
  "colors.orange.400": {
    "value": "#fb923c",
    "variable": "var(--colors-orange-400)"
  },
  "colors.orange.500": {
    "value": "#f97316",
    "variable": "var(--colors-orange-500)"
  },
  "colors.orange.600": {
    "value": "#ea580c",
    "variable": "var(--colors-orange-600)"
  },
  "colors.orange.700": {
    "value": "#c2410c",
    "variable": "var(--colors-orange-700)"
  },
  "colors.orange.800": {
    "value": "#9a3412",
    "variable": "var(--colors-orange-800)"
  },
  "colors.orange.900": {
    "value": "#7c2d12",
    "variable": "var(--colors-orange-900)"
  },
  "colors.orange.950": {
    "value": "#431407",
    "variable": "var(--colors-orange-950)"
  },
  "colors.yellow.50": {
    "value": "#fefce8",
    "variable": "var(--colors-yellow-50)"
  },
  "colors.yellow.100": {
    "value": "#fef9c3",
    "variable": "var(--colors-yellow-100)"
  },
  "colors.yellow.200": {
    "value": "#fef08a",
    "variable": "var(--colors-yellow-200)"
  },
  "colors.yellow.300": {
    "value": "#fde047",
    "variable": "var(--colors-yellow-300)"
  },
  "colors.yellow.400": {
    "value": "#facc15",
    "variable": "var(--colors-yellow-400)"
  },
  "colors.yellow.500": {
    "value": "#eab308",
    "variable": "var(--colors-yellow-500)"
  },
  "colors.yellow.600": {
    "value": "#ca8a04",
    "variable": "var(--colors-yellow-600)"
  },
  "colors.yellow.700": {
    "value": "#a16207",
    "variable": "var(--colors-yellow-700)"
  },
  "colors.yellow.800": {
    "value": "#854d0e",
    "variable": "var(--colors-yellow-800)"
  },
  "colors.yellow.900": {
    "value": "#713f12",
    "variable": "var(--colors-yellow-900)"
  },
  "colors.yellow.950": {
    "value": "#422006",
    "variable": "var(--colors-yellow-950)"
  },
  "colors.blue.50": {
    "value": "#eff6ff",
    "variable": "var(--colors-blue-50)"
  },
  "colors.blue.100": {
    "value": "#dbeafe",
    "variable": "var(--colors-blue-100)"
  },
  "colors.blue.200": {
    "value": "#bfdbfe",
    "variable": "var(--colors-blue-200)"
  },
  "colors.blue.300": {
    "value": "#93c5fd",
    "variable": "var(--colors-blue-300)"
  },
  "colors.blue.400": {
    "value": "#60a5fa",
    "variable": "var(--colors-blue-400)"
  },
  "colors.blue.500": {
    "value": "#3b82f6",
    "variable": "var(--colors-blue-500)"
  },
  "colors.blue.600": {
    "value": "#2563eb",
    "variable": "var(--colors-blue-600)"
  },
  "colors.blue.700": {
    "value": "#1d4ed8",
    "variable": "var(--colors-blue-700)"
  },
  "colors.blue.800": {
    "value": "#1e40af",
    "variable": "var(--colors-blue-800)"
  },
  "colors.blue.900": {
    "value": "#1e3a8a",
    "variable": "var(--colors-blue-900)"
  },
  "colors.blue.950": {
    "value": "#172554",
    "variable": "var(--colors-blue-950)"
  },
  "colors.blackAlpha.50": {
    "value": "rgba(0, 0, 0, 0.04)",
    "variable": "var(--colors-black-alpha-50)"
  },
  "colors.blackAlpha.100": {
    "value": "rgba(0, 0, 0, 0.06)",
    "variable": "var(--colors-black-alpha-100)"
  },
  "colors.blackAlpha.200": {
    "value": "rgba(0, 0, 0, 0.08)",
    "variable": "var(--colors-black-alpha-200)"
  },
  "colors.blackAlpha.300": {
    "value": "rgba(0, 0, 0, 0.16)",
    "variable": "var(--colors-black-alpha-300)"
  },
  "colors.blackAlpha.400": {
    "value": "rgba(0, 0, 0, 0.24)",
    "variable": "var(--colors-black-alpha-400)"
  },
  "colors.blackAlpha.500": {
    "value": "rgba(0, 0, 0, 0.36)",
    "variable": "var(--colors-black-alpha-500)"
  },
  "colors.blackAlpha.600": {
    "value": "rgba(0, 0, 0, 0.48)",
    "variable": "var(--colors-black-alpha-600)"
  },
  "colors.blackAlpha.700": {
    "value": "rgba(0, 0, 0, 0.64)",
    "variable": "var(--colors-black-alpha-700)"
  },
  "colors.blackAlpha.800": {
    "value": "rgba(0, 0, 0, 0.80)",
    "variable": "var(--colors-black-alpha-800)"
  },
  "colors.blackAlpha.900": {
    "value": "rgba(0, 0, 0, 0.92)",
    "variable": "var(--colors-black-alpha-900)"
  },
  "colors.whiteAlpha.50": {
    "value": "rgba(255, 255, 255, 0.04)",
    "variable": "var(--colors-white-alpha-50)"
  },
  "colors.whiteAlpha.100": {
    "value": "rgba(255, 255, 255, 0.06)",
    "variable": "var(--colors-white-alpha-100)"
  },
  "colors.whiteAlpha.200": {
    "value": "rgba(255, 255, 255, 0.08)",
    "variable": "var(--colors-white-alpha-200)"
  },
  "colors.whiteAlpha.300": {
    "value": "rgba(255, 255, 255, 0.16)",
    "variable": "var(--colors-white-alpha-300)"
  },
  "colors.whiteAlpha.400": {
    "value": "rgba(255, 255, 255, 0.24)",
    "variable": "var(--colors-white-alpha-400)"
  },
  "colors.whiteAlpha.500": {
    "value": "rgba(255, 255, 255, 0.36)",
    "variable": "var(--colors-white-alpha-500)"
  },
  "colors.whiteAlpha.600": {
    "value": "rgba(255, 255, 255, 0.48)",
    "variable": "var(--colors-white-alpha-600)"
  },
  "colors.whiteAlpha.700": {
    "value": "rgba(255, 255, 255, 0.64)",
    "variable": "var(--colors-white-alpha-700)"
  },
  "colors.whiteAlpha.800": {
    "value": "rgba(255, 255, 255, 0.80)",
    "variable": "var(--colors-white-alpha-800)"
  },
  "colors.whiteAlpha.900": {
    "value": "rgba(255, 255, 255, 0.92)",
    "variable": "var(--colors-white-alpha-900)"
  },
  "colors.primary": {
    "value": "#3498db",
    "variable": "var(--colors-primary)"
  },
  "colors.danger": {
    "value": "#dd3d59",
    "variable": "var(--colors-danger)"
  },
  "colors.success": {
    "value": "#3d8b2e",
    "variable": "var(--colors-success)"
  },
  "colors.warn": {
    "value": "#e5871a",
    "variable": "var(--colors-warn)"
  },
  "colors.special": {
    "value": "#f7931e",
    "variable": "var(--colors-special)"
  },
  "colors.specialBg": {
    "value": "#5D5FEF30",
    "variable": "var(--colors-special-bg)"
  },
  "colors.inactive": {
    "value": "#1f1f1f",
    "variable": "var(--colors-inactive)"
  },
  "colors.hover.special": {
    "value": "#4849B9",
    "variable": "var(--colors-hover-special)"
  },
  "colors.fonts.primary": {
    "value": "#ffffff",
    "variable": "var(--colors-fonts-primary)"
  },
  "colors.fonts.secondary": {
    "value": "#8b8787",
    "variable": "var(--colors-fonts-secondary)"
  },
  "colors.fonts.danger": {
    "value": "#b35454",
    "variable": "var(--colors-fonts-danger)"
  },
  "colors.fonts.dangerHover": {
    "value": "#bd3838",
    "variable": "var(--colors-fonts-danger-hover)"
  },
  "colors.fonts.special": {
    "value": "#f7931e",
    "variable": "var(--colors-fonts-special)"
  },
  "colors.fonts.warn": {
    "value": "#e5871a",
    "variable": "var(--colors-fonts-warn)"
  },
  "colors.news.special": {
    "value": "#f7931e",
    "variable": "var(--colors-news-special)"
  },
  "colors.news.fonts.label": {
    "value": "#606260",
    "variable": "var(--colors-news-fonts-label)"
  },
  "colors.news.fonts.primary": {
    "value": "#CFD0C8",
    "variable": "var(--colors-news-fonts-primary)"
  },
  "colors.news.fonts.reverse.primary": {
    "value": "black",
    "variable": "var(--colors-news-fonts-reverse\\.primary)"
  },
  "colors.news.borders.grey": {
    "value": "#262626",
    "variable": "var(--colors-news-borders-grey)"
  },
  "colors.news.backgrounds.primary": {
    "value": "#141414",
    "variable": "var(--colors-news-backgrounds-primary)"
  },
  "colors.news.backgrounds.secondary": {
    "value": "#1A1A1A",
    "variable": "var(--colors-news-backgrounds-secondary)"
  },
  "colors.news.backgrounds.tertiary": {
    "value": "#222222",
    "variable": "var(--colors-news-backgrounds-tertiary)"
  },
  "borders.specialDashed": {
    "value": "1px dashed #f7931e",
    "variable": "var(--borders-special-dashed)"
  },
  "borders.news.grey": {
    "value": "1px solid #262626",
    "variable": "var(--borders-news-grey)"
  },
  "gradients.decoration": {
    "value": "linear-gradient(39deg, rgba(0,0,0,1) 0%, rgba(62,62,61,1) 100%)",
    "variable": "var(--gradients-decoration)"
  },
  "breakpoints.sm": {
    "value": "640px",
    "variable": "var(--breakpoints-sm)"
  },
  "breakpoints.md": {
    "value": "768px",
    "variable": "var(--breakpoints-md)"
  },
  "breakpoints.lg": {
    "value": "1024px",
    "variable": "var(--breakpoints-lg)"
  },
  "breakpoints.xl": {
    "value": "1280px",
    "variable": "var(--breakpoints-xl)"
  },
  "breakpoints.2xl": {
    "value": "1536px",
    "variable": "var(--breakpoints-2xl)"
  },
  "sizes.breakpoint-sm": {
    "value": "640px",
    "variable": "var(--sizes-breakpoint-sm)"
  },
  "sizes.breakpoint-md": {
    "value": "768px",
    "variable": "var(--sizes-breakpoint-md)"
  },
  "sizes.breakpoint-lg": {
    "value": "1024px",
    "variable": "var(--sizes-breakpoint-lg)"
  },
  "sizes.breakpoint-xl": {
    "value": "1280px",
    "variable": "var(--sizes-breakpoint-xl)"
  },
  "sizes.breakpoint-2xl": {
    "value": "1536px",
    "variable": "var(--sizes-breakpoint-2xl)"
  },
  "colors.colorPalette.50": {
    "value": "var(--colors-color-palette-50)",
    "variable": "var(--colors-color-palette-50)"
  },
  "colors.colorPalette.100": {
    "value": "var(--colors-color-palette-100)",
    "variable": "var(--colors-color-palette-100)"
  },
  "colors.colorPalette.200": {
    "value": "var(--colors-color-palette-200)",
    "variable": "var(--colors-color-palette-200)"
  },
  "colors.colorPalette.300": {
    "value": "var(--colors-color-palette-300)",
    "variable": "var(--colors-color-palette-300)"
  },
  "colors.colorPalette.400": {
    "value": "var(--colors-color-palette-400)",
    "variable": "var(--colors-color-palette-400)"
  },
  "colors.colorPalette.500": {
    "value": "var(--colors-color-palette-500)",
    "variable": "var(--colors-color-palette-500)"
  },
  "colors.colorPalette.600": {
    "value": "var(--colors-color-palette-600)",
    "variable": "var(--colors-color-palette-600)"
  },
  "colors.colorPalette.700": {
    "value": "var(--colors-color-palette-700)",
    "variable": "var(--colors-color-palette-700)"
  },
  "colors.colorPalette.800": {
    "value": "var(--colors-color-palette-800)",
    "variable": "var(--colors-color-palette-800)"
  },
  "colors.colorPalette.900": {
    "value": "var(--colors-color-palette-900)",
    "variable": "var(--colors-color-palette-900)"
  },
  "colors.colorPalette.950": {
    "value": "var(--colors-color-palette-950)",
    "variable": "var(--colors-color-palette-950)"
  },
  "colors.colorPalette.special": {
    "value": "var(--colors-color-palette-special)",
    "variable": "var(--colors-color-palette-special)"
  },
  "colors.colorPalette.primary": {
    "value": "var(--colors-color-palette-primary)",
    "variable": "var(--colors-color-palette-primary)"
  },
  "colors.colorPalette.secondary": {
    "value": "var(--colors-color-palette-secondary)",
    "variable": "var(--colors-color-palette-secondary)"
  },
  "colors.colorPalette.danger": {
    "value": "var(--colors-color-palette-danger)",
    "variable": "var(--colors-color-palette-danger)"
  },
  "colors.colorPalette.dangerHover": {
    "value": "var(--colors-color-palette-danger-hover)",
    "variable": "var(--colors-color-palette-danger-hover)"
  },
  "colors.colorPalette.warn": {
    "value": "var(--colors-color-palette-warn)",
    "variable": "var(--colors-color-palette-warn)"
  },
  "colors.colorPalette.label": {
    "value": "var(--colors-color-palette-label)",
    "variable": "var(--colors-color-palette-label)"
  },
  "colors.colorPalette.reverse.primary": {
    "value": "var(--colors-color-palette-reverse-primary)",
    "variable": "var(--colors-color-palette-reverse\\.primary)"
  },
  "colors.colorPalette.grey": {
    "value": "var(--colors-color-palette-grey)",
    "variable": "var(--colors-color-palette-grey)"
  },
  "colors.colorPalette.tertiary": {
    "value": "var(--colors-color-palette-tertiary)",
    "variable": "var(--colors-color-palette-tertiary)"
  }
}

export function token(path, fallback) {
  return tokens[path]?.value || fallback
}

function tokenVar(path, fallback) {
  return tokens[path]?.variable || fallback
}

token.var = tokenVar