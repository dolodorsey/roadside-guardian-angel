import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'inter': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				'guardian': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				'tech': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
			},
			colors: {
				// Core semantic tokens
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				
				// Roadside Brand Colors
				'midnight-black': 'hsl(var(--midnight-black))',
				'asphalt-gray': 'hsl(var(--asphalt-gray))',
				'emergency-red': 'hsl(var(--emergency-red))',
				'beacon-blue': 'hsl(var(--beacon-blue))',
				'pulse-green': 'hsl(var(--pulse-green))',
				'metallic-silver': 'hsl(var(--metallic-silver))',
				
				// Brand semantic tokens
				'guardian-glow': 'hsl(var(--guardian-glow))',
				'beacon-pulse': 'hsl(var(--beacon-pulse))',
				'tech-accent': 'hsl(var(--tech-accent))',
				'luxury-surface': 'hsl(var(--luxury-surface))',
			},
			backgroundImage: {
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-emergency': 'var(--gradient-emergency)',
				'gradient-beacon': 'var(--gradient-beacon)',
				'gradient-luxury': 'var(--gradient-luxury)',
				'gradient-pulse': 'var(--gradient-pulse)',
			},
			boxShadow: {
				'guardian': 'var(--shadow-guardian)',
				'emergency': 'var(--shadow-emergency)',
				'beacon': 'var(--shadow-beacon)',
				'luxury': 'var(--shadow-luxury)',
				'tech': 'var(--shadow-tech)',
			},
			transitionTimingFunction: {
				'guardian': 'cubic-bezier(0.4, 0, 0.2, 1)',
				'emergency': 'cubic-bezier(0.4, 0, 0.2, 1)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
