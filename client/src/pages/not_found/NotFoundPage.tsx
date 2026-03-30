import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="text-center">
        <p className="font-mono text-7xl text-white/6 mb-4 font-bold">404</p>
        <p className="text-white/30 text-sm mb-6">Page not found.</p>
        <Link to="/login" className="text-white/50 text-sm hover:text-white/80 transition-colors">← Back to login</Link>
      </div>
    </main>
  );
}
