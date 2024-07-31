"use client";
import React, { useEffect, useMemo, useState } from "react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/table";
import { Pagination } from "@nextui-org/pagination";
import { getRecords } from "@/app/api/operations";
import { Spinner } from "@nextui-org/spinner";

interface Record {
  id: number;
  amount: number;
  userBalance: number;
  operationResponse: string;
  label: string;
  operation: {
    id: number;
    label: string;
  }
}

export default function RecordClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const rowsPerPage = 10;

  const [totalPages, setTotalPages] = useState(0);


  useMemo(() => {
    const fetchRecords = async () => {
        const result = await getRecords(page,rowsPerPage);
        const flattenedRecords = result.content.map((rcrd:Record) => {
          rcrd.label = rcrd.operation.label
          return rcrd;
        });
        setRecords(flattenedRecords);
        setTotalPages(result.totalPages)
        setRecords(flattenedRecords);
        setIsLoading(false);
      };
      fetchRecords();
    }, 
    [setRecords,setPage,page]
  );

  return (
    <>
    {children}   
    <div className="md:container md:mx-auto flex min-h-screen justify-center items-center">
      <div className="flex flex-col w-full gap-4">
        <h1 className="text-4xl font-bold">Client records</h1>
        <Table
          aria-label="Records Client"
          bottomContent={
            totalPages > 0 ? (
              <div className="flex w-full justify-center flex-wrap gap-4 items-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  size="lg"
                  color="primary"
                  variant="bordered"
                  page={page}
                  total={totalPages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn className="bg-indigo-500 text-2xl" key="id">
              Id
            </TableColumn>
            <TableColumn className="bg-indigo-500 text-2xl" key="label">
              Label
            </TableColumn>
            <TableColumn className="bg-indigo-500 text-2xl" key="amount">
              Amount
            </TableColumn>
            <TableColumn className="bg-indigo-500 text-2xl" key="userBalance">
              User Balance
            </TableColumn>
            <TableColumn className="bg-indigo-500 text-2xl" key="operationResponse">
              Operation Response
            </TableColumn>
          </TableHeader>
          <TableBody
            items={records ?? []}
            loadingContent={<Spinner />}
            loadingState={isLoading ? "loading" : "idle"}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
    </>
  );
}
