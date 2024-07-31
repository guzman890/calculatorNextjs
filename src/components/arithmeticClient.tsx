"use client";
import { getOperationResult } from "@/app/api/operations";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

export default function ArithmeticClient({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Suspense>
        <ArithmeticForm />
      </Suspense>
    </>
  );
};

export function ArithmeticForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const label = searchParams?.get("label");
  const operationId = searchParams?.get("id");
  const symbol = searchParams?.get("symbol");
  const [result, setResult] = useState("");
  const [firstValue, setFirstValue] = useState(0);
  const [secondValue, setSecondValue] = useState(0);

  const handleCalculate = async () => {
    const resp = await getOperationResult(firstValue, secondValue, operationId);
    setResult(resp.operationResponse);
  };

  return (
    <div className="md:container md:mx-auto flex min-h-screen justify-center items-center ">
      <div className="flex flex-col w-full gap-4">
        <h1 className="text-4xl font-bold">Arithmetic {label} </h1>
        {operationId === "6" ? null : (             
          <div className="flex justify-center items-center center ">
            <input
              id="first"
              name="first"
              type="number"
              autoComplete="first"
              value={firstValue}
              onChange={(e) => [
                setFirstValue(Number(e.target.value)),
                setResult(""),
              ]}
              className="flex w-full bg-blue-400 text-center text-2xl justify-center rounded-md px-3 py-5 font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            />
            {operationId === "5" ? null: (
            <>
              <p className="text-2xl px-4 "> {symbol} </p>
              <input
                id="second"
                name="second"
                type="number"
                autoComplete="second"
                value={secondValue}
                onChange={(e) => [
                  setSecondValue(Number(e.target.value)),
                  setResult(""),
                ]}
                className="flex w-full bg-blue-400 text-center text-2xl justify-center rounded-md px-3 py-5 font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />
            </>
            )}
          </div>
        )}
        <button
          className={`w-full text-2xl justify-center rounded-md bg-gray-500 px-3 py-5 font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
            !result ? "hidden" : "flex"
          }`}
        >
          {result}
        </button>
        <button
          onClick={handleCalculate}
          className="flex w-full text-2xl justify-center rounded-md bg-indigo-600 px-3 py-5 font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {operationId === "6"  ? "Generate String" : "Calculate"}
        </button>
        <Link
          href={{
            pathname: "/operations",
            query: { isNewOperation: true },
          }}
        >
          <button className="flex w-full text-2xl justify-center rounded-md bg-indigo-600 px-3 py-5 font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            New Operation
          </button>
        </Link>
      </div>
    </div>
  );
}
