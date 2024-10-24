import React from 'react';

interface DropdownProps {
  title: string;
  subTitle: string;
  items: any[];
  selectedItems: any[];
  onToggleItem: (item: any) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
  getItemLabel: (item: any) => string;
  getItemColor?: (item: any) => string; // Optional prop for item color
  isOpen: boolean; // New prop to control open state
  onToggle: () => void; // New prop to handle toggle
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  subTitle,
  items,
  selectedItems,
  onToggleItem,
  onSelectAll,
  onSelectNone,
  getItemLabel,
  getItemColor, // Destructure the optional prop
  isOpen, // Receive isOpen from props
  onToggle, // Receive onToggle from props
}) => {
  const getDropdownTitle = () => {
    if (selectedItems.length === 0) return `All `;
    if (selectedItems.length === items.length) return `All `;
    if (selectedItems.length > 3) return `${selectedItems.length} Sel.`;
    return selectedItems.map(getItemLabel).join(', ');
  };

  return (
    <div className="relative ">
      <button onClick={onToggle} className={`flex flex-col focus:outline-none  ${subTitle ? 'items-start' : 'items-end'}`}>
        <div className="flex justify-between items-start w-full h-8">
          <div className="text-xs  uppercase text-neutral-600 opacity-70 text-left">{subTitle}</div>
          
        </div>
        <div className="flex justify-between items-top text-left uppercase" >
          <span className='text-sm text-left '>
            {getDropdownTitle().split(',').map((part, index, array) => (
              <div key={index} className={`${index === array.length - 1 ? '' : 'mb-[8px]'} bg-custom-light-tan tracking-wide text-sm`}>
                {part}
              </div>
            ))}
          </span>
          <span className="flex-shrink-0 pl-3 bg-custom-light-tan h-[14px]">
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[14px] w-[14px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="inherit"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[14px] w-[14px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="inherit"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
          </span>
        </div>
      </button>
      {isOpen && (
        <div className="absolute bg-custom-light-tan border  shadow-lg p-1 mt-3  z-10 min-w-36">
          <h3 className="text-sm px-2 pt-2 mb-1 border-neutral-100 border-solid border-b pb-2 uppercase tracking-widest">{title}</h3>
          <div className="max-h-86 overflow-y-auto ">
            {items.map((item) => (
              <label
                key={getItemLabel(item)}
                className="flex items-start justify-between py-2 px-2  cursor-pointer hover:bg-custom-light-tan"
              >
                <div className="flex items-center ">
                  {getItemColor && (
                    <span
                      className={`${getItemColor(item)} inline-block w-3 h-3 rounded-full mr-2`}
                    ></span>
                  )}
                <span className="text-neutral-700  text-sm uppercase max-w-36 pr-4">{getItemLabel(item)}</span>
                </div>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item)}
                  onChange={() => onToggleItem(item)}
                  className=""
                />
              </label>
            ))}
          </div>
          <div className="border-neutral-100 border-solid border-t mt-1 flex justify-start">
            <div className="px-2 pt-2 pb-1">
              <button
                onClick={onSelectAll}
                className="bg-neutral-200 text-neutral-700 px-[6px] py-[2px]  hover:bg-neutral-300 text-sm uppercase tracking-wide mr-2"
              >
                All
              </button>
              <button
                onClick={onSelectNone}
                className="bg-neutral-200 text-neutral-700 px-[6px] py-[2px]  hover:bg-neutral-300 text-sm uppercase tracking-wide"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;