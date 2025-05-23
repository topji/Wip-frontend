import { createBrowserRouter } from "react-router";
import MainLayout from "./views/layouts/MainLayout";
import { RouterProvider } from "react-router";
import Welcome from "./views/pages/Welcome";
import AuthPage from "./views/pages/AuthPage";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { mainnet } from "wagmi/chains";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import MagicProvider from "./hooks/useMagic";
import RegisterIP from "./views/pages/RegisterIP";
import RegisterOwner from "./views/pages/RegisterOwner";
import { UserProvider } from "./context/UserContext";
import { ShareProvider } from "./context/ShareContext";
import ConfirmRegister from "./views/pages/ConfirmRegister";
import RegisterSuccess from "./views/pages/RegisterSuccess";
import Dashboard from "./views/pages/Dashboard";
import DashboardLayout from "./views/layouts/DashboardLayout";
import UpdateCertificate from "./views/pages/UpdateCertificate";
import UpdateSuccess from "./views/pages/UpdateSuccess";
import VerifyCertificate from "./views/pages/VerifyCertificate";
import VerificationSuccess from "./views/pages/VerificationSuccess";
import ProtectedLayout from "./views/layouts/ProtectedLayout";
const config = getDefaultConfig({
  appName: "World IP",
  projectId: "7825716eb0430cd79e3edfabcd5e7518",
  chains: [mainnet],
});

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Welcome />,
      },
      {
        path: "auth",
        element: <AuthPage />,
      },
      {
        path: "create-hash", // create-hash
        element: (
          <ProtectedLayout>
            <RegisterIP />
          </ProtectedLayout>
        ),
      },
      {
        path: "set-ownership", // set-ownership
        element: (
          <ProtectedLayout>
            <RegisterOwner />
          </ProtectedLayout>
        ),
      },
      {
        path: "creation-pending", // creation-pending
        element: (
          <ProtectedLayout>
            <ConfirmRegister />
          </ProtectedLayout>
        ),
      },
      {
        path: "creation-success", // creation-success
        element: (
          <ProtectedLayout>
            <RegisterSuccess />
          </ProtectedLayout>
        ),
      },
    ],
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        ),
      },
    ],
  },
  {
    path: "update-certificate",
    element: (
      <ProtectedLayout>
        <UpdateCertificate />
      </ProtectedLayout>
    ),
  },
  {
    path: "update-success",
    element: (
      <ProtectedLayout>
        <UpdateSuccess />
      </ProtectedLayout>
    ),
  },
  {
    path: "verify-certificate",
    element: (
      <ProtectedLayout>
        <VerifyCertificate />
      </ProtectedLayout>
    ),
  },
  {
    path: "verification-success",
    element: (
      <ProtectedLayout>
        <VerificationSuccess />
      </ProtectedLayout>
    ),
  },
]);

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <MagicProvider>
            <UserProvider>
              <ShareProvider>
                <RouterProvider router={router} />
              </ShareProvider>
            </UserProvider>
          </MagicProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
