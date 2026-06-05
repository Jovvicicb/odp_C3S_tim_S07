import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ErrorBox } from "../../../ui/feedback/ErrorBox";
import { SubmitButton } from "../../../ui/button/SubmitButton";

import { StringNormalizer } from "../../../../helpers/normalization/StringNormalizer";
import { useToast } from "../../../../hooks/toast/useToast";
import { useUpdateCommunity } from "../../../../hooks/communities/edit/useUpdateCommunity";
import { useEditCommunityImageInput } from "../../../../hooks/communities/edit/useEditCommunityImageInput";

import { validateUpdateCommunity } from "../../../../validators/community/validateUpdateCommunity";
import { CommunityMessages } from "../../../../constants/messages/community/CommunityMessages";
import { CommonMessages } from "../../../../constants/messages/common/CommonMessages";

import type { CommunityDto } from "../../../../models/communities/CommunityDto";
import type { CommunityType } from "../../../../types/communities/common/CommunityType";

import { CommunityTypeSelector } from "../shared/CommunityTypeSelector";
import { CommunityImageInput } from "../shared/CommunityImageInput";

type Props = {
  community: CommunityDto;
};

function buildUpdateCommunityFormData({
  community,
  name,
  description,
  rules,
  type,
  avatar,
  removeAvatar,
}: {
  community: CommunityDto;
  name: string;
  description: string;
  rules: string;
  type: CommunityType;
  avatar: File | undefined;
  removeAvatar: boolean;
}) {
  const formData = new FormData();

  const normalizedName = StringNormalizer.normalizeSpaces(name);
  const normalizedDescription = StringNormalizer.trim(description);
  const normalizedRules = StringNormalizer.trim(rules);

  const originalDescription = community.description ?? "";
  const originalRules = community.rules ?? "";

  if (normalizedName !== community.name) {
    formData.append("name", normalizedName);
  }

  if (normalizedDescription !== originalDescription) {
    formData.append("description", normalizedDescription);
  }

  if (normalizedRules !== originalRules) {
    formData.append("rules", normalizedRules);
  }

  if (type !== community.type) {
    formData.append("type", type);
  }

  if (avatar) {
    formData.append("image", avatar);
  }

  if (removeAvatar && community.avatar !== null) {
    formData.append("removeAvatar", "true");
  }

  return formData;
}

export function EditCommunityForm({ community }: Props) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const initialValues = useMemo(
    () => ({
      name: community.name,
      description: community.description ?? "",
      rules: community.rules ?? "",
      type: community.type,
    }),
    [community],
  );

  const [name, setName] = useState(initialValues.name);
  const [description, setDescription] = useState(initialValues.description);
  const [rules, setRules] = useState(initialValues.rules);
  const [type, setType] = useState<CommunityType>(initialValues.type);

  const { updateCommunity, loading, error, setError } = useUpdateCommunity();

  const {
    avatar,
    preview,
    fileKey,
    removeAvatar,
    handleImageChange,
    handleRemoveImage,
  } = useEditCommunityImageInput(community.avatar, setError);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateUpdateCommunity({
      name,
      description,
      rules,
      type,
      avatar,
      removeAvatar,
    });

    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    try {
      const formData = buildUpdateCommunityFormData({
        community,
        name,
        description,
        rules,
        type,
        avatar,
        removeAvatar,
      });

      if (Array.from(formData.keys()).length === 0) {
        setError(CommunityMessages.noChangesToUpdate);
        return;
      }

      const success = await updateCommunity(community.id, formData);

      if (!success) {
        return;
      }

      showToast({
        type: "success",
        message: CommunityMessages.updateSuccess,
      });

      navigate(`/communities/${community.id}`);
    } catch {
      setError(CommonMessages.unexpectedError);
    }
  };

  return (
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
          placeholder="Community name..."
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

      <div>
        <CommunityImageInput
          fileKey={fileKey}
          preview={preview}
          onChange={handleImageChange}
        />

        {preview && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="mt-3 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-200 transition-all hover:bg-red-500/15"
          >
            Remove image
          </button>
        )}
      </div>

      <SubmitButton
        label="Update community"
        loadingLabel="Updating community..."
        loading={loading}
      />
    </form>
  );
}
