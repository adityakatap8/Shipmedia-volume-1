// src/pages/mainPage/Main.js
import React from 'react';
import OrderManagement from "../orderManagementPage/OrderManagement";
import JobQueue from '../../components/jobQueueTable/JobQueueTable';
import Billing from '../billing/Billing';
import Profile from '../profile/Profile';
import MainTabsOndemand from '../../components/tabs-onDemand/MainTabs-ondemand';
import MainTabsWatchfolder from '../../components/tabs-watchFolder/MainTabs-watchfolder';
import ListingTable from '../../components/listingTable/ListingTable';
import JobQueueTable from '../../components/jobQueueTable/JobQueueTable';
import UserProfile from '../../components/userProfile/UserProfile';
import Catalogue from '../../components/tabs-catalogue/MainTabs-Catalogue';
import OrderSummary from '../orderSummary/OrderSummary';
import Projects from '../projects/Projects';
import ProjectsForm from '../../components/projectsForm/ProjectsForm';

// Directly export the components
export const orderManagement = () => <OrderManagement />;
export const jobQueue = () => <JobQueue />;
export const billing = () => <Billing />;
export const profile = () => <UserProfile />;
export const mainTabsWatchfolder = () => <MainTabsWatchfolder />;
export const catalogue = () => <Catalogue />;
export const mainTabsOndemand = () => <MainTabsOndemand />;
export const listingTable = () => <ListingTable />;
export const jobQueueTable = () => <JobQueueTable />;
export const userProfile = () => <UserProfile />;
export const orderSummary = () => <OrderSummary />;
export const projects = () => <Projects />;
export const projectsForm = () => <ProjectsForm />;
