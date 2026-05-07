"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { getCollegeMode, submitStudentVerification } from "@/shared/api/college.api";

export default function CollegeModePage() {
  const queryClient = useQueryClient();
  const [collegeName, setCollegeName] = useState("");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [studentId, setStudentId] = useState<File | null>(null);

  const { data } = useQuery({ queryKey: ["collegeMode"], queryFn: getCollegeMode, retry: false });
  const mutation = useMutation({
    mutationFn: submitStudentVerification,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["collegeMode"] }),
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const form = new FormData();
    form.append("college_name", collegeName);
    form.append("college_email", collegeEmail);
    if (studentId) form.append("student_id_image", studentId);
    mutation.mutate(form);
  };

  const status = data?.verification_status ?? "not_submitted";
  const verified = status === "approved";

  return (
    <main className="min-h-[100dvh] bg-[#FFF8F1] px-4 py-5 text-[#2D2424]">
      <div className="mx-auto max-w-md">
        <header className="mb-5 rounded-lg border border-[#EADDD2] bg-white p-5">
          <GraduationCap className="mb-4 h-10 w-10 text-[#7A2432]" />
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B78A3B]">College Mode</p>
          <h1 className="mt-1 text-2xl font-semibold">Campus connections with verification</h1>
          <p className="mt-2 text-sm leading-6 text-[#746767]">A slightly brighter space for students, still respectful and safety-first.</p>
        </header>

        {!verified && (
          <form onSubmit={submit} className="mb-5 space-y-3 rounded-lg border border-[#EADDD2] bg-white p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#7A2432]">
              <ShieldCheck className="h-4 w-4" />
              Verification status: {status.replace("_", " ")}
            </div>
            <input value={collegeName} onChange={(event) => setCollegeName(event.target.value)} placeholder="College name" className="h-12 w-full rounded-md border border-[#EADDD2] px-3 text-sm outline-none focus:border-[#7A2432]" />
            <input value={collegeEmail} onChange={(event) => setCollegeEmail(event.target.value)} placeholder="College email" className="h-12 w-full rounded-md border border-[#EADDD2] px-3 text-sm outline-none focus:border-[#7A2432]" />
            <label className="block rounded-md border border-dashed border-[#EADDD2] p-4 text-sm text-[#746767]">
              {studentId ? studentId.name : "Upload student ID"}
              <input type="file" accept="image/*" className="hidden" onChange={(event) => setStudentId(event.target.files?.[0] ?? null)} />
            </label>
            <button className="h-12 w-full rounded-md bg-[#7A2432] font-semibold text-white disabled:opacity-60" disabled={mutation.isPending}>
              {mutation.isPending ? "Submitting..." : "Submit verification"}
            </button>
          </form>
        )}

        <div className="space-y-3">
          {(data?.sections ?? []).map((section) => (
            <div key={section.id} className={`rounded-lg border border-[#EADDD2] bg-white p-4 ${!verified ? "opacity-60" : ""}`}>
              <h2 className="font-semibold">{section.title}</h2>
              <p className="mt-1 text-sm leading-6 text-[#746767]">{section.description}</p>
              {!verified && <p className="mt-2 text-xs font-semibold text-[#B78A3B]">Available after student verification</p>}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
