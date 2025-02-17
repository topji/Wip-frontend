import { createContext, useContext, useState, ReactNode } from "react";

interface ShareInfo {
  address: string;
  percentage: number;
}

interface ShareContextType {
  shares: ShareInfo[];
  addShare: (info: ShareInfo) => void;
  removeShare: (address: string) => void;
  updateShare: (address: string, updates: Partial<ShareInfo>) => void;
  clearShares: () => void;
  totalPercentage: number;
  setShares: (shares: ShareInfo[]) => void;
}

const ShareContext = createContext<ShareContextType | undefined>(undefined);

export function ShareProvider({ children }: { children: ReactNode }) {
  const [shares, setShares] = useState<ShareInfo[]>([]);

  const totalPercentage = shares.reduce(
    (sum, share) => sum + share.percentage,
    0
  );

  const addShare = (info: ShareInfo) => {
    if (totalPercentage + info.percentage > 100) {
      throw new Error("Total share percentage cannot exceed 100%");
    }
    setShares((prev) => [...prev, info]);
  };

  const removeShare = (address: string) => {
    setShares((prev) => prev.filter((share) => share.address !== address));
  };

  const updateShare = (address: string, updates: Partial<ShareInfo>) => {
    setShares((prev) => {
      const newShares = [...prev];
      const index = newShares.findIndex((share) => share.address === address);
      if (index !== -1) {
        const updatedShare = { ...newShares[index], ...updates };
        const otherShares = newShares.filter((_, i) => i !== index);
        const newTotal =
          otherShares.reduce((sum, share) => sum + share.percentage, 0) +
          (updates.percentage ?? newShares[index].percentage);

        if (newTotal > 100) {
          throw new Error("Total share percentage cannot exceed 100%");
        }

        newShares[index] = updatedShare;
      }
      return newShares;
    });
  };

  const clearShares = () => {
    setShares([]);
  };

  const value = {
    shares,
    addShare,
    removeShare,
    updateShare,
    clearShares,
    totalPercentage,
    setShares,
  };

  return (
    <ShareContext.Provider value={value}>{children}</ShareContext.Provider>
  );
}

export function useShare() {
  const context = useContext(ShareContext);
  if (context === undefined) {
    throw new Error("useShare must be used within a ShareProvider");
  }
  return context;
}
