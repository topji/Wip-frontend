import { format } from "date-fns";

interface Copyright {
  id: string;
  createdAt: string;
  hashId: string;
  description: string;
  image: string;
  owners: {
    address: string;
    percentage: number;
  }[];
}

const Dashboard = () => {
  // Mock data - replace with actual data fetching
  const copyrights: Copyright[] = [
    {
      id: "1",
      createdAt: "2025-01-31T12:38:00",
      hashId: "3ccfc7fd-bf8a-44c8-b2a3-3b3bd09a24b8",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      image: "/path-to-image.jpg",
      owners: [
        { address: "0x1234...5678", percentage: 90 },
        { address: "0x8765...4321", percentage: 10 },
      ],
    },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          My #Copyrights
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </h1>
      </div>

      <div className="space-y-6">
        {copyrights.map((copyright) => (
          <div
            key={copyright.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex gap-8">
              {/* Image Preview */}
              <div className="w-72 h-96 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={copyright.image}
                  alt="Copyright preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 space-y-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Created on</div>
                  <div>
                    {format(
                      new Date(copyright.createdAt),
                      "dd/MM/yyyy | HH:mm"
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Hash ID for this File
                  </div>
                  <div className="font-mono">{copyright.hashId}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Description</div>
                  <p className="text-gray-700">{copyright.description}</p>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Ownership Rights
                  </div>
                  <div className="flex gap-4">
                    {copyright.owners.map((owner, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">
                            {owner.address.charAt(2).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-gray-600">{owner.address}</span>
                        <span className="text-gray-400">
                          {owner.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="px-6 py-2 bg-blue-500 text-white rounded-full flex items-center gap-2 hover:bg-blue-600 transition-colors">
                    Download Certificate
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                  <button className="px-6 py-2 bg-orange-500 text-white rounded-full flex items-center gap-2 hover:bg-orange-600 transition-colors">
                    Verify
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
