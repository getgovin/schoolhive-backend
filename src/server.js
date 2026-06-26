import express from "express"
import { db } from "../config/database.js";
import env from "../config/env.js";
import app from "../app.js";


app.listen(env.PORT , () =>{
    console.log(`App statred on port ${process.env.PORT}`)
})

