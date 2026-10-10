import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PhoneFrame, PhoneTabs } from './PhoneFrame'
import { Reveal, SectionHeading } from './Section'

const POINTS = ['instant', 'anywhere', 'status'] as const
const POINT_DOTS = ['bg-aka', 'bg-ai-soft', 'bg-jade']

// The demo loop (.pay-* keyframes in index.css) only runs while the phone
// is on screen -- no point animating something nobody's looking at.
function useOnScreen<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.35,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, visible] as const
}

export function PaymentShowcase() {
  const { t } = useTranslation()
  const [ref, visible] = useOnScreen<HTMLDivElement>()

  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <SectionHeading kanji="払" title={t('paymentShowcase.title')} align="left" tone="aka" />
          <Reveal delay={0.15}>
            <p className="mt-6 text-lg leading-relaxed text-muted">{t('paymentShowcase.body')}</p>
          </Reveal>
          <ul className="mt-8 space-y-4">
            {POINTS.map((key, i) => (
              <Reveal key={key} delay={0.2 + i * 0.08} y={16}>
                <li className="flex items-start gap-4 rounded-xl border border-ink/10 bg-shiro/90 px-4 py-3">
                  <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${POINT_DOTS[i]}`} />
                  <span className="text-sm text-ink/80">{t(`paymentShowcase.points.${key}`)}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        <div ref={ref} className={visible ? 'pay-playing' : undefined}>
          <PhoneFrame glow="ai">
            <div className="flex flex-1 flex-col px-5 pb-4 pt-10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                {t('paymentShowcase.mock.label')}
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-ink">
                70.00 <span className="text-base font-semibold text-muted">EUR</span>
              </p>
              <p className="text-xs text-muted">{t('paymentShowcase.mock.period')}</p>

              {/* Card -> check -> seal all share this stage. */}
              <div className="relative mt-6 h-36">
                <div className="pay-card absolute inset-x-1 top-2 rounded-xl bg-linear-to-br from-ai via-ai-soft to-aka p-4 text-shiro opacity-0 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="h-5 w-7 rounded-sm bg-kin/90" />
                    <span className="font-brush text-lg">極</span>
                  </div>
                  <p className="mt-6 whitespace-nowrap font-mono text-xs tracking-[0.15em]">•••• •••• •••• 4242</p>
                  <p className="mt-1 text-[9px] uppercase tracking-wider text-shiro/70">Kime member</p>
                </div>

                <div className="pay-ring absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-jade opacity-0 shadow-[0_0_0_10px_rgba(47,107,79,0.15)]">
                  <svg viewBox="0 0 48 48" className="h-12 w-12">
                    <path
                      className="pay-check opacity-0"
                      d="M12 25 L21 34 L37 15"
                      fill="none"
                      stroke="var(--color-shiro)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <span className="pay-stamp absolute -right-1 bottom-0 rounded-sm border-2 border-aka px-2 py-1 font-display text-sm font-bold uppercase tracking-widest text-aka opacity-0">
                  {t('paymentShowcase.mock.stamp')}
                </span>
              </div>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-line/60">
                {/* Inline transform, not Tailwind's scale-x-0: that sets the
                    separate `scale` property, which would multiply with the
                    keyframes' transform and pin the bar at zero forever. */}
                <div
                  className="pay-progress h-full w-full rounded-full bg-aka"
                  style={{ transform: 'scaleX(0)' }}
                />
              </div>

              <div className="mt-5 rounded-xl bg-aka py-3 text-center font-display text-sm font-semibold uppercase tracking-wider text-shiro shadow-[0_10px_20px_-10px_rgba(194,54,31,0.8)]">
                {t('paymentShowcase.mock.cta')}
              </div>

              <p className="mt-5 text-[9px] uppercase tracking-[0.2em] text-muted">
                {t('paymentShowcase.mock.history')}
              </p>
              <div className="mt-2 divide-y divide-line rounded-xl border border-line bg-shiro">
                {(['sep', 'aug'] as const).map((m) => (
                  <div key={m} className="flex items-center justify-between px-3 py-2.5 text-[11px]">
                    <span className="text-ink">{t(`paymentShowcase.mock.${m}`)}</span>
                    <span className="rounded-full bg-jade/15 px-2 py-0.5 font-semibold text-jade">
                      70.00 EUR ✓
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <PhoneTabs
              tabs={[t('tabs.home'), t('tabs.schedule'), t('tabs.payments'), t('tabs.profile')]}
              active={2}
            />
          </PhoneFrame>
        </div>
      </div>
    </section>
  )
}
