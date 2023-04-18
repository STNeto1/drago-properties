import { useQuery } from '@tanstack/react-query'

type Props = {
  postalCode: string
}

type useLocationResponse = {
  postalCode: string
  city: string
  state: string
  district: string
  street: string
  number: string
  complement: string
}

export const useLocation = ({ postalCode }: Props) => {
  return useQuery<unknown, Error, useLocationResponse>({
    queryKey: ['location', postalCode],
    queryFn: async () => {
      // sleep 200ms
      await new Promise((resolve) => setTimeout(resolve, 200))

      return {
        postalCode,
        city: 'Campina Grande',
        state: 'PB',
        district: 'Some',
        street: 'Some',
        number: 'Some',
        complement: 'Some'
      }
    },
    enabled: postalCode?.length === 9
  })
}
