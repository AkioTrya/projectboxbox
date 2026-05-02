import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "ProjectBoxbox",
  description: "F1 Telemetry Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-pit-black text-f1-white min-h-screen font-body">
        <nav className="text-f1-red font-display tracking-widest transition-colors">
          <span className="text-f1-red font-display tracking-widest text-sm border-b-2 border-f1-red">
            BOXBOX
          </span>
          <Link href="/" className="text-f1-gray hover:text-f1-white text-sm transition-colors">
            Home
          </Link>
          <Link href="/dashboard" className="text-f1-gray hover:text-f1-white text-sm transition-colors">
            Dashboard
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}