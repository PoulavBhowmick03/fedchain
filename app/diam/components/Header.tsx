import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Diamante Gigs
        </Link>
        <div className="space-x-4">
          <Link href="/diam" className="hover:underline">
            Home
          </Link>
          <Link href="/diam/create-gig" className="hover:underline">
            Create Gig
          </Link>
          <Link href="/diam/gigs" className="hover:underline">
            View Gigs
          </Link>
        </div>
      </nav>
    </header>
  );
}