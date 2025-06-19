import { useState, useMemo } from "react"
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

// Sample data from your API response
const userData = {
  success: true,
  users: [
    {
      isVerified: false,
      isApproved: false,
      isActive: true,
      name: "sachin gokhale",
      orgName: "capemay studios",
      email: "Sachin@capemaystudios.com",
      __v: 0,
      role: "Seller",
      createdBy: "683e9cf35dd500977b5d2052",
      createdAt: "2025-06-19T05:39:41.539Z",
      updatedAt: "2025-06-19T05:39:41.539Z",
    },
    {
      role: "Buyer",
      isVerified: false,
      isApproved: false,
      isActive: false,
      name: "Privil",
      orgName: "EntTech",
      email: "privil.rodrigues@entertainmenttechnologists.com",
      __v: 0,
      createdBy: "683e9cf35dd500977b5d2052",
      createdAt: "2025-06-19T05:39:41.540Z",
      updatedAt: "2025-06-19T05:39:41.540Z",
    },
    {
      role: "Buyer",
      isVerified: false,
      isApproved: false,
      isActive: true,
      name: "John",
      orgName: "Info",
      email: "sachin.suryawanshi@entertainmenttechnologists.com",
      __v: 0,
      createdBy: "683e9cf35dd500977b5d2052",
      createdAt: "2025-06-19T05:39:41.541Z",
      updatedAt: "2025-06-19T05:39:41.541Z",
    },
    {
      isApproved: false,
      name: "John Doe",
      orgName: "MediaShippers",
      email: "admin@example.com",
      role: "Admin",
      isVerified: false,
      isActive: false,
      createdAt: "2025-04-16T10:29:07.847Z",
      updatedAt: "2025-04-16T10:29:07.847Z",
      __v: 0,
      createdBy: "683e9cf35dd500977b5d2052",
    },
    {
      isVerified: false,
      isApproved: false,
      isActive: true,
      name: "admin role",
      orgName: "admin org",
      email: "admin@mail.com",
      __v: 0,
      role: "Admin",
      createdBy: "683e9cf35dd500977b5d2052",
      createdAt: "2025-06-19T05:39:41.542Z",
      updatedAt: "2025-06-19T05:39:41.542Z",
    },
    {
      isVerified: false,
      isApproved: false,
      isActive: false,
      name: "Buyer role",
      orgName: "buyer org",
      email: "buyer@mail.com",
      __v: 0,
      role: "Buyer",
      createdBy: "683e9cf35dd500977b5d2052",
      createdAt: "2025-06-19T05:39:41.543Z",
      updatedAt: "2025-06-19T05:39:41.543Z",
    },
    {
      role: "Buyer",
      isVerified: false,
      isApproved: false,
      isActive: true,
      name: "Lucy Crawford",
      orgName: "ap ss",
      email: "lucy.crawford@ganjingworld.com",
      __v: 0,
      createdBy: "683e9cf35dd500977b5d2052",
      createdAt: "2025-06-19T05:39:41.544Z",
      updatedAt: "2025-06-19T05:39:41.544Z",
    },
    {
      isApproved: false,
      _id: "68073f58c52781253d507666",
      name: "John Doe",
      orgName: "Tech Solutions",
      email: "john.doe@techsolutions.com",
      organizationId: "68073f58c52781253d507664",
      role: "Admin",
      isVerified: false,
      isActive: false,
      verificationToken: "5083fa8c-4ab0-4c44-b219-4d9e7bfe3b6a",
      tokenExpiresAt: "2025-04-23T07:03:52.198Z",
      createdAt: "2025-04-22T07:03:52.243Z",
      updatedAt: "2025-04-22T07:03:52.243Z",
      __v: 0,
      createdBy: "683e9cf35dd500977b5d2052",
    },
    {
      isApproved: false,
      _id: "6807404c51550b7719e3edf4",
      name: "John Doe",
      orgName: "info Solutions",
      email: "sachin@entech.com",
      organizationId: "6807406851550b7719e3edf8",
      role: "Seller",
      isVerified: false,
      isActive: true,
      verificationToken: "66f59cb5-bb35-40e4-ac27-d7c83b14a2ed",
      tokenExpiresAt: "2025-04-23T07:07:56.786Z",
      createdAt: "2025-04-22T07:07:56.787Z",
      updatedAt: "2025-04-22T07:07:56.787Z",
      __v: 0,
      createdBy: "683e9cf35dd500977b5d2052",
    },
    {
      isApproved: false,
      _id: "6807406851550b7719e3edfa",
      name: "John Doe",
      orgName: "info Solutions",
      email: "aditya@entech.com",
      organizationId: "6807406851550b7719e3edf8",
      role: "Buyer",
      isVerified: false,
      isActive: false,
      verificationToken: "274d83b7-74bb-4a85-8903-be7b867898fd",
      tokenExpiresAt: "2025-04-23T07:08:24.675Z",
      createdAt: "2025-04-22T07:08:24.676Z",
      updatedAt: "2025-04-22T07:08:24.676Z",
      __v: 0,
      createdBy: "683e9cf35dd500977b5d2052",
    },
    {
      isApproved: false,
      _id: "6808d7388056ce9a8797e550",
      name: "Sukhada Joshi",
      orgName: "info Solutions",
      email: "sukhada@entech.com",
      organizationId: "6808d7388056ce9a8797e54e",
      role: "Admin",
      isVerified: false,
      isActive: true,
      verificationToken: "709b8997-c158-492c-9667-5d548fa464dc",
      tokenExpiresAt: "2025-04-24T12:04:08.752Z",
      createdAt: "2025-04-23T12:04:08.795Z",
      updatedAt: "2025-04-23T12:04:08.795Z",
      __v: 0,
      createdBy: "683e9cf35dd500977b5d2052",
    },
    {
      isApproved: false,
      _id: "680b1c8df7d159f1c31ca423",
      name: "xyz",
      orgName: "Entech Solutions",
      email: "xyz@gmail.com",
      organizationId: "6807406851550b7719e3edf8",
      role: "Buyer",
      isVerified: false,
      isActive: false,
      verificationToken: "99d1db58-4503-41fa-8423-7950d83af20d",
      tokenExpiresAt: "2025-04-26T05:24:29.618Z",
      createdAt: "2025-04-25T05:24:29.621Z",
      updatedAt: "2025-04-25T05:24:29.621Z",
      __v: 0,
      createdBy: "683e9cf35dd500977b5d2052",
    },
    {
      isApproved: false,
      _id: "68147d0a1adcf9b3bd998fde",
      name: "srija",
      orgName: "Info",
      email: "srija@gmail.com",
      organizationId: "68147d0a1adcf9b3bd998fdc",
      role: "Seller",
      isVerified: false,
      isActive: true,
      verificationToken: "149ec1df-6357-4ce8-81d8-fc456f74fd16",
      tokenExpiresAt: "2025-05-03T08:06:34.212Z",
      createdAt: "2025-05-02T08:06:34.213Z",
      updatedAt: "2025-05-02T08:06:34.213Z",
      __v: 0,
      createdBy: "683e9cf35dd500977b5d2052",
    },
    {
      isApproved: false,
      _id: "683d7781781f337b83234860",
      name: "sd sfjsd",
      orgName: "Entech",
      email: "s@gmail.com",
      organizationId: "683d7781781f337b8323485e",
      role: "Seller",
      isVerified: false,
      isActive: false,
      verificationToken: "41f02db4-195a-4e61-999d-cc0f8d356bc8",
      tokenExpiresAt: "2025-06-03T10:05:53.298Z",
      createdAt: "2025-06-02T10:05:53.299Z",
      updatedAt: "2025-06-02T10:05:53.299Z",
      __v: 0,
      createdBy: "683e9cf35dd500977b5d2052",
    },
    {
      isApproved: false,
      _id: "683d8d5b3817b286af871542",
      name: "Ashish Ashok Ningurkar",
      orgName: "VP movies",
      email: "ashishningurkar@gmail.com",
      organizationId: "683d8d5b3817b286af871540",
      role: "Seller",
      isVerified: false,
      isActive: true,
      verificationToken: "e8d32d30-869b-4228-af95-22a33b21c110",
      tokenExpiresAt: "2025-06-03T11:39:07.517Z",
      createdAt: "2025-06-02T11:39:07.518Z",
      updatedAt: "2025-06-02T11:39:07.518Z",
      __v: 0,
      createdBy: "683e9cf35dd500977b5d2052",
    },
    {
      _id: "68529e07cf2c526d040aae3c",
      name: "Vijay Devade",
      orgName: "Entech",
      email: "vijay@gmail.com",
      role: "Seller",
      isVerified: false,
      isApproved: false,
      isActive: false,
      companySite: "www.mediashipper.com",
      phoneNumber: 9887878787,
      createdAt: "2025-06-18T11:07:51.455Z",
      updatedAt: "2025-06-18T11:07:51.455Z",
      __v: 0,
    },
  ],
}

export default function UsersList() {
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

  const users = userData.users

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

  const handleToggleActive = (userIndex) => {
    // In a real app, this would make an API call
    console.log(`Toggle active status for user at index ${userIndex}`)
  }

  const handleEditUser = (user) => {
    console.log("Edit user:", user)
  }

  const handleViewUser = (user) => {
    console.log("View user:", user)
  }

  const paginatedUsers = filteredAndSortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

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
                      checked={user.isActive || false}
                      onChange={() => handleToggleActive(index)}
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
