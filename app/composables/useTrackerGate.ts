/** Shared open/closed state for the private tracker section. */
export function useTrackerGate() {
  const isOpen = useState('tracker-open', () => false)
  const open = () => { isOpen.value = true }
  return { isOpen, open }
}
