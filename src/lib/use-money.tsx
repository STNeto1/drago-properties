import { useState } from 'react'

export const useMoney = () => {
  const [value, setValue] = useState('0')

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
