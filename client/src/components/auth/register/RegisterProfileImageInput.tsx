type Props = {
  fileKey: number;
  preview: string;
  onChange: (file?: File) => void;
};

export function RegisterProfileImageInput({
  fileKey,
  preview,
  onChange,
}: Props) {
  return (
    <>
      <div>
        <label
          htmlFor="register-image"
          className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35"
        >
          Profile image
        </label>

        <input
          key={fileKey}
          id="register-image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => onChange(e.target.files?.[0])}
          className="w-full rounded-2xl border border-white/10 bg-white/4 px-3 py-2 text-sm text-white transition-all file:mr-3 file:rounded-xl file:border-0 file:bg-sky-400/15 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-sky-200 hover:file:bg-sky-400/20 focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5 hover:border-white/20"
        />
      </div>

      {preview && (
        <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/3 p-3">
          <img
            src={preview}
            alt="Profile preview"
            className="h-14 w-14 rounded-2xl border border-white/20 object-cover"
          />

          <div>
            <p className="text-sm text-white/70">Profile preview</p>

            <p className="text-xs text-white/30">Image selected successfully</p>
          </div>
        </div>
      )}
    </>
  );
}
