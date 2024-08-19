
import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import ListingItem from '../components/ListingItem';


export default function Search() {

    const navigate = useNavigate() ;

    const [sidebardata ,setSidebardata] = useState({
        searchTerm:"",
        type:'all',
        parking:false,
        furnished:false,
        sort:'created_at',
        order:'desc'
    })

    const [loading, setLoading] = useState(false)

    const [listings, setListings] = useState([])

    const [showMore, setShowMore] = useState(false)

    useEffect(() => {

        const urlParams = new URLSearchParams(location.search);

        const searchTermFromUrl = urlParams.get('searchTerm')

        const typeFromUrl = urlParams.get('type')

        const parkingFromUrl = urlParams.get('parking')

        const furnishedFromUrl = urlParams.get('furnished')

        const offerFromUrl = urlParams.get('offer')

        const orderFromUrl = urlParams.get('order')

        const sortFromUrl = urlParams.get('sort')

        if
        (
            searchTermFromUrl || 
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            orderFromUrl ||
            sortFromUrl
        )
        {
          setSidebardata({
            searchTerm : searchTermFromUrl || '',
            type:typeFromUrl || 'all',
            parking :parkingFromUrl === 'true' ? true : false ,
            furnished :furnishedFromUrl === 'true' ? true : false ,
            offer :orderFromUrl === 'true' ? true : false ,
            sort:sortFromUrl || 'created_at',
            order:orderFromUrl || 'desc',
          })
        }
        
        const fetchListings = async () => {

          try
          {
              setLoading(true)

              setShowMore(false)

              const searchQuery = urlParams.toString()

              const res = await axios.get(`/api/listing/get-listings?${searchQuery}`)

              if(res.data.success)
              {
                setListings(res.data.listings)

                setLoading(false)

                if(res.data.listings.length > 8)
                {
                  setShowMore(true)
                }
                else
                {
                  setShowMore(false)
                }
              }
          }
          catch(error)
          {
            console.log(error.message)
          }

        }
      
        fetchListings()

    },[location.search])

    console.log(listings)

    // handleSubmit
    const handleChange = (e) => {

      if(
        e.target.id === 'all' ||
        e.target.id === 'rent' ||
        e.target.id === 'sale'
      )
      {
        setSidebardata({...sidebardata, type: e.target.id})
      }

      if(e.target.id === 'searchTerm')
      {
        setSidebardata({...sidebardata, searchTerm : e.target.id})
      }

      if(
        e.target.id === 'parking' ||
        e.target.id === 'furnished' ||
        e.target.id === 'offer' 
      )
      {
        setSidebardata({
          ...sidebardata,
          [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false , 
        })
      }

      if(e.target.id === 'sort_order')
      {
        const sort = e.target.value.split('_')[0] || 'created_at'

        const order = e.target.value.split('_')[0] || 'desc'

        setSidebardata({...sidebardata, sort, order})
      }

    }

    // handleSubmit
    const handleSubmit = (e) => {

      e.preventDefault()

      const urlParams = new URLSearchParams() ;

      urlParams.set('searchTerm', sidebardata.searchTerm)

      urlParams.set('type', sidebardata.type)

      urlParams.set('parking', sidebardata.parking)

      urlParams.set('furnished', sidebardata.furnished)

      urlParams.set('offer', sidebardata.offer)

      urlParams.set('sort', sidebardata.sort)

      urlParams.set('order', sidebardata.order)

      const searchQuery = urlParams.toString()

      navigate(`/search?${searchQuery}`)
    }

    // onShowMore
    const onShowMore = async () => {

      const numberOfListings = listings.length

      const startIndex = numberOfListings ;

      const urlParams = new URLSearchParams(loaction.search)

      urlParams.set('startIndex', startIndex)

      const searchQuery = urlParams.toString()

      const res = await axios.get(`/api/listing/get-listings?${searchQuery}`)

      if(res.data.success)
      {

        if(res.data.listings < 9)
        {
          setShowMore(false)
        }

        setListings([...listings, ...res.data.listings])
      }

    }

  return (

    <div className="flex flex-col md:flex-row">

      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          <div className="flex items-center gap-2">

            <label htmlFor="" className="whitespace-nowrap font-semibold">
              Search Term
            </label>

            <input 
              type="text" 
              id='searchTerm'
              placeholder='Search....'
              className="borde rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />

          </div>

          <div className="flex gap-2 flex-wrap items-center ">

            <label htmlFor="" className="font-semibold">Type</label>

            <div className="flex gap-2">

              <input 
                  type="checkbox"
                  id="all"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.type === 'all'}
              />

              <span className="">Rent & Sale</span>

            </div>

            <div className="flex gap-2">

              <input 
                  type="checkbox"
                  id="rent"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.type === 'rent'}
              />

              <span className="">Rent</span>

            </div>

            <div className="flex gap-2">

              <input 
                  type="checkbox"
                  id="sale"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.type === 'sale'}
              />

              <span className="">Sale</span>

            </div>

            <div className="flex gap-2">

              <input 
                  type="checkbox"
                  id="offer"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.offer}
              />

              <span className="">offer</span>

            </div>

          </div>

          <div className="flex gap-2 flex-wrap items-center ">

            <label  className="font-semibold">Amenities</label>

           <div className="flex gap-2">

              <input 
                  type="checkbox"
                  id="parking"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.parking}
              />

              <span className="">Parking</span>

            </div>

            <div className="flex gap-2">

              <input 
                  type="checkbox"
                  id="furnished"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.furnished}
              />

              <span className="">Rent & Sale</span>

            </div>

          </div>

          <div className="flex items-center gsp-2">

            <label htmlFor="" className="font-semibold">Sort :</label>

            <select 
              id="sort_order" 
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              className="border rounded-lg p-3"
            >
              <option value="regulaPrice_desc">Price high to low </option>

              <option value="regulaPrice_asc">Price low to high </option>

              <option value="createdAt_asc">Latest</option>

              <option value="createdAt_desc">Oldest</option>

            </select>

          </div>

          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 ">
            search
          </button>

        </form>

      </div>

      <div className="flex-1">

        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>

        <div className="p-7 flex flex-wrap gap-4">
          {
            !loading && listings.length === 0 && (

              <p className="text-xl text-slate-700">
                No Listing found
              </p>

            )
          }

          {loading && (

            <p className="text-xl text-slate-700 text-center w-full">
              Loading ...
            </p>
          )}

          {
            !loading &&  
            listings && 
            listings.map((listing) => (

              <ListingItem key={listing._id} listing={listing} />

            ))
          }

          {showMore && (
            <button 
            onClick={onShowMore}
            className="text-green hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>

      </div>

    </div>

  )

}
