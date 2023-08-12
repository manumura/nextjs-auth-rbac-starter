import { headers } from 'next/headers';
import HomePage from './home-page';
import { getClientBaseUrl } from '../lib/utils';

// https://answers.netlify.com/t/server-edge-not-defined-error-on-nextjs-ssr-functions-cause-site-to-return-500-errors/91793/107
// https://github.com/netlify/next-runtime/issues/2127
// https://github.com/vercel/next.js/issues/49169
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
