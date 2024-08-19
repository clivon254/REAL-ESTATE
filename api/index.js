
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import "dotenv/config"
import authRouter from "./routes/authRoute.js"
import userRouter from "./routes/userRoute.js"
import bodyParser from "body-parser"
import listingRouter from "./routes/listingRoute.js"
import path from "path"



const app = express()

const PORT = process.env.PORT ;


const __dirname = path.resolve();


// middleweare
app.use(cors())

app.use(express.json())

app.use(cookieParser())

app.use(bodyParser.json())


// DB CONECTION
mongoose.connect(process.env.MONGO)
.then(() => {
    console.log("DB CONNECTED !!!")
 })
.catch((err) => {
    console.log(err)
})


// API
app.get('/',(req,res) => {

    res.send("HELLO REAL ESTATE PEOPLE")

})


// ROUTES
app.use('/api/auth', authRouter)


app.use('/api/user', userRouter)


app.use('/api/listing', listingRouter)


app.use(express.static(path.join(__dirname ,'/client/dist')))


app.get('*', (req, res) => {
  
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  
})




//  LISTENING
app.listen(PORT , () => {

    console.log(`server is running on ${PORT}`)

})




app.use((err, req,res,next) => {

    const statusCode = err.statusCode || 500 ;

    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })

})