import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500 rounded-full blur-3xl opacity-10 transform -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          IELTS MockPrep Platform
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
          The most realistic Computer-Based Test environment. Practice like the real thing, get scored by real teachers.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="btn-primary py-3 px-8 text-lg shadow-primary-500/30">
            Start for Free (Students)
          </Link>
          <Link href="/login" className="btn-secondary py-3 px-8 text-lg">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
