import { useState } from "react";

import { SubmitButton } from "../../ui/button/SubmitButton";

import { TagValidationMessages } from "../../../constants/messages/tag/TagValidationMessages";

import { StringNormalizer } from "../../../helpers/normalization/StringNormalizer";

type Props = {
  loading: boolean;
  onSubmit: (name: string) => Promise<boolean>;
};

export function AdminTagForm({ loading, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizedName = StringNormalizer.normalizeSpaces(name);

    if (!normalizedName) {
      setLocalError(TagValidationMessages.nameRequired);
      return;
    }

    setLocalError("");

    const success = await onSubmit(normalizedName);

    if (success) {
      setName("");
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 shadow-xl shadow-sky-950/10">
      <div className="border-b border-white/8 bg-white/2 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200/50">
          Create
        </p>

        <h2 className="mt-2 text-xl font-bold tracking-tight text-white">
          Add a new global tag
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
          Create reusable tags for post categorization. Tags are normalized to
          lowercase before saving.
        </p>
      </div>

      <form noValidate onSubmit={submit} className="p-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <label
              htmlFor="tag-name"
              className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35"
            >
              Tag name
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-sky-200/45">
                #
              </span>

              <input
                id="tag-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setLocalError("");
                }}
                minLength={2}
                maxLength={50}
                placeholder="react, mysql, docker..."
                className="w-full rounded-2xl border border-white/10 bg-white/4 py-3 pl-8 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/20 hover:border-sky-300/20 focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5"
              />
            </div>

            {localError ? (
              <p className="mt-2 text-xs font-medium text-red-300">
                {localError}
              </p>
            ) : (
              <p className="mt-2 text-xs text-white/25">
                Use 2–50 characters. Spaces will be normalized automatically.
              </p>
            )}
          </div>

          <div className="lg:pt-7">
            <SubmitButton
              label="Create tag"
              loadingLabel="Creating tag..."
              loading={loading}
              className="w-full lg:w-auto"
            />
          </div>
        </div>
      </form>
    </section>
  );
}
