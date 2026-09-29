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
      { label: 'What we do', to: '/what-we-do', description: 'Plugins, blocks, WooCommerce, AI and performance work.' },
      { label: 'Who we are', to: '/who-we-are', description: 'The developer, the story and the values behind the lab.' },
      { label: 'What we think', to: '/what-we-think', description: 'Articles, case studies, projects and open-source contributions.' },
    ] as NavItem[],
    // The call-to-action button is the way into /contact, so Contact isn't a separate menu item.
    cta: { label: 'Work with the lab', to: '/contact' },
  },

  /**
   * Sections rendered on the home page, in order.
   * Reorder, remove, or add entries here; each name maps to a component
   * in `pages/index.vue`.
   */
  sections: ['hero', 'giving', 'stack', 'projects', 'insights', 'why', 'about', 'faq', 'contact', 'tracker'] as SectionName[],
})

export type SectionName = 'hero' | 'giving' | 'stack' | 'projects' | 'insights' | 'why' | 'about' | 'faq' | 'contact' | 'tracker'
