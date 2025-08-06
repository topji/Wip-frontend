import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface CertificateOwner {
    walletAddress: string;
    percentage: number;
}

export interface CertificateUpdate {
    fileHash: string;
    description: string;
    timestamp: number;
    transactionHash: string;
}

export interface CertificateDetails {
    id: number;
    fileHash: string;
    metadataURI: string;
    description: string;
    fileFormat: string;
    timestamp: number;
    owners: CertificateOwner[];
    updates: CertificateUpdate[];
    updatedFileHashes: string[];
    transactionHash: string;
    createdAt: string;
    updatedAt: string;
}

interface CertificateDetailsResponse {
    success: boolean;
    data: CertificateDetails;
}

const getCertificateDetails = async (certificateId: string): Promise<CertificateDetailsResponse> => {
    const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/certificates/${certificateId}`
    );
    return response.data;
};

export const useGetCertificateDetails = (certificateId: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["certificateDetails", certificateId],
        queryFn: () => getCertificateDetails(certificateId),
        enabled: !!certificateId,
    });

    return { data, isLoading, error };
};