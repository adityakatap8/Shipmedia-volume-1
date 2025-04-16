import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateUserForm from '../createUserForm/createUserForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import MUIDataTable from 'mui-datatables';
import './index.css';
import Loader from "../../../components/loader/Loader";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // <-- Add loading state

  const fetchUsers = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get('https://www.mediashippers.com/api/auth/all-users', {
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
    onRowClick: (rowData, rowMeta) => {
      console.log(rowData, rowMeta); // Optional: Handle row click event here
    },
  };

  return (
    <div className='container py-4'>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h2 className='text-white'>User Management</h2>
        <div>
          <button className='btn btn-secondary me-2' onClick={fetchUsers}>
            Refresh
          </button>
          <button className='btn btn-primary' onClick={() => setShowForm(true)}>
            Create New User
          </button>
        </div>
      </div>

      {/* Modal for CreateUserForm */}
      {showForm && (
        <div className="modal d-block" tabIndex="-1" role="dialog" onClick={() => setShowForm(false)}>
          <div className="modal-dialog modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Register New User</h5>
                <button type="button" className="close" onClick={() => setShowForm(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <CreateUserForm
                  onSuccess={() => {
                    fetchUsers(); // Re-fetch the user list after successful registration
                    setShowForm(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MUI DataTable */}
      {loading ? (
        <div className="text-white">Loading... <br /> <Loader /> </div> // Show "Loading..." while data is being fetched
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
