const tokens = {
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
    "value": "#00A86B",
    "variable": "var(--colors-special)"
  },
  "colors.inactive": {
    "value": "#1f1f1f",
    "variable": "var(--colors-inactive)"
  },
  "colors.hover.special": {
    "value": "#007E50",
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
  "colors.fonts.special": {
    "value": "#b35454",
    "variable": "var(--colors-fonts-special)"
  },
  "colors.fonts.specialHover": {
    "value": "#bd3838",
    "variable": "var(--colors-fonts-special-hover)"
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
  "colors.colorPalette.specialHover": {
    "value": "var(--colors-color-palette-special-hover)",
    "variable": "var(--colors-color-palette-special-hover)"
  }
}

export function token(path, fallback) {
  return tokens[path]?.value || fallback
}

function tokenVar(path, fallback) {
  return tokens[path]?.variable || fallback
}

token.var = tokenVar