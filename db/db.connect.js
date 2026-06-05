const dns = require("dns")
dns.setServers(["8.8.8.8", "8.8.4.4"])

const mongoose = require("mongoose")
require("dotenv").config()

const mongoUri = process.env.MONGODB

const initialization = async ()=>{
    await mongoose
    .connect(mongoUri)
    .then(()=>{
        console.log("connect to Database")
    }).catch((error)=> console.log(" Error connecting to Database"))
}

module.exports = {initialization}