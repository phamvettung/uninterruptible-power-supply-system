import { POST, GET } from '../constants/httpMethod';
import BASE_URL from "../api";

export const getAllUsers = async () => {
    const response = await BASE_URL[GET]("/user/all");
    console.log(response);
    
    return response.data;
}