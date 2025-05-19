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
} from "@mui/icons-material"
import axios from "axios"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

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
    const [unreadCount, setUnreadCount] = useState(0);
    const [dealId, setDealId] = useState("");

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
            const response = await axios.get(`https://www.mediashippers.com/api/deal/deals-with-counts/${user._id}`)
            const data = await response.data
            setDealsData(data.deals)
            setDealCounts(data.counts) // Assuming the API returns counts for each status
            // Assuming the API returns an array of deals
            // setDeals(data.deals) // Uncomment this line if you want to set the deals from the API response
        } catch (error) {
            console.error("Error fetching deals:", error)
        }
    }

    // Fetch chat history for a specific user
    const getChatHistory = async (dealId) => {
        try {
            const response = await axios.get(`https://www.mediashippers.com/api/deal/${dealId}/message-history`);
            return response.data.history; // Return chat history
        } catch (error) {
            console.error("Error fetching chat history:", error);
            return [];
        }
    };

    // Send a message to a specific user
    const sendMessage = async (receiverId, message) => {
        try {
            const response = await axios.post(`https://www.mediashippers.com/api/deal/${dealId}/message`, {
                senderId: user._id,
                receiverId,
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
            const response = await axios.get(`https://www.mediashippers.com/api/deal/unread-count/${user._id}`);
            return response.data.unreadCount; // Return unread message count
        } catch (error) {
            console.error("Error fetching unread message count:", error);
            return 0;
        }
    };

    // Mark messages as read for a specific user
    const markMessagesAsRead = async (userId) => {
        try {
            await axios.post(`https://www.mediashippers.com/api/chat/mark-as-read`, { userId });
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    };

    useEffect(() => {
        fetchDeals();
    }, [])

    const handleOpenChat = async (dealId) => {
        setChatOpen(true);
        setDealId(dealId);
        const history = await getChatHistory(dealId);
        setChatHistory(history);

        //   await markMessagesAsRead(user._id);

        const count = await getUnreadMessageCount();
        setUnreadCount(count);
    };

    const handleCloseChat = () => {
        setChatOpen(false);
    };

    const handleSendMessage = async () => {
        if (!messageText.trim()) return;

        const newMessage = await sendMessage("6808d7388056ce9a8797e550", messageText);

        if (newMessage) {
            setChatHistory((prev) => [...prev, newMessage]);
            setMessageText("");
        }
    };

    useEffect(() => {
        const fetchUnreadCount = async () => {
            const count = await getUnreadMessageCount();
            setUnreadCount(count);
        };

        fetchUnreadCount();
    }, []);

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
                                            Reciver ID:
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
                                            label={deal.status}
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
                                        padding: '0px'
                                    }}
                                >
                                    <TableCell
                                        sx={{
                                            color: "inherit"
                                        }}
                                    >
                                        {deal.senderId}
                                    </TableCell>
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
                                            label={deal.status}
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
                                            <Tooltip title="Open Chat" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleOpenChat(deal._id)}
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
                                                    {unreadCount > 0 && (
                                                        <Chip
                                                            label={unreadCount}
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
                                            <Tooltip title="More Options" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        color: "#a0a0b0",
                                                        "&:hover": {
                                                            bgcolor: "rgba(160, 160, 176, 0.1)",
                                                            transform: "scale(1.1)",
                                                        },
                                                        transition: "all 0.2s",
                                                    }}
                                                >
                                                    <MoreVert fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
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
        </Box>
    )
}
