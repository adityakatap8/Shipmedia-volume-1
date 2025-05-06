"use client"

import React, { useState } from "react"
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
} from "@mui/material"
import { Delete, CheckCircle, Cancel } from "@mui/icons-material"
import movieImg from "../../assets/11.jpg"
import loginBack from "../../assets/loginBack.jpg"
import secImg from "../../assets/img2.jpg"

const CartPage = () => {
  // Movie data with added selected property
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: "Interstellar",
      genre: "Sci-Fi, Adventure",
      director: "Christopher Nolan",
      price: "14.99",
      img: movieImg,
      selected: true,
    },
    {
      id: 2,
      title: "The Dark Knight",
      genre: "Action, Crime, Drama",
      director: "Christopher Nolan",
      price: "12.99",
      img: secImg,
      selected: true,
    },
    {
      id: 3,
      title: "The Grand Budapest Hotel",
      genre: "Comedy, Drama",
      director: "Wes Anderson",
      price: "9.99",
      img: loginBack,
      selected: true,
    },
  ])

  // State for terms and conditions
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [newsletter, setNewsletter] = useState(false)

  // State for confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  // State for checkout drawer
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Form states
  const [selectedRights, setSelectedRights] = useState([])
  const [selectedTerritory, setSelectedTerritory] = useState("")
  const [selectedLicenseTerm, setSelectedLicenseTerm] = useState("")
  const [selectedUsageRights, setSelectedUsageRights] = useState("")
  const [selectedPaymentTerms, setSelectedPaymentTerms] = useState("")
  const [message, setMessage] = useState("")
  const [remarks, setRemarks] = useState("")

  // Rights options
  const rightsOptions = [
    { name: "Theatrical Rights", id: 1 },
    { name: "Television Broadcast Rights", id: 2 },
    { name: "Digital/SVOD (Subscription Video on Demand) Rights", id: 3 },
    { name: "EST (Electronic Sell-Through) Rights", id: 4 },
    { name: "DVD/Blu-ray Distribution Rights", id: 5 },
    { name: "Home Video Rights", id: 6 },
    { name: "Foreign Distribution Rights", id: 7 },
    { name: "Video-On-Demand (VOD) Rights", id: 8 },
    { name: "Airline/Ship Rights", id: 9 },
    { name: "Merchandising Rights", id: 10 },
    { name: "Music Rights", id: 11 },
    { name: "Product Placement Rights", id: 12 },
    { name: "Franchise/Sequel Rights", id: 13 },
    { name: "Mobile Rights", id: 14 },
    { name: "Interactive and Gaming Rights", id: 15 },
    { name: "Script/Adaptation Rights", id: 16 },
    { name: "Public Performance Rights", id: 17 },
    { name: "Specialty and Festival Rights", id: 18 },
    { name: "Censorship Rights", id: 19 },
    { name: "SVOD (Subscription Video on Demand)", id: 20 },
    { name: "AVOD (Advertising Video on Demand)", id: 21 },
    { name: "TVOD (Transactional Video on Demand)", id: 22 },
    { name: "Broadcast", id: 23 },
    { name: "Cable", id: 24 },
  ]

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

  // Calculate subtotal based on selected movies
  const subtotal = movies
    .filter((movie) => movie.selected)
    .reduce((sum, movie) => sum + Number.parseFloat(movie.price), 0)
    .toFixed(2)

  const tax = (Number.parseFloat(subtotal) * 0.08).toFixed(2)
  const total = (Number.parseFloat(subtotal) + Number.parseFloat(tax)).toFixed(2)

  // Toggle selection for a single movie
  const toggleMovieSelection = (id) => {
    setMovies(movies.map((movie) => (movie.id === id ? { ...movie, selected: !movie.selected } : movie)))
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

  // Handle form submission
  const handleSubmitForm = () => {
    // Here you would process the form data
    console.log({
      selectedRights,
      selectedTerritory,
      selectedLicenseTerm,
      selectedUsageRights,
      selectedPaymentTerms,
      message,
      remarks,
    })

    // Close drawer and show confirmation
    setDrawerOpen(false)
    setConfirmDialogOpen(true)
  }

  // Handle removing a right from the selected rights
  const handleDeleteRight = (rightIdToDelete, event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    setSelectedRights(selectedRights.filter((rightId) => rightId !== rightIdToDelete))
  }

  // Custom rendering for the rights chips
  const renderRightsValue = (selected) => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxHeight: "120px", overflowY: "auto" }}>
      {selected.map((value) => {
        const option = rightsOptions.find((opt) => opt.id === value)
        return (
          <Chip
            key={value}
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
      <Box
        sx={{
          mx: "auto",
          py: 4,
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
                      onChange={() => toggleMovieSelection(movie.id)}
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
                    src={movie.img}
                    alt={`${movie.title} poster`}
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
                      <Typography sx={{ fontWeight: 500, color: "#fff" }}>{movie.title}</Typography>
                      <Typography variant="body2" sx={{ color: "gray" }}>
                        {movie.genre}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "gray" }}>
                        Director: {movie.director}
                      </Typography>
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
                      <Typography sx={{ fontWeight: 500, color: "#fff" }}>${movie.price}</Typography>
                      <IconButton sx={{ color: "#fff" }}>
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
            <Typography variant="h6" sx={{ mb: 2, color: "#fff" }}>
              Order Summary
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ color: "gray" }}>Subtotal</Typography>
              <Typography sx={{ color: "#fff" }}>${subtotal}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography sx={{ color: "gray" }}>Tax</Typography>
              <Typography sx={{ color: "#fff" }}>${tax}</Typography>
            </Box>
            <Divider sx={{ my: 2, backgroundColor: "#27272a" }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: 500 }}>
              <Typography sx={{ color: "gray" }}>Total</Typography>
              <Typography sx={{ color: "#fff" }}>${total}</Typography>
            </Box>
            <Box>
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
            </Box>
            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                color: "#fff",
                backgroundColor: "#e1780c",
                "&:hover": { backgroundColor: "#c26509" },
              }}
              // disabled={selectedCount === 0 || !termsAgreed || !ageConfirmed}
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
            width: { xs: "100%", sm: "450px" },
            bgcolor: "#18181b",
            color: "white",
            border: "1px solid #27272a",
            p: 3,
          },
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography variant="h5" sx={{ mb: 3, color: "#fff", fontWeight: "bold" }}>
            Complete Your Purchase
          </Typography>

          <Typography variant="body2" sx={{ mb: 4, color: "gray" }}>
            Please specify the licensing details for your selected content.
          </Typography>

          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Rights Selection */}
            <FormControl fullWidth>
              <InputLabel id="rights-label" sx={{ color: "gray" }}>
                Rights
              </InputLabel>
              <Select
                labelId="rights-label"
                multiple
                value={selectedRights}
                onChange={(e) => setSelectedRights(e.target.value)}
                input={<OutlinedInput label="Rights" />}
                renderValue={renderRightsValue}
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
                  // Position the menu below the select component
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                  // Ensure the menu is positioned correctly
                  getContentAnchorEl: null,
                }}
              >
                {rightsOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText sx={{ color: "gray" }}>Select the rights you want to acquire</FormHelperText>
            </FormControl>

            {/* Territory Selection */}
            <FormControl fullWidth>
              <InputLabel id="territory-label" sx={{ color: "gray" }}>
                Territory
              </InputLabel>
              <Select
                labelId="territory-label"
                value={selectedTerritory}
                onChange={(e) => setSelectedTerritory(e.target.value)}
                label="Territory"
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
                  // Position the menu below the select component
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                  // Ensure the menu is positioned correctly
                  getContentAnchorEl: null,
                }}
              >
                {territoryOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* License Term Selection */}
            <FormControl fullWidth>
              <InputLabel id="license-term-label" sx={{ color: "gray" }}>
                License Term
              </InputLabel>
              <Select
                labelId="license-term-label"
                value={selectedLicenseTerm}
                onChange={(e) => setSelectedLicenseTerm(e.target.value)}
                label="License Term"
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
                  // Position the menu below the select component
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                  // Ensure the menu is positioned correctly
                  getContentAnchorEl: null,
                }}
              >
                {licenseTermOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Usage Rights Selection */}
            <FormControl fullWidth>
              <InputLabel id="usage-rights-label" sx={{ color: "gray" }}>
                Usage Rights
              </InputLabel>
              <Select
                labelId="usage-rights-label"
                value={selectedUsageRights}
                onChange={(e) => setSelectedUsageRights(e.target.value)}
                label="Usage Rights"
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
                  // Position the menu below the select component
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                  // Ensure the menu is positioned correctly
                  getContentAnchorEl: null,
                }}
              >
                {usageRightsOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Payment Terms Selection */}
            <FormControl fullWidth>
              <InputLabel id="payment-terms-label" sx={{ color: "gray" }}>
                Payment Terms
              </InputLabel>
              <Select
                labelId="payment-terms-label"
                value={selectedPaymentTerms}
                onChange={(e) => setSelectedPaymentTerms(e.target.value)}
                label="Payment Terms"
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
                  // Position the menu below the select component
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                  // Ensure the menu is positioned correctly
                  getContentAnchorEl: null,
                }}
              >
                {paymentTermsOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
              placeholder="Any additional comments or special requests"
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

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "#18181b",
            color: "white",
            border: "1px solid #27272a",
          },
        }}
      >
        <DialogTitle>Confirm Your Selection</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please confirm the movies you want to purchase:
          </Typography>
          <List>
            {movies
              .filter((movie) => movie.selected)
              .map((movie) => (
                <ListItem key={movie.id}>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: "#fff" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={movie.title}
                    secondary={`$${movie.price}`}
                    secondaryTypographyProps={{ sx: { color: "gray" } }}
                  />
                </ListItem>
              ))}
          </List>
          <Typography variant="body2" sx={{ mt: 2, fontWeight: 500 }}>
            Total: ${total}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={{ color: "gray" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#e1780c",
              color: "#fff",
              "&:hover": {
                bgcolor: "#c26509",
              },
            }}
            onClick={() => {
              alert("Purchase completed successfully!")
              setConfirmDialogOpen(false)
            }}
          >
            Confirm Purchase
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CartPage
