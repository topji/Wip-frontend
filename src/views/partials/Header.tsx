import React from "react";
import { cn } from "@/utils/cn";
import logo from "/World_IP_logo.svg";

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const Header = ({ className, children, ...props }: HeaderProps) => {
  return (
    <header className={cn("mb-12 pt-12", className)} {...props}>
      <div>
        <img src={logo} alt="logo" />
      </div>
      <div>{children}</div>
    </header>
  );
};

export default Header;
