import { readFile } from 'node:fs/promises';

/** Relative to the project root, where `astro dev` and `astro build` run. */
const cvFile = 'public/cv.pdf';

/**
 * Serves the CV at a stable `/cv` URL while Budi keeps replacing a single file,
 * `public/cv.pdf`. The header here is what `astro dev` sends; a static build
 * writes the PDF to the extensionless `dist/cv` asset, where `public/_headers`
 * declares the same content type for Cloudflare.
 */
export async function GET() {
  const pdf = await readFile(cvFile);

  return new Response(new Uint8Array(pdf), {
    headers: { 'Content-Type': 'application/pdf' },
  });
}
