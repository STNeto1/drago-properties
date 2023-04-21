'use client'

import Image from 'next/image'
import { FC, ReactNode, useState } from 'react'
import { Button } from '~/components/Button'
import { Divider } from '~/components/Divider'
import { Icons } from '~/components/Icons'
import { SingleProperty } from '~/db/schema'
import { formatCurrency, formatPublishedAt } from '~/lib/utils'

type ShowPropertyProps = SingleProperty
export const ShowProperty: FC<ShowPropertyProps> = (props) => {
  const [currentPhoto, setCurrentPhoto] = useState(0)

  const nextPhoto = () =>
    setCurrentPhoto((prev) => Math.min(prev + 1, props.photos.length))
  const prevPhoto = () => setCurrentPhoto((prev) => Math.max(prev - 1, 0))

  return (
    <section className="flex flex-col lg:container lg:mb-40">
      <div className="w-[425px] h-[280px] md:w-[768px] lg:w-[100%] lg:h-[400px] relative">
        <Image
          src={props.photos[currentPhoto]}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-center object-cover"
          alt={props.title}
        />

        <div className="absolute left-0 top-[50%]">
          <Button
            size={'sm'}
            variant={'subtle'}
            disabled={currentPhoto === 0}
            onClick={prevPhoto}
          >
            <Icons.chevronLeft />
          </Button>
        </div>

        <div className="absolute right-0 top-[50%]">
          <Button
            size={'sm'}
            variant={'subtle'}
            disabled={currentPhoto === props.photos.length - 1}
            onClick={nextPhoto}
          >
            <Icons.chevronRight />
          </Button>
        </div>

        <div className="absolute bottom-3 right-2">
          <span className="text-white bg-black bg-opacity-50 px-2 py-1 rounded-md">{`${
            currentPhoto + 1
          } / ${props.photos.length}`}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl break-words text-gray-800">
            {formatCurrency(props.price)}
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-1 md:gap-8 break-words font-[300] text-sm lg:text-base text-[#4a4a4a]">
          <div className="flex md:flex-col items-center justify-between md:items-start">
            <span>Condominium</span>
            <span className="font-[600]">
              {props.condominium ? formatCurrency(props.condominium) : '-'}
            </span>
          </div>

          <div className="flex md:flex-col items-center justify-between md:items-start">
            <span>IPTU</span>
            <span className="font-[600]">
              {props.iptu ? formatCurrency(props.iptu) : '-'}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:gap-4 md:pt-4">
          <h2 className="text-xl font-[400] break-words text-[#4a4a4a]">
            {props.title}
          </h2>

          <span className="text-sm font-[400] break-words text-[#999999]">
            {formatPublishedAt(props.createdAt)}
          </span>
        </div>

        <div className="grid grid-cols-4 mt-4 p-4 border border-gray-200 rounded-md">
          <PropertyDetail label="Bedrooms" value={props.bedrooms} />
          <PropertyDetail label="Bathrooms" value={props.bathrooms} />
          <PropertyDetail label="Total Area" value={`${props.totalArea} m²`} />
          <PropertyDetail label="Parking" value={props.parkingSpaces} />
        </div>

        <div className="py-4">
          <Divider />
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-[400] break-words text-[#4a4a4a]">
            Description
          </h2>

          <span className="text-sm font-[400] break-words text-justify">
            {props.description}
          </span>
        </div>

        <div className="py-4">
          <Divider />
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-[400] break-words text-[#4a4a4a]">
            Location
          </h2>

          <div className="flex flex-col text-sm font-[400] break-words text-[#4a4a4a] gap-1">
            <span>{props.street}</span>
            <span>{[props.district, props.city, props.state].join(', ')}</span>
            <span>{`CEP: ${props.postalCode}`}</span>
          </div>
        </div>

        <div className="py-4">
          <Divider />
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-[400] break-words text-[#4a4a4a]">
            Details
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6">
            {['prop1', 'prop2', 'prop3', 'prop4'].map((elem) => (
              <div key={elem} className="flex items-center justify-center">
                <span className="text-lg font-[400] text-[#4a4a4a]">
                  {elem}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const PropertyDetail: FC<{ label: string; value: ReactNode }> = (props) => {
  return (
    <div className="flex flex-col gap-1 items-center">
      <span className="text-sm font-[400] text-[#999999]">{props.label}</span>
      <span className="text-base font-[400] text-[#4a4a4a]">{props.value}</span>
    </div>
  )
}
