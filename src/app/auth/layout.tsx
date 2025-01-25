export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-yellow-400">
      <div>Hello:ABC</div>

      {children}
    </div>
  );
}
