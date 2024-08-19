

import express from "express"
import { google, signin, signOut, signup } from "../controllers/authController.js";


const authRouter = express.Router()


authRouter.post('/sign-up', signup)


authRouter.post('/sign-in', signin)


authRouter.post('/google', google)


authRouter.post('/sign-out', signOut)



export default  authRouter ;