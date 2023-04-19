'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { MinusIcon, PlusIcon } from 'lucide-react'
import Image from 'next/image'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '~/components/Button'
import { Divider } from '~/components/Divider'
import { Icons } from '~/components/Icons'
import { Input } from '~/components/Input'
import { InputErrorMessage } from '~/components/InputErrorMessage'
import { Label } from '~/components/Label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/Select'
import { Textarea } from '~/components/Textarea'
import { properties } from '~/db/schema'
import { useLocation } from '~/hooks/use-location'
import { useCreatePropertyStore } from '~/lib/create-property-store'
import { useMoney } from '~/lib/use-money'
import { trpc } from '~/trpc/client'
import { createPropertySchema } from '~/trpc/schemas'

export const SellForm = () => {
  const currentStep = useCreatePropertyStore((state) => state.step)

  return (
    <div>
      {currentStep === 1 && <SellForm_1 />}
      {currentStep === 2 && <SellForm_2 />}
      {currentStep === 3 && <SellForm_3 />}
    </div>
  )
}

const propertyTypes: Array<{
  id: typeof properties.propertyType.enumValues[number]
  name: string
}> = [
  { id: 'house', name: 'House' },
  { id: 'apartment', name: 'Apartment' },
  { id: 'land', name: 'Land' },
  { id: 'commercial', name: 'Commercial' },
  { id: 'other', name: 'Other' }
]

const firstFormSchema = z.object({
  advertisementType: z.enum(properties.advertisementType.enumValues),
  propertyType: z.enum(properties.propertyType.enumValues),

  title: z.string().min(5).max(100),
  description: z.string().min(5).max(1000),

  postalCode: z.string().length(9),
  state: z.string().max(100),
  city: z.string().max(100),
  district: z.string().max(100),
  street: z.string().max(100),
  streetNumber: z.string().min(1).max(100),
  complement: z.optional(z.string().min(1).max(100)),

  usefulArea: z.coerce.number().min(1).max(100000),
  totalArea: z.coerce.number().min(1).max(100000),
  bedrooms: z.number().min(1).max(100),
  bathrooms: z.number().min(1).max(100),
  parkingSpaces: z.number().min(1).max(100),
  suites: z.number().min(1).max(100)
})
type FirstForm = z.infer<typeof firstFormSchema>

