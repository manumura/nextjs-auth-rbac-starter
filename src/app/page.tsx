import { welcome, info } from "@/lib/api";
import HomePage from "./home-page";

export const getAppInfos = async () => {
  let message = 'Welcome fallback!';
  let information = {};

  try {
    const welcomeRes = await welcome();
    message = welcomeRes.data;
    const infoRes = await info();
    information = infoRes.data;
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
