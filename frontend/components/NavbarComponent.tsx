import React from "react";

const NavbarComponent = () => {
  const islogin = false;
  const user = "Bank20baht"
  return (
    <header className="navbar">
    <nav className="max-w-[120rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between" aria-label="Global">
      <a className="logo" href="#">Type-Rythms</a>
      <div className=" flex flex-row items-center gap-5 mt-5 sm:justify-end sm:mt-0 sm:pl-5">
        <a className="navbar-text" href="/" aria-current="page">main</a>
        { islogin ?
          <>
            <a className="buttom-primary" href="/Account">{user}</a>
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