const SellForm_1 = () => {
  const nextStep = useCreatePropertyStore((state) => state.nextStep)
  const setData = useCreatePropertyStore((state) => state.setData)

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    watch
  } = useForm<FirstForm>({
    resolver: zodResolver(firstFormSchema)
  })
  const onSubmit = (data: FirstForm) => {
    setData({
      advertisementType: data.advertisementType,
      propertyType: data.propertyType,
      bathrooms: data.bathrooms,
      bedrooms: data.bedrooms,
      city: data.city,
      complement: data.complement,
      description: data.description,
      district: data.district,
      parkingSpaces: data.parkingSpaces,
      postalCode: data.postalCode,
      state: data.state,
      street: data.street,
      streetNumber: data.streetNumber,
      suites: data.suites,
      title: data.title,
      totalArea: data.totalArea,
      usefulArea: data.usefulArea
    })

    nextStep()
  }

  const locationQuery = useLocation({
    postalCode: watch('postalCode')
  })

  useEffect(() => {
    if (!locationQuery.data) {
      return
    }

    setValue('state', locationQuery.data.state)
    setValue('city', locationQuery.data.city)
    setValue('district', locationQuery.data.district)
    setValue('street', locationQuery.data.street)
    setValue('streetNumber', locationQuery.data.number)
    setValue('complement', locationQuery.data.complement)
  }, [locationQuery, setValue])

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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-8 pt-20"
      >
        <div>
          <FormSectionTitle>What do you wish to do?</FormSectionTitle>

          <div className="flex items-center gap-4 pt-4 pb-2">
            <Button
              type="button"
              size={'lg'}
              className={'px-8'}
              variant={
                watch('advertisementType') === 'sell' ? 'default' : 'subtle'
              }
              onClick={() => setValue('advertisementType', 'sell')}
            >
              <span className="text-sm font-medium">Sell</span>
            </Button>

            <Button
              type="button"
              size={'lg'}
              className={'px-8'}
              variant={
                watch('advertisementType') === 'rent' ? 'default' : 'subtle'
              }
              onClick={() => setValue('advertisementType', 'rent')}
            >
              <span className="text-sm font-medium">Rent</span>
            </Button>
          </div>
          <InputErrorMessage message={errors.advertisementType?.message} />
        </div>

        <div className="grid gap-4">
          <FormSectionTitle>
            Give us some information about the ad
          </FormSectionTitle>

          <div className="grid grid-cols-4 gap-x-2 gap-y-6">
            <div className="col-span-4">
              <Label htmlFor="title">Title</Label>
              <div className="flex flex-col">
                <Input
                  id="title"
                  type="text"
                  className=""
                  placeholder="Ex: House with 3 bedrooms"
                  {...register('title')}
                />
                <InputErrorMessage message={errors.title?.message} />
              </div>
            </div>

            <div className="col-span-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the property in a few words"
                {...register('description')}
              />
              <InputErrorMessage message={errors.description?.message} />
            </div>
          </div>
        </div>

        <div>
          <FormSectionTitle>What is the type of property?</FormSectionTitle>

          <div className="pt-4">
            <Select
              value={getValues('propertyType')}
              onValueChange={(
                value: typeof properties.propertyType.enumValues[number]
              ) => setValue('propertyType', value)}
            >
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

            <InputErrorMessage message={errors.propertyType?.message} />
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
              maxLength={9}
              {...register('postalCode')}
            />
            <InputErrorMessage message={locationQuery.error?.message} />
            <InputErrorMessage message={errors.postalCode?.message} />
          </div>

          {locationQuery.isSuccess && (
            <div className="grid grid-cols-4 gap-x-2 gap-y-6">
              <div className="col-span-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  type="text"
                  value={locationQuery.data.city}
                  readOnly
                />
                <InputErrorMessage message={errors.postalCode?.message} />
              </div>

              <div className="col-span-1">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  type="text"
                  value={locationQuery.data.state}
                  readOnly
                />
                <InputErrorMessage message={errors.state?.message} />
              </div>

              <div className="col-span-1">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  type="text"
                  value={locationQuery.data.district}
                  readOnly
                />
                <InputErrorMessage message={errors.district?.message} />
              </div>

              <div className="col-span-4">
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  type="text"
                  value={locationQuery.data.street}
                  readOnly
                />
                <InputErrorMessage message={errors.street?.message} />
              </div>

              <div className="col-span-2">
                <Label htmlFor="number">Number</Label>
                <Input
                  id="number"
                  type="text"
                  value={locationQuery.data.number}
                  readOnly
                />
                <InputErrorMessage message={errors.streetNumber?.message} />
              </div>

              <div className="col-span-2">
                <Label htmlFor="complement">Complement</Label>
                <Input
                  id="complement"
                  type="text"
                  value={locationQuery.data.complement}
                  readOnly
                />
                <InputErrorMessage message={errors.complement?.message} />
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
                  className="rounded-r-none"
                  {...register('usefulArea')}
                />
                <span className="inline-flex items-center px-3 h-10 rounded-r-md border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  m²
                </span>
              </div>
              <InputErrorMessage message={errors.usefulArea?.message} />
            </div>

            <div className="col-span-2">
              <Label htmlFor="totalArea">Total Area</Label>
              <div className="flex items-center">
                <Input
                  id="totalArea"
                  type="number"
                  className="rounded-r-none"
                  {...register('totalArea')}
                />
                <span className="inline-flex items-center px-3 h-10 rounded-r-md border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  m²
                </span>
              </div>
              <InputErrorMessage message={errors.totalArea?.message} />
            </div>

            <div className="col-span-4">
              <div className="flex flex-col gap-y-4">
                <div className="flex flex-col">
                  <QuantitySelector
                    title="Bedrooms"
                    subtitle="How many bedrooms does the property have?"
                    initialValue={0}
                    setValue={(value) => setValue('bedrooms', value)}
                  />
                  <InputErrorMessage message={errors.bedrooms?.message} />
                </div>

                <Divider />

                <div className="flex flex-col">
                  <QuantitySelector
                    title="Bathrooms"
                    subtitle="How many bathrooms does the property have?"
                    initialValue={0}
                    setValue={(value) => setValue('bathrooms', value)}
                  />
                  <InputErrorMessage message={errors.bathrooms?.message} />
                </div>

                <Divider />

                <div className="flex flex-col">
                  <QuantitySelector
                    title="Suites"
                    subtitle="How many suites does the property have?"
                    initialValue={0}
                    setValue={(value) => setValue('suites', value)}
                  />
                  <InputErrorMessage message={errors.suites?.message} />
                </div>

                <Divider />

                <div className="flex flex-col">
                  <QuantitySelector
                    title="Parking Spaces"
                    subtitle="How many parking spaces does the property have?"
                    initialValue={0}
                    setValue={(value) => setValue('parkingSpaces', value)}
                  />
                  <InputErrorMessage message={errors.parkingSpaces?.message} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button type="submit" className="w-full h-12">
            Continue
          </Button>
        </div>
      </form>
    </section>
  )
}

