import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Testy</h1>
      <p className="text-gray-600">Minimal QA tracker for SCO/POS.</p>
      <Link
        href="/test-cases"
        className="inline-block rounded bg-black px-4 py-2 text-white"
      >
        Go to Test Cases
      </Link>
    </main>
  );
}
