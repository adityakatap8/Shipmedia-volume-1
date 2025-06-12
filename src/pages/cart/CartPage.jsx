import React, { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Button,
  Card,
  Divider,
  IconButton,
  Link as MuiLink,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Drawer,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  FormHelperText,
  Autocomplete,
} from "@mui/material"
import { Delete, CheckCircle, Cancel } from "@mui/icons-material"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { setCartMovies } from "../../redux/cartSlice/cartSlice"
import Loader from "../../components/loader/Loader"
import Breadcrumb from "../../components/breadcrumb/Breadcrumb"

const CartPage = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth.user);
  // Movie data with added selected property
  const [movies, setMovies] = useState([])
  console.log("movies", movies);

  // State for terms and conditions
  const [loading, setLoading] = useState(false)
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [newsletter, setNewsletter] = useState(false)

  // State for confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  // State for checkout drawer
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Form states
  const [selectedRights, setSelectedRights] = useState([])
  const [selectedTerritory, setSelectedTerritory] = useState([])
  const [selectedLicenseTerm, setSelectedLicenseTerm] = useState([])
  const [selectedUsageRights, setSelectedUsageRights] = useState([])
  const [selectedPaymentTerms, setSelectedPaymentTerms] = useState([])
  const [message, setMessage] = useState("")
  const [remarks, setRemarks] = useState("")
  const [buyers, setBuyers] = useState([]);
  console.log("buyers", buyers);
  const [sellers, setSellers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  console.log("selectedBuyer", selectedBuyer);
  const [selectedSeller, setSelectedSeller] = useState([]);
  const [status, setStatus] = useState("");


  const breadcrumbItems = [
    { label: "Home", path: "/showcase-projects" },
    { label: "Cart" },
  ];

  // Rights options
  const rightsOptions = [
    { name: 'SVOD (Subscription Video on Demand)', id: 1 },
    { name: 'TVOD (Transactional Video on Demand)', id: 2 },
    { name: 'AVOD (Advertising Video on Demand)', id: 3 },
    { name: 'Broadcast', id: 4 },
    { name: 'Cable', id: 5 },
    { name: 'Television Broadcast Rights', id: 6 },
    { name: 'Theatrical Rights', id: 7 },
    { name: 'EST (Electronic Sell-Through) Rights', id: 8 },
    { name: 'DVD/Blu-ray Distribution Rights', id: 9 },
    { name: 'Home Video Rights', id: 10 },
    { name: 'Foreign Distribution Rights', id: 11 },
    { name: 'Airline/Ship Rights', id: 12 },
    { name: 'Merchandising Rights', id: 13 },
    { name: 'Music Rights', id: 14 },
    { name: 'Product Placement Rights', id: 15 },
    { name: 'Franchise/Sequel Rights', id: 16 },
    { name: 'Mobile Rights', id: 17 },
    { name: 'Interactive and Gaming Rights', id: 18 },
    { name: 'Script/Adaptation Rights', id: 19 },
    { name: 'Public Performance Rights', id: 20 },
    { name: 'Specialty and Festival Rights', id: 21 },
    { name: 'Censorship Rights', id: 22 },
    { name: 'Outright Sale', id: 23 },
  ];

  const territoryOptions = [
    { name: "North America", id: 1 },
    { name: "LATAM (Latin America)", id: 2 },
    { name: "Worldwide", id: 3 },
    { name: "Europe", id: 4 },
    { name: "Asia", id: 5 },
  ]

  const licenseTermOptions = [
    { name: "1 year", id: 1 },
    { name: "2 years", id: 2 },
    { name: "3 years", id: 3 },
    { name: "5 years", id: 4 },
    { name: "Indefinite", id: 5 },
  ]

  const usageRightsOptions = [
    { name: "Exclusive", id: 1 },
    { name: "Non-Exclusive", id: 2 },
    { name: "Sub-licensable", id: 3 },
  ]

  const paymentTermsOptions = [
    { name: "Revenue Share", id: 1 },
    { name: "Minimum Guarantee", id: 2 },
    { name: "Min Guarantee + Revenue Share", id: 3 },
  ]

  const fetchCartMovies = async () => {
    try {
      setLoading(true); // Show loader
      const response = await axios.get(`https://www.mediashippers.com/api/cart/get-cart/${user?._id}`);
      console.log("response", response);
      const movies = response.data;
      console.log("Fetched movies:", movies);
      setMovies(movies.map((movie) => ({ ...movie, selected: true }))); // Set all movies as selected by default
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  // Calculate subtotal based on selected movies
  const subtotal = movies
    .filter((movie) => movie.selected)
    .reduce((sum, movie) => sum + Number.parseFloat(movie.price), 0)
    .toFixed(2)

  const tax = (Number.parseFloat(subtotal) * 0.08).toFixed(2)
  const total = (Number.parseFloat(subtotal) + Number.parseFloat(tax)).toFixed(2) || 0

  // Toggle selection for a single movie
  const toggleMovieSelection = (id) => {
    console.log("Toggling movie selection for ID:", id)
    setMovies(movies.map((movie) => (movie._id === id ? { ...movie, selected: !movie.selected } : movie)))
  }

  // Toggle selection for all movies
  const toggleSelectAll = (event) => {
    const isChecked = event.target.checked
    setMovies(movies.map((movie) => ({ ...movie, selected: isChecked })))
  }

  // Check if all movies are selected
  const allSelected = movies.every((movie) => movie.selected)

  // Count selected movies
  const selectedCount = movies.filter((movie) => movie.selected).length

  // Handle proceed to checkout
  const handleProceedToCheckout = () => {
    if (selectedCount === 0) {
      alert("Please select at least one movie")
      return
    }

    // Open drawer instead of dialog
    setDrawerOpen(true)
  }

  const handleSubmitForm = async () => {
    try {
      // Prepare the payload
      const payload = {
        senderId: user?._id,
        receiverId:
          user?.role === "Admin"
            ? selectedBuyer._id
            : user?.createdBy,
        movies: movies
          .filter((movie) => movie.selected)
          .map((movie) => ({
            movieId: movie._id,
            title: movie.projectName,
            userId: movie.userId,
          })),
        rights: selectedRights,
        territory: selectedTerritory,
        licenseTerm: selectedLicenseTerm,
        usageRights: selectedUsageRights,
        paymentTerms: selectedPaymentTerms,
        remarks,
        status: user?.role === "Admin" ? "sent_to_buyer" : "sent_to_shipper",
        message: {
          senderId: user?._id,
          reciverId: user?.role === 'Admin' ? selectedBuyer._id : user?.createdBy,
          content: message,
        },
      };

      console.log("Payload to be sent:", payload);

      // Call the API
      const response = await axios.post("https://www.mediashippers.com/api/deal/create", payload);

      if (response.status === 201) {
        const remainingMovies = response.data.remainingMovies || [];

        // Update the cart in Redux
        dispatch(setCartMovies(remainingMovies));

        // Close the drawer
        setDrawerOpen(false);

        // Navigate to deals page
        Navigate("/deals");
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Handle removing a right from the selected rights
  const handleDeleteRight = (rightIdToDelete, event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    setSelectedRights(selectedRights.filter((rightId) => rightId !== rightIdToDelete))
  }

  const handleDeleteCartItem = async (cartItemId) => {
    try {
      setLoading(true); // Show loader
      const response = await axios.delete(`https://www.mediashippers.com/api/cart/${user._id}/${cartItemId}`);
      if (response.status === 200) {
        // Remove the deleted item from the cart state
        const updatedMovies = movies.filter((movie) => movie._id !== cartItemId);
        setMovies(updatedMovies); // Update local state
        dispatch(setCartMovies(updatedMovies)); // Update Redux state
        console.log("Cart item deleted successfully:", cartItemId);
      } else {
        console.error("Failed to delete cart item:", response.status);
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  // Custom rendering for the rights chips
  const renderRightsValue = (selected) => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxHeight: "120px", overflowY: "auto" }}>
      {selected.map((value) => {
        const option = rightsOptions.find((opt) => opt.id === value)
        return (
          <Chip
            key={value}
            size="small"
            label={option ? option.name : value}
            onDelete={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleDeleteRight(value)
            }}
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            deleteIcon={
              <Cancel
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleDeleteRight(value)
                }}
              />
            }
            sx={{
              bgcolor: "#27272a",
              color: "#fff",
              m: 0.5,
              "& .MuiChip-deleteIcon": {
                color: "gray",
                "&:hover": {
                  color: "#fff",
                },
              },
            }}
          />
        )
      })}
    </Box>
  )

  useEffect(() => {
    fetchCartMovies();
  }, [])

  useEffect(() => {
    if (user?.role === 'Admin') {
      axios.get('https://www.mediashippers.com/api/auth/all-users') // Replace with your actual endpoint
        .then((res) => {
          const { users } = res.data;
          console.log("Fetched users:", users);
          setBuyers(users.filter(u => u.role === 'Buyer'));
          setSellers(users.filter(u => u.role === 'Seller'));
        })
        .catch((err) => console.error('Failed to fetch users', err));
    }
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "black",
        color: "white",
        p: 1,
      }}
    >
      <Breadcrumb items={breadcrumbItems} />
      <Box
        sx={{
          mx: "auto",
          px: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1, textAlign: "left" }}>
          Your Cart
        </Typography>
        <Typography variant="body2" sx={{ color: "gray", textAlign: "left" }}>
          Review and manage your selected movies.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gap: 4,
            mt: 4,
            gridTemplateColumns: { lg: "2fr 1fr", xs: "1fr" },
          }}
        >
          {/* Cart Items */}
          <Card
            sx={{
              p: 3,
              bgcolor: "#18181b",
              border: "1px solid #27272a",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h6" color="#fff">
                Movies ({movies.length})
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="text"
                  sx={{
                    color: "#d32f2f",
                    "&:hover": { color: "white" },
                  }}
                  onClick={() => setMovies(movies.map((movie) => ({ ...movie, selected: false })))}
                >
                  Clear All
                </Button>
              </Box>
            </Box>

            {/* Select All Checkbox */}
            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allSelected && movies.length > 0}
                    onChange={toggleSelectAll}
                    sx={{
                      color: "gray",
                      "&.Mui-checked": {
                        color: "#fff",
                      },
                    }}
                  />
                }
                label="Select All Movies"
                sx={{ color: "#e1780c" }}
              />
            </Box>

            {/* Movie Items */}
            {movies.map((movie, index) => (
              <React.Fragment key={movie.id}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                  }}
                >
                  <Box sx={{ alignItems: "center" }}>
                    <Checkbox
                      checked={movie.selected}
                      onChange={() => toggleMovieSelection(movie._id)}
                      sx={{
                        color: "gray",
                        "&.Mui-checked": {
                          color: "#fff",
                        },
                      }}
                    />
                  </Box>
                  <Box
                    component="img"
                    src={movie.projectPosterS3Url}
                    alt={`${movie.projectName} poster`}
                    sx={{
                      width: 100,
                      height: 150,
                      borderRadius: 2,
                      objectFit: "cover",
                      flexShrink: 0,
                      opacity: movie.selected ? 1 : 0.5,
                      transition: "opacity 0.2s",
                    }}
                  />
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      opacity: movie.selected ? 1 : 0.7,
                    }}
                  >
                    {/* Movie Info */}
                    <Box sx={{ marginTop: "30px", textAlign: "left" }}>
                      <Typography sx={{ fontWeight: 500, color: "#fff" }}>{movie.projectName}</Typography>
                      <Typography variant="body2" sx={{ color: "gray" }}>
                        {movie.briefSynopsis}
                      </Typography>
                      {/* <Typography variant="body2" sx={{ color: "gray" }}>
                        Director: {movie.director}
                      </Typography> */}
                    </Box>

                    {/* Deal Box */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      {/* <Typography sx={{ fontWeight: 500, color: "#fff" }}>${movie.price || 0}</Typography> */}
                      <IconButton
                        sx={{ color: "#fff" }}
                        onClick={() => handleDeleteCartItem(movie._id)} // Pass the movie ID to delete
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
                {index < movies.length - 1 && <Divider sx={{ my: 3, backgroundColor: "#27272a" }} />}
              </React.Fragment>
            ))}
          </Card>

          {/* Summary */}
          <Card
            sx={{
              p: 3,
              bgcolor: "#18181b",
              border: "1px solid #27272a",
              height: "fit-content",
            }}
          >
            {/* <Typography variant="h6" sx={{ mb: 2, color: "#fff" }}>
              Order Summary
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ color: "gray" }}>Subtotal</Typography>
              <Typography sx={{ color: "#fff" }}>${isNaN(subtotal) ? 0 : subtotal}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography sx={{ color: "gray" }}>Tax</Typography>
              <Typography sx={{ color: "#fff" }}>${isNaN(tax) ? 0 : tax}</Typography>
            </Box> */}
            <Divider sx={{ my: 2, backgroundColor: "#27272a" }} />
            {/* <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: 500 }}>
              <Typography sx={{ color: "gray" }}>Total</Typography>
              <Typography sx={{ color: "#fff" }}>${isNaN(total) ? 0 : total}</Typography>
            </Box> */}
            {/* <Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                <Checkbox
                  id="terms"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  sx={{
                    mr: 1,
                    color: "gray",
                    "&.Mui-checked": {
                      color: "#fff",
                    },
                  }}
                />
                <Typography
                  variant="body2"
                  component="label"
                  htmlFor="terms"
                  sx={{ color: "gray", cursor: "pointer", mt: 1 }}
                >
                  I agree to the Terms and Conditions and Privacy Policy
                </Typography>
              </Box>
            </Box> */}
            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                color: "#fff",
                backgroundColor: selectedCount > 0 ? "#e1780c" : "gray",
                "&:hover": { backgroundColor: selectedCount > 0 ? "#c26509" : "gray" },
              }}
              disabled={selectedCount === 0}
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </Button>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <MuiLink
                href="/showcase-projects"
                underline="hover"
                sx={{
                  color: "gray",
                  "&:hover": { color: "white" },
                }}
              >
                Continue Shopping
              </MuiLink>
            </Box>
          </Card>
        </Box>
      </Box>

      {/* Checkout Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "600px" },
            bgcolor: "#18181b",
            color: "white",
            border: "1px solid #27272a",
            p: 3,
          },
        }}
      >
        <Box sx={{ width: "100%" }}>
          {/* Header with Close Icon */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" sx={{ color: "#fff", fontWeight: "bold" }}>
              Complete Your Purchase
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#fff" }}>
              <Cancel />
            </IconButton>
          </Box>

          <Typography variant="body2" sx={{ mb: 4, color: "gray" }}>
            Please specify the licensing details for your selected content.
          </Typography>

          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Rights Selection */}
            <Autocomplete
              size="small"
              multiple
              value={selectedRights}
              onChange={(event, newValue) => setSelectedRights(newValue)} // Update the selected rights
              options={rightsOptions.map((option) => option.name)} // Extract names from rightsOptions
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option}
                    label={option}
                    {...getTagProps({ index })}
                    sx={{
                      bgcolor: "#27272a",
                      color: "#fff",
                      "& .MuiChip-deleteIcon": {
                        color: "gray",
                        "&:hover": {
                          color: "#fff",
                        },
                      },
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  type="multiple"
                  {...params}
                  label="Rights"
                  placeholder="Select Rights"
                  InputLabelProps={{
                    sx: { color: "gray" },
                  }}
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      color: "#fff",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#27272a",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e1780c",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e1780c",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "gray",
                      },
                    },
                  }}
                />
              )}
              sx={{
                "& .MuiAutocomplete-popupIndicator": {
                  color: "gray",
                },
                "& .MuiAutocomplete-clearIndicator": {
                  color: "gray",
                },
              }}
            />

            {user?.role === 'Admin' && (
              <>
                {/* Buyer Autocomplete */}
                <Autocomplete
                  value={selectedBuyer}
                  onChange={(e, newValue) => {
                    console.log("Selected Buyer:", newValue); // Debugging
                    setSelectedBuyer(newValue);
                  }}
                  options={buyers}
                  getOptionLabel={(option) => option.name || option.email}
                  isOptionEqualToValue={(option, value) => option._id === value._id} // Ensure proper comparison
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Buyer"
                      size="small"
                      type="search"
                      InputLabelProps={{ sx: { color: "gray" } }}
                      InputProps={{
                        ...params.InputProps,
                        sx: {
                          color: "#fff",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#27272a",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#e1780c",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#e1780c",
                          },
                          "& .MuiSvgIcon-root": {
                            color: "gray",
                          },
                        },
                      }}
                    />
                  )}
                />



                {/* Seller Autocomplete */}
                {/* <Autocomplete
                  multiple
                  value={selectedSeller}
                  onChange={(e, newValue) => setSelectedSeller(newValue)}
                  options={sellers}
                  getOptionLabel={(option) => option.name || option.email}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        key={option.id}
                        label={option.name || option.email}
                        {...getTagProps({ index })}
                        sx={{
                          bgcolor: "#3a3a3c",
                          color: "white",
                          "& .MuiChip-deleteIcon": {
                            color: "gray",
                            "&:hover": { color: "#e1780c" },
                          },
                        }}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Sellers"
                      size="small"
                      type="search"
                      InputLabelProps={{ sx: { color: "gray" } }}
                      InputProps={{
                        ...params.InputProps,
                        sx: {
                          color: "#fff",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#27272a",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#e1780c",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#e1780c",
                          },
                          "& .MuiSvgIcon-root": {
                            color: "gray",
                          }
                        },
                      }}
                    />
                  )}
                /> */}


              </>
            )}

            {/* Territory Selection */}
            <Autocomplete
              value={selectedTerritory}
              onChange={(e, newValue) => setSelectedTerritory(newValue)}
              options={territoryOptions.map((option) => option.name)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option}
                    label={option}
                    {...getTagProps({ index })}
                    sx={{
                      bgcolor: "#3a3a3c",
                      color: "white",
                      "& .MuiChip-deleteIcon": {
                        color: "gray",
                        "&:hover": { color: "#e1780c" },
                      },
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  type="multiple"
                  size="small"
                  label="Select Territories"
                  placeholder="Add Territory"
                  InputLabelProps={{ sx: { color: "gray" } }}
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      color: "#fff",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#27272a",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e1780c",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e1780c",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "gray",
                      }
                    },
                  }}
                />
              )}
              sx={{ width: "100%" }}
            />

            {/* License Term Selection */}
            <Autocomplete
              value={selectedLicenseTerm}
              onChange={(e, newValue) => setSelectedLicenseTerm(newValue)}
              options={licenseTermOptions.map((option) => option.name)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option}
                    label={option}
                    {...getTagProps({ index })}
                    sx={{
                      bgcolor: "#3a3a3c",
                      color: "white",
                      "& .MuiChip-deleteIcon": {
                        color: "gray",
                        "&:hover": { color: "#e1780c" },
                      },
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  type="multiple"
                  size="small"
                  label="Select License Terms"
                  placeholder="Add License Term"
                  InputLabelProps={{ sx: { color: "gray" } }}
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      color: "#fff",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#27272a",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e1780c",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e1780c",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "gray",
                      }
                    },
                  }}
                />
              )}
              sx={{ width: "100%" }}
            />

            {/* Usage Rights Selection */}
            <Autocomplete
              // multiple
              value={selectedUsageRights}
              onChange={(e, newValue) => setSelectedUsageRights(newValue)}
              options={usageRightsOptions.map((option) => option.name)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option}
                    label={option}
                    {...getTagProps({ index })}
                    sx={{
                      bgcolor: "#3a3a3c",
                      color: "white",
                      "& .MuiChip-deleteIcon": {
                        color: "gray",
                        "&:hover": { color: "#e1780c" },
                      },
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  type="multiple"
                  size="small"
                  label="Select Usage Rights"
                  placeholder="Add Usage Right"
                  InputLabelProps={{ sx: { color: "gray" } }}
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      color: "#fff",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#27272a",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e1780c",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e1780c",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "gray",
                      }
                    },
                  }}
                />
              )}
              sx={{ width: "100%" }}
            />

            {/* Payment Terms Selection */}
            <Autocomplete
              // multiple
              value={selectedPaymentTerms}
              onChange={(e, newValue) => setSelectedPaymentTerms(newValue)}
              options={paymentTermsOptions.map((option) => option.name)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option}
                    label={option}
                    {...getTagProps({ index })}
                    sx={{
                      bgcolor: "#3a3a3c",
                      color: "white",
                      "& .MuiChip-deleteIcon": {
                        color: "gray",
                        "&:hover": { color: "#e1780c" },
                      },
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  type="multiple"
                  size="small"
                  label="Select Payment Terms"
                  placeholder="Add Payment Term"
                  InputLabelProps={{ sx: { color: "gray" } }}
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      color: "#fff",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#27272a",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e1780c",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e1780c",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "gray",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "gray",
                      }
                    },
                  }}
                />
              )}
              sx={{ width: "100%" }}
            />

            {/* Status Field */}
            {/* <FormControl fullWidth size="small">
              <InputLabel id="status-label" sx={{ color: "gray" }}>
                Status
              </InputLabel>
              <Select
                labelId="status-label"
                value={status} // Bind to the state
                onChange={(e) => setStatus(e.target.value)} // Update the state on change
                label="Status"
                sx={{
                  color: "#fff",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#27272a",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e1780c",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e1780c",
                  },
                  "& .MuiSelect-icon": {
                    color: "gray",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: "#18181b",
                      color: "#fff",
                      "& .MuiMenuItem-root": {
                        "&:hover": {
                          bgcolor: "#27272a",
                        },
                        "&.Mui-selected": {
                          bgcolor: "#27272a",
                          "&:hover": {
                            bgcolor: "#333",
                          },
                        },
                      },
                    },
                  },
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                  getContentAnchorEl: null,
                }}
              >
                {user?.role === "Admin" &&
                  [
                    // <MenuItem key="pending" value="pending">Pending</MenuItem>,
                    // <MenuItem key="sent_to_seller" value="sent_to_seller">Sent to Seller</MenuItem>,
                    // <MenuItem key="in_negotiation_seller" value="in_negotiation_seller">In Negotiation Seller</MenuItem>,
                    <MenuItem key="sent_to_buyer" value="sent_to_buyer">Sent to Buyer</MenuItem>,
                    // <MenuItem key="in_negotiation_buyer" value="in_negotiation_buyer">In Negotiation Buyer</MenuItem>,
                    // <MenuItem key="verified" value="verified">Verified</MenuItem>,
                    // <MenuItem key="closed" value="closed">Closed</MenuItem>,
                    // <MenuItem key="rejected_by_shipper" value="rejected_by_shipper">Rejected by Shipper</MenuItem>,
                    // <MenuItem key="rejected_by_seller" value="rejected_by_seller">Rejected by Seller</MenuItem>,
                    // <MenuItem key="rejected_by_buyer" value="rejected_by_buyer">Rejected by Buyer</MenuItem>,
                  ]}
                {user?.role === "Seller" &&
                  [
                    <MenuItem key="pending" value="pending">Pending</MenuItem>,
                    <MenuItem key="sent_to_shipper" value="sent_to_shipper">Sent to Shipper</MenuItem>,
                    <MenuItem key="in_negotiation_shipper" value="in_negotiation_shipper">In Negotiation Shipper</MenuItem>,
                    <MenuItem key="rejected_by_seller" value="rejected_by_seller">Rejected by Seller</MenuItem>,
                    <MenuItem key="closed" value="closed">Closed</MenuItem>,
                  ]}
                {user?.role === "Buyer" &&
                  [
                    // <MenuItem key="pending" value="pending">Pending</MenuItem>,
                    <MenuItem key="sent_to_shipper" value="sent_to_shipper">Sent to Shipper</MenuItem>,
                    // <MenuItem key="in_negotiation_shipper" value="in_negotiation_shipper">In Negotiation Shipper</MenuItem>,
                    // <MenuItem key="rejected_by_buyer" value="rejected_by_buyer">Rejected by Buyer</MenuItem>,
                    // <MenuItem key="closed" value="closed">Closed</MenuItem>,
                  ]}
              </Select>
              <FormHelperText sx={{ color: "gray" }}>Select the current status</FormHelperText>
            </FormControl> */}

            {/* Message Field */}
            <TextField
              label="Message"
              multiline
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add any specific details about your licensing needs"
              fullWidth
              InputLabelProps={{
                sx: { color: "gray" },
              }}
              InputProps={{
                sx: {
                  color: "#fff",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#27272a",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e1780c",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e1780c",
                  },
                },
              }}
            />

            {/* Remarks Field */}
            <TextField
              label="Remarks"
              multiline
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={user?.role === "Seller" ? "Add buyer information or comments for smooth processing." : "Add any additional comments or instructions."}
              fullWidth
              InputLabelProps={{
                sx: { color: "gray" },
              }}
              InputProps={{
                sx: {
                  color: "#fff",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#27272a",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e1780c",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e1780c",
                  },
                },
              }}
              helperText={user?.role === "Seller" ? "Provide buyer details or any specific instructions for the deal." : "Provide any additional comments or instructions."}
              FormHelperTextProps={{
                sx: { color: "gray" },
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button
                onClick={() => setDrawerOpen(false)}
                sx={{
                  color: "gray",
                  "&:hover": { color: "#fff" },
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={handleSubmitForm}
                sx={{
                  bgcolor: "#e1780c",
                  color: "#fff",
                  "&:hover": { bgcolor: "#c26509" },
                }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  )
}

export default CartPage
