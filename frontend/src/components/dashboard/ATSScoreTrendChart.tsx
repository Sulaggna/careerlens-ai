interface DataPoint {
  label: string
  value: number
}

interface ATSScoreTrendChartProps {
  data: DataPoint[]
}

export default function ATSScoreTrendChart({ data }: ATSScoreTrendChartProps) {
  const width = 400
  const height = 180
  const padding = { top: 20, right: 20, bottom: 30, left: 40 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const maxVal = 100
  const minVal = Math.min(...data.map((d) => d.value)) - 10

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW
    const y = padding.top + chartH - ((d.value - minVal) / (maxVal - minVal)) * chartH
    return { x, y, ...d }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="ats-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 25, 50, 75, 100].map((tick) => {
          const y = padding.top + chartH - ((tick - minVal) / (maxVal - minVal)) * chartH
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="currentColor"
                className="text-border"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-muted text-[10px]"
              >
                {tick}
              </text>
            </g>
          )
        })}

        <path d={areaPath} fill="url(#ats-gradient)" />
        <path
          d={linePath}
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r="4" fill="#0EA5E9" stroke="white" strokeWidth="2" className="dark:stroke-card" />
            <text
              x={p.x}
              y={height - 8}
              textAnchor="middle"
              className="fill-muted text-[10px]"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
