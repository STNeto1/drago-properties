import slugify from 'slugify'
import { properties } from '~/db/schema'
import { createPropertySchema } from '~/trpc/schemas'
import { protectedProcedure, router } from '~/trpc/trpc'

export const propertyRouter = router({
  create: protectedProcedure
    .input(createPropertySchema)
    .mutation(async ({ input, ctx }) => {
      return ctx.db.transaction(async (tx) => {
        const ads = await tx.select().from(properties)

        const slug = slugify(`${ads.length + 1} ${input.title}`, {
          lower: true
        })

        await tx.insert(properties).values({
          advertisementType: input.advertisementType,
          propertyType: input.propertyType,
          title: input.title,
          description: input.description,
          slug,

          postalCode: input.postalCode,
          state: input.state,
          city: input.city,
          district: input.district,
          street: input.street,
          streetNumber: input.streetNumber,
          complement: input.complement,

          usefulArea: input.usefulArea,
          totalArea: input.totalArea,
          bedrooms: input.bedrooms,
          bathrooms: input.bathrooms,
          parkingSpaces: input.parkingSpaces,
          suites: input.suites,

          price: input.price,
          condominium: input.condominium,
          iptu: input.iptu,

          photos: input.photos,
          userId: ctx.auth.userId
        })

        return { slug }
      })
    })
})