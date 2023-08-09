console.log('********* PREBUILDING');
const path = require('node:path');
const fs = require('fs');
const baseDir = process.cwd();

// /node_modules/@netlify/plugin-nextjs/lib/templates/requireHooks.js

const prebuildScripts = async () => {
  const file = path.join(
    baseDir,
    '/node_modules',
    '@netlify/plugin-nextjs/lib/templates/requireHooks.js',
  );

  const content = await fs.promises.readFile(file, 'utf-8');
  await fs.promises.writeFile(
    file,
    content.replace(
      "const reactMode = process.env.__NEXT_PRIVATE_PREBUNDLED_REACT || 'default';",
      "const reactMode = process.env.__NEXT_PRIVATE_PREBUNDLED_REACT || 'next';",
    ),
  );
};

prebuildScripts();
