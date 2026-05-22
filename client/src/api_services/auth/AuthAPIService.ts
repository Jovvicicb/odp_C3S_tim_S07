import axios from "axios";
import type { AuthResponse } from "../../types/auth/AuthResponse";
import type { IAuthAPIService } from "./IAuthAPIService";
import { AuthMessages } from "../../constants/messages/auth/AuthMessages";
import {
  getApiErrorMessage,
  type ApiClientError,
} from "../../helpers/api/ApiErrorHelper";

const BASE = import.meta.env.VITE_API_URL + "auth";

const err = (e: ApiClientError, fallback: string): AuthResponse => ({
  success: false,
  message: getApiErrorMessage(e, fallback),
});

export const authApi: IAuthAPIService = {
  async login(username, password) {
    return axios
      .post<AuthResponse>(`${BASE}/login`, { username, password })
      .then((r) => r.data)
      .catch((e: ApiClientError) => err(e, AuthMessages.loginFailed));
  },

  async register(formData) {
    return axios
      .post<AuthResponse>(`${BASE}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((r) => r.data)
      .catch((e: ApiClientError) => err(e, AuthMessages.registerFailed));
  },
};