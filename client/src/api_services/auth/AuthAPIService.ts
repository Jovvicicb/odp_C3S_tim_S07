import axios from "axios";

import type { IAuthAPIService } from "./IAuthAPIService";
import type { AuthResponse } from "../../types/auth/AuthResponse";
import type { ApiResponse } from "../../types/common/ApiResponse";

import { AuthMessages } from "../../constants/messages/auth/AuthMessages";

import {
  getApiErrorMessage,
  type ApiClientError,
} from "../../helpers/api/ApiErrorHelper";

const BASE = import.meta.env.VITE_API_URL + "auth";

const err = <T>(e: ApiClientError, fallback: string): ApiResponse<T> => ({
  success: false,
  message: getApiErrorMessage(e, fallback),
});

export const authApi: IAuthAPIService = {
  async login(username, password) {
    return axios
      .post<AuthResponse>(`${BASE}/login`, { username, password })
      .then((r) => r.data)
      .catch((e: ApiClientError) => err<string>(e, AuthMessages.loginFailed));
  },

  async register(formData) {
    return axios
      .post<AuthResponse>(`${BASE}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((r) => r.data)
      .catch((e: ApiClientError) =>
        err<string>(e, AuthMessages.registerFailed),
      );
  },

  async logout(token) {
    return axios
      .post<ApiResponse<void>>(
        `${BASE}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((r) => r.data)
      .catch((e: ApiClientError) =>
        err<void>(e, AuthMessages.logoutFailed),
      );
  },
};