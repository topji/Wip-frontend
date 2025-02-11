import { useState, useEffect } from "react";
import illustration from "@/assets/illustrations/4.svg";
import logo from "/World_IP_logo.svg";
import { useNavigate } from "react-router";
import { useShare } from "@/context/ShareContext";
import { useUser } from "@/context/UserContext";
import { TextArea } from "@/components/TextArea/TextArea";
import WalletButton from "@/components/wallet/WalletButton";

interface Creator {
  address: string;
  percentage: number;
}

const RegisterOwner = () => {
  const [ownerType, setOwnerType] = useState<"sole" | "multiple">("sole");
  const [creators, setCreators] = useState<Creator[]>([]);
  const [newAddress, setNewAddress] = useState("");
  const [newShare, setNewShare] = useState("");
  const [details, setDetails] = useState("");
  const [disclaimer, setDisclaimer] = useState(false);
  const { user } = useUser();
  const { addShare, clearShares } = useShare();
  const navigate = useNavigate();

  // Initialize creators when ownerType changes
  useEffect(() => {
    clearShares();
    if (ownerType === "multiple" && user) {
      setCreators([{ address: user.publicAddress, percentage: 50 }]);
    } else {
      setCreators([]);
    }
  }, [ownerType, user]);

  const handleContinue = () => {
    if (ownerType === "sole" && user) {
      addShare({
        address: user.publicAddress,
        percentage: 100,
      });
    } else if (ownerType === "multiple") {
      creators.forEach((creator) => {
        addShare({
          address: creator.address,
          percentage: creator.percentage,
        });
      });
    }
    navigate("/confirm-register");
  };

  const handleAddCreator = () => {
    if (!newAddress || !newShare || !user) return;

    const shareValue = Number(newShare);
    if (shareValue <= 0) return;

    // Remove empty creator and add new one
    const otherCreators = creators.filter(
      (c) => c.address !== "" && c.address !== user.publicAddress
    );
    const newCreators = [
      ...otherCreators,
      { address: newAddress, percentage: shareValue },
    ];

    // Calculate and set main user's share
    const totalOtherShares = newCreators.reduce(
      (sum, c) => sum + c.percentage,
      0
    );
    const mainUserShare = Math.max(0, 100 - totalOtherShares);

    setCreators([
      { address: user.publicAddress, percentage: mainUserShare },
      ...newCreators,
    ]);

    setNewAddress("");
    setNewShare("");
  };

  const handleRemoveCreator = (address: string) => {
    if (!user || address === user.publicAddress) return;

    const remainingCreators = creators.filter((c) => c.address !== address);
    const otherCreators = remainingCreators.filter(
      (c) => c.address !== user.publicAddress
    );

    // Calculate and set main user's share
    const totalOtherShares = otherCreators.reduce(
      (sum, c) => sum + c.percentage,
      0
    );
    const mainUserShare = Math.max(0, 100 - totalOtherShares);

    setCreators([
      { address: user.publicAddress, percentage: mainUserShare },
      ...otherCreators,
    ]);
  };

  return (
    <main className="flex gap-8 grow">
      <div className="flex flex-col gap-8 items-center justify-center grow">
        <div className="self-start px-16 pb-8 pt-12">
          <img src={logo} alt="logo" />
        </div>
        <h1 className="text-6xl font-medium w-[18ch]">
          <span className="text-orange-400">Select </span>
          <span className="text-blue-500">Ownership</span>
        </h1>
        <div className="relative">
          <img src={illustration} alt="illustration" />
        </div>
      </div>

      <div className="bg-[#F8F8F8] p-12 w-[47%] flex flex-col items-start gap-8 justify-center">
        <div className="self-end">
          <WalletButton />
        </div>
        <div className="flex flex-col grow justify-center gap-6 space-y-4 w-full">
          <div className="flex items-center max-w-128 gap-4 cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center">
              <input
                className="radio [--input-color:#7357FF] [--border:2px]"
                type="radio"
                name="owner"
                id="sole"
                checked={ownerType === "sole"}
                onChange={() => setOwnerType("sole")}
              />
            </div>
            <div>
              <label htmlFor="sole" className="text-lg font-medium">
                Sole Creator
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4 cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center">
              <input
                className="radio [--input-color:#7357FF] [--border:2px]"
                type="radio"
                name="owner"
                id="multiple"
                checked={ownerType === "multiple"}
                onChange={() => setOwnerType("multiple")}
              />
            </div>
            <div>
              <label htmlFor="multiple" className="text-lg font-medium">
                Multiple Creators
              </label>
            </div>
          </div>

          {ownerType === "multiple" && (
            <div className="flex flex-col gap-4 mt-4">
              {/* Display all creators */}
              {creators.map((creator, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-100 p-4 rounded-lg"
                >
                  <span className="text-gray-600">
                    {creator.address === user?.publicAddress
                      ? "You"
                      : creator.address || "Pending Creator"}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="bg-white px-4 py-2 rounded-full">
                      {creator.percentage}%
                    </span>
                    {creator.address !== user?.publicAddress &&
                      creator.address && (
                        <button
                          onClick={() => handleRemoveCreator(creator.address)}
                          className="text-red-500 hover:text-red-700 px-2"
                        >
                          ×
                        </button>
                      )}
                  </div>
                </div>
              ))}

              {/* Add new creator */}
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Wallet Address of Creator"
                  className="flex-grow p-3 rounded-lg border border-gray-200"
                />
                <input
                  type="number"
                  value={newShare}
                  onChange={(e) => setNewShare(e.target.value)}
                  placeholder="Share %"
                  className="w-24 p-3 rounded-lg border border-gray-200"
                />
                <button
                  onClick={handleAddCreator}
                  className="text-blue-600 font-medium"
                >
                  Add
                </button>
              </div>

              <TextArea
                value={details}
                onChange={setDetails}
                placeholder="Detail of Co-Creation"
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={disclaimer}
                  onChange={(e) => setDisclaimer(e.target.checked)}
                  className="checkbox [--radius-selector:0.5rem] [--color-base-content:white] [--input-color:black] [--border:2px]"
                />
                <span className="text-sm text-gray-600">
                  Disclaimer <span className="text-blue-600">View</span>
                </span>
              </div>
            </div>
          )}

          <button
            className="bg-[#FF9519] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full flex items-center gap-2 w-fit"
            disabled={
              ownerType === "multiple" &&
              (!disclaimer ||
                creators.reduce((sum, c) => sum + c.percentage, 0) !== 100)
            }
            onClick={handleContinue}
          >
            Continue
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 12L12 4M5.5 4H12V10.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
};

export default RegisterOwner;
