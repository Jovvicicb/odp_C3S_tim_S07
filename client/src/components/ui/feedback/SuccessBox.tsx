export function SuccessBox({ message }: { message: string }) {
  return (
    <div className="mb-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200 shadow-lg shadow-emerald-950/10">
      {message}
    </div>
  );
}
