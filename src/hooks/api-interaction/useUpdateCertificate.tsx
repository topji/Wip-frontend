import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface UpdateCertificateRequest {
  certificateId: number;
  updatedFileHash: string;
  updatedMetadataURI: string;
  updatedDescription: string;
}

interface CertificateUpdate {
  fileHash: string;
  description: string;
  timestamp: number;
  transactionHash: string;
}

interface UpdateCertificateResponse {
  success: boolean;
  message: string;
  transaction: string;
  updateEntry: CertificateUpdate;
}

const updateCertificate = async (payload: UpdateCertificateRequest): Promise<UpdateCertificateResponse> => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/certificates/update`,
    payload
  );
  return response.data;
};

export const useUpdateCertificate = () => {
  return useMutation({
    mutationFn: updateCertificate,
  });
};
