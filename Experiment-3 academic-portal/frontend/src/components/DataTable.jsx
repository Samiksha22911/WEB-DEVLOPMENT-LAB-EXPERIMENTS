import React from "react";

// Generic table: columns = [{ key, label, render? }]
export default function DataTable({ columns, rows, actions, emptyText = "No records found." }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="th">
                {c.label}
              </th>
            ))}
            {actions && <th className="th text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 && (
            <tr>
              <td className="td text-center text-slate-400" colSpan={columns.length + (actions ? 1 : 0)}>
                {emptyText}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50">
              {columns.map((c) => (
                <td key={c.key} className="td">
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
              {actions && <td className="td text-right">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
