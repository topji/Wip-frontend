import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <div className="max-w-8xl mx-auto min-h-dvh bg-white flex flex-col">
      <Outlet />
      <footer className="border-t border-black/30 px-31.5 py-9 flex items-center justify-between">
        <p className=" text-[0.875rem] text-[#182537]/70 ">
          © 2023 Worldiip LLp. All rights reserved.
        </p>
        <ul className="flex items-center text-[0.75rem] text-[#182537]/70 font-medium">
          <li className="px-5 border-r border-[#182537]/20">Privacy policy</li>
          <li className="px-5">Terms and conditions</li>
        </ul>
      </footer>
    </div>
  );
};

export default MainLayout;
