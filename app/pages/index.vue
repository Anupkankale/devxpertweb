<script setup lang="ts">
import type { Component } from 'vue'
import type { SectionName } from '~/app.config'
import {
  SectionsAboutSection,
  SectionsContactSection,
  SectionsFaqSection,
  SectionsGivingSection,
  SectionsHeroSection,
  SectionsInsightsSection,
  SectionsProjectsSection,
  SectionsStackSection,
  SectionsTrackerSection,
  SectionsWhySection,
} from '#components'

/** Section name → component (+ props for the home page) */
const registry: Record<SectionName, { component: Component, props?: Record<string, unknown> }> = {
  hero: { component: SectionsHeroSection },
  giving: { component: SectionsGivingSection },
  stack: { component: SectionsStackSection, props: { more: { label: 'Explore services', to: '/what-we-do' } } },
  projects: { component: SectionsProjectsSection, props: { more: { label: 'Read our thinking', to: '/what-we-think' } } },
  insights: { component: SectionsInsightsSection },
  why: { component: SectionsWhySection, props: { more: { label: 'Our story', to: '/who-we-are' } } },
  about: { component: SectionsAboutSection },
  faq: { component: SectionsFaqSection },
  contact: { component: SectionsContactSection },
  tracker: { component: SectionsTrackerSection },
}

const { sections } = useAppConfig()
const { siteUrl } = useRuntimeConfig().public
const ids = useSchemaIds()

const [{ data: site }, { data: lists }] = await Promise.all([
  useSite(),
  useAsyncData('home-schema', () => Promise.all([
    queryCollection('projects').order('order', 'ASC').all(),
    queryCollection('contributions').order('order', 'ASC').all(),
    queryCollection('faq').order('order', 'ASC').all(),
  ])),
])

usePageSeo(() => site.value && {
  title: site.value.title,
  description: site.value.description,
  schemaType: ['WebPage', 'AboutPage'],
  nodes: () => {
    const [projects = [], contributions = [], faq = []] = lists.value ?? []
    return [
      {
        '@type': 'ItemList',
        '@id': `${siteUrl}/#projects`,
        'name': 'Projects & experiments',
        'itemListElement': [...projects, ...contributions].map((item, i) => ({
          '@type': 'ListItem',
          'position': i + 1,
          'item': {
            '@type': 'CreativeWork',
            'name': item.title,
            'description': item.body,
            ...(item.link ? { url: item.link.href } : {}),
            'creator': { '@id': ids.person },
          },
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/#faq`,
        'mainEntity': faq.map(f => ({
          '@type': 'Question',
          'name': f.question,
          'acceptedAnswer': { '@type': 'Answer', 'text': f.answer },
        })),
      },
    ]
  },
})
</script>

<template>
  <div>
    <!-- Keep a single root element (no comments beside it): the page <Transition> needs one node to animate -->
    <component :is="registry[name].component" v-for="name in sections" :key="name" v-bind="registry[name].props" />
  </div>
</template>
