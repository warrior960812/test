interface BadgeProps {
  label: string;
  color?: string;
  onRemove?: () => void;
}

export function Badge({ label, color, onRemove }: BadgeProps) {
  return (
    <span className="badge" style={color ? { backgroundColor: color, color: '#fff' } : undefined}>
      {label}
      {onRemove && (
        <button className="badge-remove" onClick={onRemove} aria-label={`Remove ${label}`}>
          ×
        </button>
      )}
    </span>
  );
}
