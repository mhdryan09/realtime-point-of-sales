import { ReactNode } from "react";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type DataTableProps = {
  header: string[];
  data: (string | ReactNode)[][];
  isLoading?: boolean;
};

export default function DataTable({ header, data, isLoading }: DataTableProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      <Card className="p-0">
        <Table className="w-full overflow-hidden rounded-lg">
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              {header.map((column) => (
                <TableHead key={`th-${column}`} className="px-6 py-3">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* data */}
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={`tr-${rowIndex}`}>
                {row.map((column, columnIndex) => (
                  <TableCell
                    key={`tc-${rowIndex}-${columnIndex}`}
                    className="px-6 py-3"
                  >
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {/* data tidak ada dan sudah selesai loading */}
            {data?.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={header.length} className="h-24 text-center">
                  No Result Data
                </TableCell>
              </TableRow>
            )}

            {/* ketika sedang loading */}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={header.length} className="h-24 text-center">
                  Loading
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
