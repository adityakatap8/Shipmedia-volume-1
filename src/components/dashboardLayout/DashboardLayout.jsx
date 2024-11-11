import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Navbar1 from '../dashboardNavbar/Navbar1';
import ContentWrapper from '../contentWrapper/ContentWrapper';
import Menu from '../dashboardMenu/Menu';

const DashboardLayout = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      console.log('Checking authentication...');
      
      // Check for token in localStorage
      const token = window.localStorage.getItem("token");
      
      if (!token ||!token.trim()) {
        console.log('No valid token found');
        setIsAuthenticated(false);
        return;
      }
      
      try {
        console.log('Fetching user data...');
        const response = await fetch('http://localhost:3000/api/auth/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers));

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();
        console.log('User data received:', userData);
        
        // Set the userData immediately
        setUserData(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error appropriately (e.g., show error message to user)
        setUserData(null);
        setIsAuthenticated(false);
      }
    };

    checkAuthAndFetchData().then(() => {
      console.log('Authentication check completed');
    });
  }, []);

  useEffect(() => {
    const storedToken = window.localStorage.getItem("token");
    if (storedToken) {
      // Verify token with the server
      const verifyToken = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/auth/store-token', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: storedToken.split('.')[0], name: '', email: '' })
          });
          
          if (response.ok) {
            console.log('Token verified successfully');
            console.log('User data:', userData);
          } else {
            console.error('Token verification failed');
            // Clear the token and redirect to login page
            localStorage.removeItem("token");
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          // Clear the token and redirect to login page
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      };

      verifyToken();
    }
  }, [userData]);

  return (
    <div className="flex h-screen">
      <ContentWrapper>
        <Navbar1 user={userData} isAuthenticated={isAuthenticated} />
        <main className="flex-1 p-4 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <aside className="hidden md:block w-64">
              <Sidebar />
            </aside>
            <div className="flex-1 p-4">
              {children}
            </div>
          </div>
        </main>
      </ContentWrapper>
    </div>
  );
};

export default DashboardLayout;



// import React, { useEffect, useState } from 'react';
// import Sidebar from '../sidebar/Sidebar';
// import Navbar1 from '../dashboardNavbar/Navbar1';
// import ContentWrapper from '../contentWrapper/ContentWrapper';
// import Menu from '../dashboardMenu/Menu';

// const DashboardLayout = ({ children }) => {
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     const checkAuthAndFetchData = async () => {
//       console.log('Checking authentication...');
      
//       // Check for token in localStorage
//       const token = window.localStorage.getItem("token");
      
//       if (!token || !token.trim()) {
//         console.log('No valid token found');
//         return;
//       }
      
//       try {
//         console.log('Fetching user data...');
//         const response = await fetch('http://localhost:3000/api/auth/user', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         console.log('Response status:', response.status);
//         console.log('Response headers:', Object.fromEntries(response.headers));

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const userData = await response.json();
//         console.log('User data received:', userData);
        
//         // Set the userData immediately
//         setUserData(userData);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         // Handle error appropriately (e.g., show error message to user)
//         setUserData(null); // Set userData to null if there's an error
//       }
//     };

//     checkAuthAndFetchData().then(() => {
//       console.log('Authentication check completed');
//     });
//   }, []);

//   useEffect(() => {
//     const storedToken = window.localStorage.getItem("token");
//     if (storedToken) {
//       // Verify token with the server
//       const verifyToken = async () => {
//         try {
//           const response = await fetch('http://localhost:3000/api/auth/store-token', {
//             method: 'POST',
//             headers: {
//               'Authorization': `Bearer ${storedToken}`,
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ userId: storedToken.split('.')[0], name: '', email: '' })
//           });
          
//           if (response.ok) {
//             console.log('Token verified successfully');
//             console.log('User data:', userData);
//           } else {
//             console.error('Token verification failed');
//             // Clear the token and redirect to login page
//             localStorage.removeItem("token");
//           }
//         } catch (error) {
//           console.error('Error verifying token:', error);
//           // Clear the token and redirect to login page
//           localStorage.removeItem("token");
//         }
//       };

//       verifyToken();
//     }
//   }, [userData]);

//   return (
//     <div className="flex h-screen">
//       <ContentWrapper>
//         <Navbar1 user={userData} />
//         <main className="flex-1 p-4 overflow-hidden">
//           <div className="flex flex-col md:flex-row">
//             <aside className="hidden md:block w-64">
//               <Sidebar />
//             </aside>
//             <div className="flex-1 p-4">
//               {children}
//             </div>
//           </div>
//         </main>
//       </ContentWrapper>
//     </div>
//   );
// };

// export default DashboardLayout;



// import {React, useEffect, useState } from 'react';
// import Sidebar from '../sidebar/Sidebar';
// import Navbar1 from '../dashboardNavbar/Navbar1';
// import ContentWrapper from '../contentWrapper/ContentWrapper';
// import Menu from '../dashboardMenu/Menu';
// import jwt from 'jsonwebtoken';

// const DashboardLayout = ({ children }) => {
//   const [userData, setUserData] = useState(null);

//   const token = window.localStorage.getItem("token");

//   useEffect(() => {
//     const checkAuthAndFetchData = async () => {
//       console.log('Checking authentication...');
      
//       if (!token || !token.trim()) {
//         console.log('No valid token found');
//         return;
//       }
      
//       try {
//         console.log('Fetching user data...');
//         const response = await fetch('http://localhost:3000/api/auth/user', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         console.log('Response status:', response.status);
//         console.log('Response headers:', Object.fromEntries(response.headers));

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const userData = await response.json();
//         console.log('User data received:', userData);
        
//         // Set the userData immediately
//         setUserData(userData);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         // Handle error appropriately (e.g., show error message to user)
//         setUserData(null); // Set userData to null if there's an error
//       }
//     };

//     checkAuthAndFetchData().then(() => {
//       console.log('Authentication check completed');
//     });
//   }, []);

//   useEffect(() => {
//     const storedToken = window.localStorage.getItem("token");
//     if (storedToken) {
//       // Verify token with the server
//       const verifyToken = async () => {
//         try {
//           const decodedToken = jwt.decode(storedToken);
//           console.log('Decoded token:', decodedToken);
          
//           // Here you would typically check if the decoded token matches your expectations
//           // For example, if it contains a userId, name, and email
          
//           if (!decodedToken.userId || !decodedToken.name || !decodedToken.email) {
//             console.error('Invalid token structure');
//             localStorage.removeItem("token");
//             return;
//           }
          
//           console.log('Token verified successfully');
//           console.log('User data:', decodedToken);
//         } catch (error) {
//           console.error('Error verifying token:', error);
//           localStorage.removeItem("token");
//         }
//       };

//       verifyToken();
//     }
//   }, []);

//   return (
//     <div className="flex h-screen">
//       <ContentWrapper>
//         <Navbar1 user={userData} />
//         <main className="flex-1 p-4 overflow-hidden">
//           <div className="flex flex-col md:flex-row">
//             <aside className="hidden md:block w-64">
//               <Sidebar />
//             </aside>
//             <div className="flex-1 p-4">
//               {children}
//             </div>
//           </div>
//         </main>
//       </ContentWrapper>
//     </div>
//   );
// };

// export default DashboardLayout;

