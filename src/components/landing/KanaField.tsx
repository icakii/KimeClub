// Real dojo vocabulary, not decorative gibberish: karate, way/do, spirit,
// power, kata, respect, dojo, technique, hard/soft (goju).
const CHARACTERS = ['空', '手', '道', '気', '心', '力', '型', '礼', '場', '技', '柔', '剛']
// Generous count so the auto-fill grid below has enough cells to tile a
// tall page -- excess cells simply don't get placed if the page is
// shorter than this on a given viewport.
const CELL_COUNT = 480
const GRID = Array.from({ length: CELL_COUNT }, (_, i) => CHARACTERS[i % CHARACTERS.length])

export function KanaField() {
  return (
    <div
      className="kana-field pointer-events-none absolute inset-x-0 top-0 -z-10 grid select-none justify-center"
      style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))',
        gridAutoRows: '56px',
        height: '100%',
      }}
      aria-hidden="true"
    >
      {GRID.map((ch, i) => (
        <span
          key={i}
          className={`kana-char kana-char-${i % 10} flex items-center justify-center font-display text-lg`}
        >
          {ch}
        </span>
      ))}
    </div>
  )
}
