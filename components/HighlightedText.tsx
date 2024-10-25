interface HighlightedTextProps {
  children: React.ReactNode
  className?: string
  highlightClass?: string
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({
  children,
  className = "",
  highlightClass = "bg-highlight opacity-60",
}) => {
  return (
    <span className={`relative inline-block ${className}`}>
      <span
        className={`absolute inset-x-0 bottom-0 h-3/5 ${highlightClass} transform -skew-y-3 rounded-sm`}
      />
      <span className="relative z-10">{children}</span>
    </span>
  )
}
