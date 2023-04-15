'use client'

import { MinusIcon, PlusIcon } from 'lucide-react'
import Image from 'next/image'
import { ReactNode, useMemo, useState } from 'react'
import { Button } from '~/components/Button'
import { Divider } from '~/components/Divider'
import { Icons } from '~/components/Icons'
import { Input } from '~/components/Input'
import { Label } from '~/components/Label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/Select'
import { Textarea } from '~/components/Textarea'
import { useLocation } from '~/hooks/use-location'
import { useMoney } from '~/lib/use-money'

export const SellForm = () => {
  return (
    <div>
      {/* <SellForm_1 /> */}

      {/* <SellForm_2 /> */}

      <SellForm_3 />
    </div>
  )
}

const propertyTypes = [
  { id: 'house', name: 'House' },
  { id: 'apartment', name: 'Apartment' },
  { id: 'land', name: 'Land' },
  { id: 'commercial', name: 'Commercial' },
  { id: 'other', name: 'Other' }
] as const

const SellForm_1 = () => {
  const [type, setType] = useState<string>('sell')

  const [postalCode, setPostalCode] = useState<string>('111111111')
  const locationQuery = useLocation({ postalCode })

  return (
    <section className="w-1/2 mx-auto">
      <div>
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          Lets get started
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-2">
          Start the registration, it is fast. If you do not have all the
          information now, you can edit the ad later.
        </p>
      </div>

      <section className="flex flex-col gap-8 pt-20">
        <div>
          <FormSectionTitle>What do you wish to do?</FormSectionTitle>

          <div className="flex items-center gap-4 pt-4">
            <Button
              size={'lg'}
              className={'px-8'}
              variant={type === 'sell' ? 'default' : 'subtle'}
              onClick={() => setType('sell')}
            >
              <span className="text-sm font-medium">Sell</span>
            </Button>

            <Button
              size={'lg'}
              className={'px-8'}
              variant={type === 'rent' ? 'default' : 'subtle'}
              onClick={() => setType('rent')}
            >
              <span className="text-sm font-medium">Rent</span>
            </Button>
          </div>
        </div>

        <div>
          <FormSectionTitle>What is the type of property?</FormSectionTitle>

          <div className="pt-4">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4">
          <FormSectionTitle>What is the property address?</FormSectionTitle>

          <div className="grid gap-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              type="text"
              autoCapitalize="none"
              autoComplete="postalCode"
              autoCorrect="off"
              placeholder="00000-000"
              defaultValue={postalCode}
              value={postalCode}
              onChange={(e) => {
                if (e.target.value.length <= 9) {
                  setPostalCode(e.target.value)
                }
              }}
            />
            {locationQuery.isError && (
              <p className="px-1 text-xs text-red-600">
                {locationQuery.error.message}
              </p>
            )}
          </div>

          {locationQuery.isSuccess && (
            <div className="grid grid-cols-4 gap-x-2 gap-y-6">
              <div className="col-span-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  type="text"
                  defaultValue={locationQuery.data.city}
                  readOnly
                />
              </div>

              <div className="col-span-1">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  type="text"
                  defaultValue={locationQuery.data.state}
                  readOnly
                />
              </div>

              <div className="col-span-1">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  type="text"
                  defaultValue={locationQuery.data.district}
                  readOnly
                />
              </div>

              <div className="col-span-4">
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  type="text"
                  defaultValue={locationQuery.data.street}
                  readOnly
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="number">Number</Label>
                <Input
                  id="number"
                  type="text"
                  defaultValue={locationQuery.data.number}
                  readOnly
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="complement">Complement</Label>
                <Input
                  id="complement"
                  type="text"
                  defaultValue={locationQuery.data.complement}
                  readOnly
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-4">
          <FormSectionTitle>Details about the property</FormSectionTitle>

          <div className="grid grid-cols-4 gap-x-2 gap-y-6">
            <div className="relative col-span-2">
              <Label htmlFor="usefulArea">Useful Area</Label>
              <div className="flex items-center">
                <Input
                  id="usefulArea"
                  type="number"
                  defaultValue={'10'}
                  className="rounded-r-none"
                />
                <span className="inline-flex items-center px-3 h-10 rounded-r-md border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  m²
                </span>
              </div>
            </div>

            <div className="col-span-2">
              <Label htmlFor="usefulArea">Total Area</Label>
              <div className="flex items-center">
                <Input
                  id="totalArea"
                  type="number"
                  defaultValue={'10'}
                  className="rounded-r-none"
                />
                <span className="inline-flex items-center px-3 h-10 rounded-r-md border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  m²
                </span>
              </div>
            </div>

            <div className="col-span-4">
              <div className="flex flex-col gap-y-4">
                <QuantitySelector
                  title="Bedrooms"
                  subtitle="How many bedrooms does the property have?"
                />

                <Divider />

                <QuantitySelector
                  title="Bathrooms"
                  subtitle="How many bathrooms does the property have?"
                />

                <Divider />

                <QuantitySelector
                  title="Suites"
                  subtitle="How many suites does the property have?"
                />

                <Divider />

                <QuantitySelector
                  title="Parking Spaces"
                  subtitle="How many parking spaces does the property have?"
                />
              </div>
            </div>

            <div className="col-span-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the property in a few words"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button className="w-full h-12">Continue</Button>
        </div>
      </section>
    </section>
  )
}

const SellForm_2 = () => {
  const price = useMoney()
  const condominium = useMoney()
  const iptu = useMoney()

  return (
    <section className="w-1/2 mx-auto">
      <div>
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          What is the price?
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
        </p>
      </div>

      <section className="mt-8">
        <div className="grid grid-cols-3 gap-x-2 gap-y-6">
          <div className="relative col-span-1">
            <Label htmlFor="value">[Sale | Rent] value</Label>
            <div className="flex items-center">
              <span className="inline-flex items-center px-2 h-10 rounded-l-md border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                $
              </span>
              <Input
                id="value"
                type="text"
                className="rounded-l-none"
                value={price.value}
                onChange={(e) => price.setValue(e.target.value)}
              />
            </div>
          </div>

          <div className="relative col-span-1">
            <Label htmlFor="condominium">Condominium</Label>
            <div className="flex items-center">
              <span className="inline-flex items-center px-2 h-10 rounded-l-md border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                $
              </span>
              <Input
                id="condominium"
                type="text"
                className="rounded-l-none"
                value={condominium.value}
                onChange={(e) => condominium.setValue(e.target.value)}
              />
            </div>
          </div>

          <div className="relative col-span-1">
            <Label htmlFor="iptu">IPTU</Label>
            <div className="flex items-center">
              <span className="inline-flex items-center px-2 h-10 rounded-l-md border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                $
              </span>
              <Input
                id="iptu"
                type="text"
                className="rounded-l-none"
                value={iptu.value}
                onChange={(e) => iptu.setValue(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <Button variant={'outline'} className="w-full h-12">
            Go back
          </Button>
          <Button className="w-full h-12">Continue</Button>
        </div>
      </section>
    </section>
  )
}

const SellForm_3 = () => {
  const [files, setFiles] = useState<File[]>([])

  const imagePreviews = useMemo(() => {
    return files.map((file) => URL.createObjectURL(file))
  }, [files])

  return (
    <section className="w-1/2 mx-auto">
      <div>
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          Now add some photos
        </h3>
      </div>

      <section className="mt-8">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Icons.upload className="w-8 h-8 text-gray-400" />
              <p className="font-semibold mb-2 text-sm text-gray-500 dark:text-gray-400">
                Click to upload
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  setFiles((prev) => [
                    ...prev,
                    ...Array.from(e.target.files ?? [])
                  ])
                }
              }}
            />
          </label>
        </div>

        <ul
          role="list"
          className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 xl:gap-x-8 mt-4"
        >
          {imagePreviews.map((file, idx) => (
            <li key={file} className="relative">
              <div className="aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden group-hover:opacity-75">
                <Image
                  src={file}
                  alt=""
                  className="object-center object-cover"
                  width={640}
                  height={480}
                />
              </div>
              <div className="absolute top-2 right-2">
                <Button
                  variant={'destructive'}
                  size={'xs'}
                  onClick={() => {
                    setFiles((prev) => prev.filter((_, i) => i !== idx))
                  }}
                >
                  <Icons.trash className="w-4 h-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center gap-4">
          <Button variant={'outline'} className="w-full h-12">
            Go back
          </Button>
          <Button className="w-full h-12" disabled={files.length === 0}>
            Continue
          </Button>
        </div>
      </section>
    </section>
  )
}

const FormSectionTitle = (props: { children: ReactNode }) => {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      {props.children}
    </h4>
  )
}

const QuantitySelector = (props: { title: string; subtitle: string }) => {
  const [quantity, setQuantity] = useState<number>(0)

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col">
        {/* <span className="text font-semibold">{props.title}</span> */}
        <Label>{props.title}</Label>
        <span className="text-sm text-gray-500">{props.subtitle}</span>
      </div>

      <div className="flex items-center gap-4">
        <Button
          size={'sm'}
          variant={'subtle'}
          className="h-8 w-8"
          onClick={() => setQuantity((prev) => Math.max(0, prev - 1))}
          disabled={quantity === 0}
        >
          <MinusIcon />
        </Button>

        <span className="text-sm font-semibold">{quantity}</span>

        <Button
          size={'sm'}
          variant={'subtle'}
          className="h-8 w-8"
          onClick={() => setQuantity((prev) => prev + 1)}
        >
          <PlusIcon />
        </Button>
      </div>
    </div>
  )
}