const secondFormSchema = z.object({
  price: z.number().min(1).max(1000000000),
  condominium: z.optional(z.number().min(0).max(1000000000)),
  iptu: z.optional(z.number().min(0).max(1000000000))
})
type SecondForm = z.infer<typeof secondFormSchema>

const SellForm_2 = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<SecondForm>({
    resolver: zodResolver(secondFormSchema)
  })

  const price = useMoney()
  const condominium = useMoney()
  const iptu = useMoney()

  useEffect(() => {
    setValue('price', price.clean)
    setValue('condominium', condominium.clean)
    setValue('iptu', iptu.clean)
  }, [price, condominium, iptu, setValue])

  const nextStep = useCreatePropertyStore((state) => state.nextStep)
  const previousStep = useCreatePropertyStore((state) => state.previousStep)
  const formData = useCreatePropertyStore((state) => state.data)
  const setFormData = useCreatePropertyStore((state) => state.setData)

  const onSubmit = (data: SecondForm) => {
    setFormData({
      price: data.price,
      condominium: data.condominium,
      iptu: data.iptu
    })
    nextStep()
  }

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

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        <div className="grid grid-cols-3 gap-x-2 gap-y-6">
          <div className="relative col-span-1">
            <Label htmlFor="value">
              {formData.advertisementType === 'rent' ? 'Rent' : 'Sale'} value
            </Label>
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
            <InputErrorMessage message={errors.price?.message} />
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
            <InputErrorMessage message={errors.condominium?.message} />
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
            <InputErrorMessage message={errors.iptu?.message} />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <Button
            type="button"
            variant={'outline'}
            className="w-full h-12"
            onClick={() => previousStep()}
          >
            Go back
          </Button>
          <Button type="submit" className="w-full h-12">
            Continue
          </Button>
        </div>
      </form>
    </section>
  )
}

const SellForm_3 = () => {
  const [files, setFiles] = useState<File[]>([])

  const imagePreviews = useMemo(() => {
    return files.map((file) => URL.createObjectURL(file))
  }, [files])

  const previousStep = useCreatePropertyStore((state) => state.previousStep)
  const formData = useCreatePropertyStore((state) => state.data)

  const createPropertyMutation = trpc.property.create.useMutation()
  const createPresignedUrlsMutation = trpc.s3.createSignedUrls.useMutation()

  const onSubmit = async () => {
    const sanitized = createPropertySchema.safeParse({
      ...formData,
      photos: []
    })
    if (!sanitized.success) {
      alert('Invalid data')
      console.log(sanitized.error)

      return
    }

    const presignedUrls = await createPresignedUrlsMutation.mutateAsync(
      files.map((f) => f.name)
    )

    const uploadPromises = files.map((file) => {
      const result = presignedUrls[file.name]

      return fetch(result.completeUrl, {
        method: 'PUT',
        body: file
      })
    })
    await Promise.all(uploadPromises)

    createPropertyMutation.mutateAsync({
      ...sanitized.data,
      photos: Object.values(presignedUrls).map((p) => p.url)
    })
  }

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
          <Button
            variant={'outline'}
            className="w-full h-12"
            onClick={() => previousStep()}
          >
            Go back
          </Button>
          <Button
            className="w-full h-12"
            disabled={files.length === 0}
            onClick={onSubmit}
          >
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

const QuantitySelector = (props: {
  title: string
  subtitle: string
  initialValue: number
  setValue: (val: number) => void
}) => {
  const [quantity, setQuantity] = useState<number>(props.initialValue)

  useEffect(() => {
    props.setValue(quantity)
  }, [quantity, props])

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col">
        {/* <span className="text font-semibold">{props.title}</span> */}
        <Label>{props.title}</Label>
        <span className="text-sm text-gray-500">{props.subtitle}</span>
      </div>

      <div className="flex items-center gap-4">
        <Button
          type="button"
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
          type="button"
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
