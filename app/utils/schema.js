import { pgTable, uuid, text, varchar } from "drizzle-orm/pg-core";

export const AIinterview = pgTable("interview", {
  id: uuid('id').defaultRandom().primaryKey(), // Use UUID type
  jsonMockResp: text('jsonMockResp').notNull(),
  jobPosition: varchar('jobPosition', { length: 255 }).notNull(),
  jobDesc: varchar('jobDesc', { length: 255 }).notNull(),
  jobExperience: varchar('jobExperience', { length: 255 }).notNull(),
  createdBy: varchar('createdBy', { length: 255 }).notNull(),
  createdAt: varchar('createdAt', { length: 255 }),
  userId: varchar('userId', { length: 255 }).notNull()
});