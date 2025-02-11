import axios from "axios";

interface UserExistsResponse {
    success: boolean;
}


export const userExists = async (address: string): Promise<UserExistsResponse> => {
    const response = await axios.get<UserExistsResponse>(
        `${import.meta.env.VITE_API_URL}/users/isUser/${address}`
    );
    return response.data;
};


