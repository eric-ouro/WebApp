import React from 'react';
import Image from 'next/image';
import Dropdowns from './Dropdowns';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full mb-3 rounded-lg text-xs">
      <div>
        <div className="my-24 ">
            <Image
            src="logo_thin_ouro_plastic.svg" // Path to the logo in the public folder
            alt="OURO Logo"
            width={36} // Adjust the width as needed (e.g., 16px)
            height={36} // Adjust the height as needed (e.g., 16px)
            className="w-[36px] h-[36px] mx-auto"
            />
        </div>
      </div>
      <div className="flex items-center justify-between w-full " >
        <div className="flex items-center">
          <Dropdowns />
        </div>
       
        {/* <div>
          <button className="focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div> */}
      </div>
    </nav>
  );
};

export default Navbar;
