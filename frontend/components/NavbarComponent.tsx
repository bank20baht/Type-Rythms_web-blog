import { useRouter } from "next/router";
import React from "react";
import icon from "@/components/logo.ico"
import { VscAccount, VscEdit, VscPreview } from "react-icons/vsc";
const NavbarComponent = () => {
  const islogin = true;
  const user = "Bank20baht"
  const router = useRouter();
  return (
    <header className="navbar">
    <nav className="max-w-[120rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between" aria-label="Global">
      <a className="logo flex items-center " href="/">
        <img src={icon.src} className="w-auto"/>Type-Rythms</a>
      <div className=" flex flex-row items-center gap-2 mt-5 sm:justify-end sm:mt-0 sm:pl-5">
        <a className="buttom-secondary flex" href="/" aria-current="page"><VscPreview/>main</a>
        { islogin ?
          <>
            <a className="buttom-secondary flex" href="/Write"><VscEdit/>Write</a>
            <a className="buttom-primary flex" onClick={() => {
              router.push("/User/NATTAPONG PROMTHONG");
            }}><VscAccount/>{user}</a>
            
          </>
        :
          <>
            <a className="navbar-text" href="/Login">Login</a>
            <a className="buttom-primary" href="/Register">Register</a>
          </>
        
        }

        
        
      </div>
    </nav>
  </header>
  );
  
  
};

export default NavbarComponent;