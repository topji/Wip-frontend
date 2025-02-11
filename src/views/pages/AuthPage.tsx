import illustration from "@/assets/illustrations/2.svg";
import logo from "/World_IP_logo.svg";
import { AuthSection } from "@/features/auth/SignUp/AuthSection";
const AuthPage = () => {
  return (
    <main className="flex gap-8 grow">
      <div className="flex flex-col gap-8 items-center justify-center grow">
        <div className="self-start px-16 pb-8 pt-12">
          <img src={logo} alt="logo" />
        </div>
        <h1 className="text-6xl font-medium w-[18ch]">
          Register your <span className="text-orange-400">#Copyright, </span>
          <span className="text-blue-500">now</span>
        </h1>
        <div className="relative mt-auto justify-self-end">
          <img src={illustration} alt="illustration" />
        </div>
      </div>
      <div className="bg-[#F8F8F8] p-12 w-[47%] flex flex-col items-center gap-8 justify-center">
        <AuthSection />
      </div>
    </main>
  );
};

export default AuthPage;
