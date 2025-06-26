import { useState, useEffect, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  Typography,
  TableSortLabel,
  Switch,
  IconButton,
  Tooltip,
} from "@mui/material"
import { Search, Edit, Visibility, Add } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import axios from "axios" // Import axios

export default function UsersList() {
  const [users, setUsers] = useState([]) // State to store users
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [verificationFilter, setVerificationFilter] = useState("")
  const [approvalFilter, setApprovalFilter] = useState("")
  const [activeFilter, setActiveFilter] = useState("")
  const [sortField, setSortField] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")

  const navigate = useNavigate()

  // Fetch users from the API when the page loads
  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://media-shippers-backend.vercel.app/api/auth/all-users");
      if (response.status === 200) {
        setUsers(response.data.users); // Update users state with fetched data
      } else {
        console.error("Failed to fetch users:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  
  

  // Filtering and sorting logic
  const filteredAndSortedUsers = useMemo(() => {
    const filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.orgName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRole = roleFilter === "" || user.role === roleFilter

      const matchesVerification =
        verificationFilter === "" ||
        (verificationFilter === "verified" && user.isVerified) ||
        (verificationFilter === "unverified" && !user.isVerified)

      const matchesApproval =
        approvalFilter === "" ||
        (approvalFilter === "approved" && user.isApproved) ||
        (approvalFilter === "unapproved" && !user.isApproved)

      const matchesActive =
        activeFilter === "" ||
        (activeFilter === "active" && user.isActive) ||
        (activeFilter === "inactive" && !user.isActive)

      return matchesSearch && matchesRole && matchesVerification && matchesApproval && matchesActive
    })

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      if (sortField === "createdAt") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [users, searchTerm, roleFilter, verificationFilter, approvalFilter, activeFilter, sortField, sortOrder])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "#f44336"
      case "Seller":
        return "#2196f3"
      case "Buyer":
        return "#4caf50"
      default:
        return "#757575"
    }
  }

  const handleToggleActive = async (userId, currentApprovalStatus) => {
    console.log("Toggling approval for user:", userId);
    console.log("Current approval status:", currentApprovalStatus);
  
    if (!userId) {
      console.error("User ID is missing");
      return;
    }
  
    try {
      // Make the API call to toggle approval
      const response = await axios.patch(`https://media-shippers-backend.vercel.app/api/auth/user/${userId}/toggle-approval`, {
        isApproved: !currentApprovalStatus, // Toggle the current approval status
      });
  
      if (response.status === 200) {
        console.log(`User ${userId} approval status updated successfully:`, response.data);
  
        // Fetch updated user list to reflect changes in the table
        fetchUsers();
      } else {
        console.error(`Failed to update approval status for user ${userId}:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error updating approval status for user ${userId}:`, error);
    }
  };

  const handleEditUser = (user) => {
    console.log("Edit user:", user)
  }

  const handleViewUser = (user) => {
    console.log("View user:", user)
  }

  const paginatedUsers = filteredAndSortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box sx={{ padding: "18px", backgroundColor: "#0b192c", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <Typography
          variant="h5"
          textAlign="left"
          sx={{
            fontWeight: "bold",
            color: "#ffffff", // Set text color to white
          }}
        >
          User Management
        </Typography>
        <IconButton
          sx={{
            color: "#ffffff", // Set icon color to white
            backgroundColor: "#1a1a2e", // Match background color
            "&:hover": { backgroundColor: "#1e293b" }, // Hover effect
          }}
          onClick={() => navigate("/user-org-register")} // Redirect on click
        >
          <Add />
        </IconButton>
      </Box>

      {/* Filters Section */}
      <Paper
        sx={{
          padding: "20px",
          marginBottom: "24px",
          borderRadius: "12px",
          backgroundColor: "#1a1a2e", // Updated background color
          color: "#ffffff", // Set text color to white
        }}
      >
        <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            label="Search Users"
            variant="outlined"
            size="small"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: "#ffffff", marginRight: "8px" }} />,
            }}
            sx={{
              minWidth: "250px",
              backgroundColor: "#1a1a2e",
              color: "#ffffff",
              "& .MuiInputBase-input": { color: "#ffffff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ffffff" },
                "&:hover fieldset": { borderColor: "#ffffff" },
                "&.Mui-focused fieldset": { borderColor: "#ffffff" },
              },
              "& .MuiInputLabel-root": { color: "#ffffff" }, // Label color
              "& .MuiInputLabel-root.Mui-focused": { color: "#ffffff" }, // Focused label color
            }}
          />

          <FormControl
            size="small"
            sx={{
              minWidth: "120px",
              backgroundColor: "#1a1a2e",
              color: "#ffffff",
              "& .MuiSelect-select": { color: "#ffffff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ffffff" },
                "&:hover fieldset": { borderColor: "#ffffff" },
                "&.Mui-focused fieldset": { borderColor: "#ffffff" },
              },
              "& .MuiSelect-icon": { color: "#ffffff" }, // Change dropdown arrow color to white
              "& .MuiInputLabel-root": { color: "#ffffff" }, // Label color
              "& .MuiInputLabel-root.Mui-focused": { color: "#ffffff" }, // Focused label color
            }}
          >
            <InputLabel sx={{ color: "#ffffff" }}>Role</InputLabel>
            <Select value={roleFilter} label="Role" onChange={(e) => setRoleFilter(e.target.value)}>
              <MenuItem value="">All Roles</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Seller">Seller</MenuItem>
              <MenuItem value="Buyer">Buyer</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            size="small"
            sx={{
              minWidth: "120px",
              backgroundColor: "#1a1a2e",
              color: "#ffffff",
              "& .MuiSelect-select": { color: "#ffffff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ffffff" },
                "&:hover fieldset": { borderColor: "#ffffff" },
                "&.Mui-focused fieldset": { borderColor: "#ffffff" },
              },
              "& .MuiSelect-icon": { color: "#ffffff" },
              "& .MuiInputLabel-root": { color: "#ffffff" }, // Label color
              "& .MuiInputLabel-root.Mui-focused": { color: "#ffffff" }, // Focused label color
            }}
          >
            <InputLabel sx={{ color: "#ffffff" }}>Status</InputLabel>
            <Select value={activeFilter} label="Status" onChange={(e) => setActiveFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="body2" sx={{ color: "#ffffff", marginLeft: "auto" }}>
            {filteredAndSortedUsers.length} users found
          </Typography>

          {/* Clear Filters Text */}
          <Typography
            variant="body2"
            sx={{
              color: "#ffffff",
              cursor: "pointer",
              textDecoration: "underline",
              "&:hover": { color: "#f44336" }, // Hover effect
            }}
            onClick={() => {
              setSearchTerm("")
              setRoleFilter("")
              setVerificationFilter("")
              setApprovalFilter("")
              setActiveFilter("")
            }}
          >
            Clear Filters
          </Typography>
        </Box>
      </Paper>

      {/* Table Section */}
      <Paper
        sx={{
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          backgroundColor: "#1a1a2e", // Updated background color
          color: "#ffffff", // Set text color to white
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1a1a2e" }}>
                <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>Organization</TableCell>
                <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>Role</TableCell>
                <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>Created Date</TableCell>
                <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user, index) => (
                <TableRow
                  key={user._id || index}
                  sx={{
                    "&:hover": { backgroundColor: "#1e293b" },
                    "&:nth-of-type(even)": { backgroundColor: "#1a1a2e" },
                  }}
                >
                  <TableCell sx={{ color: "#ffffff" }}>{user.name}</TableCell>
                  <TableCell sx={{ color: "#ffffff" }}>{user.email}</TableCell>
                  <TableCell sx={{ color: "#ffffff" }}>{user.orgName}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      sx={{
                        backgroundColor: getRoleColor(user.role),
                        color: "white",
                        fontWeight: "500",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "#ffffff" }}>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <Switch
                      checked={user.isApproved || false}
                      onChange={() => handleToggleActive(user._id, user.isApproved)} // Pass user ID and current approval status
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <IconButton
                      size="small"
                      onClick={() => handleViewUser(user)}
                      sx={{ color: "#ffffff", marginRight: "4px" }}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleEditUser(user)} sx={{ color: "#ffffff" }}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredAndSortedUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: "1px solid #ffffff",
            backgroundColor: "#1a1a2e",
            color: "#ffffff",
          }}
        />
      </Paper>
    </Box>
  )
}
