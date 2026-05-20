const axios = require("axios");



export const BASE_URL = "https://linked-in-clone-ie9l.vercel.app/";

export const clientServer = axios.create({
    baseURL : BASE_URL,
})
