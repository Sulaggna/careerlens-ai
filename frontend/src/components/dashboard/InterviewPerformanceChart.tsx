interface BarData {
  label: string
  score: number
  maxScore: number
}

interface InterviewPerformanceChartProps {
  data: BarData[]
}

export default function InterviewPerformanceChart({ data }: InterviewPerformanceChartProps) {
  const maxValue = Math.max(...data.map((d) => d.maxScore))

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const percentage = (item.score / maxValue) * 100
        return (
          <div key={item.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{item.label}</span>
              <span className="text-muted">
                {item.score}/{item.maxScore}
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted-bg">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${percentage}%`,
                  background: 'linear-gradient(90deg, #0EA5E9, #14B8A6)',
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
