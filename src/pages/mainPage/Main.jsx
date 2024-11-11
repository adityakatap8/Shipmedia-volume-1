// src/pages/mainPage/Main.js
import React from 'react';
import OrderManagement from "../orderManagementPage/OrderManagement"
import JobQueue from '../../components/jobQueueTable/JobQueueTable';
import Billing from '../billing/Billing';
import Profile from '../profile/Profile';
import MainTabsOndemand from '../../components/tabs-onDemand/MainTabs-ondemand';
import MainTabsWatchfolder from '../../components/tabs-watchFolder/MainTabs-watchfolder';
import ListingTable from '../../components/listingTable/ListingTable'
import JobQueueTable from '../../components/jobQueueTable/JobQueueTable'
import UserProfile from '../../components/userProfile/UserProfile'

const orderManagement = () => {
  return <OrderManagement/>;
};



const jobQueue = () => {
  return <JobQueue/>;
};

const billing = () => {
  return <Billing/>;
};

const profile = () => {
  return <UserProfile />;
};

const mainTabsWatchfolder = () => {
  return <MainTabsWatchfolder/>;
};

const mainTabsOndemand = () => {
  return <MainTabsOndemand/>;
};

const listingTable = () => {
  return <ListingTable />
}


const jobQueueTable = () => {
  return <JobQueueTable />
}

const userProfile = () => {
  return <UserProfile />
}





export default { orderManagement, 
  jobQueue, 
  billing, profile, listingTable, jobQueueTable, 
  mainTabsWatchfolder, mainTabsOndemand, userProfile };