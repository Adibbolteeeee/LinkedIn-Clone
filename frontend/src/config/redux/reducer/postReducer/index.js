import { createSlice } from "@reduxjs/toolkit"
import { reset } from "../authReducer"
import { getAllPosts } from "../../action/postAction";
import { getAboutUser } from "../../action/authAction";

const initialState = {
    posts : [],
    isError : false,
    postFetched : false,
    isLoading : false,
    loggedIn : false,
    message :"",
    comments : [],
    postId : "",
}

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers :{
        reset : () => initialState,
        resetPostId : (state) => {
            state.postId = "";
        },
        extraReducers : (builder) => {
            builder
            .addCase(getAllPosts.pending, (state) => {
                state.message = "Fetching all the posts";
                state.isLoading = true;
            })
            .addCase(getAllPosts.fulfilled, (state,action) => {
                state.isLoading = false;
                state.isError = false;
                state.postFetched = true;
                state.posts = action.payload.posts;
            })
            .addCase(getAllPosts.rejected,(state,action) =>{
                state.isError = true;
                state.message = action.payload;
            })
        }   
    }
})


export default postSlice.reducer;