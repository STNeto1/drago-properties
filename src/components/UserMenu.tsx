import { useAuth } from '@clerk/nextjs'
import { AvatarProps } from '@radix-ui/react-avatar'
import Link from 'next/link'
import { FC, HTMLAttributes } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/DropdownMenu'
import { Icons } from '~/components/Icons'

type UserAvatarProps = {
  name: string
  image?: string
} & AvatarProps

export const UserAvatar: FC<UserAvatarProps> = (props) => {
  return (
    <Avatar {...props}>
      {props.image ? (
        <AvatarImage alt="Picture" src={props.image} />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{props.name}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  )
}

type UserMenuProps = {
  name: string
  email?: string
  image?: string
} & HTMLAttributes<HTMLDivElement>

export const UserMenu: FC<UserMenuProps> = (props) => {
  const { signOut } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar name={props.name} image={props.image} className="h-8 w-8" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {props.name && <p className="font-medium">{props.name}</p>}
            {props.email && (
              <p className="w-[200px] truncate text-sm text-slate-600">
                {props.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/sell">Sell</Link>
        </DropdownMenuItem>
        {/* <DropdownMenuItem asChild>
          <Link href="/dashboard/billing">Billing</Link>
        </DropdownMenuItem> */}
        {/* <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">Settings</Link>
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            signOut()
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
