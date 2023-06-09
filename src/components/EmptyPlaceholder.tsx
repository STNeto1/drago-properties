import { HTMLAttributes } from 'react'
import { Icons } from '~/components/Icons'
import { cn } from '~/lib/utils'

type EmptyPlaceholderProps = {} & HTMLAttributes<HTMLDivElement>

export const EmptyPlaceholder = ({
  className,
  children,
  ...props
}: EmptyPlaceholderProps) => {
  return (
    <div
      className={cn(
        'flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50',
        className
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  )
}

type EmptyPlaceholderIconProps = {
  name: keyof typeof Icons
} & Partial<React.SVGProps<SVGSVGElement>>

EmptyPlaceholder.Icon = function EmptyPlaceHolderIcon({
  name,
  className,
  ...props
}: EmptyPlaceholderIconProps) {
  const Icon = Icons[name]

  if (!Icon) {
    return null
  }

  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
      <Icon className={cn('h-10 w-10', className)} {...props} />
    </div>
  )
}

type EmptyPlaceholderTitleProps = {} & HTMLAttributes<HTMLHeadingElement>

EmptyPlaceholder.Title = function EmptyPlaceholderTitle({
  className,
  ...props
}: EmptyPlaceholderTitleProps) {
  return (
    <h2 className={cn('mt-6 text-xl font-semibold', className)} {...props} />
  )
}

type EmptyPlaceholderDescriptionProps =
  {} & HTMLAttributes<HTMLParagraphElement>

EmptyPlaceholder.Description = function EmptyPlaceholderDescription({
  className,
  ...props
}: EmptyPlaceholderDescriptionProps) {
  return (
    <p
      className={cn(
        'mt-3 mb-8 text-center text-sm font-normal leading-6 text-slate-700',
        className
      )}
      {...props}
    />
  )
}
