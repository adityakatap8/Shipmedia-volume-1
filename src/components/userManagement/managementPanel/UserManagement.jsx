import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateUserForm from '../createUserForm/createUserForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import MUIDataTable from 'mui-datatables';
import './index.css';
import Loader from "../../../components/loader/Loader";
import AccountInfo from '../accountInfo/AccountInfo';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // <-- Add loading state

  const fetchUsers = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get('https://media-shippers-backend.vercel.app/api/auth/all-users', {
        withCredentials: true,
      });
      const allUsers = response.data.users;
      setUsers(allUsers);
      console.log("Fetched users:", allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleOpen = () => {
    console.log("showForm", showForm)
    setShowForm(true)
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // Define MUI DataTable columns
  const columns = [
    {
      name: 'name',
      label: 'Name',
      options: {
        filter: true,
        sort: true,
        filterType: 'dropdown', // <--- this
      },
    },
    {
      name: 'email',
      label: 'Email',
      options: {
        filter: true,
        sort: true,
        filterType: 'dropdown', // <--- this
      },
    },
    {
      name: 'orgName',
      label: 'Organization',
      options: {
        filter: true,
        sort: false,
        filterType: 'dropdown', // <--- this
      },
    },
    {
      name: 'role', // ✅ NEW COLUMN
      label: 'Role',
      options: {
        filter: true,
        sort: true,
        filterType: 'dropdown',
      },
    },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          const index = tableMeta.rowIndex;
          return (
            <button
              className="btn btn-warning btn-sm"
              onClick={() => {
                console.log(`Edit user: ${users[index]._id}`);
              }}
            >
              <i className="fas fa-pencil-alt"></i> {/* Pencil icon */}
            </button>
          );
        },
      },
    },
  ];

  // Define MUI DataTable options
  const options = {
    filterType: 'dropdown',
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 15, 25, 50, 100],
    onRowClick: (rowData, rowMeta) => {
      console.log(rowData, rowMeta);
    },
   
  };

  return (
    <div className='container py-4'>

    {/* Full-width Account Info Form */}
    <div className='mb-2'>
      <AccountInfo />
    </div>
  
    {/* User Management Heading + Buttons */}
    <div className='d-flex justify-content-between align-items-center flex-wrap'>
      <h2 className='text-white mb-2'>User Management</h2>
      <div className='mb-2'>
        <button className='btn btn-secondary me-2' onClick={fetchUsers}>
          Refresh
        </button>
        <button className='btn btn-primary' onClick={handleOpen}>
          Create New User
        </button>
      </div>
    </div>
  
    {/* Modal for CreateUserForm */}
    {showForm && (
      <CreateUserForm showForm={showForm} setShowForm={setShowForm} />
    )}
  
    {/* MUI DataTable */}
    {loading ? (
      <div className="text-white">
        Loading... <br /> <Loader />
      </div>
    ) : (
      <MUIDataTable
        title={"User List"}
        data={users.filter((user) =>
          (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.orgName || '').toLowerCase().includes(searchQuery.toLowerCase())
        )}
        columns={columns}
        options={options}
      />
    )}
  </div>
  
  );
}

export default UserManagement;
