import dotenv from "dotenv"
dotenv.config()
import app from "./src/app.js"
import http from "http"
import {initSocket} from "../backend/src/sockets/server.socket.js"
import connectToDb from "./src/config/database.js"

const httpServer = http.createServer(app);
initSocket(httpServer)
connectToDb()

httpServer.listen(3000,()=>{
    console.log("server is running at port no 3000")
})