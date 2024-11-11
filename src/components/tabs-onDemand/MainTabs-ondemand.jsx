import * as React from 'react';
import Tabs from './Tabs'; // Custom Tabs Component
import "./index.css";
import SetupSourceFolder from '../setupSourceFolder/SetupSourceFolder';
import SetupDelivery from '../setupDelivery/SetupDelivery';
import CodecSettings from '../codecSettings/CodecSettings';

function MainTabsOndemand() {
  // State to track the current active tab
  const [activeTab, setActiveTab] = React.useState('Set up Your Source'); // Set initial active tab by title

  // Function to handle moving to the next tab
  const handleNextTab = (nextTabTitle) => {
    setActiveTab(nextTabTitle);
  };

  // Function to handle moving to the previous tab
  const handlePreviousTab = (previousTabTitle) => {
    setActiveTab(previousTabTitle);
  };

  return (
    <div>
      {/* Pass the activeTab state and handleNextTab to each component */}
      <Tabs value={activeTab} onChange={(event, newIndex) => setActiveTab(newIndex)}>
        <div title="Set up Your Source">
          <div>
            {/* Pass handleNextTab and handlePreviousTab to SetupSourceFolder */}
            <SetupSourceFolder 
              goToNextTab={() => handleNextTab('Choose Services')} 
              goToPreviousTab={() => handlePreviousTab('Set up Your Source')}
            />
          </div>
        </div>
        <div title="Choose Services">
          <div>
            {/* Pass handleNextTab and handlePreviousTab to CodecSettings */}
            <CodecSettings 
              goToNextTab={() => handleNextTab('Select Destination for Delivery')} 
              goToPreviousTab={() => handlePreviousTab('Set up Your Source')}
            />
          </div>
        </div>
        <div title="Select Destination for Delivery">
          <div>
            {/* No need to pass goToNextTab to SetupDelivery, it's the last tab */}
            <SetupDelivery goToPreviousTab={() => handlePreviousTab('Choose Services')} />
          </div>
        </div>
      </Tabs>
    </div>
  );
}

export default MainTabsOndemand;
