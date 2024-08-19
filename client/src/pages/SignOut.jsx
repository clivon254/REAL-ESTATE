

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import {toast} from "sonner"
import {Link} from "react-router-dom"
import OAuth from '../components/OAuth'


export default function SignUp() {

  const [formData, setFormData] = useState({})

  const [error, setError] = useState(null)

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()


  // handleChange
  const handleChange = (e) => {

    setFormData({...formData, [e.target.name]:e.target.value})

  }


  // handleSubmit
  const handleSubmit = async (e) => {

    e.preventDefault()

    try
    {
        setLoading(true)

        const res = await axios.post(`/api/auth/sign-up`,formData)

        if(res.data.success)
        {
           setLoading(false)

           setError(null)

           navigate('/sign-in')

           toast.sonner("You have successfully signed up")

        }
    }
    catch(error)
    {
      setLoading(false)

      setError(error.message)
    }

  }


  return (
    
    <div className="p-3 max-w-lg mx-auto">

        <h1 className="text-3xl text-center font-semibold my-7">
          Sign Up
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input 
            type="text" 
            placeholder="username"
            className="border p-3 rounded-lg" 
            name="username"
            value={formData.username}
            onChange={handleChange}
          />

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

          <p className="">Have an account?</p>

          <Link to='/sign-in'>

            <span className="text-blue-700">Sign in</span>

          </Link>

        </div>

        {
          error && <p className="text-red-500 mt-5">{error}</p>
        }

    </div>

  )

}
