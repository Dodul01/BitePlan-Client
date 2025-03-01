export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="p-4 pt-0 min-h-screen">{children}</div>
    </div>
  );
}
