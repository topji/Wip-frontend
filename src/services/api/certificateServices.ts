// ### 1. Create Certificate
// ```http
// POST /certificates/create
// Content-Type: application/json

import axios from "axios";

export interface CreateCertificateRequest {
    fileHash: string;
    metadataURI: string;
    userAddress: string;
}

export interface CreateCertificateResponse {
    success: boolean;
    message: string;
    transaction: string;
    certificateId: string;
}

export const createCertificate = async (payload: CreateCertificateRequest): Promise<CreateCertificateResponse> => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/certificates/create`, payload);
    return response.data;
};


