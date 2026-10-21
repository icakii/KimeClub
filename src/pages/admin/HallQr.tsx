import QRCode from 'qrcode'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/app/ui'
import { Emblem } from '../../components/landing/Emblem'
import { useCheckinToken, useRotateCheckinToken } from '../../hooks/useCheckin'
import { useClub } from '../../hooks/useClub'

// The code that hangs in the hall. Students scan it with their phone camera
// and get marked present for the class that is on. Print it, or show it on a
// tablet by the door.
export function HallQr() {
  const { t } = useTranslation()
  const { data: club } = useClub()
  const { data: token, isError } = useCheckinToken(club?.id, !!club?.qr_checkin_enabled)
  const rotate = useRotateCheckinToken(club?.id)
  const [image, setImage] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const url = token ? `${window.location.origin}/checkin/${token}` : null

  useEffect(() => {
    if (!url) return
    QRCode.toDataURL(url, { width: 640, margin: 1, errorCorrectionLevel: 'M', color: { dark: '#1f1b16', light: '#ffffff' } }).then(
      setImage,
    )
  }, [url])

  if (!club) return null

  return (
    <div className="px-5 py-6">
      <div className="print:hidden">
        <PageHeader kanji="門" title={t('admin.qr.title')} tone="bg-jade" />
        <p className="mt-2 max-w-xl text-sm text-muted">{t('admin.qr.note')}</p>
      </div>

      {isError && <p className="mt-6 rounded-xl bg-aka/10 p-4 text-sm text-aka-text">{t('admin.qr.error')}</p>}

      {/* The poster: this is the only thing that prints. */}
      <div className="qr-poster mx-auto mt-6 max-w-sm rounded-3xl border border-ink/10 bg-white p-6 text-center shadow-[0_24px_48px_-32px_rgba(31,27,22,0.6)]">
        <div className="flex items-center justify-center gap-2">
          <Emblem className="h-10 w-10" />
          <p className="font-display text-lg font-semibold uppercase tracking-[0.25em] text-ink">{club.name}</p>
        </div>
        <p className="mt-4 font-display text-2xl font-bold uppercase tracking-wide text-ink">{t('admin.qr.posterTitle')}</p>
        <div className="mx-auto mt-4 aspect-square w-full max-w-72 rounded-2xl bg-white p-2 ring-4 ring-aka">
          {image ? <img src={image} alt={t('admin.qr.alt')} className="h-full w-full" /> : <div className="h-full w-full animate-pulse rounded-xl bg-ink/5" />}
        </div>
        <p className="mt-4 text-sm text-muted">{t('admin.qr.posterSteps')}</p>
      </div>

      <div className="mx-auto mt-5 flex max-w-sm flex-col gap-2 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          disabled={!image}
          className="min-h-12 rounded-xl bg-ink font-display text-sm uppercase tracking-wide text-shiro transition-colors hover:bg-aka disabled:opacity-50"
        >
          {t('admin.qr.print')}
        </button>
        {confirming ? (
          <div className="rounded-xl border border-aka/30 bg-aka/5 p-3 text-sm text-ink">
            <p>{t('admin.qr.rotateWarning')}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setConfirming(false)} className="min-h-11 rounded-lg border border-ink/15 font-display text-xs uppercase text-muted">
                {t('admin.edit.cancel')}
              </button>
              <button
                type="button"
                onClick={async () => {
                  await rotate.mutateAsync()
                  setConfirming(false)
                }}
                className="min-h-11 rounded-lg bg-aka font-display text-xs uppercase text-shiro"
              >
                {rotate.isPending ? '...' : t('admin.qr.rotateConfirm')}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="min-h-11 rounded-xl border border-ink/15 font-display text-xs uppercase tracking-wide text-muted hover:text-aka-text"
          >
            {t('admin.qr.rotate')}
          </button>
        )}
      </div>
    </div>
  )
}
