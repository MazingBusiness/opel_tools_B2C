/**
 * @param {{ specs: Array<{ label: string, value: string }> }} props
 */
export default function ProductSpecsTable({ specs }) {
  if (!specs?.length) return null

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-sm">
        <tbody>
          {specs.map((spec, index) => (
            <tr
              key={spec.label}
              className={index % 2 === 0 ? 'bg-surface-muted/50' : 'bg-surface'}
            >
              <th className="w-2/5 px-4 py-3 text-left font-semibold text-ink-muted">
                {spec.label}
              </th>
              <td className="px-4 py-3 text-ink">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
