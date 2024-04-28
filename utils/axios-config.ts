import axios, {AxiosInstance} from "axios";
import {server} from "./server";

const instance: AxiosInstance = axios.create({
    baseURL: server
})

export default instance