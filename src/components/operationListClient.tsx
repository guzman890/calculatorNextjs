"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getOperations } from "@/app/api/operations";
import { goRecord } from "@/app/lib/actions";
import { useSearchParams } from "next/navigation";

type Operation = {
  id: number;
  label: string;
  type: string;
  symbol: string;
  cost: number;
};

export function OperationListClient() {
  const searchParams = useSearchParams();
  const [isNewOperation, setIsNewOperation] = useState(
    searchParams?.get("isNewOperation") ?? false
  );
  const [operations, setOperations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const buttonClassNames =
    "flex w-full text-2xl justify-center rounded-md bg-indigo-600 px-3 py-5 font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";

  useEffect(() => {
    const fetchOperations = async () => {
      const result = await getOperations();
      setOperations(result);
      setIsLoading(false);
    };
    fetchOperations();
  }, []);

  const Loading = () => {
    return (
      <div className="md:container md:mx-auto flex min-h-screen justify-center items-center gap-4">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  };

  const List = () => {
    return (
      <div className="md:container md:mx-auto flex min-h-screen justify-center items-center gap-4">
        <div className="flex lg:flex-row flex-col w-full gap-4 px-4">
          <div className="flex flex-col justify-center w-full">
            <button onClick={() => goRecord()} className={buttonClassNames}>
              All Records
            </button>
          </div>
          <div className="flex flex-col w-full gap-4">
            {!isNewOperation ? (
              <button
                onClick={() => setIsNewOperation(true)}
                className={buttonClassNames}
              >
                New Operation
              </button>
            ) : (
              <>
                {operations.map((operation: Operation) => (
                  <Link
                    key={operation.id}
                    href={{
                      pathname: "/operations/arithmetic",
                      query: { ...operation },
                    }}
                  >
                    <button className={buttonClassNames}>
                      {operation.label}
                    </button>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };
  return <>{isLoading ? <Loading /> : <List />}</>;
}
