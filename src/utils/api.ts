import { type NextRouter } from "next/router";

export async function fetchAPI<T_IN, T_OUT>(
  endpoint: string,
  {
    method = "GET",
    body,
    router,
  }: {
    method?: string;
    body?: T_IN;
    router?: NextRouter;
  } = { method: "GET" },
) {
  const resp = await fetch(
    `https://frontend-take-home-service.fetch.com/${endpoint}`,
    {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    },
  );

  if (resp.status === 401) {
    // Not logged in; redirect to login page
    await router?.push("/login");
    return undefined;
  } else if (!resp.ok) {
    console.error(`Invalid response: [${resp.status}] ${resp.statusText}`);
    return undefined;
  }

  try {
    return (await resp.json()) as T_OUT;
  } catch (error) {
    return undefined;
  }
}
