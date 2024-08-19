
import express from "express"
import { createListing, deleteListing, getListing, getListings, updateListing } from "../controllers/listingController.js"
import { verifyToken } from "../utlis/verifyUser.js"


const listingRouter = express.Router()


listingRouter.post('/create-listing' , createListing)

listingRouter.delete('/delete-listing/:id',verifyToken , deleteListing)

listingRouter.put('/update-listing/:id', verifyToken,  updateListing)

listingRouter.get('/get-listing/:id', getListing)

listingRouter.get('/get-listings' , getListings)



export default  listingRouter 