import { Suspense } from "react";
import SubmitForm from "./SubmitForm";

type SubmitPageProps = {
  searchParams?: { ref?: string };
};

export default function SubmitPage({ searchParams }: SubmitPageProps) {
  const refFromQuery = (searchParams?.ref ?? "").toLowerCase();

  return (
    <div className="fixed inset-0 bg-[#eee] overflow-y-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <SubmitForm initialRef={refFromQuery} />
      </Suspense>
    </div>
  );
}

