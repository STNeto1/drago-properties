import { ReactNode } from 'react'
import { Navbar } from '~/components/Navbar'

type AdvertisementPageLayoutProps = {
  children: ReactNode | ReactNode[]
}

export default function AdvertisementPageLayout({
  children
}: AdvertisementPageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container sticky top-0 z-40 bg-white">
        <div className="flex h-16 items-center justify-between border-b border-b-slate-200 py-4">
          <Navbar />
          <nav></nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
