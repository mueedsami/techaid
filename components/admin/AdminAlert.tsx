export default function AdminAlert({
  type,
  text,
}: {
  type: "success" | "error";
  text: string;
}) {
  const style =
    type === "success"
      ? {
          borderColor: "rgba(16,185,129,0.22)",
          background: "rgba(16,185,129,0.08)",
          color: "#065f46",
        }
      : {
          borderColor: "rgba(239,68,68,0.22)",
          background: "rgba(239,68,68,0.08)",
          color: "#991b1b",
        };

  return (
    <div className="mb-4 rounded-xl border px-4 py-3 text-sm" style={style}>
      {text}
    </div>
  );
}
