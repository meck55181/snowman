import { Suspense } from "react";
import SubmitForm from "./SubmitForm";

type SubmitPageProps = {
  searchParams?: { ref?: string };
};

export default function SubmitPage({ searchParams }: SubmitPageProps) {
  const refFromQuery = (searchParams?.ref ?? "").toLowerCase();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-6 py-12">
      <Suspense fallback={<div>Loading...</div>}>
        <SubmitForm initialRef={refFromQuery} />
      </Suspense>
    </main>
  );
}

