export default function AdminTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs" style={{ color: "var(--text-muted)" }}>
        {label}
      </label>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--gold-border)]"
        style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text)" }}
      />
    </div>
  );
}
