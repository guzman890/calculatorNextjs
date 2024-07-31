"use client";
import { useRouter } from "next/navigation";

export default function BackClient() {
  const router = useRouter();

  return <button className="bg-emerald-700 rounded px-2" onClick={() => router.back()}>Back</button>;
}