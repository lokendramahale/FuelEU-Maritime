import type { PropsWithChildren } from 'react'

export default function UICard({ children }: PropsWithChildren<unknown>) {
  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
      {children}
    </div>
  )
}
