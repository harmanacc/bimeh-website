"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Minus, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LeadData {
  [key: string]: string;
}

interface LeadPreviewTableProps {
  data: LeadData[];
  columns: string[];
  onDataChange: (data: LeadData[]) => void;
}

const columnMappings: { [key: string]: string } = {
  // firstName
  نام: "firstName",
  اسم: "firstName",
  name: "firstName",
  firstName: "firstName",
  first_name: "firstName",
  // lastName
  "نام خانوادگی": "lastName",
  فامیلی: "lastName",
  surname: "lastName",
  lastName: "lastName",
  last_name: "lastName",
  // phone
  تلفن: "phone",
  شماره: "phone",
  phone: "phone",
  "شماره تلفن": "phone",
  phone_number: "phone",
  // insuranceType
  "نوع بیمه": "insuranceType",
  insuranceType: "insuranceType",
  insurance_type: "insuranceType",
};

export default function LeadPreviewTable({
  data,
  columns,
  onDataChange,
}: LeadPreviewTableProps) {
  const [localData, setLocalData] = useState(data);
  const [localColumns, setLocalColumns] = useState(columns);

  const handleCellChange = (
    rowIndex: number,
    column: string,
    value: string
  ) => {
    const newData = [...localData];
    newData[rowIndex] = { ...newData[rowIndex], [column]: value };
    setLocalData(newData);
    onDataChange(newData);
  };

  const addRow = () => {
    const newRow: LeadData = {};
    localColumns.forEach((col) => (newRow[col] = ""));
    const newData = [...localData, newRow];
    setLocalData(newData);
    onDataChange(newData);
  };

  const removeRow = (rowIndex: number) => {
    const newData = localData.filter((_, i) => i !== rowIndex);
    setLocalData(newData);
    onDataChange(newData);
  };

  const addColumn = () => {
    const newColumn = `ستون ${localColumns.length + 1}`;
    const newColumns = [...localColumns, newColumn];
    const newData = localData.map((row) => ({ ...row, [newColumn]: "" }));
    setLocalColumns(newColumns);
    setLocalData(newData);
    onDataChange(newData);
  };

  const removeColumn = (columnIndex: number) => {
    const columnToRemove = localColumns[columnIndex];
    const newColumns = localColumns.filter((_, i) => i !== columnIndex);
    const newData = localData.map((row) => {
      const { [columnToRemove]: _, ...rest } = row;
      return rest;
    });
    setLocalColumns(newColumns);
    setLocalData(newData);
    onDataChange(newData);
  };

  const getValidExamples = (col: string) => {
    const field = columnMappings[col];
    if (!field)
      return "این ستون شناسایی نشد. نام‌های معتبر: نام، اسم، name برای نام";
    const examples = Object.keys(columnMappings).filter(
      (key) => columnMappings[key] === field
    );
    return `نام‌های معتبر: ${examples.join(", ")}`;
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={addRow} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            اضافه کردن ردیف
          </Button>
          <Button onClick={addColumn} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            اضافه کردن ستون
          </Button>
        </div>
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {localColumns.map((col, colIndex) => (
                  <TableHead key={col} className="text-right">
                    <div className="flex items-center justify-between">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span
                            className={
                              columnMappings[col]
                                ? "text-green-600 cursor-help"
                                : "text-red-600 cursor-help"
                            }
                          >
                            {col}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{getValidExamples(col)}</p>
                        </TooltipContent>
                      </Tooltip>
                      <Button
                        onClick={() => removeColumn(colIndex)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-16">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {localColumns.map((col) => (
                    <TableCell key={col}>
                      <Input
                        value={row[col] || ""}
                        onChange={(e) =>
                          handleCellChange(rowIndex, col, e.target.value)
                        }
                        className="h-8"
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button
                      onClick={() => removeRow(rowIndex)}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
}
