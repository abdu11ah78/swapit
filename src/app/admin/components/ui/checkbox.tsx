import type React from "react"
export function Checkbox(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="checkbox" className="w-4 h-4 rounded accent-primary cursor-pointer" {...props} />
}
