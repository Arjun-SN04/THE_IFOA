import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

// Back buttons return to whichever page the visitor came from. React Router
// keeps its own history index in history.state; 0 means this page was opened
// directly (new tab, shared link, search result), so go to `fallback` instead
// of leaving the site.
export function useGoBack(fallback = '/') {
  const navigate = useNavigate()
  return useCallback(() => {
    if ((window.history.state?.idx ?? 0) > 0) navigate(-1)
    else navigate(fallback)
  }, [navigate, fallback])
}
