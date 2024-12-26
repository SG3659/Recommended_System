import { defineSchema, defineTable } from "convex/server";
import {v} from "convex/values";

const schema =defineSchema({
   videos:defineTable({
      title:v.string(),
      url:v.string(),
      thumbnail:v.string(),
      description:v.string(),
      category:v.string(),
      embedding:v.array(v.float64()),
   }).vectorIndex("by_search",{
      vectorField:"embedding",
      dimensions:1024,
      filterFields:["category"],

   })
})

export default schema;