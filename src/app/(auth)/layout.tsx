import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-surface-950">
      {/* ── Left Panel: Branding ────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Hero background image */}
        <div className="absolute inset-0">
          <Image
            src="/auth-hero.png"
            alt="Life Transformers"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-surface-950/80 via-surface-950/40 to-surface-950/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-950/90 via-transparent to-surface-950/30" />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-brand-500/10 blur-3xl animate-float" />
        <div className="absolute bottom-32 right-16 w-48 h-48 rounded-full bg-primary-500/10 blur-3xl animate-float delay-300" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
          {/* Logo */}
          <div className="relative mb-8 animate-scale-in">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-brand-500/40 shadow-[0_0_40px_rgba(234,179,8,0.3)] animate-glow-pulse">
              <Image src="/logo.png" alt="Logo" width={96} height={96} className="object-cover w-full h-full" />
            </div>
            {/* Spinning ring decoration */}
            <div className="absolute -inset-3 rounded-3xl border border-brand-500/20 animate-spin-slow" />
          </div>

          <h1 className="text-5xl font-bold mb-4 animate-fade-up">
            <span className="text-gradient-gold">Life</span>{" "}
            <span className="text-white">Transformers</span>
          </h1>

          <p className="text-xl text-surface-200 font-light mb-2 animate-fade-up delay-100">
            Ministry Network
          </p>

          <p className="text-surface-400 text-base leading-relaxed animate-fade-up delay-200 max-w-sm">
            A private, faith-filled space for our community to connect, grow, and share life together.
          </p>

          {/* Decorative divider */}
          <div className="flex items-center gap-3 mt-8 animate-fade-up delay-300">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-brand-500/60" />
            <span className="text-brand-500 text-lg">✦</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-brand-500/60" />
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-8 animate-fade-up delay-400">
            {[
              { value: "500+", label: "Members" },
              { value: "∞", label: "Blessings" },
              { value: "1", label: "Family" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-gradient-gold">{stat.value}</div>
                <div className="text-xs text-surface-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel: Form ───────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(234,179,8,0.05),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.05),_transparent_60%)]" />

        {/* Mobile logo */}
        <div className="lg:hidden mb-8 flex items-center gap-3 animate-scale-in">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-brand-500/40">
            <Image src="/logo.png" alt="Logo" width={48} height={48} className="object-cover w-full h-full" />
          </div>
          <div>
            <div className="font-bold text-lg text-gradient-gold leading-tight">Life Transformers</div>
            <div className="text-xs text-surface-400">Ministry Network</div>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-md animate-fade-up">
          {children}
        </div>
      </div>
    </div>
  )
}
