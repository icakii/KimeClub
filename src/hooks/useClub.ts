import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export interface CoachBio {
  name: string
  title_bg?: string
  title_en?: string
  bio_bg?: string
  bio_en?: string
  photo_url?: string
}

export interface ClubTheme {
  colors?: { kuro?: string; shiro?: string; aka?: string }
  logo?: string
  hero_bg?: string
  hero_en?: string
  coaches?: CoachBio[]
}

export interface Club {
  id: string
  slug: string
  name: string
  default_locale: 'bg' | 'en'
  theme: ClubTheme
}

async function fetchClub(): Promise<Club> {
  const slugOverride = import.meta.env.VITE_CLUB_SLUG as string | undefined

  if (slugOverride) {
    const { data, error } = await supabase
      .from('clubs')
      .select('id, slug, name, default_locale, theme')
      .eq('slug', slugOverride)
      .single()
    if (error) throw error
    return data
  }

  const { data: domain, error: domainError } = await supabase
    .from('club_domains')
    .select('club_id')
    .eq('hostname', window.location.hostname)
    .single()
  if (domainError) throw domainError

  const { data, error } = await supabase
    .from('clubs')
    .select('id, slug, name, default_locale, theme')
    .eq('id', domain.club_id)
    .single()
  if (error) throw error
  return data
}

export function useClub() {
  return useQuery({
    queryKey: ['club', import.meta.env.VITE_CLUB_SLUG ?? window.location.hostname],
    queryFn: fetchClub,
    staleTime: 5 * 60 * 1000,
  })
}
