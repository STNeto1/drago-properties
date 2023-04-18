import { z } from 'zod'
import { properties } from '~/db/schema'

export const createPropertySchema = z.object({
  advertisementType: z.enum(properties.advertisementType.enumValues),
  propertyType: z.enum(properties.propertyType.enumValues),

  title: z.string(),
  description: z.string(),

  postalCode: z.string(),
  state: z.string(),
  city: z.string(),
  district: z.string(),
  street: z.string(),
  streetNumber: z.string(),
  complement: z.string(),

  usefulArea: z.number(),
  totalArea: z.number(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  parkingSpaces: z.number(),
  suites: z.number(),

  price: z.number(),
  condominium: z.number(),
  iptu: z.number(),

  photos: z.array(z.string())
})
