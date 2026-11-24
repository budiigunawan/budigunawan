import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import { site } from './src/config/site';

interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  value?: string;
  children?: HastNode[];
}

/**
 * Wraps every highlighted code block in a container that can hold a copy
 * control. The button ships in the markup but stays hidden until the script
 * that can operate it takes over, so it never appears as a dead control. The
 * `<pre>` is focusable so a keyboard user can scroll code that overflows.
 */
function rehypeWrapCodeBlocks() {
  return (tree: HastNode) => {
    const visit = (node: HastNode) => {
      if (!node.children) return;

      node.children = node.children.map((child) => {
        if (child.type === 'element' && child.tagName === 'pre') {
          return {
            type: 'element',
            tagName: 'div',
            properties: { className: ['code-block'] },
            children: [
              {
                type: 'element',
                tagName: 'button',
                properties: {
                  type: 'button',
                  className: ['code-copy'],
                  'data-code-copy': '',
                  'aria-label': 'Copy code',
                  'aria-live': 'polite',
                  hidden: true,
                },
                children: [{ type: 'text', value: 'Copy' }],
              },
              { ...child, properties: { ...child.properties, tabindex: '0' } },
            ],
          } satisfies HastNode;
        }

        visit(child);
        return child;
      });
    };

    visit(tree);
  };
}

// Every page is prerendered. The adapter exists so the Contact endpoint can opt
// out of prerendering later with `export const prerender = false`.
export default defineConfig({
  site: site.url,
  output: 'static',
  adapter: vercel(),
  markdown: {
    // Two Shiki themes emit both palettes as custom properties; the stylesheet
    // chooses between them, so highlighted code follows the site theme.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
      wrap: false,
    },
    rehypePlugins: [rehypeWrapCodeBlocks],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
