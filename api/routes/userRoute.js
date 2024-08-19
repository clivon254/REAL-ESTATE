

import express from "express"
import { deleteUser, getUser, getUserListings, test, updateUser } from "../controllers/userController.js";
import { verifyToken } from "../utlis/verifyUser.js";

const userRouter = express.Router()


userRouter.post('/test',  test)

userRouter.put('/update/:id',verifyToken, updateUser)

userRouter.get('/get-user/:id', verifyToken, getUser)

userRouter.get('/getUser-listings/:id',verifyToken , getUserListings)

userRouter.delete('/delete-user/:id',verifyToken , deleteUser)



export default  userRouter ;