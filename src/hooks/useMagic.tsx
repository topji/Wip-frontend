import { Magic as MagicBase } from "magic-sdk";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { OAuthExtension } from "@magic-ext/oauth2";

export type Magic = MagicBase<OAuthExtension[]>;

type MagicContextType = {
  magic: Magic | null;
};

const MagicContext = createContext<MagicContextType>({
  magic: null,
});

export const useMagic = () => useContext(MagicContext);

const MagicProvider = ({ children }: { children: ReactNode }) => {
  const [magic, setMagic] = useState<Magic | null>(null);

  useEffect(() => {
    const magic = new MagicBase("pk_live_58D03BEFF139E3C6", {
      network: {
        rpcUrl: "https://sepolia.base.org",
        chainId: 84532,
      },
      extensions: [new OAuthExtension()],
    });

    setMagic(magic);
  }, []);

  const value = useMemo(() => {
    return {
      magic,
    };
  }, [magic]);

  return (
    <MagicContext.Provider value={value}>{children}</MagicContext.Provider>
  );
};

export default MagicProvider;
