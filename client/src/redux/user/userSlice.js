
import {createSlice} from '@reduxjs/toolkit'

const initialState = {

    currentUser:null,
    error:null,
    loading:false,
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{

        signInStart:(state) => {

            state.loading = true ;

        },

        signInSuccess:(state, action) => {

            state.currentUser = action.payload ;

            state.loading = false ,

            state.error = null
        },

        signInFailure:(state,action) => {

            state.error = action.payload ;

            state.loading = false ;

        },

        updateUserStart:(state) => {

            state.loading = true ;

        },

        updateUserSuccess:(state, action) => {

            state.currentUser = action.payload ;

            state.loading = false ;
        },

        updateUserFailure:(state,action) => {

            state.error = action.payload ;

            state.loading = false
        },

        deleteUserStart:(state) => {

            state.loading = true ;

        },

        deleteUserSuccess:(state, action) => {

            state.loading = false ;

            state.error  = null ;

            state.currentUser = null

        },

        deleteUserFailure:() => {

            state.error = action.payload ;

            state.loading = false ;
        },

        signOutUserStart:(state) => {

            state.loading = true ;

        },

        signOutUsertSuccess:(state) => {
            
            state.currentUser = null ;

            state.loading = false ;

            state.error = null 
        },

        signOutUserFailure:(state, action) => {

            state.error = action.payload ;

            state.loading = false
        },
        
    }
})


export const {
    signInStart,
    signInSuccess,
    signInFailure,
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserSuccess,
    deleteUserStart,
    deleteUserFailure,
    signOutUserStart,
    signOutUsertSuccess,
    signOutUserFailure,
} = userSlice.actions

export default userSlice.reducer