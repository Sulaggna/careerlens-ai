interface SectionHeaderProps {
  title: string
  description?: string
}

export default function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</h2>
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{description}</p>
      )}
    </div>
  )
}
