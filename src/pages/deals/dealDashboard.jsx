import { useEffect, useState } from "react"
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    TextField,
    InputAdornment,
    Tabs,
    Tab,
    Chip,
    Grid,
    Select,
    MenuItem,
    FormControl,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Fade,
    Dialog,
    Menu,
    InputLabel,
} from "@mui/material"
import {
    Search,
    BarChart,
    TableRows,
    CalendarToday,
    ArrowDownward,
    InfoOutlined,
    CheckCircleOutline,
    ArrowForward,
    MoreVert,
    Visibility,
    Edit,
    Message,
    Send,
} from "@mui/icons-material"
import axios from "axios"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Loader from "../../components/loader/Loader"

export default function DealDashboard() {
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth.user)
    const [viewMode, setViewMode] = useState("table")
    const [tabValue, setTabValue] = useState(0)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortOrder, setSortOrder] = useState("descending")
    const [sortField, setSortField] = useState("date")
    const [dealsData, setDealsData] = useState([]);
    const [dealcounts, setDealCounts] = useState({});
    const [chatOpen, setChatOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageText, setMessageText] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [dealId, setDealId] = useState("");
    const [loading, setLoading] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedDealId, setSelectedDealId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [remark, setRemark] = useState("");
    const [actionStatus, setActionStatus] = useState("");
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [sellers, setSellers] = useState([]);
    console.log("sellers", sellers)

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    // Filter deals based on tab selection and search term
    const getFilteredDeals = () => {
        let filtered = [...dealsData];

        // Filter by tab
        if (tabValue === 0) {
            filtered = filtered
        } else if (tabValue === 1) {
            filtered = filtered.filter((deal) => deal.senderId === user._id);
        } else if (tabValue === 2) {
            filtered = filtered.filter((deal) => deal.assignedTo === user._id);
        } else if (tabValue === 3) {
            filtered = filtered.filter((deal) => deal.status === "pending");
        } else if (tabValue === 4) {
            filtered = filtered.filter((deal) => deal.status === "closed");
        } else if (tabValue === 5) {
            filtered = filtered.filter((deal) => deal.status === "cancelled");
        }

        // Debugging: Log the filtered deals
        console.log("Filtered Deals:", filtered);

        return filtered;
    };

    const filteredDeals = getFilteredDeals()
    console.log("Filtered Deals:", filteredDeals)


    const getStatusLabel = (status, userRole) => {
        if (userRole === "Buyer" && status === "sent_to_buyer") {
            return "received_from_shipper";
        }
        if (userRole === "Admin" && status === "sent_to_shipper") {
            return "received_from_buyer";
        }
        return status; // Default status
    };

    // Get status chip color
    const getStatusColor = (status) => {
        switch (status) {
            case "Active":
                return { bg: "rgba(58, 123, 213, 0.2)", color: "#3a7bd5" }
            case "Pending":
                return { bg: "rgba(245, 176, 20, 0.2)", color: "#f5b014" }
            case "Completed":
                return { bg: "rgba(76, 175, 80, 0.2)", color: "#4caf50" }
            case "Cancelled":
                return { bg: "rgba(244, 67, 54, 0.2)", color: "#f44336" }
            default:
                return { bg: "rgba(158, 158, 158, 0.2)", color: "#9e9e9e" }
        }
    }

    const fetchDeals = async () => {
        try {
            setLoading(true); // Show loader
            const response = await axios.get(`https://www.mediashippers.com/api/deal/deals-with-counts/${user._id}`);
            const data = await response.data;
            console.log("Fetched Deals:", data.deals);
            setDealsData(data.deals);
            setDealCounts(data.counts); // Assuming the API returns counts for each status
        } catch (error) {
            console.error("Error fetching deals:", error);
        } finally {
            setLoading(false); // Hide loader
        }
    };

    // Fetch chat history for a specific user
    const getChatHistory = async (dealId) => {
        try {
            const response = await axios.get(`https://www.mediashippers.com/api/deal/${dealId}/message-history`, {
                params: {
                    loggedInUserId: user._id,
                    loggedInUserRole: user.role,
                    selectedUserId: selectedSeller || selectedDeal?.senderId || user.createdBy, // Use selectedSeller if available
                },
            });
            return response.data.history; // Return chat history
        } catch (error) {
            console.error("Error fetching chat history:", error);
            return [];
        }
    };

    // Send a message to a specific user
    const sendMessage = async (message) => {
        try {
            const response = await axios.post(`https://www.mediashippers.com/api/deal/${dealId}/message`, {
                senderId: user._id,
                receiverId: user.role === "Admin" ? selectedUser : user.createdBy,
                message,
            });
            return response.data; // Return the sent message
        } catch (error) {
            console.error("Error sending message:", error);
            return null;
        }
    };

    // Get unread message count for the current user
    const getUnreadMessageCount = async () => {
        try {
            const response = await axios.get(`https://www.mediashippers.com/api/deal/unread-count/${dealId}/${user._id}`);
            return response.data.unreadCount; // Return unread message count
        } catch (error) {
            console.error("Error fetching unread message count:", error);
            return 0;
        }
    };

    // Mark messages as read for a specific user
    const markMessagesAsRead = async (userId, dealId) => {
        try {
            await axios.post(`https://www.mediashippers.com/api/deal/${dealId}/mark-read/${userId}`);
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    };

    useEffect(() => {
        fetchDeals();
    }, [chatOpen])

    useEffect(() => {
        const fetchSellers = async () => {
          if (selectedDeal && selectedDeal.movieDetails) {
            const sellerData = await getUniqueSellers(selectedDeal.movieDetails); // Await the result
            setSellers(sellerData); // Set the resolved value
          }
        };
      
        fetchSellers();
      }, [selectedDeal]);

    const handleOpenChat = async (deal) => {
        setChatOpen(true);
        setDealId(deal._id);
        setSelectedDeal(deal);
        setSelectedUser(deal.senderId);
        const history = await getChatHistory(deal._id);
        setChatHistory(history);
        await markMessagesAsRead(user._id, deal._id);
    };

    const handleCloseChat = () => {
        setChatOpen(false);
    };

    const handleSendMessage = async () => {
        if (!messageText.trim()) return;

        await sendMessage(messageText);

        const history = await getChatHistory(dealId);
        setChatHistory(history);
        setMessageText("");
    };

    if (loading) {
        return <Loader />;
    }

    const handleSendDeal = async (dealId) => {
        try {
            setLoading(true); // Show loader
            const response = await axios.post('https://www.mediashippers.com/api/deal/split-to-sellers', {
                dealId, // Include dealId in the request body
            });
            console.log("Send Deal Response:", response.data);
            // Optionally, refresh the deals data or show a success message
            fetchDeals();
        } catch (error) {
            console.error("Error sending deal:", error);
        } finally {
            setLoading(false); // Hide loader
        }
    };

    const handleMenuOpen = (event, dealId) => {
        setMenuAnchor(event.currentTarget);
        setMenuOpen(true);
        setSelectedDealId(dealId);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setMenuOpen(false);
        setSelectedDealId(null);
    };

    const handleAccept = async (dealId) => {
        try {
            setLoading(true);
            const response = await axios.patch(`https://www.mediashippers.com/api/deal/${dealId}/action`);
            console.log("Accept Response:", response.data);
            fetchDeals(); // Refresh deals
        } catch (error) {
            console.error("Error accepting deal:", error);
        } finally {
            setLoading(false);
            handleMenuClose();
        }
    };

    const handleNegotiate = async (dealId) => {
        try {
            setLoading(true);
            const response = await axios.patch(`https://www.mediashippers.com/api/deal/${dealId}/action`);
            console.log("Negotiate Response:", response.data);
            fetchDeals(); // Refresh deals
        } catch (error) {
            console.error("Error negotiating deal:", error);
        } finally {
            setLoading(false);
            handleMenuClose();
        }
    };

    const handleReject = async (dealId) => {
        try {
            setLoading(true);
            const response = await axios.patch(`https://www.mediashippers.com/api/deal/${dealId}/action`);
            console.log("Reject Response:", response.data);
            fetchDeals(); // Refresh deals
        } catch (error) {
            console.error("Error rejecting deal:", error);
        } finally {
            setLoading(false);
            handleMenuClose();
        }
    };

    const handleActionClick = async (status, movies) => {
        if (status === "accepted") {
            try {
                setLoading(true); // Show loader
                const moviesPayload = movies.map((movie) => ({
                    movieId: movie.movieId, // Assuming movieId is available in the movie object
                    status: "accepted", // Use the status parameter
                    remarks: "Accepted successfully", // Example remark (can be dynamic)
                }));
                const response = await axios.patch(`https://www.mediashippers.com/api/deal/${selectedDealId}/action`, {
                    movies: moviesPayload
                }
                );
                console.log("Accept Response:", response.data);
                fetchDeals(); // Refresh deals
            } catch (error) {
                console.error("Error accepting deal:", error);
            } finally {
                setLoading(false); // Hide loader
                handleMenuClose(); // Close the menu
            }
        } else {
            setActionStatus(status); // Set the status for other actions
            setModalOpen(true); // Open the modal for "Negotiate" or "Reject"
        }
    };

    const handleModalClose = () => {
        setModalOpen(false); // Close the modal
        setRemark(""); // Reset the remark field
    };

    const handleSubmitAction = async () => {
        try {
            setLoading(true);

            const response = await axios.patch(`https://www.mediashippers.com/api/deal/${selectedDealId}/action`, {
                status: actionStatus, // Use the actionStatus state
                remark: remark, // Include the remark if provided
            });

            console.log(`${actionStatus} Response:`, response.data);
            fetchDeals(); // Refresh deals
        } catch (error) {
            console.error(`Error performing ${actionStatus} action:`, error);
        } finally {
            setLoading(false); // Hide loader
            handleModalClose(); // Close the modal
        }
    };

    const getUniqueSellers = async (movieDetails) => {
        const sellers = movieDetails.map((movie) => movie.userId);

        // Remove duplicates
        const uniqueSellerIds = [...new Set(sellers)];
        console.log("Unique Seller IDs:", uniqueSellerIds);
        return uniqueSellerIds;
    };

    const handleSellerChange = async (selectedValue) => {
        console.log("Selected Seller:", selectedValue);
        setSelectedSeller(selectedValue);
        const history = await getChatHistory(selectedDeal._id);
        setChatHistory(history);
    }


    return (
        <Box
            sx={{
                color: "white",
                minHeight: "100vh",
                padding: "20px",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        Deals Dashboard
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#a0a0b0" }}>
                        Manage and track all your deals in one place
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: "10px" }}>
                    <Box
                        sx={{
                            display: "flex",
                            bgcolor: "#1a1a2e",
                            borderRadius: "4px",
                            overflow: "hidden",
                        }}
                    >
                        <Button
                            startIcon={<TableRows />}
                            sx={{
                                color: viewMode === "table" ? "white" : "#a0a0b0",
                                bgcolor: viewMode === "table" ? "#1a1a2e" : "transparent",
                                "&:hover": { bgcolor: "#1a1a2e" },
                            }}
                            onClick={() => setViewMode("table")}
                        >
                            Table
                        </Button>
                        <Button
                            startIcon={<BarChart />}
                            sx={{
                                color: viewMode === "cards" ? "white" : "#a0a0b0",
                                bgcolor: viewMode === "cards" ? "#1a1a2e" : "transparent",
                                "&:hover": { bgcolor: "#1a1a2e" },
                            }}
                            onClick={() => setViewMode("cards")}
                        >
                            Cards
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ marginBottom: "20px" }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            bgcolor: "#1a1a2e",
                            color: "white",
                            height: "100%",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                            },
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="subtitle1">Total Deals</Typography>
                                <BarChart fontSize="small" />
                            </Box>
                            <Typography variant="h3" sx={{ my: 1, fontWeight: "bold" }}>
                                {dealcounts.total || 0}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#a0a0b0" }}>
                                Across all statuses
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            bgcolor: "#1a1a2e",
                            color: "white",
                            height: "100%",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                            },
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="subtitle1">Active Deals</Typography>
                                <InfoOutlined fontSize="small" sx={{ color: "#3a7bd5" }} />
                            </Box>
                            <Typography variant="h3" sx={{ my: 1, fontWeight: "bold" }}>
                                {dealcounts.active || 0}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#a0a0b0" }}>
                                In progress
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            bgcolor: "#1a1a2e",
                            color: "white",
                            height: "100%",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                            },
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="subtitle1">Completed Deals</Typography>
                                <CheckCircleOutline fontSize="small" sx={{ color: "#4caf50" }} />
                            </Box>
                            <Typography variant="h3" sx={{ my: 1, fontWeight: "bold" }}>
                                {dealcounts.closed || 0}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#a0a0b0" }}>
                                Successfully delivered
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            bgcolor: "#1a1a2e",
                            color: "white",
                            height: "100%",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                            },
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="subtitle1">Total Value</Typography>
                                <Typography variant="subtitle1" sx={{ color: "#a855f7" }}>
                                    $
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ my: 1, fontWeight: "bold" }}>
                                $0.00
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#a0a0b0" }}>
                                All deals combined
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Search and Filters */}
            <Box
                sx={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "20px",
                    flexDirection: { xs: "column", sm: "row" },
                }}
            >
                <TextField
                    placeholder="Search deals..."
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    type="search"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ color: "#a0a0b0" }} />
                            </InputAdornment>
                        ),
                        sx: {
                            bgcolor: "#1a1a2e",
                            color: "white",
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#2a2a3e",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#3a3a4e",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#6a26cd",
                            },
                            "& input": {
                                color: "white",
                            },
                        },
                    }}
                />
                <Box
                    sx={{
                        display: "flex",
                        gap: "10px",
                        flexShrink: 0,
                        width: { xs: "100%", sm: "auto" },
                    }}
                >
                    <FormControl sx={{ minWidth: 120 }}>
                        <Select
                            value={sortField}
                            onChange={(e) => setSortField(e.target.value)}
                            displayEmpty
                            size="small"
                            startAdornment={<CalendarToday sx={{ mr: 1, color: "#a0a0b0" }} />}
                            sx={{
                                bgcolor: "#1a1a2e",
                                color: "white",
                                height: "56px",
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#2a2a3e",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#3a3a4e",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#6a26cd",
                                },
                                "& .MuiSelect-icon": {
                                    color: "white",
                                },
                                "& .MuiSelect-select": {
                                    color: "white",
                                },
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: "#1a1a2e",
                                        color: "white",
                                        "& .MuiMenuItem-root": {
                                            color: "white",
                                            "&:hover": {
                                                bgcolor: "#2a2a3e",
                                            },
                                            "&.Mui-selected": {
                                                bgcolor: "#3a3a4e",
                                            },
                                        },
                                    },
                                },
                            }}
                        >
                            <MenuItem value="date">Date</MenuItem>
                            <MenuItem value="amount">Amount</MenuItem>
                            <MenuItem value="name">Name</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 120 }}>
                        <Select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            displayEmpty
                            sx={{
                                bgcolor: "#1a1a2e",
                                color: "white",
                                height: "56px",
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#2a2a3e",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#3a3a4e",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#6a26cd",
                                },
                                "& .MuiSelect-icon": {
                                    color: "white",
                                },
                                "& .MuiSelect-select": {
                                    color: "white",
                                },
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: "#1a1a2e",
                                        color: "white",
                                        "& .MuiMenuItem-root": {
                                            color: "white",
                                            "&:hover": {
                                                bgcolor: "#2a2a3e",
                                            },
                                            "&.Mui-selected": {
                                                bgcolor: "#3a3a4e",
                                            },
                                        },
                                    },
                                },
                            }}
                        >
                            <MenuItem value="descending">Descending</MenuItem>
                            <MenuItem value="ascending">Ascending</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {/* Tabs */}
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                    marginBottom: "20px",
                    "& .MuiTabs-indicator": {
                        backgroundColor: "#6a26cd",
                    },
                    "& .MuiTab-root": {
                        color: "#a0a0b0",
                        "&.Mui-selected": {
                            color: "white",
                        },
                    },
                }}
            >
                <Tab label={`All Deals (${dealcounts.active || 0})`} />
                <Tab label={`Shared (${dealcounts.shared || 0})`} />
                <Tab label={`Received (${dealcounts.received || 0})`} />
                <Tab label={`Pending (${dealcounts.pending || 0})`} />
                <Tab label={`Completed (${dealcounts.closed || 0})`} />
                <Tab label={`Cancelled (${dealcounts.cancelled || 0})`} />
            </Tabs>

            {/* Card View */}
            {viewMode === "cards" && (
                <Grid container spacing={2}>
                    {filteredDeals.slice(0, 3).map((deal) => (
                        <Grid item xs={12} md={4} key={deal._id}>
                            <Card
                                sx={{
                                    bgcolor: "#1a1a2e",
                                    color: "white",
                                    position: "relative",
                                    overflow: "visible",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-5px)",
                                        boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                                    },
                                }}
                            >
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                            {new Date(deal.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </Typography>
                                        <InfoOutlined
                                            fontSize="small"
                                            sx={{
                                                color:
                                                    deal.status === "Pending"
                                                        ? "#f5b014"
                                                        : deal.status === "Active"
                                                            ? "#3a7bd5"
                                                            : deal.status === "Completed"
                                                                ? "#4caf50"
                                                                : "#f44336",
                                            }}
                                        />
                                    </Box>
                                    <Typography variant="body2" sx={{ color: "#a0a0b0", marginBottom: "15px" }}>
                                        {new Date(deal.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </Typography>

                                    <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                        <Typography variant="body2" sx={{ color: "#a0a0b0" }}>
                                            Sender ID:
                                        </Typography>
                                        <Typography variant="body2">{deal.senderId}</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                        <Typography variant="body2" sx={{ color: "#a0a0b0" }}>
                                            Receiver ID:
                                        </Typography>
                                        <Typography variant="body2">{deal.assignedTo}</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                        <Typography variant="body2" sx={{ color: "#a0a0b0" }}>
                                            Total:
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                            $0.00
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Chip
                                            label={getStatusLabel(deal.status, user.role)}
                                            sx={{
                                                bgcolor: getStatusColor(deal.status).bg,
                                                color: getStatusColor(deal.status).color,
                                                borderRadius: "4px",
                                                height: "24px",
                                            }}
                                        />
                                        <Button
                                            endIcon={<ArrowForward />}
                                            sx={{
                                                color: "#a855f7",
                                                "&:hover": { bgcolor: "rgba(168, 85, 247, 0.1)" },
                                            }}
                                        >
                                            View Details
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Table View */}
            {viewMode === "table" && (
                <TableContainer
                    component={Paper}
                    sx={{
                        bgcolor: "#1a1a2e",
                        color: "white",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                        borderRadius: "8px",
                        overflow: "hidden",
                    }}
                >
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow
                                sx={{
                                    "& th": {
                                        color: "white",
                                        fontWeight: "bold",
                                        bgcolor: "#151525",
                                        borderBottom: "1px solid #2a2a3e",
                                    },
                                }}
                            >
                                <TableCell sx={{ color: "inherit" }}>Sender ID</TableCell>
                                <TableCell sx={{ color: "inherit" }}>Created Date</TableCell>
                                <TableCell sx={{ color: "inherit" }}>Reciver ID</TableCell>
                                <TableCell sx={{ color: "inherit" }}>Updated Date</TableCell>
                                <TableCell sx={{ color: "inherit" }}>Amount</TableCell>
                                <TableCell sx={{ color: "inherit" }}>Status</TableCell>
                                <TableCell sx={{ color: "inherit" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDeals.map((deal) => (
                                <TableRow
                                    key={deal._id}
                                    sx={{
                                        "&:last-child td, &:last-child th": { border: 0 },
                                        "& td": {
                                            color: "white",
                                            borderBottom: "1px solid #2a2a3e",
                                        },
                                        transition: "background-color 0.2s",
                                        "&:hover": {
                                            bgcolor: "#252535",
                                        },
                                    }}
                                >
                                    <TableCell sx={{ color: "inherit" }}>{deal.senderId}</TableCell>
                                    <TableCell sx={{ color: "inherit" }}>
                                        {new Date(deal.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </TableCell>
                                    <TableCell sx={{ color: "inherit" }}>{deal.assignedTo}</TableCell>
                                    <TableCell sx={{ color: "inherit" }}>
                                        {new Date(deal.updatedAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </TableCell>
                                    <TableCell sx={{ color: "inherit", fontWeight: "bold" }}>0.00</TableCell>
                                    <TableCell sx={{ color: "inherit" }}>
                                        <Chip
                                            label={getStatusLabel(deal.status, user.role)}
                                            sx={{
                                                bgcolor: getStatusColor(deal.status).bg,
                                                color: getStatusColor(deal.status).color,
                                                borderRadius: "4px",
                                                height: "24px",
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ color: "inherit" }}>
                                        <Box sx={{ display: "flex", gap: "4px" }}>
                                            {/* View Details Button */}
                                            <Tooltip title="View Details" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
                                                <IconButton
                                                    onClick={() => navigate(`/deal-details/${deal._id}`)}
                                                    size="small"
                                                    sx={{
                                                        color: "#a855f7",
                                                        "&:hover": {
                                                            bgcolor: "rgba(168, 85, 247, 0.1)",
                                                            transform: "scale(1.1)",
                                                        },
                                                        transition: "all 0.2s",
                                                    }}
                                                >
                                                    <Visibility fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            {/* Open Chat Button */}
                                            <Tooltip title="Open Chat" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleOpenChat(deal)}
                                                    sx={{
                                                        color: "#3a7bd5",
                                                        "&:hover": {
                                                            bgcolor: "rgba(58, 123, 213, 0.1)",
                                                            transform: "scale(1.1)",
                                                        },
                                                        transition: "all 0.2s",
                                                    }}
                                                >
                                                    <Message fontSize="small" />
                                                    {deal.unreadMessageCount > 0 && (
                                                        <Chip
                                                            label={deal.unreadMessageCount}
                                                            size="small"
                                                            sx={{
                                                                position: "absolute",
                                                                top: 0,
                                                                right: 0,
                                                                bgcolor: "#f44336",
                                                                color: "white",
                                                                fontSize: "10px",
                                                                height: "12px",
                                                                minWidth: "12px",
                                                                borderRadius: "50%",
                                                            }}
                                                        />
                                                    )}
                                                </IconButton>
                                            </Tooltip>

                                            {/* Conditional Rendering for Seller */}
                                            {user.role === "Seller" || user.role === 'Buyer' ? (
                                                <>
                                                    <Tooltip title="More Actions" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(event) => handleMenuOpen(event, deal._id)}
                                                            disabled={deal.status === "sent_to_shipper"} // Disable if status is 'sent_to_shipper'
                                                            sx={{
                                                                color: deal.status === "sent_to_shipper" ? "#9e9e9e" : "#9e9e9e",
                                                                "&:hover": {
                                                                    bgcolor: deal.status === "sent_to_shipper" ? "transparent" : "rgba(158, 158, 158, 0.1)",
                                                                    transform: deal.status === "sent_to_shipper" ? "none" : "scale(1.1)",
                                                                },
                                                                transition: "all 0.2s",
                                                            }}
                                                        >
                                                            <MoreVert fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Menu
                                                        anchorEl={menuAnchor}
                                                        open={menuOpen && selectedDealId === deal._id}
                                                        onClose={handleMenuClose}
                                                        PaperProps={{
                                                            sx: {
                                                                bgcolor: "#1a1a2e",
                                                                color: "white",
                                                                "& .MuiMenuItem-root": {
                                                                    "&:hover": {
                                                                        bgcolor: "#2a2a3e",
                                                                    },
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        <MenuItem onClick={() => handleActionClick("accepted", deal.movies)}>Accept</MenuItem>
                                                        <MenuItem onClick={() => handleActionClick("negotiation", deal.movies)}>Negotiate</MenuItem>
                                                        <MenuItem onClick={() => handleActionClick("rejected", deal.movies)}>Reject</MenuItem>
                                                    </Menu>
                                                </>
                                            ) : (
                                                <Tooltip title="Send Deal" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleSendDeal(deal._id)}
                                                        sx={{
                                                            color: "#4caf50",
                                                            "&:hover": {
                                                                bgcolor: "rgba(76, 175, 80, 0.1)",
                                                                transform: "scale(1.1)",
                                                            },
                                                            transition: "all 0.2s",
                                                        }}
                                                    >
                                                        <Send fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Chat Dialog */}
            <Dialog
                open={chatOpen}
                onClose={handleCloseChat}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: "#1a1a2e",
                        color: "white",
                        borderRadius: "12px",
                        display: "flex",
                        flexDirection: "column",
                        height: "80vh",
                    },
                }}
            >
                <Box sx={{ p: 2, borderBottom: "1px solid #2a2a3e" }}>
                    <Typography variant="h6">
                        Chat with {selectedUser?.name || "User"}
                    </Typography>
                    {user.role === 'Admin' && (
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, alignItems: "center" }}>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{
                                    bgcolor: "#6a26cd",
                                    height: 40,
                                    fontSize: "0.875rem",
                                    px: 2,
                                    "&:hover": { bgcolor: "#7c3ad9" },
                                }}
                                onClick={() => handleOpenChat(selectedDeal)}
                            >
                                Buyer
                            </Button>

                            <FormControl
                                size="small"
                                sx={{
                                    minWidth: 140,
                                    height: 40,
                                }}
                            >
                                <InputLabel
                                    size="small"
                                    id="seller-select-label"
                                    sx={{ color: "#a0a0b0", fontSize: "0.875rem" }}
                                >
                                    Select Seller
                                </InputLabel>
                                <Select
                                    labelId="seller-select-label"
                                    label="Select Seller"
                                    value={selectedSeller}
                                    onChange={(e) => handleSellerChange(e.target.value)}
                                    sx={{
                                        bgcolor: "#2a2a3e",
                                        color: "white",
                                        fontSize: "0.875rem",
                                        height: 40,
                                        ".MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#3a3a4e",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#4a4a5e",
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#6a26cd",
                                        },
                                        ".MuiSvgIcon-root": {
                                            color: "white",
                                        },
                                    }}
                                >
                                    {sellers.map((userId) => (
                                        <MenuItem key={userId} value={userId}>
                                            {userId}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    )}
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    {chatHistory.map((chat, index) => (
                        <Box
                            key={index}
                            sx={{
                                alignSelf: chat.senderId === user._id ? "flex-end" : "flex-start",
                                bgcolor: chat.senderId === user._id ? "#3a7bd5" : "#2a2e3e",
                                color: "white",
                                p: 1.5,
                                borderRadius: 2,
                                maxWidth: "70%",
                            }}
                        >
                            {chat.message}
                        </Box>
                    ))}
                </Box>

                <Box
                    sx={{
                        p: 2,
                        borderTop: "1px solid #2a2a3e",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        InputProps={{
                            sx: {
                                bgcolor: "#1a1a2e",
                                color: "white",
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#2a2a3e",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#3a3a4e",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#6a26cd",
                                },
                                "& input": {
                                    color: "white",
                                },
                            },
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendMessage}
                        sx={{ borderRadius: 2 }}
                    >
                        Send
                    </Button>
                </Box>
            </Dialog>

            {/* Action Modal */}
            <Dialog
                open={modalOpen}
                onClose={handleModalClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: "#1a1a2e",
                        color: "white",
                        borderRadius: "12px",
                        display: "flex",
                        flexDirection: "column",
                    },
                }}
            >
                <Box sx={{ p: 2, borderBottom: "1px solid #2a2a3e" }}>
                    <Typography variant="h6">
                        {actionStatus === "accepted"
                            ? "Accept Deal"
                            : actionStatus === "rejected"
                                ? "Reject Deal"
                                : "Negotiate Deal"}
                    </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                    <TextField
                        label="Remark"
                        variant="outlined"
                        fullWidth
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        InputProps={{
                            sx: {
                                bgcolor: "#1a1a2e",
                                color: "white",
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#2a2a3e",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#3a3a4e",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#6a26cd",
                                },
                                "& input": {
                                    color: "white",
                                },
                            },
                        }}
                    />
                </Box>
                <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleModalClose}
                        sx={{ borderRadius: 2 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmitAction}
                        sx={{ borderRadius: 2 }}
                    >
                        Submit
                    </Button>
                </Box>
            </Dialog>
        </Box>
    )
}
