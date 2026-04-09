import "./globals.css";

export const metadata = {
  title: "SchoolCounselor.ai",
  description: "AI-assisted class credit checker for students and advisors.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
