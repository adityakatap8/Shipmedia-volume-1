import { useState, useEffect, useRef } from "react";
import { PlayerMenu } from "../components/PlayerMenu.jsx";
import { useToast } from "../components/ui/use-toast.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Search from "./Search.jsx";
import Categories from "./Categories.jsx";
import { useDispatch, useSelector } from "react-redux";
import defaultPoster from '../../../assets/Logo-holder.png';
import defaultBanner from '../../../assets/Banner-Holder.png';
import { UserContext } from '../../../contexts/UserContext.jsx';
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
  Toolbar,
  Typography,
  alpha,
  Slider,
  Badge,
  Drawer,
  Divider,
  Popover,
  Rating,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material"
import {
  Search as SearchIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  TuneOutlined as TuneIcon,
  Close as CloseIcon,
  Star as StarIcon,
  KeyboardArrowDown as ArrowDownIcon,
  CheckBox,
} from "@mui/icons-material"
import Loader from '../../loader/Loader.jsx'
import { setCartMovies } from "../../../redux/cartSlice/cartSlice.js";



export default function MovieGrid() {

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
  const [originalProjectData, setOriginalProjectData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { orgName, _id:
    userId, role } = useSelector((state) => state.auth.user.user)

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



  useEffect(() => {
    console.log("all details hit");

    // Fetch userId and role from Redux (already done outside)
    const token = Cookies.get("token");
    console.log("UserId and role", userId, role);

    if (!userId || !role || !token) return;

    // Fetch all project data from the backend
    const fetchAllProjectData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://media-shippers-backend.vercel.app/api/project-form/all-details?userId=${userId}&role=${role}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        const projects = response.data?.projects || [];

        console.log("Respone from get alldata", response.data)

        // Set the full project data (including formData)
        setProjectData(projects);
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

    fetchAllProjectData();
  }, [userId, role, token, toast]);


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!searchTerm) {
        // If search term is empty, reset to original data
        setProjectData([...originalProjectData]);
      } else {
        // Filter project data based on the search term
        const filteredData = originalProjectData.filter((project) =>
          project?.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setProjectData(filteredData);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(delayDebounceFn); // Cleanup the timeout
  }, [searchTerm, originalProjectData]);


  // Filter states
  const [selectedGenres, setSelectedGenres] = useState([])
  const [selectedYears, setSelectedYears] = useState([])
  const [priceRange, setPriceRange] = useState([0, 30])
  const [ratingFilter, setRatingFilter] = useState(0)
  const [filteredMovies, setFilteredMovies] = useState(movies)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [sortOption, setSortOption] = useState("featured")

  // UI states
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
  const [genreAnchorEl, setGenreAnchorEl] = useState(null)
  const [yearAnchorEl, setYearAnchorEl] = useState(null)
  const [sortAnchorEl, setSortAnchorEl] = useState(null)
  const [territoryAnchorEl, setTerritoryAnchorEl] = useState(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [rightsAnchorEl, setRightsAnchorEl] = useState(null); // Add state for rights popover
  const [contentCategoryAnchorEl, setContentCategoryAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State to control Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State to store the message
  const [snackbarSeverity, setSnackbarSeverity] = useState("error"); // State to store the severity (error, success, etc.)

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Close the Snackbar
  };










  const allUserIds = useRef([]);






  const handleGenreFilter = (genre) => {

    // Update selectedGenres state
    let updatedGenres;
    if (selectedGenres.includes(genre)) {
      updatedGenres = selectedGenres.filter((g) => g !== genre); // Remove genre
    } else {
      updatedGenres = [...selectedGenres, genre]; // Add genre
    }
    setSelectedGenres(updatedGenres);

    // Filter project data based on the updated genres
    const filteredData = originalProjectData.filter((project) => {
      const projectGenres = project?.formData?.specificationsInfo?.genres
        ?.split(",") // Convert comma-separated string into an array
        .map((g) => g.trim().toLowerCase()); // Trim and convert to lowercase

      return updatedGenres.length > 0
        ? updatedGenres.some((selectedGenre) =>
          projectGenres?.includes(selectedGenre.toLowerCase())
        )
        : true;
    });

    console.log("Filtered Data by Genre:", filteredData);
    setProjectData(filteredData); // Update the filtered movies state
  };

  const handleYearFilter = (year) => {
    // Update selectedYears state
    let updatedYears;
    if (selectedYears.includes(year)) {
      updatedYears = selectedYears.filter((y) => y !== year); // Remove year
    } else {
      updatedYears = [...selectedYears, year]; // Add year
    }
    setSelectedYears(updatedYears);
    console.log("Selected Years:", updatedYears);
    // Filter project data based on the selected years
    const filteredData = originalProjectData.filter((project) => {
      const completionDate = project?.formData?.specificationsInfo?.completionDate;
      const projectYear = completionDate ? new Date(completionDate).getFullYear() : null;
      console.log("project Years:", projectYear);
      return updatedYears.length > 0
        ? updatedYears.includes(projectYear) 
        : true;
    });
    
    console.log("Filtered Data by Year:", filteredData);
    setProjectData(filteredData); // Update the filtered movies state
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
      // Sort projectData alphabetically by projectTitle (case-insensitive)
      const sortedData = [...projectData].sort((a, b) => {
        const titleA = a.projectTitle?.toLowerCase() || "";
        const titleB = b.projectTitle?.toLowerCase() || "";
        return titleA.localeCompare(titleB, undefined, { sensitivity: 'base' });
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


  const handleTerritoryFilter = (territory) => {
    if (selectedTerritories.includes(territory)) {
      setSelectedTerritories(selectedTerritories.filter((t) => t !== territory));
    } else {
      setSelectedTerritories([...selectedTerritories, territory]);
    }
  };

  const handleLanguageFilter = (language) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== language)); // Remove language
    } else {
      setSelectedLanguages([...selectedLanguages, language]); // Add language
    }

    // Filter project data based on the selected language
    const filteredData = originalProjectData.filter(
      (project) =>
        project?.formData?.specificationsInfo?.language?.toLowerCase() === language.toLowerCase()
    );

    console.log("Filtered Data:", filteredData);
    setProjectData(filteredData); // Update the filtered movies state
  };

  const handleContentCategoryFilter = (category) => {
    const copyOfFilteredData = [...projectData];
    if (selectedContentCategories.includes(category)) {
      setSelectedContentCategories(selectedContentCategories.filter((c) => c !== category)); // Remove category
    } else {
      setSelectedContentCategories([...selectedContentCategories, category]); // Add category
    }

    // Filter project data based on the selected content category
    const filteredData = copyOfFilteredData.filter((project) =>
      selectedContentCategories.length > 0
        ? selectedContentCategories.some((selectedCategory) =>
          project?.formData?.specificationsInfo?.projectType
            ?.toLowerCase()
            .includes(selectedCategory.toLowerCase())
        )
        : true
    );

    console.log("Filtered Data by Content Category:", filteredData);
    setProjectData(filteredData); // Update the filtered movies state
  };

  const handleRightsFilter = (right) => {
    if (selectedRights.includes(right)) {
      setSelectedRights(selectedRights.filter((r) => r !== right)); // Remove right
    } else {
      setSelectedRights([...selectedRights, right]); // Add right
    }
  };

  // Apply filters and sorting
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

    setFilteredMovies(result);

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
      height: "auto",
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
        return "Featured"
    }
  }

  const handleAddToCart = async () => {
    const movies = selectedItems.map((itemId) => {
      const project = projectData.find((project) => project._id === itemId);
      return {
        movieId: project._id,
        title: project.projectTitle,
      };
    });

    try {
      const response = await axios.post('https://media-shippers-backend.vercel.app/api/cart/add-to-cart', {
        userId,
        movies,
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

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      // Select all items
      const allIds = projectData.map((project) => project._id);
      setSelectedItems(allIds);
    } else {
      // Deselect all items
      setSelectedItems([]);
    }
  };

  const handleCheckboxChange = (id) => {
    if (selectedItems.includes(id)) {
      // Remove the item if already selected
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      // Add the item to the selected list
      setSelectedItems([...selectedItems, id]);
    }
  };

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
          </Box>

          {/* Compact Filter Bar */}
          <Box sx={styles.compactFilterSection} gap={1}>
            {/* Sort Button */}
            <Button sx={styles.filterButton} onClick={handleSortClick} endIcon={<ArrowDownIcon fontSize="small" />}>
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
                </Box>
              </Box>
            </Popover>

            {/* Genre Button */}
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
            </Popover>

            {/* Year Button */}
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
            </Popover>

            <Button
              sx={selectedTerritories.length > 0 ? styles.filterButtonActive : styles.filterButton}
              onClick={(e) => setTerritoryAnchorEl(e.currentTarget)}
              endIcon={<ArrowDownIcon fontSize="small" />}
            >
              Territory
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
                  Territory
                  {selectedTerritories.length > 0 && (
                    <Button size="small" sx={styles.clearButton} onClick={clearFilters}>
                      Clear
                    </Button>
                  )}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  {territoryGroupedOptions.map((territory) => (
                    <Chip
                      key={territory.name}
                      label={territory.name}
                      onClick={() => handleTerritoryFilter(territory.name)}
                      sx={selectedTerritories.includes(territory.name) ? styles.popoverChipActive : styles.popoverChip}
                    />
                  ))}
                </Box>
              </Box>
            </Popover>

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
                      onClick={() => handleContentCategoryFilter(category.name)} // Toggle content category selection
                      sx={selectedContentCategories.includes(category.name) ? styles.popoverChipActive : styles.popoverChip}
                    />
                  ))}
                </Box>
              </Box>
            </Popover>

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
            </Popover>

            {/* Advanced Filters Button */}
            <Button
              sx={styles.advancedFilterButton}
              onClick={() => setAdvancedFiltersOpen(true)}
              startIcon={<TuneIcon fontSize="small" />}
            >
              More Filters
              {activeFiltersCount > 0 && (
                <Badge
                  badgeContent={activeFiltersCount}
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

          {/* Advanced Filters Drawer */}
          <Drawer anchor="right" open={advancedFiltersOpen} onClose={() => setAdvancedFiltersOpen(false)}>
            <Box sx={styles.drawerContent}>
              <Box sx={styles.drawerHeader}>
                <Typography sx={styles.drawerTitle}>Advanced Filters</Typography>
                <IconButton onClick={() => setAdvancedFiltersOpen(false)} sx={{ color: "#fff" }}>
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Selected Filters */}
              {allSelectedFilters.length > 0 && (
                <Box sx={styles.selectedFiltersContainer}>
                  {allSelectedFilters.map((filter, index) => (
                    <Chip
                      key={`${filter.type}-${filter.value}`}
                      label={filter.value}
                      onDelete={() => removeFilter(filter)}
                      deleteIcon={<CloseIcon fontSize="small" />}
                      sx={styles.selectedFilterChip}
                    />
                  ))}
                  {allSelectedFilters.length > 0 && (
                    <Button sx={styles.clearButton} onClick={clearFilters}>
                      Clear All
                    </Button>
                  )}
                </Box>
              )}

              <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)", margin: "16px 0" }} />

              {/* Genre Filter */}
              <Box sx={styles.drawerSection}>
                <Typography sx={styles.drawerSectionTitle}>Genre</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  {genresOptions.map((genre) => (
                    <Chip
                      key={genre.id}
                      onClick={() => handleGenreFilter(genre.name)}
                      sx={selectedGenres.includes(genre.name) ? styles.popoverChipActive : styles.popoverChip}
                    />
                  ))}
                </Box>
              </Box>

              {/* Year Filter */}
              <Box sx={styles.drawerSection}>
                <Typography sx={styles.drawerSectionTitle}>Year</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  {allYears.map((year) => (
                    <Chip
                      key={year}
                      onClick={() => handleYearFilter(year)}
                      sx={selectedYears.includes(year) ? styles.popoverChipActive : styles.popoverChip}
                    />
                  ))}
                </Box>
              </Box>

              {/* Price Range Filter */}
              {/* <Box sx={styles.drawerSection}>
            <Typography sx={styles.drawerSectionTitle}>Price Range</Typography>
            <Box sx={{ padding: "0 10px" }}>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={minPrice}
                max={maxPrice}
                step={1}
                sx={styles.slider}
                valueLabelFormat={(value) => `$${value}`}
              />
              <Box sx={styles.priceRangeText}>
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </Box>
            </Box>
          </Box> */}

              {/* Rating Filter */}
              <Box sx={styles.drawerSection}>
                <Typography sx={styles.drawerSectionTitle}>Minimum Rating</Typography>
                <Box sx={{ padding: "0 10px" }}>
                  <Slider
                    value={ratingFilter}
                    onChange={handleRatingChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={5}
                    step={0.5}
                    sx={styles.slider}
                    valueLabelFormat={(value) => `${value} Stars`}
                  />
                  <Box sx={styles.ratingContainer}>
                    <Rating
                      value={ratingFilter}
                      precision={0.5}
                      onChange={handleRatingChange}
                      emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
                    />
                    <Typography sx={styles.ratingValue}>
                      {ratingFilter > 0 ? `${ratingFilter}+ Stars` : "Any Rating"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Drawer>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
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
              <Button variant="contained" size="small" onClick={handleAddToCart}>Add To Cart</Button>
            </Badge>
          </div>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
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
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(project._id)}
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
                      <Box sx={{ display: 'flex', gap: 2, mt: 1, ml: 1 }}>
                        <Button
                          variant="contained"
                          sx={styles.checkoutButton}
                          onClick={() => navigate(`/movie/${project._id}`)}
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              );
            })}
          </Box>


        </Box>
      )}
    </>
  )
}

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

const contentCategoryOptions = [
  { name: 'Feature Film', id: 1 },
  { name: 'TV Show', id: 2 },
  { name: 'Docu Series', id: 3 },
  { name: 'Web Series', id: 4 },
  { name: 'Kids Content', id: 5 },
  { name: 'Vertical Drama', id: 6 },
  { name: 'Micro Drama', id: 7 },
  { name: 'Documentary', id: 8 },
  { name: 'Short Film', id: 9 },
  { name: 'Animation', id: 10 },
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

