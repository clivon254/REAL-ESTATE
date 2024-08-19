

import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, uploadBytes, uploadBytesResumable,ref } from "firebase/storage"
import { app } from '../firebase'
import {Link} from "react-router-dom"
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUsertSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice'
import axios from "axios"

export default function Profile() {

  const fileRef = useRef(null)

  const {currentUser , loading , error} = useSelector((state) => state.user)

  const [file, setFile] = useState(undefined)

  const [filePerc, setFilePerc] = useState(0)

  const [fileUploadError, setFileUploadError] = useState(false)

  const [formData, setFormData] = useState({})

  const [updateSuccess, setUpdateSuccess] = useState(false)

  const [showListingError, setShowListingError] = useState(false)

  const [userListings, setUserListings] = useState([])

  const dispatch = useDispatch()

  useEffect(() => {

    if(file)
    {
      handleFileUpload(file)
    }
  },[file])


  // handleFileUpload
  const handleFileUpload = (file) => {

    const storage = getStorage(app)

    const fileName = new Date().getTime() + file.name ;

    const storageRef = ref(storage, fileName)

    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes ) * 100

        setFilePerc(Math.round(progress))
      },
      (error) => {

        setFileUploadError(true)

      },
      () => {

        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => 
        setFormData({...formData, avatar:downloadURL}))

      }
    )
  }

  // handleChange
  const handleChange = (e) => {

    setFormData({...formData, [e.target.name] : e.target.value})

  }


  // handleSignout
  const handleSignOut = async () => {

    try
    {
        dispatch(signOutUserStart())

        const res = await axios.post(`/api/auth/sign-out`)

        if(res.data.success)
        {
          dispatch(signOutUsertSuccess())
        }
    }
    catch(error)
    {
      console.log(error)
    }

  }


  // handleDeleteUser
  const handleDeleteUser = async () => {

    try
    {
        dispatch(deleteUserStart())

        const res = await axios.delete(`/api/user/delete-user/${currentUser._id}`)

        if(res.data.success)
        {
          dispatch(deleteUserSuccess())

          toast.success("user deleted successfully")

        }
        else
        {
          dispatch(deleteUserFailure(res.data.message))
        }

    }
    catch(error)
    {
        dispatch(deleteUserFailure(error.message))
    }

  }


  // handleSubmit
  const handleSubmit = async (e) => {

    e.preventDefault()

    try
    {
        dispatch(updateUserStart())

        const res = await axios.put(`/api/user/update/${currentUser._id}`,formData)

        if(res.data.success)
        {
          setFormData(res.data.rest)

          dispatch(updateUserSuccess(res.data.rest))

          setUpdateSuccess(true)
        }

    }
    catch(error)
    {
      dispatch(updateUserFailure(error.message))
    }

  }


  // handleShowListings
  const handleShowListings = async () => {

    try
    {
      setShowListingError(false)

      const res = await axios.get(`/api/user/getUser-listings/${currentUser._id}`)

      if(res.data.success)
      {
        setUserListings(res.data.listings)
      }
      else
      {
        setShowListingError(true)
      }

    }
    catch(error)
    {
      console.log(error.message)
    }

  }


  // handleListingDelete 
  const handleListingDelete = async (listingId) => {

    try
    { 
      const res = await axios.delete(`/api/listing/delete-listing/${listingId}`)

      if(res.data.success)
      {

        setUserListings(
          (prev) => prev.filter((listing) => listing._id !== listingId)
        )

        toast.success("listing deleteed successfully")

      }
    }
    catch(error)
    {

    }

  }


  return (

    <div className="p-3 max-w-lg mx-auto">

      <h1 className="text-3xl font-semibold text-center my-7">
        Profile
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          hidden
          accept='image/*'
        />

        <img 
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar} 
          alt="profile" 
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" 
        />

        <p className="text-sm self-center">
          {
            fileUploadError ? 
            (
             <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
             </span>
            ) 
            :
            filePerc > 0 && filePerc < 100  ? 
                 (
                    <span className='text-slate-700'>{`uUploading ${filePerc} %`}</span>
                 )
                 :
                 filePerc === 100 ? 
                        (
                          <span className="text-green-700">Image successfully uploaded</span>
                        ) 
                        : 
                        (
                          ''
                        )
          }
        </p>

        <input 
          type="text" 
          className="border p-3 rounded-lg" 
          defaultValue={currentUser.username}
          name="username"
          onChange={handleChange}
        />

        <input 
          type="email" 
          className="border p-3 rounded-lg" 
          defaultValue={currentUser.email}
          name="email"
          onChange={handleChange}
        />

        <input 
          type="password" 
          placeholder="password"
          className="border p-3 rounded-lg" 
          defaultValue={currentUser.password}
          name="password"
          onChange={handleChange}
        />

        <button 
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabed:opacity-80"
        >
          {loading ? 'Loading ....' : 'Update'}
        </button>


        <Link
          to="/create-listing"
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          create Listing
        </Link>

      </form>

      <div className="flex justify-between mt-5">

        <span 
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>

        <span 
          onClick={handleSignOut}
          className="text-red-700 cursor-pointer"
        >
         Sign out
        </span>

      </div>

      <p className="text-red-700 my-5 text-center ">
        {error ? error : ''}
      </p>

      <p className="text-green-700 my-5 text-center text-sm">
         {updateSuccess ? "User is updated successfully" : ""}
      </p>

      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>

      <p className="text-red-700 my-5 text-center">
        { showListingError ? "Error showing listing" :""}
      </p>

      {
        userListings && userListings.length > 0 && (

          <div className="flex flex-col gap-4">

              <h1 className="text-center mt-7 text-2xl font-semibold">
                Your Listings
              </h1>

              {
                userListings?.map((listing) => (

                  <div 
                    key={listing._id}
                    className="border rounded-lg p-3 flex justify-between items-center gap-4"
                  >

                    <Link to={`/listing/${listing._id}`}>

                        <img 
                          src={listing.imageUrls[0]} 
                          alt="listing cover" 
                          className="h-16 w-16 object-contain"
                         />

                    </Link>

                    <Link 
                      className="text-slate-700 font-semibold hover:underline truncate flex-1"
                      to={`/listing/${listing._id}`}
                    >

                      <p className="text-lg font-bold">{listing.name}</p>

                    </Link>

                    <div className="flex flex-col item-center">

                      <button 
                        onClick={() => handleListingDelete(listing._id)}
                        className="text-red-700 uppercase"
                      >
                        Delete
                      </button>

                      <Link to={`/update-listing/${listing._id}`}>

                        <button className="text-green-700 uppercase">
                          Edit
                        </button>

                      </Link>

                    </div>

                  </div>

                ))
              }
          </div>

        )
      }

    </div>

  )

}
