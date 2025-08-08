import illustration from "@/assets/illustrations/1.svg";
import { useCategories } from "@/hooks/useCategories";
import logo from "/World_IP_logo.svg";
import { Link, useSearchParams, Navigate } from "react-router";
import { cn } from "@/utils/cn";
import { useUser } from "@/context/UserContext";
import { useMagic } from "@/hooks/useMagic";
import { createUser } from "@/hooks/api-interaction/useCreateUser";
import { userExists } from "@/services/api/userServices";
import { generateUserName } from "@/utils/generateUserName";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const Welcome = () => {
  const { categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  const paramCategory = searchParams.get("category");
  const { isAuthenticated, setUser } = useUser();
  const { magic } = useMagic();
  const navigate = useNavigate();

  // Handle OAuth redirect result
  useEffect(() => {
    const handleOAuthRedirect = async () => {
      try {
        // Check if we're returning from an OAuth redirect
        const urlParams = new URLSearchParams(window.location.search);
        const hasOAuthParams = urlParams.has('magic_credential') || 
                              (urlParams.has('code') && urlParams.has('state'));
        
        console.log("Welcome - URL params:", Object.fromEntries(urlParams.entries()));
        console.log("Welcome - Has OAuth params:", hasOAuthParams);
        
        if (!hasOAuthParams) {
          console.log("Welcome - No OAuth redirect detected");
          return;
        }
        
        console.log("Welcome - OAuth redirect detected, processing result...");
        
        const result = await magic?.oauth2.getRedirectResult();
        console.log("Welcome - Redirect result:", result);
        
        if (result) {
          const userInfo = result.magic.userMetadata;
          console.log("Welcome - User info from Magic:", userInfo);
          
          if (!userInfo?.publicAddress) {
            console.error("Welcome - No public address found in user info");
            return;
          }

          // Check if user exists
          console.log("Welcome - Checking if user exists...");
          const userExistsResponse = await userExists(userInfo.publicAddress);
          console.log("Welcome - User exists response:", userExistsResponse);
          
          if (userExistsResponse.success) {
            // User exists - sign them in
            console.log("Welcome - User exists, signing in...");
            const userPayload = {
              email: userInfo?.email ?? "",
              publicAddress: userInfo.publicAddress,
              username: generateUserName(userInfo.publicAddress),
              walletType: "magic-link" as const,
            };
            setUser(userPayload);
            navigate("/dashboard");
          } else {
            // User doesn't exist - create account and redirect to dashboard
            console.log("Welcome - User doesn't exist, creating account...");
            const createUserPayload = {
              username: generateUserName(userInfo.publicAddress),
              email: userInfo?.email ?? "NA",
              company: "NA",
              tags: paramCategory?.split(",") ?? [],
              userAddress: userInfo.publicAddress,
            };
            
            const response = await createUser(createUserPayload);
            console.log("Welcome - Create user response:", response);
            
            if (response.data.success) {
              const userPayload = {
                email: userInfo?.email ?? "",
                publicAddress: userInfo.publicAddress,
                username: generateUserName(userInfo.publicAddress),
                walletType: "magic-link" as const,
              };
              setUser(userPayload);
              navigate("/dashboard");
            } else {
              console.error("Welcome - Failed to create user account");
            }
          }
        }
      } catch (error) {
        console.error("Welcome - OAuth redirect error:", error);
      }
    };

    handleOAuthRedirect();
  }, [magic, setUser, navigate, paramCategory]);

  // Redirect logged-in users to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleCategoryClick = (currentCategory: string) => {
    const newCategory = paramCategory?.split(",").includes(currentCategory)
      ? paramCategory
          ?.split(",")
          .filter((c) => c !== currentCategory)
          .join(",")
      : paramCategory
      ? paramCategory + "," + currentCategory
      : currentCategory;

    setSearchParams({ category: newCategory });
  };

  return (
    <main className="flex gap-8 grow">
      <div className="flex flex-col gap-8 items-center justify-center grow">
        <div className="self-start px-16 pb-8 pt-12">
          <img src={logo} alt="logo" />
        </div>
        <h1 className="text-6xl font-medium w-[18ch]">
          Hi <span className="text-orange-400">creator</span>, What have you{" "}
          <span className="text-blue-500">created today</span>?
        </h1>
        <div className="relative">
          <img src={illustration} alt="illustration" />
        </div>
      </div>
      <div className="bg-[#F8F8F8] p-12 w-[47%] flex flex-col items-center gap-8 justify-center">
        <div className="flex flex-wrap gap-y-8 gap-x-5 items-center justify-evenly">
          {categories.map((category) => (
            <button
              onClick={() => handleCategoryClick(category.name)}
              key={category.name}
              className={cn(
                "flex items-center font-semibold gap-1.5 px-3 py-1 rounded-full shadow-[0px_2.5px_4.99px_-2.5px_hsla(254,48%,9%,0.12)] border-[1.25px] border-[hsla(240,3%,93%,1)] transition-colors",
                paramCategory?.split(",").includes(category.name) &&
                  "bg-[#E2DCFF] border-[1.25px] border-[#C6BBFF]"
              )}
            >
              <span>{category.icon}</span>

              <span>{category.name}</span>
            </button>
          ))}
        </div>
        <Link
          to={"/auth" + (paramCategory ? `?category=${paramCategory}` : "")}
          className="bg-[#FF9519] font-semibold text-white px-5 py-3 rounded-full flex items-center gap-2 cursor-pointer"
        >
          Register your copyright
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M4 12L12 4"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.5 4H12V10.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </main>
  );
};

export default Welcome;
