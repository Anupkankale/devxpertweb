/** Stable @id references shared by every page's JSON-LD. */
export function useSchemaIds() {
  const { siteUrl } = useRuntimeConfig().public
  return {
    siteUrl,
    org: `${siteUrl}/#organization`,
    person: `${siteUrl}/#person`,
    website: `${siteUrl}/#website`,
  }
}

/**
 * Site-wide entities (Organization, Person, WebSite). Rendered once from app.vue;
 * page-level nodes reference them by @id.
 */
export function useBaseSchema() {
  const ids = useSchemaIds()
  const { data: site } = useSite()
  const { data: stack } = useAsyncData('schema-stack', () => queryCollection('stack').order('order', 'ASC').all())

  const graph = computed(() => {
    const s = site.value
    if (!s) return null
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['Organization', 'ProfessionalService'],
          '@id': ids.org,
          'name': s.name,
          'legalName': s.organization.legalName,
          'slogan': s.organization.slogan,
          'description': s.description,
          'url': ids.siteUrl,
          'logo': { '@type': 'ImageObject', 'url': `${ids.siteUrl}/icon-512.png`, 'width': 512, 'height': 512 },
          'image': `${ids.siteUrl}${s.ogImage}`,
          'email': s.organization.email,
          'telephone': s.organization.telephone,
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': s.organization.city,
            'addressRegion': s.organization.region,
            'addressCountry': s.organization.country,
          },
          'areaServed': 'Worldwide',
          'founder': { '@id': ids.person },
          'sameAs': s.organization.sameAs,
          'knowsAbout': s.person.knowsAbout,
          'hasOfferCatalog': {
            '@type': 'OfferCatalog',
            'name': 'Services',
            'itemListElement': (stack.value ?? []).map(item => ({
              '@type': 'Offer',
              'itemOffered': { '@type': 'Service', 'name': item.title, 'description': item.body },
            })),
          },
        },
        {
          '@type': 'Person',
          '@id': ids.person,
          'name': s.person.name,
          'jobTitle': s.person.jobTitle,
          'url': s.person.url,
          'worksFor': { '@id': ids.org },
          'homeLocation': { '@type': 'Place', 'name': `${s.organization.city}, India` },
          'knowsAbout': s.person.knowsAbout,
          'sameAs': s.person.sameAs,
        },
        {
          '@type': 'WebSite',
          '@id': ids.website,
          'url': ids.siteUrl,
          'name': s.name,
          'description': s.description,
          'inLanguage': 'en',
          'publisher': { '@id': ids.org },
        },
      ],
    }
  })

  useHead({
    script: [{ key: 'ld-base', type: 'application/ld+json', innerHTML: () => graph.value ? JSON.stringify(graph.value) : '' }],
  })
}
