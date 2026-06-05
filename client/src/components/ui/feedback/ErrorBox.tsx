export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200 shadow-lg shadow-red-950/10">
      {message}
    </div>
  );
}
