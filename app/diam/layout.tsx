import './globals.css';
import { DiamanteProvider } from '@/context/DiamanteContext';
import Header from './components/Header';
import Footer from './components/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <DiamanteProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </DiamanteProvider>
      </body>
    </html>
  );
}
