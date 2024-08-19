import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from './pages/Home'
import SignUp from './pages/SignOut'
import Signin from './pages/Signin'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import {Toaster} from "sonner"
import PrivateRoute from './components/PrivateRoute'
import CreateListings from './pages/CreateListings'
import Listing from './pages/Listing'
import UpdateListing from './pages/UpdateListing'
import Search from './pages/search'

export default function App() {

  return (

    <BrowserRouter>

      <Header/>

      <Routes>

        <Route path="/" element={<Home/>}/>

        <Route path="/sign-in" element={<Signin/>}/>

        <Route path="/sign-up" element={<SignUp/>}/>

        <Route path="/about" element={<About/>}/>

        <Route path="/search" element={<Search/>}/>

        <Route path="/listing/:id" element={<Listing/>}/>

        <Route element={<PrivateRoute/>}>
          
            <Route path="/create-listing" element={<CreateListings/>}/>

            <Route path="/profile" element={<Profile/>}/>

            <Route path="/update-listing/:id" element={<UpdateListing/>}/>

        </Route>

      </Routes>

      <Toaster richColors/>

    </BrowserRouter>

  )

}

