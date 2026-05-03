import React from "react";
import "./globals.css";
import Navbar from "./components/Navbar";

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
      <body className="bg-pit-black text-f1-white h-screen flex flex-col overflow-hidden font-body">
        <Navbar />
        {children}
      </body>
    </html>
  );
}