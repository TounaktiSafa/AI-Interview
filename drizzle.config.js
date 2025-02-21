import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_ZgfSBaL4x6vr@ep-square-star-a81818po-pooler.eastus2.azure.neon.tech/neondb?sslmode=require'
  }
});
