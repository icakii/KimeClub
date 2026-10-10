import { useTranslation } from 'react-i18next'
import { BeltChip } from '../BeltChip'
import { PaymentStatusChip } from '../PaymentStatusChip'
import { PhoneFrame, PhoneTabs } from './PhoneFrame'
import { Reveal, SectionHeading } from './Section'

const EXAMPLE_BELT = {
  id: 'example',
  rank: 3,
  name_bg: 'Зелено',
  name_en: 'Green',
  color_hex: '#2e9e5b',
  color2_hex: null,
  grade_bg: '6 кю',
  grade_en: '6th kyu',
}

const POINTS = ['belt', 'payments', 'calendar', 'offline'] as const
const POINT_DOTS = ['bg-jade', 'bg-aka', 'bg-ai-soft', 'bg-kin']

export function AppShowcase() {
  const { t } = useTranslation()
  const weekdaysShort = t('schedule.weekdaysShort', { returnObjects: true }) as string[]

  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <SectionHeading kanji="技" title={t('appShowcase.title')} align="left" tone="jade" />
          <Reveal delay={0.15}>
            <p className="mt-6 text-lg leading-relaxed text-muted">{t('appShowcase.body')}</p>
          </Reveal>
          <ul className="mt-8 space-y-4">
            {POINTS.map((key, i) => (
              <Reveal key={key} delay={0.2 + i * 0.08} y={16}>
                <li className="flex items-start gap-4 rounded-xl border border-ink/10 bg-shiro/90 px-4 py-3">
                  <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${POINT_DOTS[i]}`} />
                  <span className="text-sm text-ink/80">{t(`appShowcase.points.${key}`)}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        <PhoneFrame glow="jade">
          <div className="px-5 pb-4 pt-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Kime · 極</p>
            <p className="mt-1 font-display text-xl font-semibold uppercase tracking-wide text-ink">
              {t('appShowcase.mock.greeting')}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <BeltChip belt={EXAMPLE_BELT} showLabel={false} />
              <PaymentStatusChip status="paid" />
            </div>

            <div className="mt-5 overflow-hidden rounded-xl bg-ai p-4 text-shiro">
              <p className="text-[9px] uppercase tracking-[0.2em] text-shiro/70">
                {t('appShowcase.mock.nextClass')}
              </p>
              <p className="mt-1 font-display text-lg font-semibold uppercase tracking-wide">
                {t('appShowcase.mock.className')}
              </p>
              <p className="text-xs text-shiro/80">{t('appShowcase.mock.classTime')}</p>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1 text-center">
              {weekdaysShort.map((d, i) => (
                <div key={d} className="flex flex-col items-center gap-1">
                  <span className="text-[8px] uppercase text-muted">{d}</span>
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${
                      i === 3 ? 'bg-aka text-shiro' : 'text-ink'
                    }`}
                  >
                    {10 + i}
                  </span>
                  <span
                    className={`h-1 w-1 rounded-full ${[0, 3, 5].includes(i) ? 'bg-kin' : 'bg-transparent'}`}
                  />
                </div>
              ))}
            </div>

            <p className="mt-5 text-[9px] uppercase tracking-[0.2em] text-muted">
              {t('appShowcase.mock.inbox')}
            </p>
            <div className="mt-2 space-y-2">
              <div className="flex gap-3 rounded-xl border border-line bg-shiro p-3">
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-aka" />
                <div>
                  <p className="text-[11px] font-semibold text-ink">{t('appShowcase.mock.msg1Title')}</p>
                  <p className="text-[10px] text-muted">{t('appShowcase.mock.msg1Body')}</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-xl border border-line bg-shiro p-3">
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-jade" />
                <div>
                  <p className="text-[11px] font-semibold text-ink">{t('appShowcase.mock.msg2Title')}</p>
                  <p className="text-[10px] text-muted">{t('appShowcase.mock.msg2Body')}</p>
                </div>
              </div>
            </div>
          </div>
          <PhoneTabs
            tabs={[t('tabs.home'), t('tabs.schedule'), t('tabs.payments'), t('tabs.profile')]}
            active={0}
          />
        </PhoneFrame>
      </div>
    </section>
  )
}
