import React, { useContext } from "react";

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

export type APIClientInit = {
  baseUrl: string;
  headers?: HeadersInit;
};

export class APIClient {
  private readonly baseUrl: string;
  private readonly headers?: HeadersInit;

  constructor({ baseUrl, headers }: APIClientInit) {
    // Cut the ending slash
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, baseUrl.length - 1);
    }
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  async execute(path: string, init: RequestInit = {}) {
    // Add starting slash
    if (!path.startsWith("/")) {
      path = `/${path}`
    }
    const url = this.baseUrl + path;

    init.headers = {
      ...this.headers,
      ...init.headers
    };

    return fetch(url, init);
  }
}

const APIClientContext = React.createContext<APIClient>(
  new APIClient({ baseUrl: "//" })
);

export const useApiClient = (): APIClient => useContext(APIClientContext)

export const APIClientProvider: React.FunctionComponent<{ client: APIClient }> = ({ client, children }) => (
  <APIClientContext.Provider value={client}>
    {children}
  </APIClientContext.Provider>
)
