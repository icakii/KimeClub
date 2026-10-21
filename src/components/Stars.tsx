// Five stars, filled up to `value` (halves rounded for averages). With
// `onChange` the stars become buttons for giving a grade.
export function Stars({
  value,
  onChange,
  size = 'h-5 w-5',
  label,
}: {
  value: number
  onChange?: (stars: number) => void
  size?: string
  label?: string
}) {
  const rounded = Math.round(value * 2) / 2
  return (
    <span className="inline-flex items-center gap-0.5" role={onChange ? 'radiogroup' : 'img'} aria-label={label ?? `${value}/5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = rounded >= n ? 1 : rounded >= n - 0.5 ? 0.5 : 0
        const star = (
          <svg viewBox="0 0 24 24" className={size} aria-hidden="true">
            <defs>
              <linearGradient id={`star-${n}-${fill}`}>
                <stop offset={`${fill * 100}%`} stopColor="var(--color-kin)" />
                <stop offset={`${fill * 100}%`} stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"
              fill={`url(#star-${n}-${fill})`}
              stroke="var(--color-gold)"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        )
        return onChange ? (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n}/5`}
            onClick={() => onChange(n)}
            className="rounded-md p-0.5 transition-transform hover:scale-110 active:scale-95"
          >
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        )
      })}
    </span>
  )
}
