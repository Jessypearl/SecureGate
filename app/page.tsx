import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      {/* Background glowing gradients */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full mix-blend-screen filter blur-[128px] animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-6 py-24 text-center flex flex-col items-center mt-12 sm:mt-0">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900/50 backdrop-blur-md text-sm font-medium text-slate-300 shadow-xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          SecureGate Platform v1.0
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
          The New Standard for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Secure Access
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Secure, fast, and developer-friendly authentication built with Next.js. Deploy
          anywhere and scale with confidence.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/auth?mode=signup"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-white bg-indigo-600 rounded-full overflow-hidden transition-all hover:bg-indigo-500 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] active:scale-95 w-full sm:w-auto shadow-lg"
          >
            <span>Get Started</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          
          <Link
            href="/auth?mode=login"
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-full transition-all hover:bg-slate-800 hover:text-white hover:scale-105 active:scale-95 w-full sm:w-auto shadow-lg"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Decorative glass card */}
      <div className="relative z-10 mt-16 w-full max-w-5xl mx-auto px-6 hidden md:block">
        <div className="relative rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-xl shadow-2xl p-2 overflow-hidden transform transition-transform hover:scale-[1.02] duration-500">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"></div>
          <div className="rounded-xl border border-slate-800/50 bg-slate-950/80 p-6 shadow-inner min-h-[300px] flex flex-col gap-4">
             {/* Mock UI header */}
             <div className="flex items-center gap-4 border-b border-slate-800/80 pb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="h-5 w-48 bg-slate-800/50 rounded-md"></div>
                <div className="ml-auto flex gap-3">
                  <div className="h-6 w-16 bg-indigo-500/20 text-indigo-400 rounded flex items-center justify-center text-[10px] font-bold">200 OK</div>
                  <div className="h-6 w-24 bg-slate-800/50 rounded"></div>
                </div>
             </div>
             {/* Mock UI body */}
             <div className="flex gap-6 mt-4 opacity-75">
                <div className="w-64 h-48 bg-slate-800/30 rounded-lg border border-slate-800/50 flex flex-col p-4 gap-3">
                   <div className="h-4 w-2/3 bg-slate-700/50 rounded"></div>
                   <div className="h-3 w-full bg-slate-800/50 rounded mt-2"></div>
                   <div className="h-3 w-4/5 bg-slate-800/50 rounded"></div>
                   <div className="h-3 w-full bg-slate-800/50 rounded"></div>
                </div>
                <div className="flex-1 space-y-4">
                   <div className="h-12 w-full bg-slate-800/30 rounded-lg border border-slate-800/50 flex items-center px-4">
                     <div className="h-4 w-32 bg-slate-700/50 rounded"></div>
                     <div className="ml-auto h-6 w-24 bg-indigo-600/30 rounded text-indigo-400 flex items-center justify-center text-xs">Protected</div>
                   </div>
                   <div className="h-24 w-full bg-slate-800/30 rounded-lg border border-slate-800/50 p-4 space-y-3">
                     <div className="h-3 w-1/4 bg-slate-700/50 rounded"></div>
                     <div className="h-3 w-full bg-slate-800/50 rounded"></div>
                     <div className="h-3 w-5/6 bg-slate-800/50 rounded"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
