import "./globals.css";

export const metadata = {
  title: "JILLS EFFECTS | Santhoshkumar – VFX Artist, Video Editor & 3D Designer",
  description:
    "Portfolio of Santhoshkumar – VFX Artist, Video Editor and 3D Designer. Explore Graphic Design, 3D Design and Video projects.",
  keywords: [
    "VFX artist",
    "video editor",
    "3D designer",
    "Santhoshkumar",
    "Jills Effects",
    "motion graphics",
    "compositing",
    "Maya",
    "Nuke",
  ],
  authors: [{ name: "Santhoshkumar" }],
  openGraph: {
    title: "JILLS EFFECTS | Santhoshkumar – VFX Artist, Video Editor & 3D Designer",
    description:
      "Portfolio of Santhoshkumar – VFX Artist, Video Editor and 3D Designer. Explore Graphic Design, 3D Design and Video projects.",
    type: "website",
    siteName: "JILLS EFFECTS",
    images: ["/profile.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "JILLS EFFECTS | Santhoshkumar",
    description:
      "VFX Artist, Video Editor and 3D Designer. Graphic Design, 3D Design and Video projects.",
    images: ["/profile.jpg"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export const viewport = {
  themeColor: "#040206",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="stage" aria-hidden="true" />
        <div className="floor" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
