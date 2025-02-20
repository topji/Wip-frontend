import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useMagic } from "../useMagic";
import { generateUserName } from "@/utils/generateUserName";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router";
export interface User {
    email: string;
    password: string;
    category: string | null;
}

interface UserPayload {
    username: string;
    email: string;
    company: string;
    tags: string[];
    userAddress: string;
}

type CreateUserResponse = {
    success: boolean;
    message: string;
    transaction: string;
}

export const createUser = async (user: UserPayload): Promise<AxiosResponse<CreateUserResponse>> => {
    return await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, user);
};

export const useCreateMagicUser = (
    mutationConfig?: UseMutationOptions<AxiosResponse<CreateUserResponse>, Error, User>
) => {
    const { magic } = useMagic();
    const { setUser } = useUser();
    const navigate = useNavigate();


    return useMutation({
        mutationFn: async (user: User) => {
            await magic?.auth.loginWithEmailOTP({
                email: user.email,
            });
            const userInfo = await magic?.user.getInfo();
            const userPayload = {
                username: userInfo?.publicAddress
                    ? generateUserName(userInfo.publicAddress)
                    : "",
                email: userInfo?.email ?? "NA",
                company: "NA",
                tags: user.category?.split(",") ?? [],
                userAddress: userInfo?.publicAddress ?? "",
            };
            return await createUser(userPayload);

        },
        onSuccess: async () => {
            const userInfo = await magic?.user.getInfo();
            const userPayload = {
                email: userInfo?.email ?? "",
                publicAddress: userInfo?.publicAddress ?? "",
                username: generateUserName(userInfo?.publicAddress ?? ""),
                walletType: "magic-link" as const,
            };
            setUser(userPayload);
            navigate("/create-hash");
        },
        ...mutationConfig,
    });
};

export const useCreateRainbowKitUser = (
    mutationConfig?: UseMutationOptions<AxiosResponse<CreateUserResponse>, Error, UserPayload>
) => {
    return useMutation({
        mutationFn: createUser,
        ...mutationConfig,
    });
};




