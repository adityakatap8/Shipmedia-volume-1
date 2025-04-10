import React from 'react';
import './index.css'
const ContentWrapper = ({ children }) => {
  return (
    <main className="flex-1 flex flex-col overflow-hidden main-background">
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </main>
  );
};

export default ContentWrapper;
