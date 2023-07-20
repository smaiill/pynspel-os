/* eslint-disable */
export type Token = "colors.primary" | "colors.danger" | "colors.success" | "colors.warn" | "colors.special" | "colors.inactive" | "colors.fonts.primary" | "colors.fonts.secondary" | "colors.fonts.special" | "colors.fonts.specialHover" | "gradients.decoration" | "breakpoints.sm" | "breakpoints.md" | "breakpoints.lg" | "breakpoints.xl" | "breakpoints.2xl" | "sizes.breakpoint-sm" | "sizes.breakpoint-md" | "sizes.breakpoint-lg" | "sizes.breakpoint-xl" | "sizes.breakpoint-2xl" | "colors.colorPalette.primary" | "colors.colorPalette.secondary" | "colors.colorPalette.special" | "colors.colorPalette.specialHover"

export type ColorPalette = "fonts"

export type ColorToken = "primary" | "danger" | "success" | "warn" | "special" | "inactive" | "fonts.primary" | "fonts.secondary" | "fonts.special" | "fonts.specialHover" | "colorPalette.primary" | "colorPalette.secondary" | "colorPalette.special" | "colorPalette.specialHover"

export type GradientToken = "decoration"

export type BreakpointToken = "sm" | "md" | "lg" | "xl" | "2xl"

export type SizeToken = "breakpoint-sm" | "breakpoint-md" | "breakpoint-lg" | "breakpoint-xl" | "breakpoint-2xl"

export type Tokens = {
		colors: ColorToken
		gradients: GradientToken
		breakpoints: BreakpointToken
		sizes: SizeToken
} & { [token: string]: never }

export type TokenCategory = "zIndex" | "opacity" | "colors" | "fonts" | "fontSizes" | "fontWeights" | "lineHeights" | "letterSpacings" | "sizes" | "shadows" | "spacing" | "radii" | "borders" | "durations" | "easings" | "animations" | "blurs" | "gradients" | "breakpoints" | "assets"