"use client";
import { OperationListClient } from "@/components/operationListClient";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";


export default function OperationsClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <OperationListClient />
    </>
  );
}
