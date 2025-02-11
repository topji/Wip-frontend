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
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source
              src="https://worldip.s3.us-east-1.amazonaws.com/footer.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </div>
      <div className="bg-[#F8F8F8] p-12 w-[47%] flex flex-col items-center gap-8 justify-center">
        <AuthSection />
      </div>
    </main>
  );
};

export default AuthPage;
