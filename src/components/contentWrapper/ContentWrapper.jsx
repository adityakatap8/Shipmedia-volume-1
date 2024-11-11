import React from 'react';

const ContentWrapper = ({ children }) => {
  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </main>
  );
};

export default ContentWrapper;
