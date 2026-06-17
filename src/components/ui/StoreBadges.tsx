function GooglePlayIcon({ className = 'w-11 h-11' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.66,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5Z"
      />
      <path
        fill="#34A853"
        d="M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12Z"
      />
      <path
        fill="#FBBC04"
        d="M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81Z"
      />
      <path
        fill="#EA4335"
        d="M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"
      />
    </svg>
  )
}

function AppleIcon({ className = 'w-9 h-11' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 814 1000" aria-hidden="true">
      <path
        fill="currentColor"
        d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.9-164-39.9c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.2 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.2 32.4-54.4 83.8-54.4 135.8 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.8-71.6z"
      />
    </svg>
  )
}

type StoreBadgeProps = {
  variant: 'google' | 'apple'
  theme?: 'dark' | 'light'
}

export function StoreBadge({ variant, theme = 'dark' }: StoreBadgeProps) {
  const isDark = theme === 'dark'

  return (
    <span
      className={`inline-flex items-center gap-3.5 px-5 py-3.5 rounded-xl border min-w-[210px] ${
        isDark
          ? 'bg-white/10 border-white/15 text-white'
          : 'bg-black border-black text-white'
      }`}
    >
      {variant === 'google' ? (
        <GooglePlayIcon className="w-12 h-12 shrink-0" />
      ) : (
        <AppleIcon className="w-9 h-11 shrink-0 text-white" />
      )}
      <span className="text-left leading-tight">
        <span className={`block text-[11px] uppercase tracking-wide ${isDark ? 'text-white/75' : 'text-white/80'}`}>
          Coming soon on
        </span>
        <span className="block text-lg font-semibold mt-0.5">
          {variant === 'google' ? 'Google Play' : 'App Store'}
        </span>
      </span>
    </span>
  )
}

export { GooglePlayIcon, AppleIcon }
