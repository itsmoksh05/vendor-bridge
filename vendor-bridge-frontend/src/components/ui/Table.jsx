import React from 'react';
import { Database } from 'lucide-react';

export function Table({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No records found',
}) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#1F2937] bg-[#111827]">
      <table className="w-full border-collapse text-left text-sm text-[#F9FAFB]">
        {/* Table Header */}
        <thead className="bg-[#0A0F1E] border-b border-[#1F2937] text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-4">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-[#1F2937]">
          {loading ? (
            // Skeleton Loader (5 rows, animated pulse)
            Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="animate-pulse">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div className="h-4 bg-[#1F2937] rounded w-2/3" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            // Empty State
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0A0F1E] border border-[#1F2937] text-[#9CA3AF]">
                    <Database className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium text-[#9CA3AF]">
                    {emptyMessage}
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            // Data Rows
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className="hover:bg-white/[0.02] transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm whitespace-nowrap text-[#F9FAFB]">
                    {col.render
                      ? col.render(row[col.key], row)
                      : row[col.key] !== undefined && row[col.key] !== null
                      ? String(row[col.key])
                      : '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
