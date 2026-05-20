import { createSlice } from "@reduxjs/toolkit"
import { reset } from "../authReducer"
import { getAllComments, getAllPosts } from "../../action/postAction";
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
                state.posts = action.payload.reverse();
            })
            .addCase(getAllPosts.rejected,(state,action) =>{
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getAllComments.fulfilled, (state,action) => {
                state.postId = action.payload.postId;
                state.comments = action.payload.comments;
            })
        }   
})

export const {resetPostId } = postSlice.actions;
export default postSlice.reducer;