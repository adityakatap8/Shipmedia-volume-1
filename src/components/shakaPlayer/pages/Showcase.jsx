import { useState, useEffect, useRef } from "react";
import { PlayerMenu } from "../components/PlayerMenu.jsx";
import { useToast } from "../components/ui/use-toast.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Search from "./Search.jsx";
import Categories from "./Categories.jsx";
import { useSelector } from "react-redux";
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
} from "@mui/material"
import {
  Search as SearchIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  TuneOutlined as TuneIcon,
  Close as CloseIcon,
  Star as StarIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from "@mui/icons-material"



export default function MovieGrid() {
  const { orgName } = useSelector((state) => state.auth.user.user)
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


  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [projectData, setProjectData] = useState([]);
  const [specificationsData, setSpecificationsData] = useState([]);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState('');
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);


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


  const [projectIds, setProjectIds] = useState([]);
  console.log("projectIds", projectIds)
  const [movieDataMap, setMovieDataMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);





  // Extract unique genres and years
  const allGenres = Array.from(
    new Set(
      Object.values(movieDataMap)
        .flatMap((project) => project.specificationsInfoData?.genres || []) // Get genres from specificationsInfoData
        .map((genre) => genre.toLowerCase()) // Convert to lowercase to avoid case issues
    )
  );




  const allYears = [...new Set(
    Object.values(movieDataMap)
      .map((project) => {
        const date = project?.specificationsInfoData?.completionDate;
        const parsedYear = date && !isNaN(new Date(date)) ? new Date(date).getFullYear() : null;
        return parsedYear;
      })
      .filter((year) => typeof year === "number")
  )].sort((a, b) => b - a); // Descending order

  console.log('Raw Dates:', Object.values(movieDataMap).map(p => p?.specificationsInfoData?.completionDate));
  console.log('Extracted Years:', allYears);



  // Count movies for each filter
  // Calculate the genre counts based on movieDataMap
  const genreCounts = allGenres.reduce((acc, genre) => {
    // Count how many projects have the given genre
    const count = Object.values(movieDataMap).reduce((total, project) => {
      if (project.specificationsInfoData?.genres?.includes(genre)) {
        total++;
      }
      return total;
    }, 0);
    acc[genre] = count; // Store count for each genre
    return acc;
  }, {});


  const yearCounts = allYears.reduce((acc, year) => {
    acc[year] = Object.values(movieDataMap).filter((project) => {
      const date = project?.specificationsInfoData?.completionDate;
      const projectYear = date && !isNaN(new Date(date)) ? new Date(date).getFullYear() : null;
      return projectYear === year;
    }).length;
    return acc;
  }, {});
  
  



  const allUserIds = useRef([]);

  useEffect(() => {
    const token = Cookies.get('token');

    if (!user?.userId || !token) return;

    axios
      .get(`http://localhost:3000/api/projects/${user.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log("response====", response.data)
        setProjectData(response.data);
        fetchProjectInfoForProjects(response.data);

        // Collect unique userIds
        const userIds = response.data.map(project => project.userId);
        const uniqueUserIds = [...new Set(userIds)];
        allUserIds.current = uniqueUserIds;
        console.log('All unique user IDs:', allUserIds.current);

        // Collect project IDs for next useEffect
        const ids = response.data.map(project => project._id); // or project.projectId depending on your schema
        setProjectIds(ids);
      })
      .catch((err) => {
        console.error('Error fetching projects:', err.response?.data || err.message);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch projects.',
        });
      });
  }, [user?.userId, toast]);

  // 🚀 Second useEffect: Fetch data based on collected projectIds
  useEffect(() => {
    if (!projectIds.length) return;

    const fetchMovieData = async () => {
      setIsLoading(true);
      const dataMap = {};

      try {
        for (const projectId of projectIds) {
          try {
            const response = await axios.get(
              `http://localhost:3000/api/project-form/data/${projectId}`,
              {
                withCredentials: true,
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            console.log("response=====>", response)

            if (response.status === 200) {
              console.log(`🎬 Data for project ${projectId}:`, response.data);
              dataMap[projectId] = response.data;
            } else {
              console.warn(`⚠️ Failed to load data for project ${projectId}`);
            }
          } catch (err) {
            console.error(`❌ Error fetching data for project ${projectId}:`, err);
          }
        }

        setMovieDataMap(dataMap);

        // 🔍 Optionally, log current user's data if project belongs to them
        const currentUserProjects = Object.entries(dataMap).filter(
          ([_, data]) => data.userId === user.userId
        );
        console.log(`🎯 Current user's project data:`, currentUserProjects);

      } catch (error) {
        console.error("Error fetching movie data for projects:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load project details.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, [projectIds]);


  const fetchProjectInfoForProjects = async (projects) => {
    try {
      const token = Cookies.get("token"); // Make sure js-cookie is imported

      const projectInfoResponses = await Promise.all(
        projects.map((project) =>
          axios.get(`http://localhost:3000/api/folders/project-info/${project._id}`, {
            withCredentials: true, // Send cookies with the request (including JWT cookie)
            headers: {
              'Authorization': `Bearer ${token}`, // Add token in header
              'Content-Type': 'application/json',
            },
          })
        )
      );

      const projectInfos = projectInfoResponses.map((response) => ({
        projectId: response.data?._id,
        projectTitle: response.data?.projectTitle,
        projectPoster: response.data?.projectPoster,
        trailerFile: response.data?.trailerFile,
      }));

      setSpecificationsData(projectInfos);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch project info data for projects.",
      });
      console.error("Fetch error:", error.response?.data || error.message);
    }
  };



  const handleGenreFilter = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre)); // Remove genre
    } else {
      setSelectedGenres([...selectedGenres, genre]); // Add genre
    }
  };

  const handleYearFilter = (year) => {
    if (selectedYears.includes(year)) {
      setSelectedYears(selectedYears.filter((y) => y !== year))
    } else {
      setSelectedYears([...selectedYears, year])
    }
  }

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue)
  }

  const handleRatingChange = (event, newValue) => {
    setRatingFilter(newValue)
  }

  const handleSortChange = (option) => {
    setSortOption(option)
    setSortAnchorEl(null)
  }

  const clearFilters = () => {
    setSelectedGenres([])
    setSelectedYears([])

    setRatingFilter(0)
  }

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

  // Apply filters and sorting
  useEffect(() => {
    let result = [...movies]

    // Apply genre filter
    if (selectedGenres.length > 0) {
      result = result.filter((movie) => selectedGenres.includes(movie.genre))
    }

    // Apply year filter
    if (selectedYears.length > 0) {
      result = result.filter((movie) => selectedYears.includes(movie.year))
    }

    // Apply price range filter
    result = result.filter((movie) => movie.price >= priceRange[0] && movie.price <= priceRange[1])

    // Apply rating filter
    if (ratingFilter > 0) {
      result = result.filter((movie) => movie.rating >= ratingFilter)
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "year":
        result.sort((a, b) => b.year - a.year)
        break
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        // Featured - no sorting
        break
    }

    setFilteredMovies(result)

    // Count active filters
    let count = 0
    if (selectedGenres.length > 0) count += selectedGenres.length
    if (selectedYears.length > 0) count += selectedYears.length

    if (ratingFilter > 0) count++
    setActiveFiltersCount(count)
  }, [selectedGenres, selectedYears, ratingFilter, sortOption])



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
      marginBottom:"30px"
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
      width: "16.666%", // Exactly 6 items per row
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
      paddingTop: "120%", // 2:3 aspect ratio for movie posters
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
      marginLeft:'10px'
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
      marginRight:'10px'
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
      marginBottom:"30px",
      paddingBottom:"30px"
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
      marginBottom: "24px",
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


  // Fetch project data
  useEffect(() => {
    const token = Cookies.get('token'); // get the token from cookies

    if (!user?.userId || !token) return;

    axios
      .get(`http://localhost:3000/api/projects/${user.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // add the token to the Authorization header
        },
        withCredentials: true, // include credentials if needed for CORS
      })
      .then((response) => {
        setProjectData(response.data);
        fetchProjectInfoForProjects(response.data);
      })
      .catch((err) => {
        console.error('Error fetching projects:', err.response?.data || err.message);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch projects.',
        });
      });
  }, [user?.userId, toast]);

  // const fetchProjectInfoForProjects = async (projects) => {
  //   try {
  //     const token = Cookies.get("token"); // Make sure js-cookie is imported

  //     const projectInfoResponses = await Promise.all(
  //       projects.map((project) =>
  //         axios.get(`http://localhost:3000/api/folders/project-info/${project._id}`, {
  //           withCredentials: true, // Send cookies with the request (including JWT cookie)
  //           headers: {
  //             'Authorization': `Bearer ${token}`, // Add token in header
  //             'Content-Type': 'application/json',
  //           },
  //         })
  //       )
  //     );

  //     const projectInfos = projectInfoResponses.map((response) => ({
  //       projectId: response.data?._id,
  //       projectTitle: response.data?.projectTitle,
  //       projectPoster: response.data?.projectPoster,
  //       trailerFile: response.data?.trailerFile,
  //     }));

  //     setSpecificationsData(projectInfos);
  //   } catch (error) {
  //     toast({
  //       variant: "destructive",
  //       title: "Error",
  //       description: "Failed to fetch project info data for projects.",
  //     });
  //     console.error("Fetch error:", error.response?.data || error.message);
  //   }
  // };


  // Get display text for sort option
  const getSortDisplayText = () => {
    switch (sortOption) {
      //   case "price-low":
      //     return "Price: Low to High"
      //   case "price-high":
      //     return "Price: High to Low"
      case "rating":
        return "Top Rated"
      case "year":
        return "Newest"
      case "title":
        return "Title A-Z"
      default:
        return "Featured"
    }
  }

  return (
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
                sx={sortOption === "featured" ? styles.sortItemActive : styles.sortItem}
                onClick={() => handleSortChange("featured")}
              >
                Featured
              </Box>

              <Box
                sx={sortOption === "rating" ? styles.sortItemActive : styles.sortItem}
                onClick={() => handleSortChange("rating")}
              >
                Top Rated
              </Box>
              <Box
                sx={sortOption === "year" ? styles.sortItemActive : styles.sortItem}
                onClick={() => handleSortChange("year")}
              >
                Newest
              </Box>
              <Box
                sx={sortOption === "title" ? styles.sortItemActive : styles.sortItem}
                onClick={() => handleSortChange("title")}
              >
                Title A-Z
              </Box>
            </Box>
          </Box>
        </Popover>

        {/* Genre Button */}
        <Button
          sx={selectedGenres.length > 0 ? styles.filterButtonActive : styles.filterButton}
          onClick={handleGenreClick}
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
          onClose={handleGenreClose}
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
                <Button size="small" sx={styles.clearButton} onClick={() => setSelectedGenres([])}>
                  Clear
                </Button>
              )}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {allGenres.map((genre) => (
                <Chip
                  key={genre}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {genre}
                      <Box component="span" sx={styles.countBadge}>
                        {genreCounts[genre] || 0} {/* Default to 0 if no count exists */}
                      </Box>
                    </Box>
                  }
                  onClick={() => handleGenreFilter(genre)}
                  sx={selectedGenres.includes(genre) ? styles.popoverChipActive : styles.popoverChip}
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
          Year
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
                <Button size="small" sx={styles.clearButton} onClick={() => setSelectedYears([])}>
                  Clear
                </Button>
              )}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {allYears.map((year) => (
                <Chip
                  key={year}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {year}
                      <Box component="span" sx={styles.countBadge}>
                        {yearCounts[year]}
                      </Box>
                    </Box>
                  }
                  onClick={() => handleYearFilter(year)}
                  sx={selectedYears.includes(year) ? styles.popoverChipActive : styles.popoverChip}
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
              {allGenres.map((genre) => (
                <Chip
                  key={genre}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {genre}
                      <Box component="span" sx={styles.countBadge}>
                        {genreCounts[genre]}
                      </Box>
                    </Box>
                  }
                  onClick={() => handleGenreFilter(genre)}
                  sx={selectedGenres.includes(genre) ? styles.popoverChipActive : styles.popoverChip}
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
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {year}
                      <Box component="span" sx={styles.countBadge}>
                        {yearCounts[year]}
                      </Box>
                    </Box>
                  }
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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
        {Object.values(movieDataMap).map((project) => {
          console.log("🔍 Project data in map:", project); // Add log here

          const title = project?.projectInfoData?.projectTitle || "Untitled Project";
          const poster = project?.projectInfoData?.posterFileName;
          const logoImageURL = poster
            ? `https://mediashippers-filestash.s3.eu-north-1.amazonaws.com/${orgName}/${encodeURIComponent(title)}/film+stills/${poster}`
            : defaultPoster;

          const genre = project?.specificationsInfoData?.genres || "Unknown Genre";
          const completionDate = project?.specificationsInfoData?.completionDate;
          const year = completionDate ? new Date(completionDate).getFullYear() : "N/A";
          const rating = project?.rating || 0;

          return (
            <Box key={project._id} sx={responsiveStyles.movieItem}>
              <Card sx={styles.card} elevation={0}>
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
                  {/* <Rating
                    value={rating}
                    precision={0.5}
                    size="small"
                    readOnly
                    sx={{ marginTop: "4px", marginBottom: "8px" }}
                  /> */}
                  <Box sx={{ display: 'flex', gap:2, mt: 1, ml:1 }}>
                    <Button
                      variant="contained"
                      sx={styles.checkoutButton}
                      onClick={() => navigate(`/movie/${project.projectInfoData?._id}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      sx={styles.checkoutButton}
                      onClick={() => handleAddToCart(project)}
                    >
                      Add to Cart
                    </Button>
                  </Box>


                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>


    </Box>
  )
}

