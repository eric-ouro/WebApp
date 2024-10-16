import React from 'react';

interface DashboardDisplayHeaderProps {
  headerText: string;
}

const DashboardDisplayHeader: React.FC<DashboardDisplayHeaderProps> = ({ headerText }) => {
  return (
    <div className="flex items-center mb-4">
      <h2 className="text-l uppercase tracking-wide mr-4">{headerText}</h2>
      <div className="flex-grow border-t border-neutral-400" style={{ height: '1px' }}></div>
    </div>
  );
};

export default DashboardDisplayHeader;