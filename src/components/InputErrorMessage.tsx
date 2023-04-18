import { FC } from 'react'

type Props = {
  message?: string
}

export const InputErrorMessage: FC<Props> = ({ message }) => {
  return (
    <>{message && <p className="px-1 text-xs text-red-600">{message}</p>}</>
  )
}
