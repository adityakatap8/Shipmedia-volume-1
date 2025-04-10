// src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import store from './redux/store.js'; // Import your Redux store
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProjectInfoProvider } from '../src/contexts/projectInfoContext.jsx'; // Import the ProjectInfoProvider


// Create a QueryClient instance
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        {/* Wrapping the App component with ProjectInfoProvider */}
        <ProjectInfoProvider>
          <App />
        </ProjectInfoProvider>
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);
