export interface NavItem {
  label: string
  to: string
  description?: string
  children?: NavItem[]
}

export default defineAppConfig({
  brand: 'devxpert_labs',

  nav: {
    items: [
      { label: 'Home', to: '/' },
      {
        label: 'About',
        to: '/about',
        children: [
          { label: 'What we do', to: '/about/what-we-do', description: 'Plugins, blocks, WooCommerce, AI and performance work.' },
          { label: 'Who we are', to: '/about/who-we-are', description: 'The developer, the story and the values behind the lab.' },
          { label: 'Insights', to: '/about/insights', description: 'Case studies, projects and open-source contributions.' },
        ],
      },
      { label: 'Blog', to: '/blog' },
      { label: 'Contact', to: '/contact' },
    ] as NavItem[],
    cta: { label: 'Work with the lab', to: '/contact' },
  },

  /**
   * Sections rendered on the home page, in order.
   * Reorder, remove, or add entries here; each name maps to a component
   * in `pages/index.vue`.
   */
  sections: ['hero', 'giving', 'stack', 'projects', 'blog', 'why', 'about', 'faq', 'contact', 'tracker'] as SectionName[],
})

export type SectionName = 'hero' | 'giving' | 'stack' | 'projects' | 'blog' | 'why' | 'about' | 'faq' | 'contact' | 'tracker'
