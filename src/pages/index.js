import Head from "next/head";
import Script from "next/script";
import React from "react";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen bg-gradient-to-b from-gray-900 to-slate-800 flex flex-col text-white">
        <header className="py-16">
          <h1 className="text-5xl font-bold text-center mb-6">
            Create Tailwind
          </h1>
          <div className="flex flex-row justify-center items-center gap-4">
            <a
              className="github-button"
              href="https://github.com/andrejjurkin/create-tw"
              data-color-scheme="no-preference: dark; light: dark; dark: dark;"
              data-icon="octicon-star"
              data-size="large"
              data-show-count="true"
              aria-label="Star andrejjurkin/create-tw on GitHub"
            >
              Star
            </a>
            <a
              className="github-button"
              href="https://github.com/andrejjurkin/create-tw/discussions"
              data-color-scheme="no-preference: dark; light: dark; dark: dark;"
              data-icon="octicon-comment-discussion"
              data-size="large"
              aria-label="Discuss andrejjurkin/create-tw on GitHub"
            >
              Discuss
            </a>
          </div>
        </header>

        <main className="flex-1">
          <section className="text-center">
            <h2 className="text-3xl font-medium text-center">
              Next.js Project Created using{" "}
              <a
                href="https://nextjs.org/docs/api-reference/create-next-app"
                target="_blank"
                className="text-indigo-300"
              >
                create-next-app
              </a>
            </h2>
            <p className="mb-6">
              Officially maintained by the creators of Next.js
            </p>
          </section>
        </main>

        <footer className="px-8 py-12 border-t border-gray-800">
          <div className="px-8 font-medium text-center">
            <a href="https://github.com/andrejjurkin/create-tw">
              Create Tailwind
            </a>
          </div>
        </footer>
      </div>
      <Script src="https://buttons.github.io/buttons.js" />
    </div>
  );
}
