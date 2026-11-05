import "./globals.css";
import { CartProvider } from "../lib/cart-store";
import Chrome from "../components/Chrome";

export const metadata = {
  title: "TERSOO'S WRLD — Tersoo Dzoho, designer & illustrator",
  description:
    "Selected works, prints, and commissions from Tersoo Dzoho — graphic designer & illustrator. The art speaks for itself.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;500;700&family=Caveat:wght@600&display=swap"
          rel="stylesheet"
        />
        <meta name="description" content="Tersoo Dzoho — graphic designer & illustrator. Selected works, prints, commissions." />
      </head>
      <body>
        <CartProvider>
          <Chrome />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
