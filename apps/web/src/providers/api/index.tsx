import { variables } from "@/config/variables";
import { getCookieStore } from "@/utils/auth";
import { getCookie } from "cookies-next";

interface ApiConfig extends RequestInit {
  params?: any;
  method: string;
}

interface RequestConfig extends Omit<ApiConfig, "method"> {}

export interface ResponseAPI<T = any> extends Response {
  data: T;
}

export interface CacheConfig {
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

export class FetchApiException extends Error {
  constructor(public response: ResponseAPI) {
    super(response.statusText);
  }
}

class Api {
  private readonly baseUrl: string;
  private token?: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  }

  async get<T = any>(path: string, options?: RequestConfig) {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  async post<T = any>(
    path: string,
    body?: Record<string, any>,
    options?: RequestConfig
  ) {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async patch<T = any>(
    path: string,
    body?: Record<string, any>,
    options?: RequestConfig
  ) {
    return this.request<T>(path, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  async delete<T = any>(path: string, options?: RequestConfig) {
    return this.request<T>(path, {
      ...options,
      method: "DELETE",
    });
  }

  private async request<T = unknown>(
    path: string,
    options?: ApiConfig
  ): Promise<ResponseAPI<T>> {
    if (!this.token) {
      const cookieStore = await getCookieStore();

      const token = getCookie(variables.accessTokenVar, {
        cookies: cookieStore,
      });

      if (token) this.token = token;
    }

    const headers = new Headers(options?.headers);

    if (this.token) headers.set("Authorization", `Bearer ${this.token}`);
    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");

    const configOptions: RequestInit = options || {};
    const url = new URL(path, this.baseUrl);

    Object.entries(options?.params || {}).forEach(
      ([key, value]) => value && url.searchParams.set(key, value.toString())
    );

    const response = await fetch(url, {
      ...configOptions,
      headers,
    });

    const { status } = response;
    const data = (await response.json().catch(() => {})) || {};

    const apiResponse = { ...response, status, data };

    if (status >= 400) throw new FetchApiException(apiResponse);

    return apiResponse;
  }
}

const api = new Api();

export { api };
