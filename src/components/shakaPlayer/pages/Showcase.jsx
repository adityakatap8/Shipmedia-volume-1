import { useState, useEffect, useRef } from "react";
import { useToast } from "../components/ui/use-toast.js";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import defaultPoster from '../../../assets/Logo-holder.png';
import Cookies from 'js-cookie';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  InputBase,
  Typography,
  alpha,
  Badge,
  Drawer,
  Popover,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Container,
  Paper,
  Modal,
  Stack,
} from "@mui/material"
import {
  Search as SearchIcon,
  TuneOutlined as TuneIcon,
  Close as CloseIcon,
  KeyboardArrowDown as ArrowDownIcon,
  HelpOutlined,
  Send,
  ContactSupport,
  Edit,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material"
import Loader from '../../loader/Loader.jsx'
import { setCartMovies } from "../../../redux/cartSlice/cartSlice.js";



export default function MovieGrid() {
  const location = useLocation();
  const dealDetails = location.state?.dealDetails;
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [projectData, setProjectData] = useState([]);
  const [specificationsData, setSpecificationsData] = useState([]);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState('');
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]); // State to track selected items
  console.log("selected items", selectedItems)
  const [selectAll, setSelectAll] = useState(false); // State to track "Select All" checkbox
  const [selectedTerritories, setSelectedTerritories] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedContentCategories, setSelectedContentCategories] = useState([]);
  const [selectedRights, setSelectedRights] = useState([]);
  console.log("selectedRights:", selectedRights); // Ensure it's an array
  const [originalProjectData, setOriginalProjectData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // Drawer-specific states
  const [drawerSelectedRights, setDrawerSelectedRights] = useState("");
  const [drawerSelectedTerritory, setDrawerSelectedTerritory] = useState([]);
  const [drawerSelectedUsageRights, setDrawerSelectedUsageRights] = useState([]);
  const [drawerSelectedContentCategories, setDrawerSelectedContentCategories] = useState([]);
  console.log("drawerSelectedContentCategories:", drawerSelectedContentCategories); // Ensure it's an array
  const [drawerSelectedLanguages, setDrawerSelectedLanguages] = useState([]);
  const [drawerSelectedGenres, setDrawerSelectedGenres] = useState([]);
  const [drawerSelectedYears, setDrawerSelectedYears] = useState([]);
  const [selectedExcludingTerritory, setSelectedExcludingTerritory] = useState([]);
  const [hasFilteredOnce, setHasFilteredOnce] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(1);
  const { orgName, _id:
    userId, role } = useSelector((state) => state.auth.user.user)
  const [filtersApplied, setFiltersApplied] = useState(false);
  console.log("Filters applied state:", filtersApplied);
  // Filter states
  const [selectedGenres, setSelectedGenres] = useState([])
  const [selectedYears, setSelectedYears] = useState([])
  const [priceRange, setPriceRange] = useState([0, 30])
  const [ratingFilter, setRatingFilter] = useState(0)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [sortOption, setSortOption] = useState("featured")

  // UI states
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
  const [genreAnchorEl, setGenreAnchorEl] = useState(null)
  const [yearAnchorEl, setYearAnchorEl] = useState(null)
  const [sortAnchorEl, setSortAnchorEl] = useState(null)
  const [territoryAnchorEl, setTerritoryAnchorEl] = useState(null);
  const [includingRegions, setIncludingRegions] = useState([]);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [rightsAnchorEl, setRightsAnchorEl] = useState(null); // Add state for rights popover
  const [contentCategoryAnchorEl, setContentCategoryAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State to control Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State to store the message
  const [snackbarSeverity, setSnackbarSeverity] = useState("error"); // State to store the severity (error, success, etc.)
  const [filteredExcludingCountries, setFilteredExcludingCountries] = useState([]); // Filtered countries for excluding
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false); // State for the warning modal
  const [excludingCountryAnchorEl, setExcludingCountryAnchorEl] = useState(null);
  console.log("user from redux", user)
  // Sample movie data with ratings added
  const movies = [
    {
      id: 1,
      title: "The Adventure Begins",
      genre: "Action/Adventure",
      year: 2023,
      price: 19.99,
      // image: img,
      rating: 4.5,
    },
    {
      id: 2,
      title: "Midnight Mystery",
      genre: "Thriller",
      year: 2022,
      price: 15.99,
      // image: img1,
      rating: 4.2,
    },
    {
      id: 3,
      title: "Eternal Love",
      genre: "Romance",
      year: 2023,
      price: 14.99,
      // image: img,
      rating: 3.8,
    },
    {
      id: 4,
      title: "Cosmic Journey",
      genre: "Sci-Fi",
      year: 2021,
      price: 18.99,
      // image: img1,
      rating: 4.7,
    },
    {
      id: 5,
      title: "Laugh Out Loud",
      genre: "Comedy",
      year: 2023,
      price: 16.99,
      // image: img,
      rating: 4.0,
    },
    {
      id: 6,
      title: "Historical Heroes",
      genre: "Drama/History",
      year: 2022,
      price: 17.99,
      // image: img1,
      rating: 4.3,
    },
    {
      id: 7,
      title: "The Adventure Begins 2",
      genre: "Action/Adventure",
      year: 2023,
      price: 21.99,
      // image: img,
      rating: 4.1,
    },
    {
      id: 8,
      title: "Midnight Mystery Returns",
      genre: "Thriller",
      year: 2022,
      price: 15.99,
      // image: img1,
      rating: 3.9,
    },
    {
      id: 9,
      title: "Eternal Love: The Sequel",
      genre: "Romance",
      year: 2023,
      price: 14.99,
      // image: img,
      rating: 4.4,
    },
  ]

  const token = Cookies.get('token'); // 🔐 Add this at the top of your component, just below useState declarations

  // Fetch all project data from the backend
  const fetchAllProjectData = async (
    page = currentPage,
    clear = true,
    rights = selectedRights,
    includingRegions = selectedTerritories,
    excludingCountries = selectedExcludingTerritory,
    years = selectedYears,
    genres = selectedGenres,
    languages = selectedLanguages,
    contentCategories = selectedContentCategories
  ) => {
    setLoading(true);
    console.log("Fetching all project data with page:",);

    const queryParams = dealDetails && clear
      ? {
        userId,
        role,
        page,
        limit: 48,
        rights: dealDetails?.rights || "",
        includingRegions: dealDetails?.includingRegions || [],
        excludingCountries: dealDetails?.excludingCountries || [],
        usageRights: dealDetails?.usageRights || [],
        contentCategory: dealDetails?.contentCategory || [],
        languages: dealDetails?.languages || [],
        genre: dealDetails?.genre || [],
        yearOfRelease: dealDetails?.yearOfRelease || [],
      }
      : {
        userId,
        role,
        page,
        limit: 48,
        rights,
        includingRegions,
        excludingCountries,
        contentCategory: contentCategories,
        genre: genres,
        yearOfRelease: years,
        languages,
      };

    console.log("Query Params for fetching all data:", queryParams);

    try {
      const response = await axios.get(
        `https://www.mediashippers.com/api/project-form/all-details`,
        {
          params: queryParams,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const projects = response.data?.projects || [];

      const mergedData = projects.map((project) => ({
        ...project,
        isSelected: selectedItems.includes(project._id), // Mark as selected if already in selectedItems
      }));

      console.log("Respone from get alldata", response.data)
      setCurrentPage(response?.data?.currentPage || 1); // Reset current page to 1 after fetching new data
      setTotalPages(response?.data?.totalPages || 1); // Set total pages from response
      // Set the full project data (including formData)
      setProjectData(mergedData);
      setOriginalProjectData(projects);

      // Optionally extract and set poster/trailer/specification info if needed
      const formattedSpecs = projects.map((project) => ({
        projectId: project._id,
        projectTitle: project.projectTitle,
        projectPoster: project.posterFileName,
        trailerFile: project.trailerFileName,
      }));
      setSpecificationsData(formattedSpecs);

      // Save project IDs and user IDs if needed

      allUserIds.current = [...new Set(projects.map((p) => p.userId))];

      console.log("✅ All project + form data loaded");
    } catch (error) {
      console.error("❌ Error fetching merged data:", error.response?.data || error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load full project details.",
      });
    } finally {
      setLoading(false); // Set loading to false once data is loaded (or if an error occurs)
    }
  };






  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Close the Snackbar
  };


  const addToArray = (array, value, setter) => {
    if (value && !array.includes(value)) {
      setter([...array, value]);
    }
  };

  const removeFromArray = (array, value, setter) => {
    setter(array.filter((item) => item !== value));
  };

  const handleGlobalRegionSelection = () => {
    const allRegions = Object.keys(regionCountryMapping).filter((region) => region !== "Worldwide");
    setIncludingRegions(["Worldwide", ...allRegions]);
  };







  const allUserIds = useRef([]);



  const areDrawerFieldsFilled = () => {
    return (
      drawerSelectedRights ||
      drawerSelectedTerritory ||
      drawerSelectedUsageRights &&
      drawerSelectedContentCategories.length > 0 &&
      drawerSelectedLanguages &&
      drawerSelectedGenres.length > 0 &&
      drawerSelectedYears.length > 0
    );
  };



  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue)
  }

  const handleRatingChange = (event, newValue) => {
    setRatingFilter(newValue)
  }

  const handleSortChange = (option) => {
    setSortOption(option); // Update the selected sort option
    setSortAnchorEl(null); // Close the sort popover

    if (option === "title") {
      // Sort projectData alphabetically by projectTitle (A-Z)
      const sortedData = [...projectData].sort((a, b) => {
        const titleA = a.projectTitle?.toLowerCase() || "";
        const titleB = b.projectTitle?.toLowerCase() || "";
        return titleA.localeCompare(titleB, undefined, { sensitivity: "base" });
      });
      setProjectData(sortedData); // Update the sorted project data
    } else if (option === "title-desc") {
      // Sort projectData reverse alphabetically by projectTitle (Z-A)
      const sortedData = [...projectData].sort((a, b) => {
        const titleA = a.projectTitle?.toLowerCase() || "";
        const titleB = b.projectTitle?.toLowerCase() || "";
        return titleB.localeCompare(titleA, undefined, { sensitivity: "base" });
      });
      setProjectData(sortedData); // Update the sorted project data
    } else {
      // Reset to original data if no specific sort option is selected
      setProjectData([...originalProjectData]);
    }
  };

  const clearFilters = () => {
    // Reset all filter states
    setSelectedGenres([]);
    setSelectedYears([]);
    setSelectedLanguages([]);
    setSelectedTerritories([]);
    setSelectedContentCategories([]);
    setSelectedRights([]);
    setRatingFilter(0);

    // Reset the filtered data to the original project data
    setProjectData([...originalProjectData]); // Use a copy of the original data
  };

  // Popover handlers
  const handleGenreClick = (event) => {
    setGenreAnchorEl(event.currentTarget)
  }

  const handleGenreClose = () => {
    setGenreAnchorEl(null)
  }

  const handleYearClick = (event) => {
    setYearAnchorEl(event.currentTarget)
  }

  const handleYearClose = () => {
    setYearAnchorEl(null)
  }

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget)
  }

  const handleSortClose = () => {
    setSortAnchorEl(null)
  }


  const handleTerritoryFilter = (selectedRegions) => {
    // Filter countries based on selected regions
    const filteredCountries = territoryGroupedOptions.filter((option) =>
      selectedRegions.some((region) => option.region.toLowerCase() === region.toLowerCase())
    );

    // Update the filtered countries state
    setFilteredExcludingCountries(filteredCountries.map((option) => option.name));
  };



  const handlePageChange = (page) => {
    console.log("Changing to page:", page);
    if (page >= 1 && page <= totalPages) {
      fetchAllProjectData(page);
    }
    setCurrentPage(page);
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      // Show all pages if total pages are less than or equal to 7
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first 2, last 2, and ellipsis in between
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const handleRightsFilter = (right) => {
    setSelectedRights((prevRights) => {
      const updatedRights = prevRights.includes(right)
        ? prevRights.filter((r) => r !== right)
        : [...prevRights, right];
      fetchAllProjectData(1, false, updatedRights);
      setRightsAnchorEl(null); // Close the popover immediately
      return updatedRights;
    });
  };

  const handleIncludingRegionFilter = (region) => {
    setSelectedTerritories((prevTerritories) => {
      const updatedTerritories = prevTerritories.includes(region)
        ? prevTerritories.filter((t) => t !== region)
        : [...prevTerritories, region];
      fetchAllProjectData(1, false, selectedRights, updatedTerritories);
      setTerritoryAnchorEl(null); // Close the popover immediately
      return updatedTerritories;
    });
  };

  const handleGenreFilter = (genre) => {
    setSelectedGenres((prevGenres) => {
      const updatedGenres = prevGenres.includes(genre)
        ? prevGenres.filter((g) => g !== genre)
        : [...prevGenres, genre];
      fetchAllProjectData(1, false, selectedRights, selectedTerritories, selectedContentCategories, selectedYears, updatedGenres, selectedLanguages);
      setGenreAnchorEl(null)
      return updatedGenres;
    });
  };

  const handleYearFilter = (year) => {
    setSelectedYears((prevYears) => {
      const updatedYears = prevYears.includes(year)
        ? prevYears.filter((y) => y !== year)
        : [...prevYears, year];
      fetchAllProjectData(
        1,
        false,
        selectedRights,
        selectedTerritories,
        selectedGenres,
        updatedYears,
        selectedLanguages,
        selectedContentCategories
      );
      setYearAnchorEl(null); 
      return updatedYears;
    });
  };

  const handleLanguageFilter = (language) => {
    setSelectedLanguages((prevLanguages) => {
      const updatedLanguages = prevLanguages.includes(language)
        ? prevLanguages.filter((l) => l !== language)
        : [...prevLanguages, language];
      fetchAllProjectData(1, false, selectedRights, selectedTerritories, selectedExcludingTerritory, selectedYears, selectedGenres, updatedLanguages, selectedContentCategories);
      setLanguageAnchorEl(null)
      return updatedLanguages;
    });
  };

  const handleContentCategoryFilter = (category) => {
    setSelectedContentCategories((prevCategories) => {
      const updatedCategories = prevCategories.includes(category)
        ? prevCategories.filter((c) => c !== category)
        : [...prevCategories, category];
      fetchAllProjectData(1, false, selectedRights, selectedTerritories, selectedExcludingTerritory, selectedYears, selectedGenres, selectedLanguages, updatedCategories);
      setContentCategoryAnchorEl(null)
      return updatedCategories;
    });
  };



  // Inline styles
  const styles = {
    root: {
      backgroundColor: "#0d2240",
      color: "#fff",
      minHeight: "100vh",
      margin: 0,
      padding: '20px'
    },
    title: {
      flexGrow: 1,
      fontWeight: "bold",
    },
    search: {
      position: "relative",
      borderRadius: "5px",
      backgroundColor: alpha("#fff", 0.15),
      "&:hover": {
        backgroundColor: alpha("#fff", 0.25),
      },
      width: "50%",
      margin: '0 auto',
      marginBottom: "30px"
    },
    searchIcon: {
      padding: "0 16px",
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "inherit",
      width: "100%",
    },
    inputInput: {
      padding: "8px 8px 8px 0",
      paddingLeft: "48px",
      width: "100%",
    },
    featuredSection: {
      padding: "0",
      marginTop: "16px",
      marginBottom: "0",
      width: "100%",
    },
    featuredTitle: {
      marginBottom: "16px",
      fontWeight: "bold",
      fontSize: "24px",
      paddingLeft: "24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    movieGrid: {
      display: "flex",
      flexWrap: "wrap",
      margin: 0,
      padding: 0,
      width: "100%",
    },
    movieItem: {
      width: "16.666%" // Exactly 6 items per row
      ,
      padding: "0 4px",
      boxSizing: "border-box",
    },
    card: {
      backgroundColor: "#0d2240",
      //   border: '1px solid #fff',
      color: "#fff",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      boxShadow: "none",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: "0 12px 20px -10px rgba(123, 181, 231, 0.3)",
        padding: "5px",

      },
    },
    cardMedia: {
      height: 0,
      paddingTop: "120%" // 2:3 aspect ratio for movie posters
    },
    cardContent: {
      flexGrow: 1,
      padding: "16px 0",
    },
    movieTitle: {
      fontWeight: "bold",
      marginBottom: "8px",
      fontSize: "16px",
      margin: "15px 0px"
    },
    genreYearContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "15px",
      marginLeft: '10px'
    },
    genreChip: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: "#fff",
      height: "24px",
      fontSize: "12px",
    },
    yearText: {
      color: "#aaa",
      fontSize: "14px",
      marginRight: '10px'
    },
    priceText: {
      fontWeight: "bold",
      marginTop: "8px",
      marginBottom: "16px",
    },
    checkoutButton: {
      backgroundColor: "#7ab5e7",
      color: "#000",
      textTransform: "none",
      "&:hover": {
        backgroundColor: "#5a9bd5",
      },
      width: "100%",
      borderRadius: "4px",
      padding: "6px 0",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "#5a9bd5",
        transform: "translateY(-2px)",
        boxShadow: "0 4px 8px rgba(123, 181, 231, 0.5)",
      },
    },
    // Compact Filter styles
    compactFilterSection: {
      padding: 1,
      display: "flex",
      alignItems: "center",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      marginBottom: "30px",
      paddingBottom: "30px"
    },
    filterButton: {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      color: "#fff",
      fontSize: "13px",
      padding: "4px 12px",
      borderRadius: "16px",
      textTransform: "none",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      height: "32px",
      "&:hover": {
        backgroundColor: "rgba(123, 181, 231, 0.2)",
      },
    },
    filterButtonActive: {
      backgroundColor: "rgba(123, 181, 231, 0.2)",
      color: "#7ab5e7",
      fontSize: "13px",
      padding: "4px 12px",
      borderRadius: "16px",
      textTransform: "none",
      border: "1px solid #7ab5e7",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      height: "32px",
      "&:hover": {
        backgroundColor: "rgba(123, 181, 231, 0.3)",
      },
    },
    advancedFilterButton: {
      backgroundColor: activeFiltersCount > 0 ? "rgba(123, 181, 231, 0.2)" : "rgba(255, 255, 255, 0.08)",
      color: activeFiltersCount > 0 ? "#7ab5e7" : "#fff",
      fontSize: "13px",
      padding: "4px 12px",
      borderRadius: "16px",
      textTransform: "none",
      border: activeFiltersCount > 0 ? "1px solid #7ab5e7" : "1px solid rgba(255, 255, 255, 0.1)",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      height: "32px",
      marginLeft: "auto",
      "&:hover": {
        backgroundColor: "rgba(123, 181, 231, 0.2)",
      },
    },
    popoverContent: {
      padding: "16px",
      backgroundColor: "#111",
      color: "#fff",
      width: "280px",
      maxHeight: "300px",
      overflowY: "auto",
    },
    popoverTitle: {
      fontSize: "14px",
      fontWeight: "bold",
      marginBottom: "12px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    popoverChip: {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      color: "#fff",
      height: "28px",
      fontSize: "12px",
      margin: "4px",
      "&:hover": {
        backgroundColor: "rgba(123, 181, 231, 0.2)",
      },
    },
    popoverChipActive: {
      backgroundColor: "#7ab5e7",
      color: "#000",
      height: "28px",
      fontSize: "12px",
      margin: "4px",
      fontWeight: "bold",
      "&:hover": {
        backgroundColor: "#5a9bd5",
      },
    },
    drawerContent: {
      backgroundColor: "#111",
      color: "#fff",
      width: "320px",
      height: "100%",
      padding: "24px",
    },
    drawerHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
    },
    drawerTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#7ab5e7",
    },
    drawerSection: {
      marginBottom: "14px",
    },
    drawerSectionTitle: {
      fontSize: "15px",
      fontWeight: "500",
      marginBottom: "12px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      paddingBottom: "8px",
    },
    slider: {
      color: "#7ab5e7",
      height: 8,
      padding: "15px 0",
      "& .MuiSlider-thumb": {
        height: 20,
        width: 20,
        backgroundColor: "#fff",
        border: "2px solid #7ab5e7",
        "&:focus, &:hover, &.Mui-active": {
          boxShadow: "0 0 0 8px rgba(123, 181, 231, 0.16)",
        },
      },
      "& .MuiSlider-valueLabel": {
        backgroundColor: "#7ab5e7",
        color: "#000",
        fontSize: "12px",
        fontWeight: "bold",
        padding: "2px 6px",
        borderRadius: "4px",
      },
      "& .MuiSlider-track": {
        height: 8,
        borderRadius: 4,
      },
      "& .MuiSlider-rail": {
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      },
    },
    priceRangeText: {
      display: "flex",
      justifyContent: "space-between",
      color: "#aaa",
      fontSize: "13px",
      marginTop: "8px",
    },
    selectedFiltersContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginBottom: "16px",

    },
    selectedFilterChip: {
      backgroundColor: "rgba(123, 181, 231, 0.2)",
      color: "#fff",
      height: "28px",
      fontSize: "12px",
      borderRadius: "14px",
      border: "1px solid rgba(123, 181, 231, 0.5)",
      "& .MuiChip-deleteIcon": {
        color: "#7ab5e7",
        "&:hover": {
          color: "#fff",
        },
      },
    },
    sortContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    sortItem: {
      padding: "8px 12px",
      borderRadius: "4px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "rgba(123, 181, 231, 0.1)",
      },
    },
    sortItemActive: {
      padding: "8px 12px",
      borderRadius: "4px",
      cursor: "pointer",
      backgroundColor: "rgba(123, 181, 231, 0.2)",
      color: "#7ab5e7",
      fontWeight: "bold",
    },
    countBadge: {
      marginLeft: "6px",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      color: "#fff",
      fontSize: "11px",
      padding: "0 6px",
      borderRadius: "10px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "20px",
      height: "20px",
    },
    ratingContainer: {
      display: "flex",
      alignItems: "center",
      marginTop: "8px",
    },
    ratingValue: {
      marginLeft: "8px",
      color: "#7ab5e7",
      fontWeight: "bold",
    },
    noResults: {
      textAlign: "center",
      padding: "40px 0",
      color: "#aaa",
      width: "100%",
    },
    resultsCount: {
      color: "#7ab5e7",
      fontSize: "14px",
      marginLeft: "auto",
      marginRight: "15px"
    },
    clearButton: {
      color: "#7ab5e7",
      textTransform: "none",
      padding: "4px 12px",
      minWidth: "auto",
      borderRadius: "16px",
      fontSize: "13px",
      border: "1px solid rgba(123, 181, 231, 0.3)",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "rgba(123, 181, 231, 0.1)",
        borderColor: "#7ab5e7",
      },
    },
  }

  // For responsive design, we need to handle smaller screens differently
  const responsiveStyles = {
    movieItem: {
      width: {
        xs: "100%", // 1 per row on extra small screens
        sm: "50%", // 2 per row on small screens
        md: "33.333%", // 3 per row on medium screens
        lg: "16.666%", // 6 per row on large screens
      },
      padding: "0 4px",
      marginBottom: "8px",
      boxSizing: "border-box",
    },
  }

  // Get all selected filters for display
  const allSelectedFilters = [
    ...selectedGenres.map((genre) => ({ type: "genre", value: genre })),
    ...selectedYears.map((year) => ({ type: "year", value: year.toString() })),
    ...(ratingFilter > 0 ? [{ type: "rating", value: `${ratingFilter}+ Stars` }] : []),
  ];




  // Get display text for sort option
  const getSortDisplayText = () => {
    switch (sortOption) {
      //   case "price-low":
      //     return "Price: Low to High"
      //   case "price-high":
      //     return "Price: High to Low"
      // case "rating":
      //   return "Top Rated"
      // case "year":
      //   return "Newest"
      case "title":
        return "Title A-Z"
      default:
        return "Titles"
    }
  }

  const handleAddToCart = async () => {

    try {
      const response = await axios.post("https://www.mediashippers.com/api/cart/add-to-cart", {
        userId,
        movies: selectedItems,
        dealId: dealDetails?._id,
        status: 'admin_filtered_content'
      });

      if (response.status === 200 || response.status === 201) {
        console.log("Movies added to cart:", response.data);
        setSnackbarMessage(response.data.message || "Movies added to cart successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true); // Show success Snackbar
        dispatch(setCartMovies(response.data.cartMovies));
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error:", error.response.data.message);
        setSnackbarMessage(error.response.data.message);
      } else {
        console.error("Failed to add movies to cart:", error.message);
        setSnackbarMessage("Failed to add movies to cart.");
      }
      setSnackbarSeverity("error");
      setSnackbarOpen(true); // Show error Snackbar
    } finally {
      setSelectedItems([]); // Clear selected items after adding to cart
      setSelectAll(false); // Reset select all checkbox
    }
  };

  const handleRegionSelection = (selectedRegions) => {
    // Update the selected regions state
    setDrawerSelectedTerritory(selectedRegions);

    // Filter territories based on selected regions
    const filteredTerritories = territoryGroupedOptions.filter((option) =>
      selectedRegions.some((region) => option.region.toLowerCase() === region.toLowerCase())
    );

    // Update the filtered territories state
    setFilteredExcludingCountries(filteredTerritories.map((option) => option.name));
  };

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      // Select all items
      const allIds = projectData.map((project) => project._id);
      setSelectedItems(allIds);

      // Open the drawer only if any drawer field is empty
      if (!areDrawerFieldsFilled()) {
        setAdvancedFiltersOpen(true);
      }
    } else {
      // Deselect all items
      setSelectedItems([]);
      setAdvancedFiltersOpen(false); // Close the drawer when "Select All" is unchecked
    }
  };

  const handleCheckboxChange = (id) => {
    if (!filtersApplied) {
      setIsWarningModalOpen(true); // Show the warning modal
      return; // Prevent checkbox selection
    }

    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(id)) {
        // If the item is already selected, remove it
        return prevSelectedItems.filter((itemId) => itemId !== id);
      } else {
        // Otherwise, add it to the selection
        return [...prevSelectedItems, id];
      }
    });
  };

  const allCountries = Object.values(regionCountryMapping).flat();
  const availableExcludingCountries =
    selectedTerritories.includes("Worldwide")
      ? allCountries
      : selectedTerritories.flatMap(region => regionCountryMapping[region] || []);

  // New filtering function
  const filterMovies = () => {
    let filteredData = [...originalProjectData]; // Start with the original data
    console.log("Filtering movies with current selections...", filteredData);
    console.log("Selected Genres:", drawerSelectedRights);
    console.log("Selected Years:", drawerSelectedTerritory);

    // Filter by Rights
    if (drawerSelectedRights.length > 0) {
      console.log("Filtering by Rights:", drawerSelectedRights.toLowerCase());
      if (drawerSelectedRights.toLowerCase() === "all rights") {
        // Show only content that has "All Rights"
        console.log("Filtering by All Rights");
        filteredData = filteredData.filter((project) =>
          project?.formData?.rightsInfo?.some((rightInfo) =>
            rightInfo?.rights?.some((right) =>
              right?.name?.toLowerCase() === "all rights"
            )
          )
        );
      } else {
        // Show content that has the selected right OR has "All Rights"
        filteredData = filteredData.filter((project) =>
          project?.formData?.rightsInfo?.some((rightInfo) =>
            rightInfo?.rights?.some((right) =>
              right?.name?.toLowerCase() === drawerSelectedRights.toLowerCase() ||
              right?.name?.toLowerCase() === "all rights"
            )
          )
        );
      }

      console.log("Filtered by Rights:", filteredData);
    }


    // Filter by Territory
    if (drawerSelectedTerritory.length > 0) {
      // Check if "Worldwide" is selected exclusively
      const isWorldwideSelected = drawerSelectedTerritory.length === 1 && drawerSelectedTerritory[0].toLowerCase() === 'worldwide';

      if (isWorldwideSelected) {
        // Show only Worldwide content
        filteredData = filteredData.filter((project) =>
          project?.formData.rightsInfo?.some((rightInfo) => {
            if (Array.isArray(rightInfo.territories)) {
              return rightInfo.territories.some((territory) =>
                territory.id?.toLowerCase() === 'worldwide'
              );
            } else if (rightInfo.territories?.includedRegions) {
              return rightInfo.territories.includedRegions.some((region) =>
                region.name?.toLowerCase() === 'worldwide'
              );
            }
            return false;
          })
        );
      } else {
        // For other regions, include matching region + Worldwide content
        filteredData = filteredData.filter((project) =>
          project?.formData.rightsInfo?.some((rightInfo) => {
            if (Array.isArray(rightInfo.territories)) {
              return rightInfo.territories.some((territory) =>
                drawerSelectedTerritory.some((selectedTerritory) =>
                  territory.id?.toLowerCase() === selectedTerritory.toLowerCase() ||
                  territory.id?.toLowerCase() === 'worldwide'
                )
              );
            } else if (rightInfo.territories?.includedRegions) {
              return rightInfo.territories.includedRegions.some((region) =>
                drawerSelectedTerritory.some((selectedTerritory) =>
                  region.name?.toLowerCase() === selectedTerritory.toLowerCase() ||
                  region.name?.toLowerCase() === 'worldwide'
                )
              );
            }
            return false;
          })
        );
      }
      console.log("Filtered by Territory:", filteredData);
    }



    // Filter by Excluding Territory
    if (selectedExcludingTerritory.length > 0) {
      filteredData = filteredData.filter((project) =>
        project?.formData?.rightsInfo?.some((rightInfo) => {
          if (Array.isArray(rightInfo.territories)) {
            // Handle array format
            return rightInfo.territories.some((territory) =>
              selectedExcludingTerritory.some((selectedTerritory) =>
                territory.country?.toLowerCase() === selectedTerritory.toLowerCase()
              )
            );
          } else if (rightInfo.territories?.excludeCountries) {
            // Handle object format
            return rightInfo.territories.excludeCountries.some((country) =>
              selectedExcludingTerritory.some((selectedTerritory) =>
                country.name?.toLowerCase() === selectedTerritory.toLowerCase()
              )
            );
          }
          return false;
        })
      );
      console.log("Filtered by Excluding Territory:", filteredData);
    }

    // Filter by Usage Rights
    if (drawerSelectedUsageRights.length > 0) {
      filteredData = filteredData.filter((project) =>
        project?.formData?.rightsInfo?.some((rightInfo) =>
          rightInfo.usageRights?.some((usageRight) =>
            drawerSelectedUsageRights.some((selectedUsageRight) =>
              usageRight.name.toLowerCase() === selectedUsageRight.toLowerCase()
            )
          )
        )
      );
      console.log("Filtered by Usage Rights:", filteredData);
    }

    // Filter by Content Category
    if (drawerSelectedContentCategories.length > 0) {
      filteredData = filteredData.filter((project) => {
        const projectType = project?.formData?.specificationsInfo?.projectType?.toLowerCase();
        return drawerSelectedContentCategories.some(
          (selectedCategory) => selectedCategory.toLowerCase() === projectType
        );
      });
      console.log("Filtered by Content Category:", filteredData);
    }

    // Filter by Language
    if (drawerSelectedLanguages.length > 0) {
      filteredData = filteredData.filter((project) =>
        drawerSelectedLanguages.some((selectedLanguage) =>
          project?.formData?.specificationsInfo?.language?.toLowerCase() === selectedLanguage.toLowerCase()
        )
      );
      console.log("Filtered by Language:", filteredData);
    }

    // Filter by Genre
    if (drawerSelectedGenres.length > 0) {
      filteredData = filteredData.filter((project) => {
        const rawGenres = project?.formData?.specificationsInfo?.genres;

        let projectGenres = [];
        if (Array.isArray(rawGenres)) {
          projectGenres = rawGenres.flatMap((genreString) =>
            genreString.split(',').map((g) => g.trim().toLowerCase())
          );
        } else if (typeof rawGenres === 'string') {
          projectGenres = rawGenres.split(',').map((g) => g.trim().toLowerCase());
        }

        return drawerSelectedGenres.some((selectedGenre) =>
          projectGenres.includes(selectedGenre.toLowerCase())
        );
      });
      console.log("Filtered by Genres:", filteredData);
    }


    // Filter by Year of Release
    if (drawerSelectedYears.length > 0) {
      filteredData = filteredData.filter((project) => {
        const completionDate = project?.formData?.specificationsInfo?.completionDate;
        const projectYear = completionDate ? new Date(completionDate).getFullYear() : null;

        return drawerSelectedYears.some((selectedYear) => projectYear === parseInt(selectedYear));
      });
      console.log("Filtered by Year of Release:", filteredData);
    }

    // Update the filtered data
    setHasFilteredOnce(true);
    setProjectData(filteredData);
    setFiltersApplied(true);
  };

  const handleCommonFilterChange = (filterType, value) => {
    let updated;
    switch (filterType) {
      case "genre":
        updated = selectedGenres.includes(value)
          ? selectedGenres.filter((g) => g !== value)
          : [...selectedGenres, value];
        setSelectedGenres(updated);
        break;
      case "year":
        updated = selectedYears.includes(value)
          ? selectedYears.filter((y) => y !== value)
          : [...selectedYears, value];
        setSelectedYears(updated);
        break;
      case "language":
        updated = selectedLanguages.includes(value)
          ? selectedLanguages.filter((l) => l !== value)
          : [...selectedLanguages, value];
        setSelectedLanguages(updated);
        break;
      case "territory":
        updated = selectedTerritories.includes(value)
          ? selectedTerritories.filter((t) => t !== value)
          : [...selectedTerritories, value];
        setSelectedTerritories(updated);
        break;
      case "contentCategory":
        updated = selectedContentCategories.includes(value)
          ? selectedContentCategories.filter((c) => c !== value)
          : [...selectedContentCategories, value];
        setSelectedContentCategories(updated);
        break;
      case "rights":
        updated = selectedRights.includes(value)
          ? selectedRights.filter((r) => r !== value)
          : [...selectedRights, value];
        setSelectedRights(updated);
        break;
      default:
        break;
    }
    // Fetch API only if dealDetails is not present
    if (!dealDetails) {
      fetchAllProjectData(1, false);
    }
  };

  const clearSelectedFilters = () => {
    // Reset all filter states
    setSelectedGenres([]);
    setSelectedYears([]);
    setSelectedLanguages([]);
    setSelectedTerritories([]);
    setSelectedContentCategories([]);
    setSelectedRights([]);
    setRatingFilter(0);
    setDrawerSelectedRights("");
    setDrawerSelectedTerritory([]);
    setDrawerSelectedUsageRights([]);
    setDrawerSelectedContentCategories([]);
    setDrawerSelectedLanguages([]);
    setDrawerSelectedGenres([]);
    setDrawerSelectedYears([]);
    setSelectedExcludingTerritory([]);
    setFiltersApplied(false);
    navigate(location.pathname, { state: { dealDetails: null } });
    fetchAllProjectData(1, false, [], [], [], [], [], [], []); 
  };

  useEffect(() => {
    if (dealDetails && originalProjectData) {
      setDrawerSelectedRights(dealDetails.rights || "");
      setDrawerSelectedTerritory(dealDetails.includingRegions || []);
      setDrawerSelectedUsageRights(dealDetails.usageRights ? [dealDetails.usageRights] : []);
      setDrawerSelectedContentCategories(dealDetails.contentCategory || []);
      setDrawerSelectedLanguages(dealDetails.languages || []);
      setDrawerSelectedGenres(dealDetails.genre || []);
      setDrawerSelectedYears(dealDetails.yearOfRelease || []);
      setSelectedExcludingTerritory(dealDetails.excludingCountries || []);

      // setAdvancedFiltersOpen(true);
      // filterMovies();
      setFiltersApplied(true); // Set filtersApplied to true when dealDetails are set
    }
  }, [dealDetails, originalProjectData]);

  useEffect(() => {
    let result = [...movies];

    // Apply genre filter
    if (selectedGenres.length > 0) {
      result = result.filter((movie) => selectedGenres.includes(movie.genre));
    }

    // Apply year filter
    if (selectedYears.length > 0) {
      result = result.filter((movie) => selectedYears.includes(movie.year));
    }

    // Apply territory filter
    if (selectedTerritories.length > 0) {
      result = result.filter((movie) =>
        selectedTerritories.some((territory) => movie.territories?.includes(territory))
      );
    }

    // Apply language filter
    if (selectedLanguages.length > 0) {
      result = result.filter((movie) =>
        selectedLanguages.some((language) => movie.languages?.includes(language))
      );
    }

    // Apply content category filter
    if (selectedContentCategories.length > 0) {
      result = result.filter((movie) =>
        selectedContentCategories.some((category) => movie.contentCategories?.includes(category))
      );
    }

    // Apply rights filter
    if (selectedRights.length > 0) {
      result = result.filter((movie) =>
        selectedRights.some((right) => movie.rights?.includes(right))
      );
    }


    // Count active filters
    let count = 0;
    if (selectedGenres.length > 0) count += selectedGenres.length;
    if (selectedYears.length > 0) count += selectedYears.length;
    if (selectedTerritories.length > 0) count += selectedTerritories.length;
    if (selectedLanguages.length > 0) count += selectedLanguages.length;
    if (selectedContentCategories.length > 0) count += selectedContentCategories.length;
    if (selectedRights.length > 0) count += selectedRights.length;

    setActiveFiltersCount(count);
  }, [
    selectedGenres,
    selectedYears,
    selectedTerritories,
    selectedLanguages,
    selectedContentCategories,
    selectedRights,
  ]);



  useEffect(() => {
    if (selectedTerritories.length > 0) {
      // Filter countries based on selected regions
      const filteredCountries = selectedTerritories.flatMap(
        (region) => regionCountryMapping[region] || []
      );
      setFilteredExcludingCountries(filteredCountries);
    } else {
      // Reset to all countries if no region is selected
      setFilteredExcludingCountries([]);
    }
  }, [selectedTerritories]);

  useEffect(() => {
    console.log("all details hit");

    // Fetch userId and role from Redux (already done outside)
    const token = Cookies.get("token");
    console.log("UserId and role", userId, role);

    if (!userId || !role || !token) return;

    fetchAllProjectData();
  }, [userId, role, token, toast]);


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!searchTerm) {
        // Only reset to original data if dealDetails is not present
        if (!dealDetails) {
          setProjectData([...originalProjectData]);
        }
      } else {
        // Filter project data based on the search term
        const filteredData = originalProjectData.filter((project) =>
          project?.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setProjectData(filteredData);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(delayDebounceFn); // Cleanup the timeout
  }, [searchTerm, originalProjectData, dealDetails]);


  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Automatically hide after 6 seconds
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position: Top-Right
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {loading ? (
        <Loader />  // Show loader when loading is true
      ) : (
        <Box sx={styles.root}>
          {!dealDetails &&
            <Box sx={styles.search}>
              <Box sx={styles.searchIcon}>
                <SearchIcon />
              </Box>
              <InputBase
                placeholder="Search movies..."
                sx={{
                  ...styles.inputRoot,
                  "& .MuiInputBase-input": styles.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
                value={searchTerm} // Bind the searchTerm state
                onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
              />
            </Box>}

          {/* Compact Filter Bar */}
          <Box sx={styles.compactFilterSection} gap={1}>
            {/* Sort Button */}
            {/* <Button sx={styles.filterButton} onClick={handleSortClick} endIcon={<ArrowDownIcon fontSize="small" />}>
              Sort: {getSortDisplayText()}
            </Button>
            <Popover
              open={Boolean(sortAnchorEl)}
              anchorEl={sortAnchorEl}
              onClose={handleSortClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              PaperProps={{
                style: { backgroundColor: "#111" },
              }}
            >
              <Box sx={styles.popoverContent}>
                <Typography sx={styles.popoverTitle}>Sort By</Typography>
                <Box sx={styles.sortContainer}>
                  <Box
                    sx={sortOption === "title" ? styles.sortItemActive : styles.sortItem}
                    onClick={() => handleSortChange("title")} // Sort A-Z
                  >
                    Title A-Z
                  </Box>
                  <Box
                    sx={sortOption === "title-desc" ? styles.sortItemActive : styles.sortItem}
                    onClick={() => handleSortChange("title-desc")} // Sort Z-A
                  >
                    Title Z-A
                  </Box>
                </Box>
              </Box>
            </Popover> */}
            {!dealDetails && user?.user?.role !== "Seller" &&
              <>
                <Button
                  sx={selectedRights.length > 0 ? styles.filterButtonActive : styles.filterButton}
                  onClick={(e) => setRightsAnchorEl(e.currentTarget)} // Open the popover
                  endIcon={<ArrowDownIcon fontSize="small" />}
                >
                  Rights
                  {selectedRights.length > 0 && (
                    <Badge
                      badgeContent={selectedRights.length}
                      color="primary"
                      sx={{
                        marginLeft: "4px",
                        "& .MuiBadge-badge": {
                          backgroundColor: "#7ab5e7",
                          color: "#000",
                          fontWeight: "bold",
                        },
                      }}
                    />
                  )}
                </Button>
                <Popover
                  open={Boolean(rightsAnchorEl)}
                  anchorEl={rightsAnchorEl}
                  onClose={() => setRightsAnchorEl(null)} // Close the popover
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  PaperProps={{
                    style: { backgroundColor: "#111" },
                  }}
                >
                  <Box sx={styles.popoverContent}>
                    <Typography sx={styles.popoverTitle}>
                      Rights
                      {selectedRights.length > 0 && (
                        <Button size="small" sx={styles.clearButton} onClick={clearFilters}>
                          Clear
                        </Button>
                      )}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                      {rightsOptions.map((right) => (
                        <Chip
                          key={right.id}
                          label={right.name}
                          onClick={() => handleRightsFilter(right.name)} // Toggle rights selection
                          sx={selectedRights.includes(right.name) ? styles.popoverChipActive : styles.popoverChip}
                        />
                      ))}
                    </Box>
                  </Box>
                </Popover></>}
            {!dealDetails && user?.user?.role !== "Seller" && <>
              <Button
                sx={selectedTerritories.length > 0 ? styles.filterButtonActive : styles.filterButton}
                onClick={(e) => setTerritoryAnchorEl(e.currentTarget)}
                endIcon={<ArrowDownIcon fontSize="small" />}
              >
                Including Region
                {selectedTerritories.length > 0 && (
                  <Badge
                    badgeContent={selectedTerritories.length}
                    color="primary"
                    sx={{
                      marginLeft: "4px",
                      "& .MuiBadge-badge": {
                        backgroundColor: "#7ab5e7",
                        color: "#000",
                        fontWeight: "bold",
                      },
                    }}
                  />
                )}
              </Button>
              <Popover
                open={Boolean(territoryAnchorEl)}
                anchorEl={territoryAnchorEl}
                onClose={() => setTerritoryAnchorEl(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                PaperProps={{
                  style: { backgroundColor: "#111" },
                }}
              >
                <Box sx={styles.popoverContent}>
                  <Typography sx={styles.popoverTitle}>
                    Including Region
                    {selectedTerritories.length > 0 && (
                      <Button
                        size="small"
                        sx={styles.clearButton}
                        onClick={() => {
                          setSelectedTerritories([]); // Clear selected regions
                          setProjectData([...originalProjectData]); // Reset to original data
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </Typography>
                  {Object.keys(regionCountryMapping).map((region) => (
                    <Chip
                      key={region}
                      label={region}
                      onClick={() => handleIncludingRegionFilter(region)}
                      sx={selectedTerritories.includes(region) ? styles.popoverChipActive : styles.popoverChip}
                    />
                  ))}
                </Box>
              </Popover></>}

            {/* Excluding Countries Filter */}
            {!dealDetails && user?.user?.role !== "Seller" && <><Button
              sx={selectedExcludingTerritory.length > 0 ? styles.filterButtonActive : styles.filterButton}
              onClick={(e) => setExcludingCountryAnchorEl(e.currentTarget)}
              endIcon={<ArrowDownIcon fontSize="small" />}
            >
              Excluding Countries
              {selectedExcludingTerritory.length > 0 && (
                <Badge
                  badgeContent={selectedExcludingTerritory.length}
                  color="primary"
                  sx={{
                    marginLeft: "4px",
                    "& .MuiBadge-badge": {
                      backgroundColor: "#7ab5e7",
                      color: "#000",
                      fontWeight: "bold",
                    },
                  }}
                />
              )}
            </Button>
              <Popover
                open={Boolean(excludingCountryAnchorEl)}
                anchorEl={excludingCountryAnchorEl}
                onClose={() => setExcludingCountryAnchorEl(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                PaperProps={{
                  style: { backgroundColor: "#111" },
                }}
              >
                <Box sx={styles.popoverContent}>
                  <Typography sx={styles.popoverTitle}>
                    Excluding Countries
                    {selectedExcludingTerritory.length > 0 && (
                      <Button
                        size="small"
                        sx={styles.clearButton}
                        onClick={() => {
                          setSelectedExcludingTerritory([]);
                          setExcludingCountryAnchorEl(null);
                          fetchAllProjectData(
                            1,
                            false,
                            selectedRights,
                            selectedTerritories,
                            [],
                            selectedYears,
                            selectedGenres,
                            selectedLanguages,
                            selectedContentCategories
                          );
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                    {availableExcludingCountries.map((country) => (
                      <Chip
                        key={country}
                        label={country}
                        onClick={() => {
                          setSelectedExcludingTerritory((prev) => {
                            const updated = prev.includes(country)
                              ? prev.filter((c) => c !== country)
                              : [...prev, country];
                            fetchAllProjectData(
                              1,
                              false,
                              selectedRights,
                              selectedTerritories,
                              updated,
                              selectedYears,
                              selectedGenres,
                              selectedLanguages,
                              selectedContentCategories
                            );
                            setExcludingCountryAnchorEl(null); // Close popover after selection
                            return updated;
                          });
                        }}
                        sx={
                          selectedExcludingTerritory.includes(country)
                            ? styles.popoverChipActive
                            : styles.popoverChip
                        }
                      />
                    ))}
                  </Box>
                </Box>
              </Popover></>}

            {/* Genre Button */}
            {!dealDetails && user?.user?.role !== "Seller" &&
              <>
                <Button
                  sx={selectedGenres.length > 0 ? styles.filterButtonActive : styles.filterButton}
                  onClick={(e) => setGenreAnchorEl(e.currentTarget)} // Open the popover
                  endIcon={<ArrowDownIcon fontSize="small" />}
                >
                  Genre
                  {selectedGenres.length > 0 && (
                    <Badge
                      badgeContent={selectedGenres.length}
                      color="primary"
                      sx={{
                        marginLeft: "4px",
                        "& .MuiBadge-badge": {
                          backgroundColor: "#7ab5e7",
                          color: "#000",
                          fontWeight: "bold",
                        },
                      }}
                    />
                  )}
                </Button>
                <Popover
                  open={Boolean(genreAnchorEl)}
                  anchorEl={genreAnchorEl}
                  onClose={() => setGenreAnchorEl(null)} // Close the popover
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  PaperProps={{
                    style: { backgroundColor: "#111" },
                  }}
                >
                  <Box sx={styles.popoverContent}>
                    <Typography sx={styles.popoverTitle}>
                      Genre
                      {selectedGenres.length > 0 && (
                        <Button size="small" sx={styles.clearButton} onClick={clearFilters}>
                          Clear
                        </Button>
                      )}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                      {genresOptions.map((genre) => (
                        <Chip
                          key={genre.id}
                          label={genre.name} // Use the name property for the label
                          onClick={() => handleGenreFilter(genre.name)} // Pass only the name to the handler
                          sx={selectedGenres.includes(genre.name) ? styles.popoverChipActive : styles.popoverChip}
                        />
                      ))}
                    </Box>
                  </Box>
                </Popover></>}

            {/* Year Button */}
            {!dealDetails && user?.user?.role !== "Seller" &&
              <>
                <Button
                  sx={selectedYears.length > 0 ? styles.filterButtonActive : styles.filterButton}
                  onClick={handleYearClick}
                  endIcon={<ArrowDownIcon fontSize="small" />}
                >
                  Year Of Release
                  {selectedYears.length > 0 && (
                    <Badge
                      badgeContent={selectedYears.length}
                      color="primary"
                      sx={{
                        marginLeft: "4px",
                        "& .MuiBadge-badge": {
                          backgroundColor: "#7ab5e7",
                          color: "#000",
                          fontWeight: "bold",
                        },
                      }}
                    />
                  )}
                </Button>
                <Popover
                  open={Boolean(yearAnchorEl)}
                  anchorEl={yearAnchorEl}
                  onClose={handleYearClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  PaperProps={{
                    style: { backgroundColor: "#111" },
                  }}
                >
                  <Box sx={styles.popoverContent}>
                    <Typography sx={styles.popoverTitle}>
                      Year
                      {selectedYears.length > 0 && (
                        <Button size="small" sx={styles.clearButton} onClick={clearFilters}>
                          Clear
                        </Button>
                      )}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                      {allYears.map((year) => (
                        <Chip
                          label={year}
                          key={year}
                          onClick={() => handleYearFilter(year)
                          }
                          sx={selectedYears.includes(year) ? styles.popoverChipActive : styles.popoverChip}
                        />
                      ))}
                    </Box>
                  </Box>
                </Popover>
              </>}

            {!dealDetails && user?.user?.role !== "Seller" &&
              <>
                <Button
                  sx={selectedLanguages.length > 0 ? styles.filterButtonActive : styles.filterButton}
                  onClick={(e) => setLanguageAnchorEl(e.currentTarget)} // Open the popover
                  endIcon={<ArrowDownIcon fontSize="small" />}
                >
                  Language
                  {selectedLanguages.length > 0 && (
                    <Badge
                      badgeContent={selectedLanguages.length}
                      color="primary"
                      sx={{
                        marginLeft: "4px",
                        "& .MuiBadge-badge": {
                          backgroundColor: "#7ab5e7",
                          color: "#000",
                          fontWeight: "bold",
                        },
                      }}
                    />
                  )}
                </Button>
                <Popover
                  open={Boolean(languageAnchorEl)}
                  anchorEl={languageAnchorEl}
                  onClose={() => setLanguageAnchorEl(null)} // Close the popover
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  PaperProps={{
                    style: { backgroundColor: "#111" },
                  }}
                >
                  <Box sx={styles.popoverContent}>
                    <Typography sx={styles.popoverTitle}>
                      Language
                      {selectedLanguages.length > 0 && (
                        <Button size="small" sx={styles.clearButton} onClick={clearFilters}>
                          Clear
                        </Button>
                      )}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                      {languageList.map((language) => (
                        <Chip
                          key={language}
                          label={language}
                          onClick={() => handleLanguageFilter(language)} // Toggle language selection
                          sx={selectedLanguages.includes(language) ? styles.popoverChipActive : styles.popoverChip}
                        />
                      ))}
                    </Box>
                  </Box>
                </Popover></>}

            {!dealDetails && user?.user?.role !== "Seller" &&
              <>
                <Button
                  sx={selectedContentCategories.length > 0 ? styles.filterButtonActive : styles.filterButton}
                  onClick={(e) => setContentCategoryAnchorEl(e.currentTarget)} // Open the popover
                  endIcon={<ArrowDownIcon fontSize="small" />}
                >
                  Content Category
                  {selectedContentCategories.length > 0 && (
                    <Badge
                      badgeContent={selectedContentCategories.length}
                      color="primary"
                      sx={{
                        marginLeft: "4px",
                        "& .MuiBadge-badge": {
                          backgroundColor: "#7ab5e7",
                          color: "#000",
                          fontWeight: "bold",
                        },
                      }}
                    />
                  )}
                </Button>
                <Popover
                  open={Boolean(contentCategoryAnchorEl)}
                  anchorEl={contentCategoryAnchorEl}
                  onClose={() => setContentCategoryAnchorEl(null)} // Close the popover
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  PaperProps={{
                    style: { backgroundColor: "#111" },
                  }}
                >
                  <Box sx={styles.popoverContent}>
                    <Typography sx={styles.popoverTitle}>
                      Content Category
                      {selectedContentCategories.length > 0 && (
                        <Button size="small" sx={styles.clearButton} onClick={clearFilters}>
                          Clear
                        </Button>
                      )}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                      {contentCategoryOptions.map((category) => (
                        <Chip
                          key={category.id}
                          label={category.name}
                          onClick={() => handleContentCategoryFilter(category.id)} // Toggle content category selection
                          sx={selectedContentCategories.includes(category.name) ? styles.popoverChipActive : styles.popoverChip}
                        />
                      ))}
                    </Box>
                  </Box>
                </Popover>
              </>}

            {/* Filter Action Buttons */}
            {dealDetails ? (
              // If dealDetails is present, show both "Open Filters" and "Clear Filters"
              <>
                <Button
                  variant="contained"
                  onClick={() => setAdvancedFiltersOpen(true)}
                  sx={styles.advancedFilterButton}
                >
                  Open Filters
                </Button>
                <Button
                  variant="outlined"
                  onClick={clearSelectedFilters}
                  sx={{
                    backgroundColor: activeFiltersCount > 0 ? "rgba(123, 181, 231, 0.2)" : "rgba(255, 255, 255, 0.08)",
                    color: activeFiltersCount > 0 ? "#7ab5e7" : "#fff",
                    fontSize: "13px",
                    padding: "4px 12px",
                    borderRadius: "16px",
                    textTransform: "none",
                    border: activeFiltersCount > 0 ? "1px solid #7ab5e7" : "1px solid rgba(255, 255, 255, 0.1)",
                   
                    gap: "4px",
                    height: "32px",
                    "&:hover": {
                      backgroundColor: "rgba(123, 181, 231, 0.2)",
                    },
                  }}
                >
                  Clear Filters
                </Button>
              </>
            ) : activeFiltersCount > 0 ? (
              // If any filter is applied, show only "Clear Filters"
              <Button
                variant="outlined"
                sx={styles.advancedFilterButton}
                onClick={clearSelectedFilters}
              >
                Clear Filters
              </Button>
            ) : (
              // If no filter is applied, show only "Create Requirement"
              <Button
                sx={styles.advancedFilterButton}
                onClick={() => {
                  navigate("/create-requirement");
                }}
                startIcon={<TuneIcon fontSize="small" />}
              >
                Create Requirement
              </Button>
            )}

            {/* Selected Filters */}
            {allSelectedFilters.length > 0 && (
              <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap", marginLeft: "8px" }}>
                {allSelectedFilters.slice(0, 3).map((filter, index) => (
                  <Chip
                    key={`${filter.type}-${filter.value}`}
                    label={filter.value}
                    onDelete={() => removeFilter(filter)}
                    deleteIcon={<CloseIcon fontSize="small" />}
                    sx={styles.selectedFilterChip}
                    size="small"
                  />
                ))}
                {allSelectedFilters.length > 3 && (
                  <Chip
                    label={`+${allSelectedFilters.length - 3} more`}
                    sx={styles.selectedFilterChip}
                    size="small"
                    onClick={() => setAdvancedFiltersOpen(true)}
                  />
                )}
              </Box>
            )}
          </Box>

          <Drawer anchor="right"
            open={advancedFiltersOpen}
            onClose={(event, reason) => {
              if (reason === "backdropClick" || reason === "escapeKeyDown") return;
              setAdvancedFiltersOpen(false);
              // setSelectedItems([]);
            }}
            ModalProps={{
              keepMounted: true, // Keep the drawer mounted for performance
              disableBackdropClick: true, // Prevent closing when clicking outside
            }}
          >
            <Box sx={styles.drawerContent}>
              <Box sx={styles.drawerHeader}>
                <Typography sx={styles.drawerTitle}>Your Requirement</Typography>
                <div>
                  <IconButton
                    onClick={() => navigate("/create-requirement", { state: { dealDetails: dealDetails } })}
                    sx={{ color: "#3848a2" }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => {
                    setAdvancedFiltersOpen(false);
                    // setSelectedItems([]);
                    setSelectAll(false);
                  }} sx={{ color: "#FF0000" }}>
                    <CloseIcon />
                  </IconButton>
                </div>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold", color: "#e1780c" }}>
                    Rights:
                  </Typography>
                  <Typography variant="body1">{dealDetails?.rights || "N/A"}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold", color: "#e1780c" }}>
                    Including Regions:
                  </Typography>
                  <Typography variant="body1">
                    {dealDetails?.includingRegions?.join(", ") || "N/A"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold", color: "#e1780c" }}>
                    Excluding Countries:
                  </Typography>
                  <Typography variant="body1">
                    {dealDetails?.excludingCountries?.join(", ") || "N/A"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold", color: "#e1780c" }}>
                    Usage Rights:
                  </Typography>
                  <Typography variant="body1">{dealDetails?.usageRights || "N/A"}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold", color: "#e1780c" }}>
                    Content Categories:
                  </Typography>
                  <Typography variant="body1">
                    {dealDetails?.contentCategory?.join(", ") || "N/A"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold", color: "#e1780c" }}>
                    Languages:
                  </Typography>
                  <Typography variant="body1">
                    {dealDetails?.languages?.join(", ") || "N/A"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold", color: "#e1780c" }}>
                    Genres:
                  </Typography>
                  <Typography variant="body1">
                    {dealDetails?.genre?.join(", ") || "N/A"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold", color: "#e1780c" }}>
                    Year of Release:
                  </Typography>
                  <Typography variant="body1">
                    {dealDetails?.yearOfRelease?.join(", ") || "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Drawer>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            {areDrawerFieldsFilled() && filtersApplied && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAll}
                    sx={{
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "rgba(123, 181, 231, 0.1)", // Background color on hover
                      },
                    }}
                  />
                }
                label="Select All"
              />
            )}
            {areDrawerFieldsFilled() && filtersApplied && (
              <Badge
                badgeContent={selectedItems.length}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#7ab5e7",
                    color: "#000",
                    fontWeight: "bold",
                  },
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleAddToCart}
                  disabled={selectedItems.length === 0} // Disable button when no items are selected
                  sx={{
                    backgroundColor: selectedItems.length > 0 ? "#7ab5e7" : "rgba(255, 255, 255, 0.08)",
                    color: selectedItems.length > 0 ? "#000" : "#aaa",
                    "&:hover": {
                      backgroundColor: selectedItems.length > 0 ? "#5a9bd5" : "rgba(255, 255, 255, 0.08)",
                    },
                  }}
                >
                  Add To Cart
                </Button>
              </Badge>
            )}
          </div>
          {Object.values(projectData).length > 0 ? <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
            {Object.values(projectData).map((project) => {
              console.log("🔍 Project data in map:", project); // Add log here

              const title = project?.projectTitle || "Untitled Project";
              const poster = project?.posterFileName;
              const logoImageURL = project.projectPosterS3Url || defaultPoster;
              console.log("poster filen name", poster)
              console.log("logo image url", logoImageURL)
              console.log("orgname", orgName)

              const genre = project?.formData?.specificationsInfo?.genres || "Unknown Genre";
              const completionDate = project?.formData?.specificationsInfo?.completionDate;
              const year = completionDate ? new Date(completionDate).getFullYear() : "N/A";
              const rating = project?.formData?.specificationsInfo?.rating || 0;
              const isChecked = selectedItems.includes(project._id);

              return (
                <Box key={project._id} sx={responsiveStyles.movieItem}>
                  <Card sx={{ ...styles.card, position: 'relative' }} elevation={0}>

                    <Checkbox
                      sx={{
                        position: 'absolute',
                        top: 1,
                        right: 1,
                        color: '#fff',
                        '&.Mui-checked': {
                          color: '#7ab5e7',
                        },
                      }}
                      checked={selectedItems.includes(project._id)}
                      onChange={() => handleCheckboxChange(project._id)} // Updated handler
                    />
                    <CardMedia sx={styles.cardMedia} image={logoImageURL} title={title} />
                    <CardContent sx={styles.cardContent}>
                      <Typography gutterBottom variant="h6" component="div" sx={styles.movieTitle}>
                        {title}
                      </Typography>
                      <Box sx={styles.genreYearContainer}>
                        <Chip label={genre} size="small" sx={styles.genreChip} />
                        <Typography variant="body2" sx={styles.yearText}>
                          {year}
                        </Typography>
                      </Box>
                      {user?.user?.role !== "Seller" && (
                        <Box sx={{ display: 'flex', gap: 2, mt: 1, ml: 1 }}>
                          <Button
                            variant="contained"
                            sx={styles.checkoutButton}
                            // onClick={() => navigate(`/movie/${project._id}`)}
                            onClick={() => window.open(`/movie/${project._id}`, "_blank")}
                          >
                            View Details
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              );
            })}
          </Box> : <Container>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "60vh",
                textAlign: "center",
                padding: 3,
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  padding: 4,
                  borderRadius: 3,
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #e9ecef",
                  width: "100%",
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    marginBottom: 3,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <HelpOutlined
                    sx={{
                      fontSize: 80,
                      color: "#6c757d",
                      opacity: 0.7,
                    }}
                  />
                </Box>

                {/* Main Message */}
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    marginBottom: 2,
                    fontWeight: 600,
                    color: "#343a40",
                    fontSize: { xs: "1.5rem", sm: "2rem" },
                  }}
                >
                  Oops! No Content Found
                </Typography>

                {role === "Buyer" && (
                  <>
                    <Typography
                      variant="body1"
                      sx={{
                        marginBottom: 3,
                        color: "#6c757d",
                        lineHeight: 1.6,
                        fontSize: "1.1rem",
                      }}
                    >
                      We couldn't find what you're looking for right now. Don't worry though - our admin team is here to help you
                      get exactly what you need!
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: "#e3f2fd",
                        padding: 3,
                        borderRadius: 2,
                        marginBottom: 3,
                        border: "1px solid #bbdefb",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          marginBottom: 2,
                          color: "#1565c0",
                          fontWeight: 500,
                        }}
                      >
                        📝 Have specific requirements?
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#424242",
                          marginBottom: 2,
                        }}
                      >
                        Click below to send your requirements to our admin team. We'll get back to you as soon as possible!
                      </Typography>
                    </Box>


                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<Send />}
                        // onClick={handleContactAdmin}
                        sx={{
                          backgroundColor: "#1976d2",
                          "&:hover": {
                            backgroundColor: "#1565c0",
                          },
                          paddingX: 3,
                          paddingY: 1.5,
                          borderRadius: 2,
                          textTransform: "none",
                          fontSize: "1rem",
                          fontWeight: 600,
                          boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                        }}
                      >
                        Send Requirement
                      </Button>

                      <Button
                        variant="outlined"
                        size="large"
                        startIcon={<ContactSupport />}
                        sx={{
                          borderColor: "#1976d2",
                          color: "#1976d2",
                          "&:hover": {
                            borderColor: "#1565c0",
                            backgroundColor: "rgba(25, 118, 210, 0.04)",
                          },
                          paddingX: 3,
                          paddingY: 1.5,
                          borderRadius: 2,
                          textTransform: "none",
                          fontSize: "1rem",
                          fontWeight: 600,
                        }}
                      >
                        Get Support
                      </Button>
                    </Box>
                  </>
                )}
              </Paper>
            </Box>
          </Container>}


        </Box>
      )}

      <Modal
        open={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)} // Close the modal
        aria-labelledby="warning-modal-title"
        aria-describedby="warning-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 450,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Cross Icon for Closing */}
          <IconButton
            onClick={() => setIsWarningModalOpen(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "#888",
              "&:hover": {
                color: "#000",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Title */}
          <Typography id="warning-modal-title" variant="h5" component="h2" sx={{ mb: 2, fontWeight: "bold", color: "#e1780c" }}>
            Action Required: Create a Requirement
          </Typography>

          {/* Message */}
          <Typography id="warning-modal-description" sx={{ mb: 3, color: "#555", lineHeight: 1.6 }}>
            <strong>Let’s Customize Your Content!</strong><br />
            Please <strong>create a requirement</strong> or <strong>select an existing one</strong> to filter content that matches your needs.
          </Typography>

          {/* Button to Navigate to Create Requirement */}
          <Button
            variant="contained"
            onClick={() => {
              setIsWarningModalOpen(false); // Close the modal
              navigate("/create-requirement"); // Navigate to the Create Requirement page
            }}
            sx={{
              bgcolor: "#e1780c",
              color: "#fff",
              "&:hover": { bgcolor: "#c26509" },
              mt: 2,
              textTransform: "none",
              fontWeight: "bold",
              paddingX: 3,
              paddingY: 1.5,
            }}
          >
            Create Requirement
          </Button>

          {/* Help Link */}
          <Typography sx={{ mt: 2, fontSize: "0.9rem", color: "#888" }}>
            Need help? <a style={{ color: "#e1780c", textDecoration: "none" }}>Visit our Help Center</a>.
          </Typography>
        </Box>
      </Modal>

      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ marginTop: "10px", marginBottom: "10px" }}>
        {/* Left Arrow */}
        <IconButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          sx={{
            backgroundColor: currentPage === 1 ? "rgba(255, 165, 0, 0.5)" : "#FFA500", // Lighter orange when disabled
            color: "#fff",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            "&:hover": {
              backgroundColor: currentPage === 1 ? "rgba(255, 165, 0, 0.5)" : "#FF8C00", // Darker orange on hover
            },
          }}
        >
          <ChevronLeft />
        </IconButton>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => (
          <Typography
            key={index}
            onClick={() => typeof page === "number" && handlePageChange(page)}
            sx={{
              cursor: typeof page === "number" ? "pointer" : "default",
              padding: "8px",
              fontWeight: page === currentPage ? "bold" : "normal",
              color: page === currentPage ? "#1976d2" : "#fff",
            }}
          >
            {page}
          </Typography>
        ))}

        {/* Right Arrow */}
        <IconButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          sx={{
            backgroundColor: currentPage === totalPages ? "rgba(255, 165, 0, 0.5)" : "#FFA500", // Lighter orange when disabled
            color: "#fff",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            "&:hover": {
              backgroundColor: currentPage === totalPages ? "rgba(255, 165, 0, 0.5)" : "#FF8C00", // Darker orange on hover
            },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Stack>
    </>
  )
}

const rightsOptions = [
  { name: 'All Rights', id: 1 },
  { name: 'SVOD (Subscription Video on Demand)', id: 2 },
  { name: 'TVOD (Transactional Video on Demand)', id: 3 },
  { name: 'AVOD (Advertising Video on Demand)', id: 4 },
  { name: 'Broadcast Rights', id: 5 },
  { name: 'Cable Rights', id: 6 },
  { name: 'Television Broadcast Rights', id: 7 },
  { name: 'Theatrical Rights', id: 8 },
  { name: 'EST (Electronic Sell-Through) Rights', id: 9 },
  { name: 'DVD/Blu-ray Distribution Rights', id: 10 },
  { name: 'Home Video Rights', id: 11 },
  { name: 'Foreign Distribution Rights', id: 12 },
  { name: 'Airline/Ship Rights', id: 13 },
  { name: 'Merchandising Rights', id: 14 },
  { name: 'Music Rights', id: 15 },
  { name: 'Product Placement Rights', id: 16 },
  { name: 'Franchise/Sequel Rights', id: 17 },
  { name: 'Mobile Rights', id: 18 },
  { name: 'Interactive and Gaming Rights', id: 19 },
  { name: 'Script/Adaptation Rights', id: 20 },
  { name: 'Public Performance Rights', id: 21 },
  { name: 'Specialty and Festival Rights', id: 22 },
  { name: 'Censorship Rights', id: 23 },
  { name: 'Outright Sale', id: 24 },
  { name: 'Digital Distribution', id: 25 },
  { name: 'Streaming Rights', id: 26 },
  { name: 'Video on Demand', id: 27 },
  { name: 'Free-to-Air Broadcast', id: 28 },
  { name: 'Pay Television', id: 29 },
  { name: 'Satellite Television', id: 30 },
  { name: 'IPTV Rights', id: 31 },
  { name: 'Mobile Distribution', id: 32 },
  { name: 'In-Flight Entertainment', id: 33 },
  { name: 'Hotel Distribution', id: 34 },
  { name: 'Educational Distribution', id: 35 },
  { name: 'Non-Theatrical Rights', id: 36 },
  { name: 'Digital Download', id: 37 },
  { name: 'Digital Rental', id: 38 },
  { name: 'Physical Rental', id: 39 },
  { name: 'Library Rights', id: 40 },
  { name: 'Archive Rights', id: 41 },
  { name: 'Festival Rights', id: 42 },
  { name: 'Awards Consideration', id: 43 },
  { name: 'Press Screening Rights', id: 44 },
  { name: 'Promotional Rights', id: 45 },
  { name: 'Marketing Rights', id: 46 },
  { name: 'Advertising Rights', id: 47 },
  { name: 'Soundtrack Rights', id: 48 },
  { name: 'Music Publishing', id: 49 },
  { name: 'Synchronization Rights', id: 50 },
  { name: 'Master Recording Rights', id: 51 },
  { name: 'Remake Rights', id: 52 },
  { name: 'Sequel Rights', id: 53 },
  { name: 'Prequel Rights', id: 54 },
  { name: 'Spin-off Rights', id: 55 },
  { name: 'Format Rights', id: 56 },
  { name: 'Adaptation Rights', id: 57 },
  { name: 'Translation Rights', id: 58 },
  { name: 'Dubbing Rights', id: 59 },
  { name: 'Subtitling Rights', id: 60 },
  { name: 'Closed Captioning Rights', id: 61 },
  { name: 'Audio Description Rights', id: 62 },
  { name: 'Social Media Rights', id: 63 },
  { name: 'YouTube Rights', id: 64 },
  { name: 'Facebook Rights', id: 65 },
  { name: 'Instagram Rights', id: 66 },
  { name: 'TikTok Rights', id: 67 },
  { name: 'Twitter Rights', id: 68 },
  { name: 'Podcast Rights', id: 69 },
  { name: 'Radio Rights', id: 70 },
  { name: 'Internet Radio Rights', id: 71 },
  { name: 'Gaming Rights', id: 72 },
  { name: 'Virtual Reality Rights', id: 73 },
  { name: 'Augmented Reality Rights', id: 74 },
  { name: 'NFT Rights', id: 75 },
  { name: 'Blockchain Rights', id: 76 },
  { name: 'Metaverse Rights', id: 77 }
];


const usageRightsOptions = [
  { name: "Exclusive", id: 1 },
  { name: "Non-Exclusive", id: 2 },
  { name: "Sub-licensable", id: 3 },
]

const contentCategoryOptions = [
    { id: "feature_film", name: "Feature Film" },
    { id: "short_film", name: "Short Films" },
    { id: "documentary_feature", name: "Documentary Feature" },
    { id: "documentary_short", name: "Documentary Short" },
    { id: "tv_series", name: "TV Series" },
    { id: "limited_series", name: "Limited Series" },
    { id: "mini_series", name: "Mini Series" },
    { id: "tv_movie", name: "TV Movie" },
    { id: "tv_special", name: "TV Special" },
    { id: "reality_tv", name: "Reality TV" },
    { id: "talk_show", name: "Talk Show" },
    { id: "game_show", name: "Game Show" },
    { id: "news_program", name: "News Program" },
    { id: "sports_program", name: "Sports Program" },
    { id: "children_program", name: "Children's Program" },
    { id: "animation_feature", name: "Animation Feature" },
    { id: "animation_series", name: "Animation Series" },
    { id: "animation_short", name: "Animation Short" },
    { id: "music_video", name: "Music Video" },
    { id: "concert_film", name: "Concert Film" },
    { id: "stand_up_comedy", name: "Stand-up Comedy" },
    { id: "variety_show", name: "Variety Show" },
    { id: "award_show", name: "Award Show" },
    { id: "commercial", name: "Commercial" },
    { id: "corporate_video", name: "Corporate Video" },
    { id: "training_video", name: "Training Video" },
    { id: "instructional_video", name: "Instructional Video" },
    { id: "web_series", name: "Web Series" },
    { id: "podcast", name: "Podcast" },
    { id: "audio_drama", name: "Audio Drama" },
    { id: "radio_show", name: "Radio Show" },
    { id: "live_stream", name: "Live Stream" },
    { id: "virtual_event", name: "Virtual Event" },
    { id: "interactive_content", name: "Interactive Content" },
    { id: "360_video", name: "360° Video" },
    { id: "vr_content", name: "VR Content" },
    { id: "ar_content", name: "AR Content" },
    { id: "gaming_content", name: "Gaming Content" },
    { id: "ugc", name: "User Generated Content" },
    { id: "social_media_content", name: "Social Media Content" },
    { id: "branded_content", name: "Branded Content" },
    { id: "sponsored_content", name: "Sponsored Content" },
];


const languageList = [
  "Afrikaans", "Albanian", "Amharic", "Arabic", "Armenian", "Azerbaijani", "Basque", "Belarusian",
  "Bengali", "Bosnian", "Bulgarian", "Burmese", "Catalan", "Cebuano", "Chinese", "Corsican",
  "Croatian", "Czech", "Danish", "Dutch", "English", "Esperanto", "Estonian", "Finnish",
  "French", "Frisian", "Galician", "Georgian", "German", "Greek", "Gujarati", "Haitian Creole",
  "Hausa", "Hawaiian", "Hebrew", "Hindi", "Hmong", "Hungarian", "Icelandic", "Igbo", "Indonesian",
  "Irish", "Italian", "Japanese", "Javanese", "Kannada", "Kazakh", "Khmer", "Kinyarwanda",
  "Korean", "Kurdish", "Kyrgyz", "Lao", "Latin", "Latvian", "Lithuanian", "Luxembourgish",
  "Macedonian", "Malagasy", "Malay", "Malayalam", "Maltese", "Maori", "Marathi", "Mongolian",
  "Nepali", "Norwegian", "Nyanja", "Odia", "Pashto", "Persian", "Polish", "Portuguese", "Punjabi",
  "Romanian", "Russian", "Samoan", "Scots Gaelic", "Serbian", "Sesotho", "Shona", "Sindhi",
  "Sinhala", "Slovak", "Slovenian", "Somali", "Spanish", "Sundanese", "Swahili", "Swedish",
  "Tagalog", "Tajik", "Tamil", "Tatar", "Telugu", "Thai", "Turkish", "Turkmen", "Ukrainian",
  "Urdu", "Uyghur", "Uzbek", "Vietnamese", "Welsh", "Xhosa", "Yiddish", "Yoruba", "Zulu"
];

const regionCountryMapping = {
  Worldwide: [],
  "North America": [
    "United States",
    "Canada",
    "Mexico",
    "Guatemala",
    "Belize",
    "El Salvador",
    "Honduras",
    "Nicaragua",
    "Costa Rica",
    "Panama",
  ],
  "South America": [
    "Brazil",
    "Argentina",
    "Chile",
    "Peru",
    "Colombia",
    "Venezuela",
    "Ecuador",
    "Bolivia",
    "Paraguay",
    "Uruguay",
    "Guyana",
    "Suriname",
    "French Guiana",
  ],
  Europe: [
    "United Kingdom",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Netherlands",
    "Belgium",
    "Switzerland",
    "Austria",
    "Sweden",
    "Norway",
    "Denmark",
    "Finland",
    "Poland",
    "Czech Republic",
    "Hungary",
    "Romania",
    "Bulgaria",
    "Greece",
    "Portugal",
    "Ireland",
    "Croatia",
    "Slovenia",
    "Slovakia",
    "Estonia",
    "Latvia",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Cyprus",
  ],
  "Asia Pacific": [
    "China",
    "Japan",
    "South Korea",
    "India",
    "Australia",
    "New Zealand",
    "Singapore",
    "Malaysia",
    "Thailand",
    "Indonesia",
    "Philippines",
    "Vietnam",
    "Taiwan",
    "Hong Kong",
    "Macau",
    "Cambodia",
    "Laos",
    "Myanmar",
    "Brunei",
    "Papua New Guinea",
    "Fiji",
    "Solomon Islands",
  ],
  "Middle East": [
    "Saudi Arabia",
    "United Arab Emirates",
    "Qatar",
    "Kuwait",
    "Bahrain",
    "Oman",
    "Israel",
    "Turkey",
    "Iran",
    "Iraq",
    "Jordan",
    "Lebanon",
    "Syria",
    "Yemen",
    "Egypt",
  ],
  Africa: [
    "South Africa",
    "Nigeria",
    "Kenya",
    "Ghana",
    "Morocco",
    "Egypt",
    "Algeria",
    "Tunisia",
    "Ethiopia",
    "Tanzania",
    "Uganda",
    "Zimbabwe",
    "Botswana",
    "Namibia",
    "Zambia",
    "Malawi",
    "Mozambique",
    "Madagascar",
    "Mauritius",
    "Seychelles",
  ],
  "Latin America": [
    "Mexico",
    "Brazil",
    "Argentina",
    "Chile",
    "Peru",
    "Colombia",
    "Venezuela",
    "Ecuador",
    "Bolivia",
    "Paraguay",
    "Uruguay",
    "Guatemala",
    "Honduras",
    "El Salvador",
    "Nicaragua",
    "Costa Rica",
    "Panama",
    "Dominican Republic",
    "Cuba",
    "Jamaica",
    "Haiti",
    "Trinidad and Tobago",
  ],
  "Eastern Europe": [
    "Russia",
    "Ukraine",
    "Belarus",
    "Moldova",
    "Georgia",
    "Armenia",
    "Azerbaijan",
    "Kazakhstan",
    "Uzbekistan",
    "Turkmenistan",
    "Kyrgyzstan",
    "Tajikistan",
  ],
  Scandinavia: ["Sweden", "Norway", "Denmark", "Finland", "Iceland"],
  Benelux: ["Netherlands", "Belgium", "Luxembourg"],
  DACH: ["Germany", "Austria", "Switzerland"],
  "UK & Ireland": ["United Kingdom", "Ireland"],
  Iberia: ["Spain", "Portugal"],
  Balkans: ["Serbia", "Montenegro", "Bosnia and Herzegovina", "North Macedonia", "Albania", "Kosovo"],
}


const territoryGroupedOptions = [
  {
    name: 'Worldwide',
    id: 'worldwide',
    country: 'All Countries',
    region: 'global'
  },
  // Asia
  { name: 'India', id: 'india', country: 'India', region: 'Asia' },
  { name: 'China', id: 'china', country: 'China', region: 'Asia' },
  { name: 'Japan', id: 'japan', country: 'Japan', region: 'Asia' },
  { name: 'South Korea', id: 'south_korea', country: 'South Korea', region: 'Asia' },
  { name: 'Indonesia', id: 'indonesia', country: 'Indonesia', region: 'Asia' },
  { name: 'Thailand', id: 'thailand', country: 'Thailand', region: 'Asia' },
  { name: 'Vietnam', id: 'vietnam', country: 'Vietnam', region: 'Asia' },
  { name: 'Philippines', id: 'philippines', country: 'Philippines', region: 'Asia' },
  // Europe
  { name: 'Germany', id: 'germany', country: 'Germany', region: 'Europe' },
  { name: 'France', id: 'france', country: 'France', region: 'Europe' },
  { name: 'Italy', id: 'italy', country: 'Italy', region: 'Europe' },
  { name: 'United Kingdom', id: 'united_kingdom', country: 'United Kingdom', region: 'Europe' },
  { name: 'Spain', id: 'spain', country: 'Spain', region: 'Europe' },
  { name: 'Netherlands', id: 'netherlands', country: 'Netherlands', region: 'Europe' },
  // North America
  { name: 'United States', id: 'united_states', country: 'United States', region: 'North America' },
  { name: 'Canada', id: 'canada', country: 'Canada', region: 'North America' },
  { name: 'Mexico', id: 'mexico', country: 'Mexico', region: 'North America' },
  // Latin America
  { name: 'Brazil', id: 'brazil', country: 'Brazil', region: 'LATAM (Latin America)' },
  { name: 'Argentina', id: 'argentina', country: 'Argentina', region: 'LATAM (Latin America)' },
  { name: 'Colombia', id: 'colombia', country: 'Colombia', region: 'LATAM (Latin America)' },
  { name: 'Chile', id: 'chile', country: 'Chile', region: 'LATAM (Latin America)' },
  { name: 'Peru', id: 'peru', country: 'Peru', region: 'LATAM (Latin America)' },
  // Africa
  { name: 'South Africa', id: 'south_africa', country: 'South Africa', region: 'Africa' },
  { name: 'Nigeria', id: 'nigeria', country: 'Nigeria', region: 'Africa' },
  { name: 'Egypt', id: 'egypt', country: 'Egypt', region: 'Africa' },
  { name: 'Kenya', id: 'kenya', country: 'Kenya', region: 'Africa' },
  // Oceania
  { name: 'Australia', id: 'australia', country: 'Australia', region: 'Oceania' },
  { name: 'New Zealand', id: 'new_zealand', country: 'New Zealand', region: 'Oceania' },
];


const genresOptions = [
  { name: 'Action', id: 1 },
  { name: 'Adventure', id: 2 },
  { name: 'Animation', id: 3 },
  { name: 'Comedy', id: 4 },
  { name: 'Drama', id: 5 },
  { name: 'Fantasy', id: 6 },
  { name: 'Historical', id: 7 },
  { name: 'Horror', id: 8 },
  { name: 'Musical', id: 9 },
  { name: 'Mystery', id: 10 },
  { name: 'Romance', id: 11 },
  { name: 'Sci-Fi', id: 12 },
  { name: 'Thriller', id: 13 },
  { name: 'War', id: 14 },
  { name: 'Western', id: 15 },
  { name: 'Crime', id: 16 },
  { name: 'Documentary', id: 17 },
  { name: 'Family', id: 18 },
  { name: 'Film-Noir', id: 19 },
  { name: 'Reality', id: 20 },
  { name: 'Animation/Cartoon', id: 21 },
  { name: 'Biography', id: 22 },
  { name: 'Sports', id: 23 },
  { name: 'Experimental', id: 24 },
  { name: 'Short Film', id: 25 },
  { name: 'Indie', id: 26 },
  { name: 'LGBTQ+', id: 27 },
  { name: 'Cult', id: 28 },
  { name: 'Noir', id: 29 },
  { name: 'Psychological', id: 30 },
];


const allYears = [
  2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014,
  2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004,
  2003, 2002, 2001, 2000, 1999, 1998, 1997, 1996, 1995, 1994,
  1993, 1992, 1991, 1990, 1989, 1988, 1987, 1986, 1985, 1984,
  1983, 1982, 1981, 1980, 1979, 1978, 1977, 1976, 1975, 1974,
  1973, 1972, 1971, 1970, 1969, 1968, 1967, 1966, 1965, 1964,
  1963, 1962, 1961, 1960
];



