import { useTranslation } from 'react-i18next'
import { useBelts } from '../../hooks/useBelts'
import { useInView } from '../../hooks/useInView'

const DARK_TEXT_BELTS = new Set(['white', 'yellow', 'orange', 'green'])

function beltTextColor(nameEn: string, hex: string): string {
  const key = nameEn.toLowerCase()
  if (DARK_TEXT_BELTS.has(key)) return '#111114'
  if (['blue', 'brown', 'black'].includes(key)) return '#f6f3ec'

  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#111114' : '#f6f3ec'
}

export function BeltLadder({ clubId }: { clubId: string | undefined }) {
  const { t, i18n } = useTranslation()
  const { data: belts } = useBelts(clubId)
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-2xl uppercase tracking-wide sm:text-3xl">
          {t('beltLadder.title')}
        </h2>

        <div ref={ref} className="mt-10 flex flex-wrap justify-center gap-3">
          {belts?.map((belt, index) => (
            <span
              key={belt.id}
              className={`belt-chip rounded-full border border-line/60 px-5 py-2.5 font-display text-xs uppercase tracking-wide sm:text-sm ${
                inView ? 'is-visible' : ''
              }`}
              style={{
                background: belt.color_hex,
                color: beltTextColor(belt.name_en, belt.color_hex),
                transitionDelay: `${index * 60}ms`,
              }}
            >
              {i18n.resolvedLanguage === 'en' ? belt.name_en : belt.name_bg}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
