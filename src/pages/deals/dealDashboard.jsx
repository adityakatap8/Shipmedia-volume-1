import React from "react"

import { useEffect, useState, useRef } from "react"
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
    Collapse,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material"
import {
    Search,
    BarChart,
    TableRows,
    CalendarToday,
    InfoOutlined,
    CheckCircleOutline,
    ArrowForward,
    MoreVert,
    Visibility,
    Message,
    Send,
    KeyboardArrowDown,
    KeyboardArrowRight,
    InsertEmoticon,
    Mic,
    AttachFile,
    Image,
    Close,
    PauseCircle,
    FilePresent,
} from "@mui/icons-material"
import axios from "axios"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Loader from "../../components/loader/Loader"

// Add this at the top of your component, after the imports
const globalStyles = `
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(244, 67, 54, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
    }
  }
`

export default function DealDashboard() {
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth.user)
    console.log("User:", user)
    const [viewMode, setViewMode] = useState("table")
    const [tabValue, setTabValue] = useState(0)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortOrder, setSortOrder] = useState("descending")
    const [sortField, setSortField] = useState("date")
    const [dealsData, setDealsData] = useState([])
    const [dealcounts, setDealCounts] = useState({})
    const [chatOpen, setChatOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [messageText, setMessageText] = useState("")
    const [chatHistory, setChatHistory] = useState([])
    const [dealId, setDealId] = useState("")
    const [loading, setLoading] = useState(false)
    const [menuAnchor, setMenuAnchor] = useState(null)
    const [menuOpen, setMenuOpen] = useState(false)
    const [selectedDealId, setSelectedDealId] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [remark, setRemark] = useState("")
    const [actionStatus, setActionStatus] = useState("")
    const [selectedSeller, setSelectedSeller] = useState(null)
    const [selectedDeal, setSelectedDeal] = useState(null)
    console.log("Selected Deal:", selectedDeal)
    const [sellers, setSellers] = useState([])
    const [expandedRows, setExpandedRows] = useState(new Set())
    const [subDeals, setSubDeals] = useState({})
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const [audioBlob, setAudioBlob] = useState(null)
    const [mediaRecorder, setMediaRecorder] = useState(null)
    const [audioChunks, setAudioChunks] = useState([])
    const [audioURL, setAudioURL] = useState("")
    const fileInputRef = useRef(null)
    const imageInputRef = useRef(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)

    console.log("sellers", sellers)

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    // Toggle row expansion
    const handleRowExpand = (dealId) => {
        setExpandedRows((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(dealId)) {
                newSet.delete(dealId)
            } else {
                newSet.add(dealId)
            }
            return newSet
        })
    }

    // Fetch sub-deals for a specific deal
    const fetchSubDeals = async (dealId) => {
        try {
            setLoading(true)
            const response = await axios.get(`https://www.mediashippers.com/api/deal/${dealId}/sub-deals`)
            const subDealData = response.data.subDeals || []

            setSubDeals((prev) => ({
                ...prev,
                [dealId]: subDealData,
            }))
        } catch (error) {
            console.error("Error fetching sub-deals:", error)
            // Set empty array if no sub-deals found
            setSubDeals((prev) => ({
                ...prev,
                [dealId]: [],
            }))
        } finally {
            setLoading(false)
        }
    }

    // Filter deals based on tab selection and search term
    const getFilteredDeals = () => {
        let filtered = [...dealsData]

        // Filter by tab
        if (tabValue === 0) {
            filtered = filtered.filter((deal) => deal.senderId === user._id)
        } else if (tabValue === 1) {
            filtered = filtered.filter((deal) => deal.assignedTo === user._id)
        } else if (tabValue === 2) {
            filtered = filtered.filter((deal) => deal.status === "pending")
        } else if (tabValue === 3) {
            filtered = filtered.filter((deal) => deal.status === "closed")
        } else if (tabValue === 4) {
            filtered = filtered.filter((deal) => deal.status === "cancelled")
        }

        console.log("Filtered Deals:", filtered)

        return filtered
    }

    const filteredDeals = getFilteredDeals()
    console.log("Filtered Deals:", filteredDeals)

    const getStatusLabel = (status, userRole) => {
        if (userRole === "Buyer" && status === "sent_to_buyer") {
            return "received_from_shipper"
        }
        if (userRole === "Admin" && status === "sent_to_shipper") {
            return "received_from_buyer"
        }
        return status // Default status
    }

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
            setLoading(true) // Show loader
            const response = await axios.get(`https://www.mediashippers.com/api/deal/deals-with-counts/${user._id}`)
            const data = await response.data
            console.log("Fetched Deals:", data.deals)
            setDealsData(data.deals)
            setDealCounts(data.counts) // Assuming the API returns counts for each status
        } catch (error) {
            console.error("Error fetching deals:", error)
        } finally {
            setLoading(false) // Hide loader
        }
    }

    // Fetch chat history for a specific user
    const getChatHistory = async (dealId) => {
        try {
            const response = await axios.get(`https://www.mediashippers.com/api/deal/${dealId}/message-history`, {
                params: {
                    loggedInUserId: user._id,
                    loggedInUserRole: user.role,
                },
            })
            return response.data.history
        } catch (error) {
            console.error("Error fetching chat history:", error)
            return []
        }
    }

    // Send a message to a specific user
    const handleSendMessage = async () => {
        try {
            const response = await axios.post(`https://www.mediashippers.com/api/deal/${dealId}/message`, {
                senderId: user._id,
                receiverId: user.role === "Admin" ? selectedUser : user.createdBy,
                message: messageText,
            })
            const history = await getChatHistory(dealId)
            setChatHistory(history)
            setMessageText("")
        } catch (error) {
            console.error("Error sending message:", error)
            return null
        }
    }

    // Get unread message count for the current user
    const getUnreadMessageCount = async () => {
        try {
            const response = await axios.get(`https://www.mediashippers.com/api/deal/unread-count/${dealId}/${user._id}`)
            return response.data.unreadCount // Return unread message count
        } catch (error) {
            console.error("Error fetching unread message count:", error)
            return 0
        }
    }

    // Mark messages as read for a specific user
    const markMessagesAsRead = async (userId, dealId) => {
        try {
            await axios.post(`https://www.mediashippers.com/api/deal/${dealId}/mark-read/${userId}`)
        } catch (error) {
            console.error("Error marking messages as read:", error)
        }
    }

    useEffect(() => {
        fetchDeals()
    }, [chatOpen])

    useEffect(() => {
        const fetchSellers = async () => {
            if (selectedDeal && selectedDeal.movieDetails) {
                const sellerData = await getUniqueSellers(selectedDeal.movieDetails) // Await the result
                setSellers(sellerData) // Set the resolved value
            }
        }

        fetchSellers()
    }, [selectedDeal])

    const handleOpenChat = async (deal) => {
        console.log("Opening chat for deal:", deal)
        setChatOpen(true)
        setDealId(deal._id)
        setSelectedDeal(deal)
        setSelectedUser(deal.senderId)
        const history = await getChatHistory(deal._id)
        setChatHistory(history)
        await markMessagesAsRead(user._id, deal._id)
    }

    const handleCloseChat = () => {
        setChatOpen(false)
    }

    // Handle emoji selection
    const emojis = [
        "😀", "😂", "😍", "👍", "🎉", "😎", "😢", "😡", "❤️", "🔥", "✨", "🎁", "🎶", "🌟", "💯", "👏", "🙌", "🤔", "🤩", "🥳"
    ];  // Define your custom emojis

    const handleEmojiClick = (emoji) => {
        setMessageText((prev) => prev + emoji); // Append the selected emoji to the message text
        setShowEmojiPicker(false); // Close the emoji picker
    };

    // Start voice recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const recorder = new MediaRecorder(stream)
            const chunks = []

            recorder.ondataavailable = (e) => {
                chunks.push(e.data)
            }

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: "audio/webm" })
                setAudioBlob(blob)
                setAudioURL(URL.createObjectURL(blob))
                setAudioChunks([])
            }

            setMediaRecorder(recorder)
            setAudioChunks([])
            recorder.start()
            setIsRecording(true)

            // Start timer
            const startTime = Date.now()
            const timerInterval = setInterval(() => {
                setRecordingTime(Math.floor((Date.now() - startTime) / 1000))
            }, 1000)

            // Store interval ID in recorder object for cleanup
            recorder.timerInterval = timerInterval
        } catch (err) {
            console.error("Error accessing microphone:", err)
            alert("Could not access microphone. Please check permissions.")
        }
    }

    // Stop voice recording
    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop()
            // Stop all tracks in the stream
            mediaRecorder.stream.getTracks().forEach((track) => track.stop())
            // Clear the timer interval
            clearInterval(mediaRecorder.timerInterval)
            setIsRecording(false)
        }
    }

    // Cancel voice recording
    const cancelRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop()
            mediaRecorder.stream.getTracks().forEach((track) => track.stop())
            clearInterval(mediaRecorder.timerInterval)
            setIsRecording(false)
            setAudioURL("")
            setAudioBlob(null)
        }
    }

    // Handle file selection
    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    // Handle image selection
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0]
            setSelectedImage(file)
            setPreviewImage(URL.createObjectURL(file))
        }
    }

    // Clear selected file
    const clearSelectedFile = () => {
        setSelectedFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    // Clear selected image
    const clearSelectedImage = () => {
        setSelectedImage(null)
        setPreviewImage(null)
        if (imageInputRef.current) {
            imageInputRef.current.value = ""
        }
    }

    // Format recording time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    // Send message with attachments
    // const handleSendMessage = async () => {
    //     if (!messageText.trim() && !audioBlob && !selectedFile && !selectedImage) return

    //     // Create FormData for attachments
    //     const formData = new FormData()
    //     formData.append("senderId", user._id)
    //     formData.append("receiverId", user.role === "Admin" ? selectedUser : user.createdBy)

    //     if (messageText.trim()) {
    //         formData.append("message", messageText)
    //     }

    //     if (audioBlob) {
    //         formData.append("audio", audioBlob, "voice-message.webm")
    //     }

    //     if (selectedFile) {
    //         formData.append("file", selectedFile)
    //     }

    //     if (selectedImage) {
    //         formData.append("image", selectedImage)
    //     }

    //     try {
    //         // Assuming your API can handle multipart/form-data
    //         const response = await axios.post(`https://www.mediashippers.com/api/deal/${dealId}/message`, formData, {
    //             headers: {
    //                 "Content-Type": "multipart/form-data",
    //             },
    //         })

    //         // Refresh chat history
    //         const history = await getChatHistory(dealId)
    //         setChatHistory(history)

    //         // Reset all states
    //         setMessageText("")
    //         setAudioURL("")
    //         setAudioBlob(null)
    //         setSelectedFile(null)
    //         setSelectedImage(null)
    //         setPreviewImage(null)

    //         if (fileInputRef.current) fileInputRef.current.value = ""
    //         if (imageInputRef.current) imageInputRef.current.value = ""
    //     } catch (error) {
    //         console.error("Error sending message with attachments:", error)
    //     }
    // }

    const handleSendDeal = async (dealId) => {
        try {
            setLoading(true) // Show loader
            const response = await axios.post("https://www.mediashippers.com/api/deal/split-to-sellers", {
                dealId,
                userId: user._id,
            })
            console.log("Send Deal Response:", response.data)
            // Optionally, refresh the deals data or show a success message
            fetchDeals()
        } catch (error) {
            console.error("Error sending deal:", error)
        } finally {
            setLoading(false) // Hide loader
        }
    }

    const handleMenuOpen = (event, dealId) => {
        setMenuAnchor(event.currentTarget)
        setMenuOpen(true)
        setSelectedDealId(dealId)
    }

    const handleMenuClose = () => {
        setMenuAnchor(null)
        setMenuOpen(false)
        setSelectedDealId(null)
    }

    const handleAccept = async (dealId) => {
        try {
            setLoading(true)
            const response = await axios.patch(`https://www.mediashippers.com/api/deal/${dealId}/action`)
            console.log("Accept Response:", response.data)
            fetchDeals() // Refresh deals
        } catch (error) {
            console.error("Error accepting deal:", error)
        } finally {
            setLoading(false)
            handleMenuClose()
        }
    }

    const handleNegotiate = async (dealId) => {
        try {
            setLoading(true)
            const response = await axios.patch(`https://www.mediashippers.com/api/deal/${dealId}/action`)
            console.log("Negotiate Response:", response.data)
            fetchDeals() // Refresh deals
        } catch (error) {
            console.error("Error negotiating deal:", error)
        } finally {
            setLoading(false)
            handleMenuClose()
        }
    }

    const handleReject = async (dealId) => {
        try {
            setLoading(true)
            const response = await axios.patch(`https://www.mediashippers.com/api/deal/${dealId}/action`)
            console.log("Reject Response:", response.data)
            fetchDeals() // Refresh deals
        } catch (error) {
            console.error("Error rejecting deal:", error)
        } finally {
            setLoading(false)
            handleMenuClose()
        }
    }

    const handleActionClick = async (status, deal) => {
        if (status === "rejected" || status === "negotiation") {
            // Open the remark modal for "reject" and "negotiate"
            setActionStatus(status); // Set the action status
            setModalOpen(true); // Open the modal
            setSelectedDeal(deal);
        } else {
            try {
                setLoading(true); // Show loader

                // Prepare the payload for the API
                const moviesPayload = deal.movies.map((movie) => ({
                    movieId: movie.movieId, // Assuming movieId is available in the movie object
                    status, // Use the status parameter dynamically
                    remarks: "", // No remarks for "accept"
                }));

                // Call the API
                const response = await axios.patch(
                    `https://www.mediashippers.com/api/deal/${selectedDealId}/action`,
                    { movies: moviesPayload }
                );

                console.log(`${status} Response:`, response.data);

                // Refresh deals after the action
                fetchDeals();
            } catch (error) {
                console.error(`Error performing ${status} action:`, error);
            } finally {
                setLoading(false); // Hide loader
                handleMenuClose(); // Close the menu
            }
        }
    };

    const handleModalClose = () => {
        setModalOpen(false) // Close the modal
        setRemark("") // Reset the remark field
    }

    const handleSubmitAction = async () => {
        try {
            setLoading(true); // Show loader

            // Prepare the payload for the API
            const moviesPayload = selectedDeal.movies.map((movie) => ({
                movieId: movie.movieId, // Assuming movieId is available in the movie object
                status: actionStatus, // Use the actionStatus state
                remarks: remark, // Include the remark if provided
            }));
            console.log("Movies Payload:", moviesPayload)

            // Call the API
            const response = await axios.patch(
                `https://www.mediashippers.com/api/deal/${selectedDealId}/action`,
                { movies: moviesPayload }
            );

            console.log(`${actionStatus} Response:`, response.data);

            // Refresh deals after the action
            fetchDeals();
        } catch (error) {
            console.error(`Error performing ${actionStatus} action:`, error);
        } finally {
            setLoading(false); // Hide loader
            handleModalClose(); // Close the modal
        }
    };

    const getUniqueSellers = async (movieDetails) => {
        const sellers = movieDetails.map((movie) => movie.userId)

        // Remove duplicates
        const uniqueSellerIds = [...new Set(sellers)]
        console.log("Unique Seller IDs:", uniqueSellerIds)
        return uniqueSellerIds
    }

    const handleSellerChange = async (selectedValue) => {
        console.log("Selected Seller:", selectedDeal, selectedValue)
        setSelectedSeller(selectedValue)
        const history = await getChatHistory(selectedDeal._id)
        setChatHistory(history)
    }

    // Render table row (for both main deals and sub-deals)
    const renderTableRow = (deal, isSubDeal = false) => (
        <TableRow
            key={deal._id}
            sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "& td": {
                    color: "white",
                    borderBottom: "1px solid #2a2a3e",
                    paddingLeft: isSubDeal ? "40px" : "16px", // Indent sub-deals
                },
                transition: "background-color 0.2s",
                "&:hover": {
                    bgcolor: "#252535",
                },
                bgcolor: isSubDeal ? "#1e1e2e" : "transparent", // Slightly different background for sub-deals
            }}
        >
            {tabValue !== 0 && (
                <TableCell sx={{ color: "inherit" }}>
                    {!isSubDeal && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleRowExpand(deal._id)
                                }}
                                sx={{
                                    color: "white",
                                    marginRight: 1,
                                    padding: "2px",
                                }}
                            >
                                {expandedRows.has(deal._id) ? (
                                    <KeyboardArrowDown fontSize="small" />
                                ) : (
                                    <KeyboardArrowRight fontSize="small" />
                                )}
                            </IconButton>
                            {deal.senderDetails?.name}
                        </Box>
                    )}
                    {isSubDeal && (
                        <Box sx={{ display: "flex", alignItems: "center", paddingLeft: "24px" }}>
                            <Typography variant="body2" sx={{ color: "#a0a0b0", marginRight: 1 }}>
                                └
                            </Typography>
                            {deal.senderDetails?.name}
                        </Box>
                    )}
                </TableCell>
            )}
            {tabValue !== 1 && <TableCell sx={{ color: "inherit" }}>{deal.assignedToDetails?.name}</TableCell>}
            <TableCell sx={{ color: "inherit" }}>
                {new Date(deal.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })}
            </TableCell>
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
                    {user.role === "Seller" || user.role === "Buyer" ? (
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
                                <MenuItem onClick={() => handleActionClick("accepted", deal)}>Accept</MenuItem>
                                <MenuItem onClick={() => handleActionClick("negotiation", deal)}>Negotiate</MenuItem>
                                <MenuItem onClick={() => handleActionClick("rejected", deal)}>Reject</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Tooltip title="Send Deal" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
                            <IconButton
                                size="small"
                                onClick={() => handleSendDeal(deal._id)}
                                disabled={deal.status === "sent_to_seller" || deal.status === "sent_to_buyer"} // Correct condition
                                sx={{
                                    color: deal.status === "sent_to_seller" || deal.status === "sent_to_buyer" ? "#9e9e9e" : "#4caf50", // Change color when disabled
                                    "&:hover": {
                                        bgcolor:
                                            deal.status === "sent_to_seller" || deal.status === "sent_to_buyer"
                                                ? "transparent"
                                                : "rgba(76, 175, 80, 0.1)",
                                        transform:
                                            deal.status === "sent_to_seller" || deal.status === "sent_to_buyer" ? "none" : "scale(1.1)",
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
    )

    return (
        <>
            <style>{globalStyles}</style>
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
                                                Sender:
                                            </Typography>
                                            <Typography variant="body2">{deal.senderDetails.name}</Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                            <Typography variant="body2" sx={{ color: "#a0a0b0" }}>
                                                Receiver:
                                            </Typography>
                                            <Typography variant="body2">{deal.assignedToDetails.name}</Typography>
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

                {/* Table View with Expandable Rows */}
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
                                    {tabValue !== 0 && <TableCell sx={{ color: "inherit" }}>Sender</TableCell>}
                                    {tabValue !== 1 && <TableCell sx={{ color: "inherit" }}>Receiver</TableCell>}
                                    <TableCell sx={{ color: "inherit" }}>Created Date</TableCell>
                                    <TableCell sx={{ color: "inherit" }}>Updated Date</TableCell>
                                    <TableCell sx={{ color: "inherit" }}>Amount</TableCell>
                                    <TableCell sx={{ color: "inherit" }}>Status</TableCell>
                                    <TableCell sx={{ color: "inherit" }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredDeals.map((deal) => (
                                    <React.Fragment key={deal._id}>
                                        {/* Main Deal Row */}
                                        {renderTableRow(deal, false)}

                                        {/* Sub-deals Row (Collapsible) */}
                                        {user.role === "Admin" && (
                                            <TableRow key={`${deal._id}-subdeals`}>
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                                                    <Collapse in={expandedRows.has(deal._id)} timeout="auto" unmountOnExit>
                                                        <Box sx={{ margin: 1 }}>
                                                            {deal.childDeals && deal.childDeals.length > 0 ? (
                                                                deal.childDeals.map((childDeal) => renderTableRow(childDeal, true))
                                                            ) : (
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        color: "#a0a0b0",
                                                                        textAlign: "center",
                                                                        padding: 2,
                                                                    }}
                                                                >
                                                                    No sub-deals available
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Chat Dialog */}
                <Dialog
                    open={chatOpen}
                    onClose={handleCloseChat}
                    maxWidth="xs"
                    fullWidth
                    PaperProps={{
                        sx: {
                            position: "fixed", // Fix the position
                            bottom: 0, // Position at the bottom
                            right: 0, // Position at the right
                            width: "600px", // Set a fixed width
                            height: "400px", // Set a fixed height
                            bgcolor: "#1a1a2e", // Background color
                            color: "white", // Text color
                            borderRadius: "20px 20px 0 20px", // Rounded corners
                            boxShadow: "0 4px 20px rgba(0,0,0,0.2)", // Add shadow
                        },
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", height: "600px" }}>
                        {/* Chat Header */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "16px",
                                borderBottom: "1px solid #2a2a3e",
                            }}
                        >
                            <Typography variant="h6">
                                Chat with
                            </Typography>
                            <IconButton onClick={handleCloseChat} sx={{ color: "white" }}>
                                <Close />
                            </IconButton>
                        </Box>

                        {/* Chat Messages */}
                        <Box
                            sx={{
                                flexGrow: 1,
                                overflowY: "auto",
                                padding: "16px"
                            }}
                        >
                            {chatHistory.map((message, index) => {
                                const messageDay = getMessageDay(message.createdAt);

                                return (
                                    <Box key={index} sx={{ display: "flex", flexDirection: "column", marginBottom: "16px" }}>
                                        {/* Show the day label only if it's the first message of that day */}
                                        {(index === 0 || getMessageDay(chatHistory[index - 1].createdAt) !== messageDay) && (
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    color: "#a0a0b0",
                                                    textAlign: "center",
                                                    marginBottom: "8px",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {messageDay}
                                            </Typography>
                                        )}

                                        {/* Message Bubble */}
                                        <Box
                                            sx={{
                                                maxWidth: "70%",
                                                marginBottom: "8px",
                                                padding: "10px 14px",
                                                borderRadius: "12px",
                                                bgcolor: message.senderId === user._id ? "#dcf8c6" : "#ffffff", // Green for logged-in user, white for others
                                                color: message.senderId === user._id ? "#000" : "#000", // Text color
                                                alignSelf: message.senderId === user._id ? "flex-end" : "flex-start", // Align based on sender
                                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)", // Add shadow for bubble effect
                                                wordBreak: "break-word", // Handle long text
                                            }}
                                        >
                                            <Typography variant="body1" sx={{ fontSize: "14px", marginBottom: "4px" }}>
                                                {message.message}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    display: "block",
                                                    textAlign: "right",
                                                    color: "#999",
                                                    fontSize: "12px",
                                                    marginTop: "4px",
                                                }}
                                            >
                                                {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </Typography>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>

                        {/* Chat Input */}
                        <Box
                            sx={{
                                padding: "16px",
                                borderTop: "1px solid #2a2a3e",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <IconButton onClick={() => setShowEmojiPicker((prev) => !prev)} sx={{ color: "white" }}>
                                <InsertEmoticon />
                            </IconButton>

                            {/* Emoji Picker */}
                            <Collapse
                                in={showEmojiPicker}
                                timeout="auto"
                                unmountOnExit
                                sx={{ position: "absolute", bottom: 80, left: 16, zIndex: 1 }}
                            >
                                <Paper
                                    elevation={4}
                                    sx={{
                                        bgcolor: "#1a1a2e",
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                        padding: "8px",
                                        display: "flex",
                                        flexWrap: "wrap", // Wrap emojis to the next row
                                        gap: "8px",
                                        justifyContent: "center", // Center emojis
                                    }}
                                >
                                    {emojis.map((emoji, index) => (
                                        <Button
                                            key={index}
                                            onClick={() => handleEmojiClick(emoji)}
                                            sx={{
                                                fontSize: "24px",
                                                color: "white",
                                                minWidth: "20px",
                                                height: "40px",
                                                bgcolor: "#2a2e3d",
                                                "&:hover": { bgcolor: "#3a3a4e" },
                                            }}
                                        >
                                            {emoji}
                                        </Button>
                                    ))}
                                </Paper>
                            </Collapse>

                            {/* Voice Recording */}
                            {isRecording ? (
                                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Typography variant="body2" sx={{ color: "white" }}>
                                        Recording: {formatTime(recordingTime)}
                                    </Typography>
                                    <IconButton onClick={stopRecording} sx={{ color: "white" }}>
                                        <PauseCircle />
                                    </IconButton>
                                    <IconButton onClick={cancelRecording} sx={{ color: "white" }}>
                                        <Close />
                                    </IconButton>
                                </Box>
                            ) : (
                                <IconButton onClick={startRecording} sx={{ color: "white" }}>
                                    <Mic />
                                </IconButton>
                            )}

                            {/* Audio Preview */}
                            {audioURL && <audio controls src={audioURL} style={{ maxWidth: "100px" }} />}

                            {/* File Upload */}
                            <input
                                type="file"
                                style={{ display: "none" }}
                                id="file-upload"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            <label htmlFor="file-upload">
                                <IconButton component="span" sx={{ color: "white" }}>
                                    <AttachFile />
                                </IconButton>
                            </label>
                            {selectedFile && (
                                <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "white",
                                            maxWidth: "80px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {selectedFile.name}
                                    </Typography>
                                    <IconButton onClick={clearSelectedFile} size="small" sx={{ color: "white" }}>
                                        <Close fontSize="small" />
                                    </IconButton>
                                </Box>
                            )}

                            {/* Image Upload */}
                            <input
                                type="file"
                                style={{ display: "none" }}
                                id="image-upload"
                                onChange={handleImageChange}
                                ref={imageInputRef}
                            />
                            <label htmlFor="image-upload">
                                <IconButton component="span" sx={{ color: "white" }}>
                                    <Image />
                                </IconButton>
                            </label>
                            {previewImage && (
                                <Box sx={{ position: "relative", display: "inline-block" }}>
                                    <img
                                        src={previewImage || "/placeholder.svg"}
                                        alt="Preview"
                                        style={{ maxWidth: "50px", maxHeight: "50px", borderRadius: "4px" }}
                                    />
                                    <IconButton
                                        onClick={clearSelectedImage}
                                        size="small"
                                        sx={{
                                            position: "absolute",
                                            top: "-8px",
                                            right: "-8px",
                                            color: "white",
                                            bgcolor: "rgba(0,0,0,0.5)",
                                            "&:hover": {
                                                bgcolor: "rgba(0,0,0,0.7)",
                                            },
                                        }}
                                    >
                                        <Close fontSize="small" />
                                    </IconButton>
                                </Box>
                            )}

                            <TextField
                                fullWidth
                                placeholder="Type your message..."
                                variant="outlined"
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSendMessage()
                                        e.preventDefault()
                                    }
                                }}
                                InputProps={{
                                    sx: {
                                        bgcolor: "#2a2e3d",
                                        color: "white",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#3a3a4e",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#4a4a5e",
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#6a26cd",
                                        },
                                    },
                                }}
                            />
                            <IconButton onClick={handleSendMessage} sx={{ color: "white" }}>
                                <Send />
                            </IconButton>
                        </Box>
                    </Box>
                </Dialog>

                {/* Remark Modal */}
                <Dialog
                    open={modalOpen}
                    onClose={handleModalClose}
                    PaperProps={{ style: { backgroundColor: "#1a1a2e", color: "white" } }}
                >
                    <DialogTitle sx={{ color: "white" }}>
                        {actionStatus === "negotiation" ? "Negotiate" : "Reject"} Deal
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="remark"
                            label="Remark"
                            type="text"
                            fullWidth
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            InputProps={{
                                style: { color: "white" },
                                sx: {
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#3a3a4e",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#4a4a5e",
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#6a26cd",
                                    },
                                },
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleModalClose} sx={{ color: "white" }}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitAction} sx={{ color: "white" }}>
                            {actionStatus === "negotiation" ? "Negotiate" : "Reject"}
                        </Button>
                    </DialogActions>
                </Dialog>

                {loading && <Loader />}
            </Box>
        </>
    )
}

const getMessageDay = (messageDate) => {
    const today = new Date();
    const messageDateObj = new Date(messageDate);

    // Check if the message is from today
    if (messageDateObj.toDateString() === today.toDateString()) {
        return "Today";
    }

    // Check if the message is from yesterday
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (messageDateObj.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    }

    // Otherwise, it's a past date
    return messageDateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};
