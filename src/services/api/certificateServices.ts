// ### 1. Create Certificate
// ```http
// POST /certificates/create
// Content-Type: application/json

import axios from "axios";

interface Owner {
    walletAddress: string;
    percentage: number;
}

export interface CreateCertificateRequest {
    fileHash: string;
    metadataURI: string;
    description: string;
    fileFormat: string;
    owners: Owner[];
}

export interface CreateCertificateResponse {
    success: boolean;
    message: string;
    transaction?: string;
    certificateId?: string;
    existingCertificateId?: number;
}

export const createCertificate = async (payload: CreateCertificateRequest): Promise<CreateCertificateResponse> => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/certificates/create`, payload);
    return response.data;
};


