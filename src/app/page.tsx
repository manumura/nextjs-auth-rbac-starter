import { headers } from "next/headers";
import HomePage from "./home-page";
import { getClientBaseUrl } from "../lib/util";

export const getAppInfos = async () => {
  let message = 'Welcome fallback!';
  let information = {};

  const baseUrl = getClientBaseUrl(headers());

  try {
    const welcomeRes = await fetch(`${baseUrl}/api/welcome`, {
      method: "GET",
    });
    if (welcomeRes.ok) {
      const messageAsJson = await welcomeRes.json();
      message = messageAsJson.message;
    }

    const infoRes = await fetch(`${baseUrl}/api/info`, {
      method: "GET",
    });
    if (infoRes.ok) {
      information = await infoRes.json();
    }
    // const welcomeRes = await welcome();
    // message = welcomeRes.data;
    // const infoRes = await info();
    // information = infoRes.data;
  } catch (err) {
    console.error(`Welcome message error: ${err.message}`);
  }

  return {
      message,
      information,
  };
};

export default async function Home() {
  // Fetch data directly in a Server Component
  const appInfos = await getAppInfos();

  // Forward fetched data to your Client Component
  return <HomePage message={appInfos?.message} information={appInfos?.information} />;
}
