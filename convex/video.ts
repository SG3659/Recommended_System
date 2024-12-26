import {v} from "convex/values";
import {action, internalQuery, internalMutation, query } from "./_generated/server"
import {embed} from "../src//lib/embedd"
import {internal} from"./_generated/api"
import {Doc} from "./_generated/dataModel"



// this function will fetch the video data
export const fetchVideosData = internalQuery({
   args:{
      ids:v.array(v.id("videos"))
   },
   handler:async (ctx,args)=>{
      const result =[]
      for(const id of args.ids){
         const video = await ctx.db.get(id);
         if(video){
            result.push(video)
         }
      }
      return result;
   },
})


// this function will return the similar video
export const videoSimilar = action({
   args: {
      query:v.string(),
   },
   handler:async (ctx , args) => {
      const embeddings = await embed(args.query);
      console.log(embeddings);
      const result =await ctx.vectorSearch("videos","by_search",{
         vector:embeddings,
         limit:2,
      }); 

      const videoIds =result.map((r)=>r._id)
      const videos: Array<Doc<"videos">> = await ctx.runQuery(
         internal.video.fetchVideosData,
         { ids: videoIds }
       );
       return videos;
     }
})

export const insertVideo = internalMutation({
   args:{
      title:v.string(),
      url:v.string(),
      thumbnail:v.string(),
      description:v.string(),
      category:v.string(),
      embedding:v.array(v.float64()),
   },
   handler:async (ctx,args)=>{
      // check 
      if(!args.title || !args.url || !args.thumbnail || !args.description || !args.category || !args.embedding){
         throw new Error("All fields are required")
      }
      const video = await ctx.db.insert("videos",{
         title:args.title,
         url:args.url,
         thumbnail:args.thumbnail,
         description:args.description,
         category:args.category,
         embedding:args.embedding,
      })
      return video;
   }
})

// add video function but not directly access above code 
export const addVideo=action({
   args:{
      title:v.string(),
      url:v.string(),
      thumbnail:v.string(),
      description:v.string(),
      category:v.string(),
      embedding:v.array(v.float64()),
   }, 
   handler:async (ctx,args)=>{
      // check
      if(!args.title || !args.url || !args.thumbnail || !args.description || !args.category || !args.embedding){
         throw new Error("All fields are required")
      }
      const embeddings = await embed(args.title);
       await ctx.runMutation(internal.video.insertVideo,{
         title: args.title,
         url: args.url,
         description: args.description,
         thumbnail: args.thumbnail,
         category: args.category,
         embedding: embeddings,
      });
      return {message:"Video added successfully"}
   }

})


// get all videos
export const allVideos = query({
   args:{},
   handler:async (ctx)=>{
      const videos = await ctx.db.query("videos").collect();
      return videos;
   }
})