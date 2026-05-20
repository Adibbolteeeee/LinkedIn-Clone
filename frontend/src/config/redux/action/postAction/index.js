import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/posts");
      console.log(response.data)
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, thunkAPI) => {
    try {
      const { file, body } = userData;
      const formData = new FormData();
      formData.append("token", localStorage.getItem("token"));
      formData.append("body", body);
      formData.append("file", file);
      const response = await clientServer.post("/post", formData);
      if(response.status === 200) {
            return thunkAPI.fulfillWithValue("Post uploaded");
        }
        else {
            return thunkAPI.rejectWithValue("Post not uploaded");
        }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);


export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (postId, thunkAPI) => {
    try {     
         const response = await clientServer.delete("/deletePost", {
        data: {
          token: localStorage.getItem("token"), 
          postId: postId,
        }
      });
      return thunkAPI.fulfillWithValue("Post deleted");
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);


export const incremenetLikes = createAsyncThunk(
  "post/incremenetLikes",
  async (post, thunkAPI) => {
    try {
          const response = await clientServer.post("/incrementPostLike", {
            token: localStorage.getItem("token"),
            postId: post.postId
          });
          return thunkAPI.fulfillWithValue("Like incremented");
        } catch (err) {
          return thunkAPI.rejectWithValue(err.response.data);
        }
      }
    );

export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async (postData, thunkAPI) => {
    try {      
      const response = await clientServer.get("/getComments", {
       params: {
         postId: postData.postId
       }
      });
      return thunkAPI.fulfillWithValue({
        comments : response.data.comments,
        postId : postData.postId
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const postComment = createAsyncThunk(
  "post/postComment",
  async (commentData, thunkAPI) => {
    try {
      const response = await clientServer.post("/addComment", {
        token : localStorage.getItem("token"),
        postId : commentData.postId,
        commentBody : commentData.body
      });
      return thunkAPI.fulfillWithValue("Comment added");
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    } 
  }
);