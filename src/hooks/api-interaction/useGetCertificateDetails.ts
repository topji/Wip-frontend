import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getCertificateIds = async (userAddress: string): Promise<string[]> => {
    const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/certificates/user/${userAddress}`
    );
    return response.data.data;
};

export const useGetCertificateIds = (userAddress: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["certificateIds", userAddress],
        queryFn: () => getCertificateIds(userAddress),
        enabled: !!userAddress,
    });

    return { data, isLoading, error };
};

// GET /certificates/:certificateId

interface CertificateDetails {
    success: boolean;
    data: {
        id: number;
        fileHash: string;
        metadataURI: string;
        description: string;
        fileFormat: string;
        timestamp: number;
        owners: {
            walletAddress: string;
            percentage: number;
        }[];
        updates: string[];
        metadataUpdates: string[];
        transactionHash: string;
        createdAt: string;
        updatedAt: string;
    }
}

// {
//     "success": true,
//     "data": {
//         "id": 16,
//         "fileHash": "dkjfcweikdcnxkjdsckjwa",
//         "metadataURI": "dsjndcwkejascniwejkdascnijkw",
//         "description": "This is a patent for a new technology",
//         "fileFormat": ".pdf",
//         "timestamp": 1739277702,
//         "owners": [
//             {
//                 "walletAddress": "0xc55ba672518eb7b61d6b0dd1ed8d6605ed8ad6ce",
//                 "percentage": 90
//             },
//             {
//                 "walletAddress": "0xd9ce19b00eb5cbef476a402f1799a89172b736d7",
//                 "percentage": 10
//             }
//         ],
//         "updates": [],
//         "metadataUpdates": [],
//         "transactionHash": "0x7cc6964b8e391fe684f74c0474f80ce8fbe3ff627a16290c26f66140e3df4316",
//         "createdAt": "2025-02-11T12:41:46.105Z",
//         "updatedAt": "2025-02-11T12:41:46.105Z"
//     }
// }

const getCertificateDetails = async (certificateId: string): Promise<CertificateDetails> => {
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



