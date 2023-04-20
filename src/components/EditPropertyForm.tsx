'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useMemo, useState } from 'react'
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
      <TabsContent value="medias">
        <EditMedias {...showPropertyQuery.data} />
      </TabsContent>
    </Tabs>
  )
}

type EditFormProps = SingleProperty
const EditForm: FC<EditFormProps> = (props) => {
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
      <FormSectionTitle>What do you want to update?</FormSectionTitle>

      <div className="pt-6">
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
        <div className="relative col-span-3 lg:col-span-1">
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

        <div className="relative col-span-3 lg:col-span-1">
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

        <div className="relative col-span-3 lg:col-span-1">
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

type EditMediasProps = SingleProperty
const EditMedias: React.FC<EditMediasProps> = (props) => {
  const router = useRouter()
  const utils = trpc.useContext()

  const [files, setFiles] = useState<File[]>([])
  const imagePreviews = useMemo(() => {
    return files.map((file) => URL.createObjectURL(file))
  }, [files])

  const createPresignedUrlsMutation = trpc.s3.createSignedUrls.useMutation()
  const uploadFilesMutation = trpc.property.addPhotos.useMutation({
    onSuccess: async () => {
      await utils.property.show.reset()
      setFiles([])
    }
  })
  const removePhotoMutation = trpc.property.removePhoto.useMutation({
    onSuccess: async () => {
      await utils.property.show.invalidate()
    }
  })

  const onSubmit = async () => {
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

    await uploadFilesMutation.mutateAsync({
      id: props.id,
      photos: Object.values(presignedUrls).map((p) => p.url)
    })
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <FormSectionTitle>What do you want to add new photos?</FormSectionTitle>

      <div className="pt-6">
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
          className="grid grid-cols-1 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 xl:gap-x-8 mt-4"
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
            onClick={() => router.back()}
            disabled={
              createPresignedUrlsMutation.isLoading ||
              uploadFilesMutation.isLoading
            }
          >
            Go back
          </Button>
          <Button
            className="w-full h-12"
            disabled={
              files.length === 0 ||
              createPresignedUrlsMutation.isLoading ||
              uploadFilesMutation.isLoading
            }
            onClick={onSubmit}
          >
            Continue
          </Button>
        </div>
      </div>

      <Divider />

      <FormSectionTitle>What do you want to remove old ones?</FormSectionTitle>

      <div className="pt-4">
        <ul
          role="list"
          className="grid grid-cols-1 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 xl:gap-x-8 mt-4"
        >
          {props.photos.map((url) => (
            <li key={url} className="relative">
              <div className="aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden group-hover:opacity-75">
                <Image
                  src={url}
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
                    removePhotoMutation.mutate({
                      id: props.id,
                      photo: url
                    })
                  }}
                  disabled={
                    props.photos.length === 1 || removePhotoMutation.isLoading
                  }
                >
                  <Icons.trash className="w-4 h-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
