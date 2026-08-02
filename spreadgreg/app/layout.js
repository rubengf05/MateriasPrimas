import './globals.css';

export const metadata = {
  title: 'Plataforma SpreadGreg',
  description: 'Curvas de futuros, spreads, COT e informes USDA — sin análisis interpretativo.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
