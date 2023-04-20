'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '~/components/AlertDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/DropdownMenu'
import { Icons } from '~/components/Icons'
import { SingleProperty } from '~/db/schema'
import { formatDate } from '~/lib/utils'
import { trpc } from '~/trpc/client'

type Props = {
  status: string | null
}

export const ListProperties: FC<Props> = ({ status }) => {
  const listPropertiesQuery = trpc.property.list.useQuery(undefined, {
    suspense: true
  })

  return (
    <div className="mt-4">
      <div className="divide-y divide-neutral-200 rounded-md border border-slate-200">
        {listPropertiesQuery.data?.map((elem) => (
          <Item key={elem.slug} {...elem} />
        ))}
      </div>
    </div>
  )
}

type ItemProps = SingleProperty

const Item: FC<ItemProps> = (props) => {
  const router = useRouter()
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false)

  const deletePropertyMutation = trpc.property.delete.useMutation({
    onSuccess: () => {
      router.refresh()
    }
  })

  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link href={`/${props.slug}`} className="font-semibold hover:underline">
          {props.title}
        </Link>
        <div>
          <p className="text-sm text-slate-600">
            {formatDate(props.createdAt?.toDateString())}
          </p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-slate-50">
          <Icons.ellipsis className="h-4 w-4" />
          <span className="sr-only">Open</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link
              href={`/dashboard/advertisements/${props.slug}`}
              className="flex w-full"
            >
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center text-red-600 focus:bg-red-50"
            onSelect={() => setShowDeleteAlert(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this post?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 focus:ring-red-600"
              onClick={() => {
                deletePropertyMutation.mutate(props.id)
              }}
            >
              {deletePropertyMutation.isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.trash className="mr-2 h-4 w-4" />
              )}
              <span>Delete</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
