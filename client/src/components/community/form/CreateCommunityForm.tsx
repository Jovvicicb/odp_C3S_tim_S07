import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ErrorBox } from "../../ui/UI";
import { StringNormalizer } from "../../../helpers/normalization/StringNormalizer";
import { useCreateCommunity } from "../../../hooks/community/useCreateCommunity";
import { validateCreateCommunity } from "../../../validators/community/validateCreateCommunity";
import { useToast } from "../../../hooks/toast/useToast";
import { CommunityMessages } from "../../../constants/messages/community/CommunityMessages";
import { CommonMessages } from "../../../constants/messages/common/CommonMessages";
import type { CommunityType } from "../../../types/community/CommunityType";

import { CommunityFormIntro } from "./CommunityFormIntro";
import { CommunityTypeSelector } from "./CommunityTypeSelector";
import { CommunityImageInput } from "./CommunityImageInput";
import { useCommunityImageInput } from "../../../hooks/community/form/useCommunityImageInput";
import { SubmitButton } from "../../ui/SubmitButton";

export default function CreateCommunityForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [type, setType] = useState<CommunityType>("public");

  const { showToast } = useToast();
  const navigate = useNavigate();

  const { createCommunity, loading, error, setError } = useCreateCommunity();

  const { avatar, preview, fileKey, handleImageChange } =
    useCommunityImageInput(setError);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateCreateCommunity({
      name,
      description,
      rules,
      type,
      avatar,
    });

    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", StringNormalizer.normalizeSpaces(name));
      formData.append("description", StringNormalizer.trim(description));
      formData.append("rules", StringNormalizer.trim(rules));
      formData.append("type", type);

      if (avatar) {
        formData.append("image", avatar);
      }

      const createdCommunity = await createCommunity(formData);

      if (!createdCommunity) return;

      showToast({
        type: "success",
        message: CommunityMessages.createSuccess,
      });

      navigate(`/communities/${createdCommunity.id}`);
    } catch {
      setError(CommonMessages.unexpectedError);
    }
  };

  return (
    <section>
      <CommunityFormIntro />

      <form
        noValidate
        onSubmit={submit}
        className="mx-auto flex w-full max-w-2xl flex-col gap-6"
      >
        {error && <ErrorBox message={error} />}

        <div>
          <label
            htmlFor="community-name"
            className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35"
          >
            Community name
          </label>

          <input
            id="community-name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={2}
            maxLength={80}
            required
            placeholder="community name"
            className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5"
          />
        </div>

        <div>
          <label
            htmlFor="community-description"
            className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35"
          >
            Description
          </label>

          <textarea
            id="community-description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="What is this community about?"
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm leading-6 text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5"
          />
        </div>

        <div>
          <label
            htmlFor="community-rules"
            className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35"
          >
            Rules
          </label>

          <textarea
            id="community-rules"
            name="rules"
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Define basic community rules..."
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm leading-6 text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5"
          />
        </div>

        <CommunityTypeSelector value={type} onChange={setType} />

        <CommunityImageInput
          fileKey={fileKey}
          preview={preview}
          onChange={handleImageChange}
        />

        <SubmitButton
          label="Create community"
          loadingLabel="Creating community..."
          loading={loading}
        />
      </form>
    </section>
  );
}
