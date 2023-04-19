'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { HTMLAttributes, ReactNode } from 'react'
import { Icons } from '~/components/Icons'
import { cn } from '~/lib/utils'

type DashboardShellProps = {} & HTMLAttributes<HTMLDivElement>

export const DashboardShell = ({
  children,
  className,
  ...props
}: DashboardShellProps) => {
  return (
    <div className={cn('grid items-start gap-8', className)} {...props}>
      {children}
    </div>
  )
}

type DashboardHeaderProps = {
  heading: string
  text?: string
  children?: ReactNode
}

export const DashboardHeader = ({
  heading,
  text,
  children
}: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between px-2">
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold tracking-wide text-slate-900">
          {heading}
        </h1>
        {text && <p className="text-neutral-500">{text}</p>}
      </div>
      {children}
    </div>
  )
}

const sidebarNav = [
  {
    title: 'All',
    href: '/dashboard/advertisements',
    icon: 'post',
    disabled: false
  },
  {
    title: 'Published',
    href: '/dashboard/advertisements?status=published',
    icon: 'post',
    disabled: false
  },
  {
    title: 'Pending',
    href: '/dashboard/advertisements?status=pending',
    icon: 'post',
    disabled: false
  },
  {
    title: 'Inactive',
    href: '/dashboard/advertisements?status=inactive',
    icon: 'post',
    disabled: false
  }
] as const

type DashboardNavProps = {}

const shouldBeActive = (href: string, path: string, status: string | null) => {
  if (status) {
    return href.endsWith(status)
  }

  return path === href
}

export function DashboardNav({}: DashboardNavProps) {
  const path = usePathname()
  const searchParams = useSearchParams()
  const status = searchParams.get('status')

  return (
    <nav className="grid items-start gap-2">
      {sidebarNav.map((item, index) => {
        const Icon = Icons[item.icon || 'arrowRight']
        return (
          <Link key={index} href={item.disabled ? '#' : item.href}>
            <span
              className={cn(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100',
                {
                  'cursor-not-allowed opacity-80': item.disabled,
                  'bg-slate-200': shouldBeActive(item.href, path, status),
                  transparent: !shouldBeActive(item.href, path, status)
                }
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
