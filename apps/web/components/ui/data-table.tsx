'use client';
import * as XLSX from 'xlsx';

import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { ChevronDown, Search, Download } from 'lucide-react';
import { Input } from './input';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  basePath?: string;
  idKey?: string;
  disablePagination?: boolean;
  exportFileName?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  basePath,
  idKey,
  disablePagination = false,
  exportFileName,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleExportExcel = () => {
    if (!exportFileName) return;

    // Get header keys from columns (excluding actions column)
    const headerIds = columns
      .map(c => c.id || (c as any).accessorKey)
      .filter((id): id is string => !!id && id !== 'actions');

    // Build array of plain objects for xlsx
    const worksheetData = table.getFilteredRowModel().rows.map(row => {
      const obj: Record<string, string> = {};
      headerIds.forEach(header => {
        let value = (row.original as any)[header];
        if (typeof value === 'object' && value !== null) {
          if (Array.isArray(value)) value = `[${value.length} items]`;
          else value = JSON.stringify(value);
        }
        obj[header] = String(value ?? '');
      });
      return obj;
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData, { header: headerIds });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Export');
    XLSX.writeFile(workbook, `${exportFileName}.xlsx`);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        {/* Search */}
        {searchKey && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={
                (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
              }
              onChange={event =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="pl-10"
            />
          </div>
        )}

        {/* Actions Container */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Export Button */}
          {exportFileName && (
            <Button
              variant="outline"
              size="lg"
              onClick={handleExportExcel}
              className="bg-[#20212b] border border-slate-700/50 text-slate-300 hover:bg-emerald-600/20 hover:text-emerald-400 hover:border-emerald-600/50 px-4 py-2 text-[1.4rem] transition-all"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
          )}

          {/* Column visibility toggle */}
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-[#20212b] border border-slate-700/50 text-slate-300 hover:bg-[#30313b] hover:text-white px-4 py-2 text-[1.4rem]"
            >
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted shadow-md">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => {
                console.log(row.original);
                return (
                  <TableRow
                    key={row.id}
                    className="h-[4rem] cursor-pointer hover:bg-[#404040] hover:shadow-md hover:shadow-slate-900 border-b-2 border-b-gray-700"
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={() => {
                      if (basePath && idKey) {
                        const id = (row.original as any)[idKey];
                        if (id) {
                          router.push(`${basePath}/${id}`);
                        }
                      }
                    }}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!disablePagination && (
        <div className="flex items-center justify-between px-2 text-[1.4rem] text-slate-300 mt-4">
        <div className="flex-1 text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length > 0 ? (
            <>
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </>
          ) : (
            <>Total {table.getFilteredRowModel().rows.length} rows</>
          )}
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-3">
            <p className="font-medium text-[1.4rem]">Rows per page</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              className="h-10 w-[80px] rounded-md border border-slate-700 bg-[#20212b] px-3 py-1 text-[1.4rem] focus:outline-none focus:ring-1 focus:ring-green-500 cursor-pointer appearance-none"
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-[120px] items-center justify-center font-medium text-[1.4rem]">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-10 w-10 p-0 bg-[#404040] text-foreground border-slate-700 hover:bg-[#505050]"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              {'<<'}
            </Button>
            <Button
              variant="outline"
              className="h-10 w-10 p-0 bg-[#404040] text-foreground border-slate-700 hover:bg-[#505050]"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              {'<'}
            </Button>
            <Button
              variant="outline"
              className="h-10 w-10 p-0 bg-[#404040] text-foreground border-slate-700 hover:bg-[#505050]"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              {'>'}
            </Button>
            <Button
              variant="outline"
              className="h-10 w-10 p-0 bg-[#404040] text-foreground border-slate-700 hover:bg-[#505050]"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              {'>>'}
            </Button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
