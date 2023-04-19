import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'
import { z } from 'zod'

import { protectedProcedure, router } from '~/trpc/trpc'

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT as string,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string
  }
})

export const s3Router = router({
  createSignedUrls: protectedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      const result: Record<
        string,
        {
          url: string
          completeUrl: string
        }
      > = {}

      for (const fileName of input) {
        // get ext
        const ext = fileName.split('.').pop()
        const key = `${ctx.auth.userId}/${randomUUID()}.${ext}`
        // const url = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_DEFAULT_REGION}.amazonaws.com/${key}`
        const url = `https://cdn.stneto.dev/nyxneto/${key}`

        const command = new PutObjectCommand({
          Key: key,
          Bucket: 'nyxneto'
          // Expires: new Date('2024-01-01'),
          // ContentType: 'image/jpeg',
          // ACL: 'public-read'
        })

        const completeUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 3600
        })

        result[fileName] = {
          url,
          completeUrl
        }
      }

      return result
    })
})
