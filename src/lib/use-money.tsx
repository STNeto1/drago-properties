import { useState } from 'react'

export const useMoney = (initialValue?: number | null) => {
  const [value, setValue] = useState((initialValue ?? 0).toString())

  const cleanStrValue = +value.replace(/\D+/g, '')
  const intlValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(cleanStrValue / 100)

  const cleanIntlValue = intlValue.replaceAll(',', '').replace('.', '')

  return {
    value: intlValue.substring(1),
    clean: parseFloat(cleanIntlValue.substring(1)) / 100,
    setValue
  }
}
