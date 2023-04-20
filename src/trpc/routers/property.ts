import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import slugify from 'slugify'
import { z } from 'zod'
import { properties } from '~/db/schema'
import { createPropertySchema, updatePropertySchema } from '~/trpc/schemas'
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
    }),
  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(properties)
      .where(eq(properties.userId, ctx.auth.userId))
  }),
  show: protectedProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const [userProperty] = await ctx.db
      .select()
      .from(properties)
      .where(
        and(eq(properties.slug, input), eq(properties.userId, ctx.auth.userId))
      )
      .limit(1)

    if (!userProperty) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Property not found'
      })
    }

    return userProperty
  }),
  update: protectedProcedure
    .input(updatePropertySchema.merge(z.object({ id: z.number() })))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.transaction(async (tx) => {
        const [property] = await tx
          .select()
          .from(properties)
          .where(
            and(
              eq(properties.id, input.id),
              eq(properties.userId, ctx.auth.userId)
            )
          )
          .limit(1)

        if (!property) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Property not found'
          })
        }

        const slug =
          input.title === property.title
            ? property.slug
            : slugify(`${property.id} ${input.title}`, {
                lower: true
              })

        const [updateResult] = await tx
          .update(properties)
          .set({
            advertisementType: input.advertisementType,
            propertyType: input.propertyType,
            title: input.title,
            description: input.description,
            slug,
            price: input.price,
            condominium: input.condominium,
            iptu: input.iptu
          })
          .where(
            and(
              eq(properties.id, input.id),
              eq(properties.userId, ctx.auth.userId)
            )
          )
          .execute()

        if (updateResult.affectedRows === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Property not found'
          })
        }

        return { slug }
      })
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      return ctx.db.transaction(async (tx) => {
        const [property] = await tx
          .select()
          .from(properties)
          .where(
            and(
              eq(properties.id, input),
              eq(properties.userId, ctx.auth.userId)
            )
          )
          .limit(1)

        if (!property) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Property not found'
          })
        }

        const [deleteResult] = await tx
          .delete(properties)
          .where(
            and(
              eq(properties.id, input),
              eq(properties.userId, ctx.auth.userId)
            )
          )
          .execute()

        if (deleteResult.affectedRows === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Property not found'
          })
        }
      })
    }),
  addPhotos: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        photos: z.array(z.string())
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db.transaction(async (tx) => {
        const [property] = await tx
          .select()
          .from(properties)
          .where(
            and(
              eq(properties.id, input.id),
              eq(properties.userId, ctx.auth.userId)
            )
          )
          .limit(1)

        if (!property) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Property not found'
          })
        }

        await tx
          .update(properties)
          .set({
            photos: [...property.photos, ...input.photos]
          })
          .where(
            and(
              eq(properties.id, input.id),
              eq(properties.userId, ctx.auth.userId)
            )
          )
          .execute()
      })
    }),
  removePhoto: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        photo: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db.transaction(async (tx) => {
        const [property] = await tx
          .select()
          .from(properties)
          .where(
            and(
              eq(properties.id, input.id),
              eq(properties.userId, ctx.auth.userId)
            )
          )
          .limit(1)

        if (!property) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Property not found'
          })
        }

        if (property.photos.length === 1) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'You must have at least one photo'
          })
        }

        await tx
          .update(properties)
          .set({
            photos: property.photos.filter((photo) => photo !== input.photo)
          })
          .where(
            and(
              eq(properties.id, input.id),
              eq(properties.userId, ctx.auth.userId)
            )
          )
          .execute()
      })
    })
})
