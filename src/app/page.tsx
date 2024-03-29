import { headers } from 'next/headers';
import HomePage from './home-page';
import { getClientBaseUrl } from '../lib/utils';

async function getAppInfos() {
  let message = 'Welcome to MyApp!';
  let information = {};

  try {
    const baseUrl = getClientBaseUrl(headers());
    const welcomeRes = await fetch(`${baseUrl}/api/welcome`, {
      method: 'GET',
    });

    if (welcomeRes.ok) {
      const welcomeAsJson = await welcomeRes.json();
      message = welcomeAsJson.message;
    }

    const infoRes = await fetch(`${baseUrl}/api/info`, {
      method: 'GET',
    });

    if (infoRes.ok) {
      information = await infoRes.json();
    }
  } catch (error) {
    console.error(error);
  }

  return {
    message,
    information,
  };
}

export default async function Home() {
  // Fetch data directly in a Server Component
  const appInfos = await getAppInfos();

  // Forward fetched data to your Client Component
  return (
    <HomePage message={appInfos?.message} information={appInfos?.information} />
  );
}
