/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1280px',
			},
		},
		extend: {
			colors: {
				// Glassmorphism design tokens
				primary: {
					50: '#EEF2FF',
					100: '#DDE4FF',
					500: '#6B7FE8',
					600: '#5566D5',
					900: '#2D3A8C',
					DEFAULT: '#6B7FE8',
				},
				text: {
					primary: '#1D1D1F',
					secondary: '#6B7280',
					'on-primary': '#FFFFFF',
				},
				semantic: {
					success: '#10B981',
					warning: '#F59E0B',
					error: '#EF4444',
					info: '#3B82F6',
				},
				persona: {
					counselor: '#6B7FE8',
					therapist: '#5EEAD4',
					coach: '#F59E87',
					career: '#FBBF24',
					spiritual: '#C084FC',
				},
			},
			fontFamily: {
				sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
			},
			fontSize: {
				hero: ['64px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
				title: ['48px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
				subtitle: ['32px', { lineHeight: '1.3', letterSpacing: '0' }],
				'body-large': ['20px', { lineHeight: '1.6', letterSpacing: '0' }],
				body: ['16px', { lineHeight: '1.6', letterSpacing: '0' }],
				small: ['14px', { lineHeight: '1.5', letterSpacing: '0' }],
				caption: ['12px', { lineHeight: '1.4', letterSpacing: '0.01em' }],
			},
			spacing: {
				xs: '8px',
				sm: '16px',
				md: '24px',
				lg: '32px',
				xl: '48px',
				'2xl': '64px',
				'3xl': '96px',
			},
			borderRadius: {
				sm: '12px',
				md: '16px',
				lg: '24px',
				xl: '32px',
				full: '9999px',
			},
			boxShadow: {
				'glass-card': '0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
				'glass-float': '0 12px 40px rgba(0, 0, 0, 0.12), 0 6px 20px rgba(0, 0, 0, 0.06)',
				button: '0 4px 12px rgba(107, 127, 232, 0.25)',
			},
			backdropBlur: {
				glass: '20px',
				'glass-emphasized': '30px',
				'glass-subtle': '15px',
			},
			animation: {
				'fade-in': 'fadeIn 0.3s ease-out',
				'slide-up': 'slideUp 0.3s ease-out',
				'scale-in': 'scaleIn 0.3s ease-out',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				scaleIn: {
					'0%': { transform: 'scale(0.9)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
