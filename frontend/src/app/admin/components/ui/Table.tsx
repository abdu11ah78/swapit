import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface TableProps {
  children: ReactNode
  className?: string
}

interface TableHeaderProps {
  children: ReactNode
}

interface TableRowProps {
  children: ReactNode
  className?: string
}

interface TableCellProps {
  children: ReactNode
  className?: string
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full", className)}>{children}</table>
    </div>
  )
}

export function TableHead({ children }: TableHeaderProps) {
  return <thead className="bg-secondary border-b border-border">{children}</thead>
}

export function TableBody({ children }: TableProps) {
  return <tbody className="divide-y divide-border">{children}</tbody>
}

export function TableRow({ children, className }: TableRowProps) {
  return <tr className={cn("hover:bg-secondary/50 transition-colors", className)}>{children}</tr>
}

export function TableCell({ children, className }: TableCellProps) {
  return <td className={cn("px-4 py-3 text-sm text-foreground", className)}>{children}</td>
}

export function TableHeader({ children, className }: TableCellProps) {
  return <th className={cn("px-4 py-3 text-left text-xs font-semibold text-foreground", className)}>{children}</th>
}
