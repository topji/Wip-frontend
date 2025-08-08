import { useUser } from "@/context/UserContext";
import { Navigate } from "react-router";
import { useState, useEffect } from "react";
import { useMagic } from "@/hooks/useMagic";
import { userExists } from "@/services/api/userServices";
import { createUser } from "@/hooks/api-interaction/useCreateUser";
import { generateUserName } from "@/utils/generateUserName";
import { useSearchParams } from "react-router-dom";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, setUser } = useUser();
  const { magic } = useMagic();
  const [searchParams] = useSearchParams();
  const paramsCategory = searchParams.get("category");
  const [isCheckingOAuth, setIsCheckingOAuth] = useState<boolean>(true);
  const [, setIsProcessingOAuth] = useState<boolean>(false);

  // Handle OAuth processing directly in ProtectedLayout
  useEffect(() => {
    const handleOAuthProcessing = async () => {
      try {
        // Check if we're in an OAuth redirect scenario
        const urlParams = new URLSearchParams(window.location.search);
        const hasOAuthParams = urlParams.has('magic_credential') || 
                              (urlParams.has('code') && urlParams.has('state'));
        
        console.log("ProtectedLayout - Checking for OAuth params:", hasOAuthParams);
        console.log("ProtectedLayout - URL params:", Object.fromEntries(urlParams.entries()));
        
        if (!hasOAuthParams) {
          console.log("ProtectedLayout - No OAuth params, immediate check");
          setIsCheckingOAuth(false);
          return;
        }
        
        console.log("ProtectedLayout - OAuth params detected, processing...");
        setIsProcessingOAuth(true);
        
        // Wait for Magic to be available
        if (!magic) {
          console.log("ProtectedLayout - Magic not available, waiting...");
          return;
        }
        
        console.log("ProtectedLayout - Magic available, processing OAuth...");
        
        // Try to get redirect result
        const result = await magic.oauth2.getRedirectResult();
        console.log("ProtectedLayout - OAuth result:", result);
        
        if (result && result.magic && result.magic.userMetadata) {
          const userInfo = result.magic.userMetadata;
          console.log("ProtectedLayout - User info:", userInfo);
          
          if (userInfo?.publicAddress) {
            // Check if user exists
            console.log("ProtectedLayout - Checking if user exists...");
            const userExistsResponse = await userExists(userInfo.publicAddress);
            console.log("ProtectedLayout - User exists response:", userExistsResponse);
            
            if (userExistsResponse.success) {
              // User exists - sign them in
              console.log("ProtectedLayout - User exists, signing in...");
              const userPayload = {
                email: userInfo?.email ?? "",
                publicAddress: userInfo.publicAddress,
                username: generateUserName(userInfo.publicAddress),
                walletType: "magic-link" as const,
              };
              setUser(userPayload);
              // Clear URL parameters after successful authentication
              window.history.replaceState({}, document.title, window.location.pathname);
              console.log("ProtectedLayout - User set successfully!");
            } else {
              // User doesn't exist - create account
              console.log("ProtectedLayout - User doesn't exist, creating account...");
              const createUserPayload = {
                username: generateUserName(userInfo.publicAddress),
                email: userInfo?.email ?? "NA",
                company: "NA",
                tags: paramsCategory?.split(",") ?? [],
                userAddress: userInfo.publicAddress,
              };
              
              const response = await createUser(createUserPayload);
              console.log("ProtectedLayout - Create user response:", response);
              
              if (response.data.success) {
                const userPayload = {
                  email: userInfo?.email ?? "",
                  publicAddress: userInfo.publicAddress,
                  username: generateUserName(userInfo.publicAddress),
                  walletType: "magic-link" as const,
                };
                setUser(userPayload);
                // Clear URL parameters after successful authentication
                window.history.replaceState({}, document.title, window.location.pathname);
                console.log("ProtectedLayout - New user created and set successfully!");
              } else {
                console.error("ProtectedLayout - Failed to create user account");
              }
            }
          }
        } else {
          console.log("ProtectedLayout - No valid OAuth result");
        }
      } catch (error) {
        console.error("ProtectedLayout - OAuth processing error:", error);
      } finally {
        setIsProcessingOAuth(false);
        setIsCheckingOAuth(false);
      }
    };

    if (magic) {
      handleOAuthProcessing();
    } else {
      // Wait for Magic to be available
      const timer = setTimeout(() => {
        console.log("ProtectedLayout - Magic still not available, proceeding with normal check");
        setIsCheckingOAuth(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [magic, setUser, paramsCategory]);

  // Listen for authentication changes
  useEffect(() => {
    if (isAuthenticated && isCheckingOAuth) {
      console.log("ProtectedLayout - User authenticated, stopping OAuth check");
      setIsCheckingOAuth(false);
    }
  }, [isAuthenticated, isCheckingOAuth]);

  // If we're still checking for OAuth, show loading
  if (isCheckingOAuth && !isAuthenticated) {
    console.log("ProtectedLayout - Waiting for OAuth processing...");
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#EDEDED]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing authentication...</p>
        </div>
      </div>
    );
  }

  console.log("ProtectedLayout - Final check - isAuthenticated:", isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

export default ProtectedLayout;
