import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface CertificateOwner {
    walletAddress: string;
    percentage: number;
}

export interface CertificateData {
    _id: string;
    certificateId: number;
    fileHash: string;
    description: string;
    fileFormat: string;
    timestamp: number;
    owners: CertificateOwner[];
}

interface CertificatesResponse {
    success: boolean;
    data: CertificateData[];
}

const getCertificateIds = async (userAddress: string): Promise<CertificatesResponse> => {
    const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/certificates/user/${userAddress}`
    );
    return response.data;
};

export const useGetCertificateIds = (userAddress: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["certificateIds", userAddress],
        queryFn: () => getCertificateIds(userAddress),
        enabled: !!userAddress,
    });

    return { data, isLoading, error };
}; 