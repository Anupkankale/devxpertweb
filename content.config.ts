import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const link = z.object({
  href: z.string(),
  label: z.string(),
  icon: z.string().optional(),
})

export default defineContentConfig({
  collections: {
    site: defineCollection({
      type: 'data',
      source: 'site.yml',
      schema: z.object({
        name: z.string(),
        title: z.string(),
        description: z.string(),
        ogDescription: z.string(),
        author: z.string(),
        locale: z.string(),
        ogImage: z.string(),
        ogImageAlt: z.string(),
        organization: z.object({
          legalName: z.string(),
          slogan: z.string(),
          email: z.string(),
          telephone: z.string(),
          city: z.string(),
          region: z.string(),
          country: z.string(),
          sameAs: z.array(z.string()),
        }),
        person: z.object({
          name: z.string(),
          jobTitle: z.string(),
          url: z.string(),
          sameAs: z.array(z.string()),
          knowsAbout: z.array(z.string()),
        }),
        hero: z.object({
          eyebrow: z.string(),
          title: z.string(),
          titleEmphasis: z.string(),
          lead: z.string(),
          primaryCta: link,
          secondaryCta: link,
        }),
        pluginCard: z.object({
          name: z.string(),
          by: z.string(),
          filename: z.string(),
          hint: z.string(),
          header: z.array(z.object({ key: z.string(), value: z.string(), url: z.boolean().optional() })),
        }),
        footer: z.object({ meta: z.string() }),
      }),
    }),

    sections: defineCollection({
      type: 'data',
      source: 'sections/*.yml',
      schema: z.object({
        eyebrow: z.string(),
        title: z.string(),
        lead: z.string().optional(),
        note: z.string().optional(),
        paragraphs: z.array(z.string()).optional(),
      }),
    }),

    contributions: defineCollection({
      type: 'data',
      source: 'contributions/*.yml',
      schema: z.object({
        order: z.number(),
        kicker: z.string(),
        pill: z.object({ label: z.string(), variant: z.enum(['core', 'live', 'oss']) }),
        title: z.string(),
        body: z.string(),
        link,
      }),
    }),

    stack: defineCollection({
      type: 'data',
      source: 'stack/*.yml',
      schema: z.object({
        order: z.number(),
        title: z.string(),
        body: z.string(),
      }),
    }),

    projects: defineCollection({
      type: 'data',
      source: 'projects/*.yml',
      schema: z.object({
        order: z.number(),
        tag: z.string(),
        title: z.string(),
        body: z.string(),
        link: link.optional(),
      }),
    }),

    timeline: defineCollection({
      type: 'data',
      source: 'timeline/*.yml',
      schema: z.object({
        order: z.number(),
        kicker: z.string(),
        title: z.string(),
        body: z.string(),
      }),
    }),

    contacts: defineCollection({
      type: 'data',
      source: 'contacts/*.yml',
      schema: z.object({
        order: z.number(),
        label: z.string(),
        href: z.string(),
        icon: z.string(),
        variant: z.enum(['default', 'whatsapp']).default('default'),
      }),
    }),

    faq: defineCollection({
      type: 'data',
      source: 'faq/*.yml',
      schema: z.object({
        order: z.number(),
        question: z.string(),
        answer: z.string(),
      }),
    }),

    process: defineCollection({
      type: 'data',
      source: 'process/*.yml',
      schema: z.object({
        order: z.number(),
        title: z.string(),
        body: z.string(),
      }),
    }),

    // Hero + SEO copy for each inner page, keyed by file name (e.g. pages/contact.yml)
    pages: defineCollection({
      type: 'data',
      source: 'pages/*.yml',
      schema: z.object({
        seoTitle: z.string(),
        seoDescription: z.string(),
        eyebrow: z.string(),
        title: z.string(),
        titleEmphasis: z.string().optional(),
        lead: z.string(),
      }),
    }),

    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        date: z.string(),
        updated: z.string().optional(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false),
        readingTime: z.number().optional(),
      }),
    }),

    insights: defineCollection({
      type: 'page',
      // served under /about/insights/<slug>
      source: { include: 'insights/*.md', prefix: '/about/insights' },
      schema: z.object({
        date: z.string(),
        kind: z.string(),
        client: z.string().optional(),
        services: z.array(z.string()).default([]),
        outcome: z.string().optional(),
        link: link.optional(),
        draft: z.boolean().default(false),
        readingTime: z.number().optional(),
      }),
    }),

    about: defineCollection({
      type: 'page',
      source: 'about.md',
      schema: z.object({
        eyebrow: z.string(),
        cta: link.optional(),
      }),
    }),

    tracker: defineCollection({
      type: 'data',
      source: 'tracker/*.yml',
      schema: z.object({
        order: z.number(),
        key: z.string(),
        title: z.string(),
        url: z.string(),
        seeds: z.array(z.string()),
      }),
    }),
  },
})
