import { defineCollection, z } from 'astro:content';

import { glob, file } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/posts' }),
  schema: ({ image }) =>
    z.object({
      published_settings: z.object({
        published: z.boolean().default(true),
        created: z.date()
      }),
      cover: image(),
      title: z.string(),
      description: z.string()
    })
});

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/products' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.string(),
      externalLink: z.string().optional()
    })
});

const products_category = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/products-category' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      cover: image()
    })
});

const showrooms = defineCollection({
  loader: file('./src/data/showrooms.json'),
  schema: ({ image }) =>
    z.array(
      z.object({
        image: image(),
        width: z.number(),
        height: z.number()
      })
    )
});

const content_pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/content_pages' }),
  schema: ({ image }) =>
    z.object({
      published_settings: z.object({
        published: z.boolean().default(true),
      }),
      slug: z.string(),
      title: z.string()
    })
});

export const collections = { blog, products, products_category, showrooms, content_pages };
