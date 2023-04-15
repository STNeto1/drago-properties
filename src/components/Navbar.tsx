'use client'

import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode, useState } from 'react'
import { buttonVariants } from '~/components/Button'
import { Icons } from '~/components/Icons'
import { MobileNav } from '~/components/MobileNav'
import { UserMenu } from '~/components/UserMenu'
import { cn } from '~/lib/utils'

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export const navItems: Array<NavItem> = [
  {
    title: 'Buy',
    href: '#',
    disabled: true
  },
  {
    title: 'Sell',
    href: '/sell',
    disabled: false
  },
  {
    title: 'Discover',
    href: '#',
    disabled: true
  },
  {
    title: 'Advertise',
    href: '#',
    disabled: true
  }
]

type NavbarProps = {
  children?: ReactNode | ReactNode[]
}

export const Navbar = (props: NavbarProps) => {
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false)

  const { isSignedIn, user } = useUser()

  return (
    <div className="flex flex-row-reverse md:flex-row items-center justify-between gap-6 md:gap-10 w-full">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Icons.logo />
        <span className="hidden font-bold sm:inline-block">
          Drago Properties
        </span>
      </Link>

      <div className="flex items-center gap-6">
        <nav className="hidden md:flex gap-6">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? '#' : item.href}
              className={cn(
                'flex items-center text-lg font-semibold text-slate-600 sm:text-sm',
                {
                  'text-slate-900 border-b-2 border-slate-900':
                    item.href === pathname,
                  'cursor-not-allowed opacity-80': item.disabled
                }
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {isSignedIn ? (
          <UserMenu
            name={user.fullName ?? ''}
            email={user.primaryEmailAddress?.emailAddress}
            image={user.profileImageUrl}
          />
        ) : (
          <Link
            href="/sign-in"
            className={cn(buttonVariants({ size: 'sm' }), 'px-4')}
          >
            Sign In
          </Link>
        )}
      </div>

      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <Icons.close /> : <Icons.logo />}
        <span className="font-bold">Menu</span>
      </button>
      {showMobileMenu && <MobileNav>{props.children}</MobileNav>}
    </div>
  )
}
