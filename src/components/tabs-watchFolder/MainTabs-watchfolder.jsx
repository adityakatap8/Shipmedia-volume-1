import * as React from 'react';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Box from '@mui/material/Box';
import Tabs from './Tabs';
import "./index.css"
import SetupWatchFolder from '../setupWatchFolder/SetupWatchFolder';
import SetupDelivery from '../setupDelivery/SetupDelivery'
import CodecSettings from '../codecSettings/CodecSettings';

function MainTabsWatchfolder({ label }) {
  

  return (
    <div>
    
   
    <Tabs className="tab">
      <div title='Set up Your Source'>
        <div><SetupWatchFolder /></div>
      </div>
      <div title='Choose Format For Conversion'>
       <div>
        <CodecSettings />
       </div>
      </div>
      <div title='Select Destination for Delivery'>
        <div><SetupDelivery /></div>
      </div>
    </Tabs>
  </div>
  );
}

export default MainTabsWatchfolder;