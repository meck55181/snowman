import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-8 px-6 py-12 text-center">
      <div className="space-y-4">
        <p className="rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
          Welcome to Year-End Recap Network
        </p>
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
          Map how your year-end recaps connect.
        </h1>
        <p className="text-lg text-slate-600">
          Submit a recap, credit who recommended you, and see the network graph.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/submit"
          className="rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Write a note
        </Link>
        <Link
          href="/board"
          className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          View the board
        </Link>
      </div>
    </main>
  );
}

