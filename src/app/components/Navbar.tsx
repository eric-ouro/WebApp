import React from 'react';
import Image from 'next/image';
import Dropdowns from './Dropdowns';

const Navbar: React.FC = () => {
  return (
    <nav className="">
     
      <div>
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
