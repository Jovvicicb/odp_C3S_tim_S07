import type { Dispatch, SetStateAction } from "react";
import type { PostDetailsDto } from "../../../models/post/PostDetailsDto";

export type CommentActionHookProps = {
  reloadPostDetails: () => Promise<void>;
  setPostDetails: Dispatch<SetStateAction<PostDetailsDto | null>>;
};