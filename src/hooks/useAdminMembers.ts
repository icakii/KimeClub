import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export interface AdminMember {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  role: 'owner' | 'coach' | 'student'
  status: 'active' | 'trial' | 'paused' | 'left'
  group_id: string | null
  monthly_fee_cents: number | null
  birth_year: number | null
  guardian_first_name: string | null
  guardian_last_name: string | null
  guardian_phone: string | null
  guardian_email: string | null
  photo_path: string | null
  belt: { id: string; rank: number; name_bg: string; name_en: string; color_hex: string } | null
}

// Club staff see their own club's members. They can update contact details,
// parent info and the photo (via the update_member_contact/set_member_photo
// functions); adding members, belts, groups, fees and logins stay in the Hub.
export function useAdminMembers(clubId: string | undefined) {
  return useQuery({
    queryKey: ['admin-members', clubId],
    queryFn: async (): Promise<AdminMember[]> => {
      const { data, error } = await supabase
        .from('members')
        .select(
          'id, full_name, email, phone, role, status, group_id, monthly_fee_cents, birth_year, guardian_first_name, guardian_last_name, guardian_phone, guardian_email, photo_path, belt:belts(id, rank, name_bg, name_en, color_hex)',
        )
        .eq('club_id', clubId as string)
        .order('full_name')
      if (error) throw error
      return data as unknown as AdminMember[]
    },
    enabled: !!clubId,
  })
}

export interface MemberContact {
  email: string
  phone: string
  guardian_first_name: string
  guardian_last_name: string
  guardian_phone: string
  guardian_email: string
}

export function useUpdateMemberContact(clubId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ memberId, contact }: { memberId: string; contact: MemberContact }) => {
      const { error } = await supabase.rpc('update_member_contact', {
        p_member_id: memberId,
        p_email: contact.email,
        p_phone: contact.phone,
        p_guardian_first_name: contact.guardian_first_name,
        p_guardian_last_name: contact.guardian_last_name,
        p_guardian_phone: contact.guardian_phone,
        p_guardian_email: contact.guardian_email,
      })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-members', clubId] }),
  })
}

// Downscale to a 512px JPEG in the browser: keeps uploads small and drops
// EXIF data (location etc.) from phone photos.
async function toSmallJpeg(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not read image'))), 'image/jpeg', 0.85),
  )
}

export function useUploadMemberPhoto(clubId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ memberId, file, oldPath }: { memberId: string; file: File; oldPath: string | null }) => {
      const blob = await toSmallJpeg(file)
      const path = `${clubId}/${memberId}/${Date.now()}.jpg`
      const { error } = await supabase.storage
        .from('member-photos')
        .upload(path, blob, { contentType: 'image/jpeg' })
      if (error) throw error
      const { error: rpcError } = await supabase.rpc('set_member_photo', { p_member_id: memberId, p_path: path })
      if (rpcError) throw rpcError
      if (oldPath) await supabase.storage.from('member-photos').remove([oldPath])
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-members', clubId] }),
  })
}

// Photos live in a private bucket; read them through a short-lived URL.
export function usePhotoUrl(path: string | null | undefined) {
  return useQuery({
    queryKey: ['photo-url', path],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from('member-photos').createSignedUrl(path as string, 3600)
      if (error) throw error
      return data.signedUrl
    },
    enabled: !!path,
    staleTime: 50 * 60 * 1000,
  })
}
