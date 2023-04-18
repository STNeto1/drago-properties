import { InferModel } from 'drizzle-orm'
import {
  float,
  int,
  json,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar
} from 'drizzle-orm/mysql-core'

export const properties = mysqlTable('properties', {
  id: serial('id').primaryKey(),
  advertisementType: varchar('advertisement_type', {
    length: 4,
    enum: ['sell', 'rent']
  }).notNull(),
  propertyType: varchar('property_type', {
    length: 20,
    enum: ['house', 'apartment', 'land', 'commercial', 'other']
  }).notNull(),

  title: varchar('title', { length: 100 }).notNull(),
  description: text('description').notNull(),

  postalCode: varchar('postal_code', { length: 10 }).notNull(),
  state: varchar('state', { length: 50 }).notNull(),
  city: varchar('city', { length: 50 }).notNull(),
  district: varchar('district', { length: 50 }).notNull(),
  street: varchar('street', { length: 50 }).notNull(),
  streetNumber: varchar('street_number', { length: 10 }).notNull(),
  complement: varchar('complement', { length: 50 }).notNull(),

  usefulArea: float('useful_area').notNull(),
  totalArea: float('total_area').notNull(),
  bedrooms: int('bedrooms').notNull(),
  bathrooms: int('bathrooms').notNull(),
  parkingSpaces: int('parking_spaces').notNull(),
  suites: int('suites').notNull(),

  price: float('price').notNull(),
  condominium: float('condominium'),
  iptu: float('iptu'),

  photos: json('photos').$type<string[]>().notNull(),

  userId: varchar('user_id', { length: 36 }).notNull(),

  createdAt: timestamp('created_at', { fsp: 2 }).notNull().defaultNow()
})

export type CreateProperty = InferModel<typeof properties, 'insert'>
