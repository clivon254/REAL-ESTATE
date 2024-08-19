

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import {toast} from "sonner"
import {Link} from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'


export default function Signin() {

  const [formData, setFormData] = useState({})

  const {loading, error} = useSelector((state) => state.user)

  const navigate = useNavigate()

  const dispatch = useDispatch()

  // handleChange
  const handleChange = (e) => {

    setFormData({...formData, [e.target.name]:e.target.value})

  }


  // handleSubmit
  const handleSubmit = async (e) => {

    e.preventDefault()

    try
    {
      dispatch(signInStart())

      const res = await axios.post(`/api/auth/sign-in`, formData)

      if(res.data.success)
      {
        dispatch(signInSuccess(res.data.rest))

        navigate('/')

        toast.success("signed in successfully")

      }
      else
      {
        dispatch(signInFailure(res.data.message))
      }

    }
    catch(error)
    {
        dispatch(signInFailure(error.message))
    }

  }


  return (
    
    <div className="p-3 max-w-lg mx-auto">

        <h1 className="text-3xl text-center font-semibold my-7">
          Sign In
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">


          <input 
            type="email" 
            placeholder="email"
            className="border p-3 rounded-lg" 
            name="email"
            value={formData.email}
            onChange={handleChange}
          />


          <input 
            type="password" 
            placeholder="password"
            className="border p-3 rounded-lg" 
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

          <button 
            disabled={loading}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? 'loading .....': 'Sign Up'}
          </button>

          <OAuth />

        </form>

        <div className="flex gap-2 mt-5">

          <p className="">Dont have an account?</p>

          <Link to='/sign-up'>

            <span className="text-blue-700">Sign in</span>

          </Link>

        </div>

        {
          error && <p className="text-red-500 mt-5">{error}</p>
        }

    </div>

  )

}
