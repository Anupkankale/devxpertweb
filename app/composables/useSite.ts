/** Global site settings from `content/site.yml`, shared across components. */
export function useSite() {
  return useAsyncData('site', () => queryCollection('site').first())
}
