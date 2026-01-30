type AuthLayoutProps = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="glow-orb float left-[-15%] top-[15%] h-[360px] w-[360px] bg-[rgba(139,184,255,0.35)]" />
      <div className="glow-orb float right-[-20%] bottom-[10%] h-[420px] w-[420px] bg-[rgba(126,249,216,0.28)]" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-16">
        <div className="glass-panel-strong w-full max-w-xl rounded-3xl px-8 py-10 text-center">
          {children}
        </div>
      </div>
    </div>
  );
}
