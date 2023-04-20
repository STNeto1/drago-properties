'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '~/components/Button'
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
import { FormSectionTitle, propertyTypes } from '~/components/SellForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/Tabs'
import { Textarea } from '~/components/Textarea'
import { SingleProperty, properties } from '~/db/schema'
import { useMoney } from '~/lib/use-money'
import { trpc } from '~/trpc/client'
import { updatePropertySchema } from '~/trpc/schemas'

type Props = {
  slug: string
}
export const EditPropertyForm: FC<Props> = (props) => {
  const showPropertyQuery = trpc.property.show.useQuery(props.slug, {
    suspense: true,
    retry: 1
  })

  // Suspense is in the page
  if (!showPropertyQuery.data) return null

  return (
    <Tabs defaultValue="info" className="">
      <TabsList>
        <TabsTrigger value="info">Information</TabsTrigger>
        <TabsTrigger value="medias">Medias</TabsTrigger>
      </TabsList>
      <TabsContent value="info">
        <EditForm {...showPropertyQuery.data} />
      </TabsContent>
    </Tabs>
  )
}

type EditFormProps = SingleProperty
export const EditForm: FC<EditFormProps> = (props) => {
  const router = useRouter()

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    getValues,
    setValue
  } = useForm<z.infer<typeof updatePropertySchema>>({
    resolver: zodResolver(updatePropertySchema),
    defaultValues: {
      advertisementType: props.advertisementType,
      propertyType: props.propertyType,
      title: props.title,
      description: props.description,
      price: props.price,
      condominium: props.condominium ?? 0,
      iptu: props.iptu ?? 0
    }
  })
  const price = useMoney(props.price)
  const condominium = useMoney(props.condominium)
  const iptu = useMoney(props.iptu)
  useEffect(() => {
    setValue('price', price.clean)
    setValue('condominium', condominium.clean)
    setValue('iptu', iptu.clean)
  }, [price, condominium, iptu, setValue])

  const updatePropertyMutation = trpc.property.update.useMutation()

  const onSubmit = async (data: z.infer<typeof updatePropertySchema>) => {
    const result = await updatePropertyMutation.mutateAsync({
      id: props.id,
      ...data
    })
    router.push(`/dashboard/advertisements/${result.slug}`)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8 w-full"
    >
      <div>
        <FormSectionTitle>What do you want to update?</FormSectionTitle>

        <div className="pt-10">
          <Label>Advertisement Type</Label>
          <div className="flex items-center gap-4 pt-1">
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
      </div>

      <div className="">
        <Label>Property Type</Label>
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

      <div className="grid gap-4">
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
              rows={10}
              cols={10}
              className="h-56"
              {...register('description')}
            />
            <InputErrorMessage message={errors.description?.message} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-x-2 gap-y-6">
        <div className="relative col-span-1">
          <Label htmlFor="value">
            {props.advertisementType === 'rent' ? 'Rent' : 'Sale'} value
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
          variant={'outline'}
          className="w-full h-12"
          type="button"
          onClick={() => router.back()}
        >
          Go back
        </Button>
        <Button className="w-full h-12">Continue</Button>
      </div>
    </form>
  )
}
