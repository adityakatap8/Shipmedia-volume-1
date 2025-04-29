import { useState } from "react"
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
} from "@mui/icons-material"

// Sample data for the deals
const dealsData = [
    {
        id: 1,
        name: "Documentary Footage Collection",
        date: "Apr 20, 2023",
        buyer: "Michael Brown",
        seller: "RealLife Media",
        amount: 650.0,
        status: "Pending",
        items: 1,
    },
    {
        id: 2,
        name: "4K Cinematic Video Assets",
        date: "Apr 18, 2023",
        buyer: "Jane Smith",
        seller: "FilmCraft Productions",
        amount: 550.0,
        status: "Pending",
        items: 1,
    },
    {
        id: 3,
        name: "Premium Stock Photos Collection",
        date: "Apr 15, 2023",
        buyer: "John Doe",
        seller: "VisualArts Studio",
        amount: 350.0,
        status: "Active",
        items: 1,
    },
    {
        id: 4,
        name: "Vector Graphics Bundle",
        date: "Apr 14, 2023",
        buyer: "Sarah Williams",
        seller: "DesignMasters",
        amount: 250.0,
        status: "Active",
        items: 1,
    },
    {
        id: 5,
        name: "3D Model Collection",
        date: "Apr 12, 2023",
        buyer: "David Wilson",
        seller: "3D Masters",
        amount: 420.0,
        status: "Active",
        items: 1,
    },
    {
        id: 6,
        name: "Professional Audio Production Pack",
        date: "Apr 10, 2023",
        buyer: "Alex Johnson",
        seller: "SoundWave Studios",
        amount: 300.0,
        status: "Completed",
        items: 1,
    },
    {
        id: 7,
        name: "Motion Graphics Templates",
        date: "Apr 8, 2023",
        buyer: "Emily Chen",
        seller: "Motion Studios",
        amount: 330.0,
        status: "Cancelled",
        items: 1,
    },
]

export default function DealDashboard() {
    const [viewMode, setViewMode] = useState("table")
    const [tabValue, setTabValue] = useState(0)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortOrder, setSortOrder] = useState("descending")
    const [sortField, setSortField] = useState("date")

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    // Filter deals based on tab selection and search term
    const getFilteredDeals = () => {
        let filtered = [...dealsData]

        // Filter by tab
        if (tabValue === 1) {
            filtered = filtered.filter((deal) => deal.status === "Active")
        } else if (tabValue === 2) {
            filtered = filtered.filter((deal) => deal.status === "Pending")
        } else if (tabValue === 3) {
            filtered = filtered.filter((deal) => deal.status === "Completed")
        } else if (tabValue === 4) {
            filtered = filtered.filter((deal) => deal.status === "Cancelled")
        }

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            filtered = filtered.filter(
                (deal) =>
                    deal.name.toLowerCase().includes(term) ||
                    deal.buyer.toLowerCase().includes(term) ||
                    deal.seller.toLowerCase().includes(term),
            )
        }

        // Sort deals
        filtered.sort((a, b) => {
            if (sortField === "date") {
                return new Date(b.date).getTime() - new Date(a.date).getTime()
            } else if (sortField === "amount") {
                return b.amount - a.amount
            } else {
                return a.name.localeCompare(b.name)
            }
        })

        if (sortOrder === "ascending") {
            filtered.reverse()
        }

        return filtered
    }

    const filteredDeals = getFilteredDeals()

    // Calculate statistics
    const totalDeals = dealsData.length
    const activeDeals = dealsData.filter((deal) => deal.status === "Active").length
    const completedDeals = dealsData.filter((deal) => deal.status === "Completed").length
    const totalValue = dealsData.reduce((sum, deal) => sum + deal.amount, 0).toFixed(2)
    const pendingDeals = dealsData.filter((deal) => deal.status === "Pending").length
    const cancelledDeals = dealsData.filter((deal) => deal.status === "Cancelled").length

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
                                {totalDeals}
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
                                {activeDeals}
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
                                {completedDeals}
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
                                ${totalValue}
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
                <Tab label={`All Deals (${totalDeals})`} />
                <Tab label={`Active (${activeDeals})`} />
                <Tab label={`Pending (${pendingDeals})`} />
                <Tab label={`Completed (${completedDeals})`} />
                <Tab label={`Cancelled (${cancelledDeals})`} />
            </Tabs>

            {/* Card View */}
            {viewMode === "cards" && (
                <Grid container spacing={2}>
                    {filteredDeals.slice(0, 3).map((deal) => (
                        <Grid item xs={12} md={4} key={deal.id}>
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
                                            {deal.name}
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
                                        {deal.date} • {deal.items} item
                                    </Typography>

                                    <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                        <Typography variant="body2" sx={{ color: "#a0a0b0" }}>
                                            Buyer:
                                        </Typography>
                                        <Typography variant="body2">{deal.buyer}</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                        <Typography variant="body2" sx={{ color: "#a0a0b0" }}>
                                            Seller:
                                        </Typography>
                                        <Typography variant="body2">{deal.seller}</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                        <Typography variant="body2" sx={{ color: "#a0a0b0" }}>
                                            Total:
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                            ${deal.amount.toFixed(2)}
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
                                <TableCell sx={{ color: "inherit" }}>Deal</TableCell>
                                <TableCell sx={{ color: "inherit" }}>Date</TableCell>
                                <TableCell sx={{ color: "inherit" }}>Buyer</TableCell>
                                <TableCell sx={{ color: "inherit" }}>Seller</TableCell>
                                <TableCell sx={{ color: "inherit" }}>Amount</TableCell>
                                <TableCell sx={{ color: "inherit" }}>Status</TableCell>
                                <TableCell sx={{ color: "inherit" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDeals.map((deal) => (
                                <TableRow
                                    key={deal.id}
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
                                        {deal.name}
                                    </TableCell>
                                    <TableCell sx={{ color: "inherit" }}>{deal.date}</TableCell>
                                    <TableCell sx={{ color: "inherit" }}>{deal.buyer}</TableCell>
                                    <TableCell sx={{ color: "inherit" }}>{deal.seller}</TableCell>
                                    <TableCell sx={{ color: "inherit", fontWeight: "bold" }}>${deal.amount.toFixed(2)}</TableCell>
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
                                            <Tooltip title="Edit Deal" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        color: "#3a7bd5",
                                                        "&:hover": {
                                                            bgcolor: "rgba(58, 123, 213, 0.1)",
                                                            transform: "scale(1.1)",
                                                        },
                                                        transition: "all 0.2s",
                                                    }}
                                                >
                                                    <Edit fontSize="small" />
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
        </Box>
    )
}
