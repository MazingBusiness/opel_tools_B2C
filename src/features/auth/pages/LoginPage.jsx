import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUiStore } from '../../../app/store/useUiStore'

/** Deep-link entry: open auth modal and return home. */
export default function LoginPage() {
  const navigate = useNavigate()
  const openAuthModal = useUiStore((s) => s.openAuthModal)

  useEffect(() => {
    openAuthModal()
    navigate('/', { replace: true })
  }, [navigate, openAuthModal])

  return null
}
