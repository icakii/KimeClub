import { useTranslation } from 'react-i18next'
import { PhoneFrame, PhoneTabs } from './PhoneFrame'
import { Reveal, SectionHeading } from './Section'

const POINTS = ['entries', 'results', 'medals'] as const
const POINT_DOTS = ['bg-ai-soft', 'bg-aka', 'bg-kin']

export function CompetitionsShowcase() {
  const { t } = useTranslation()

  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <div className="order-2 lg:order-1">
          <PhoneFrame glow="aka" tilt={-1}>
            <div className="px-5 pb-4 pt-10">
              <p className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
                {t('competitionsShowcase.mock.title')}
              </p>

              <div className="mt-4 rounded-xl bg-linear-to-br from-kin to-gold p-4 text-shiro shadow-md">
                <div className="flex items-center justify-between">
                  <p className="font-display text-sm font-semibold uppercase tracking-wide">
                    {t('competitionsShowcase.mock.eventName')}
                  </p>
                  <span className="text-2xl">🥇</span>
                </div>
                <p className="text-[11px] text-shiro/80">{t('competitionsShowcase.mock.eventDate')}</p>
                <p className="mt-2 inline-block rounded-full bg-shiro/20 px-2 py-0.5 text-[11px] font-semibold">
                  {t('competitionsShowcase.mock.placement')}
                </p>
              </div>

              <div className="mt-3 rounded-xl border border-line bg-shiro p-4">
                <div className="flex items-center justify-between">
                  <p className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
                    {t('competitionsShowcase.mock.eventName2')}
                  </p>
                  <span className="text-2xl">🥉</span>
                </div>
                <p className="text-[11px] text-muted">{t('competitionsShowcase.mock.eventDate2')}</p>
              </div>

              <div className="mt-4 flex items-center justify-around rounded-xl bg-ink py-3 text-center text-shiro">
                <div>
                  <p className="font-display text-lg font-bold text-kin">2</p>
                  <p className="text-[8px] uppercase tracking-wider text-shiro/70">🥇</p>
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-shiro/90">1</p>
                  <p className="text-[8px] uppercase tracking-wider text-shiro/70">🥈</p>
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-sakura">3</p>
                  <p className="text-[8px] uppercase tracking-wider text-shiro/70">🥉</p>
                </div>
              </div>
            </div>
            <PhoneTabs
              tabs={[t('tabs.home'), t('tabs.schedule'), t('tabs.competitions'), t('tabs.profile')]}
              active={2}
            />
          </PhoneFrame>
        </div>

        <div className="order-1 lg:order-2">
          <SectionHeading kanji="勝" title={t('competitionsShowcase.title')} align="left" tone="kin" />
          <Reveal delay={0.15}>
            <p className="mt-6 text-lg leading-relaxed text-muted">{t('competitionsShowcase.body')}</p>
          </Reveal>
          <ul className="mt-8 space-y-4">
            {POINTS.map((key, i) => (
              <Reveal key={key} delay={0.2 + i * 0.08} y={16}>
                <li className="flex items-start gap-4 rounded-xl border border-ink/10 bg-shiro/90 px-4 py-3">
                  <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${POINT_DOTS[i]}`} />
                  <span className="text-sm text-ink/80">{t(`competitionsShowcase.points.${key}`)}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
