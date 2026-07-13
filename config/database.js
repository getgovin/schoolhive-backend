import mongoose from "mongoose";
import env from "./env.js";
mongoose.connect(env.MONGODB_URI);

const db = mongoose.connection;

 db.on('connected' , () =>{
    console.log("Mongo DB is connected")
 })

  db.on('error' , () =>{
    console.log(`Mongo DB connection error `)
 })

  db.on('disconnected' , () =>{
    console.log("Mongo DB is disconnected")
 })

 export {db};