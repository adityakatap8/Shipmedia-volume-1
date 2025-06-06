import { useState, useEffect, useContext } from "react"
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Breadcrumbs,
  Link,
  Paper,
  Grid,
  IconButton,
  InputAdornment,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material"
import {
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Download as DownloadIcon,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
} from "@mui/icons-material"
import { UserContext } from '../../contexts/UserContext';
import Loader from "../loader/Loader";

export default function S3Browser() {
  const [currentPath, setCurrentPath] = useState([]);
  const [currentItems, setCurrentItems] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table");
  const [progress, setProgress] = useState(0);

  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth.user);

  // Initialize currentPath when orgName is available
  useEffect(() => {
    if (user.orgName) {
      setCurrentPath(["mediashippers-filestash", user.orgName]);
    }
  }, [user.orgName]);

  // Fetch data when currentPath changes
  useEffect(() => {
    if (currentPath.length > 0) {
      fetchData();
    }
  }, [currentPath]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const path = currentPath.join('/');
      const response = await axios.post('https://media-shippers-backend.vercel.app/api/folders/s3-list', 
        { path },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      if (response.data) {
        setCurrentItems({
          ...response.data.folders.reduce((acc, folder) => {
            acc[folder] = { type: "folder", children: {} };
            return acc;
          }, {}),
          ...response.data.files.reduce((acc, fileName) => {
            acc[fileName] = { type: "file" };
            return acc;
          }, {})
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        dispatch({ type: 'CLEAR_AUTH_TOKEN' });
        window.location.href = '/login';
      }
    }
    setLoading(false);
  };

  // Navigate to a specific path
  const navigateTo = (path) => {
    setCurrentPath(path);
    setSearchTerm("");
    setSearchResults([]);
    setIsSearching(false);
  };

  // Navigate to a specific folder
  const openFolder = (folderName) => {
    navigateTo([...currentPath, folderName]);
  };

  // Navigate up one level
  const goBack = () => {
    if (currentPath.length > 1) {
      navigateTo(currentPath.slice(0, -1));
    }
  };

  // Navigate to root
  const goHome = () => {
    navigateTo(["mediashippers-filestash", orgName]);
  };

  // Download a file
  const downloadFile = async (fileName) => {
    try {
      const fullFilePath = `s3://${currentPath.join('/')}/${fileName}`;
      const response = await axios.post('https://media-shippers-backend.vercel.app/api/folders/download-files', 
        { files: [fullFilePath] },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.urls && response.data.urls.length > 0) {
        const url = response.data.urls[0];
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Error downloading file');
    }
  };

  // Handle view mode change
  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  // Search for folders and files
  const handleSearch = (term) => {
    setSearchTerm(term);

    if (!term.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setLoading(true);

    const results = [];

    // Search in current items
    Object.entries(currentItems).forEach(([key, value]) => {
      if (key.toLowerCase().includes(term.toLowerCase())) {
        results.push({
          name: key,
          path: [...currentPath, key],
          type: value.type,
          size: value.type === "file" ? value.size : null,
        });
      }
    });

    setSearchResults(results);
    setLoading(false);
  };

  // Render grid view
  const renderGridView = (items, isSearchResults = false) => {
    return (
      <Grid container spacing={2}>
        {items.map(([name, details], index) => {
          // Determine file type and color for the chip
          let fileType = "Folder"
          let chipColor = "#ffca28"
          let chipBgColor = "rgba(255, 202, 40, 0.15)"

          if (details.type === "file") {
            const extension = name.split(".").pop()?.toLowerCase() || ""
            if (["jpg", "jpeg", "png", "gif", "svg"].includes(extension)) {
              fileType = "Image"
              chipColor = "#4caf50"
              chipBgColor = "rgba(76, 175, 80, 0.15)"
            } else if (["mp4", "avi", "mov", "wmv"].includes(extension)) {
              fileType = "Video"
              chipColor = "#f44336"
              chipBgColor = "rgba(244, 67, 54, 0.15)"
            } else if (["mp3", "wav", "ogg"].includes(extension)) {
              fileType = "Audio"
              chipColor = "#9c27b0"
              chipBgColor = "rgba(156, 39, 176, 0.15)"
            } else if (["pdf"].includes(extension)) {
              fileType = "PDF"
              chipColor = "#f44336"
              chipBgColor = "rgba(244, 67, 54, 0.15)"
            } else if (["doc", "docx"].includes(extension)) {
              fileType = "Word"
              chipColor = "#2196f3"
              chipBgColor = "rgba(33, 150, 243, 0.15)"
            } else if (["xls", "xlsx"].includes(extension)) {
              fileType = "Excel"
              chipColor = "#4caf50"
              chipBgColor = "rgba(76, 175, 80, 0.15)"
            } else if (["ppt", "pptx"].includes(extension)) {
              fileType = "PowerPoint"
              chipColor = "#ff9800"
              chipBgColor = "rgba(255, 152, 0, 0.15)"
            } else if (["zip", "rar", "7z"].includes(extension)) {
              fileType = "Archive"
              chipColor = "#795548"
              chipBgColor = "rgba(121, 85, 72, 0.15)"
            } else {
              fileType = extension.toUpperCase() || "File"
              chipColor = "#90caf9"
              chipBgColor = "rgba(144, 202, 249, 0.15)"
            }
          }

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Paper
                sx={{
                  p: 0,
                  bgcolor: "#234976",
                  display: "flex",
                  flexDirection: "column",
                  cursor: details.type === "folder" ? "pointer" : "default",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "#334155",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                  },
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 2,
                  height: "100%",
                  minHeight: 220,
                }}
                onClick={() => {
                  if (details.type === "folder") {
                    if (isSearchResults) {
                      navigateTo(details.path.slice(0, -1))
                      setTimeout(() => openFolder(details.path[details.path.length - 1]), 100)
                    } else {
                      openFolder(name)
                    }
                  }
                }}
              >
                {/* Top colored band based on file type */}
                <Box
                  sx={{
                    height: 8,
                    width: "100%",
                    bgcolor: chipColor,
                  }}
                />

                {/* Content area */}
                <Box sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    {/* File type chip */}
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 4,
                        fontSize: "0.75rem",
                        fontWeight: "medium",
                        color: chipColor,
                        bgcolor: chipBgColor,
                      }}
                    >
                      {fileType}
                    </Box>

                    {details.type === "file" && (
                      <Tooltip title="Download">
                        <IconButton
                          size="small"
                          sx={{
                            color: "#64b5f6",
                            "&:hover": {
                              color: "white",
                              bgcolor: "rgba(100, 181, 246, 0.2)",
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            downloadFile(name)
                          }}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>

                  {/* Icon */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      my: 1.5,
                    }}
                  >
                    {details.type === "folder" ? (
                      <FolderIcon sx={{ fontSize: 64, color: "#ffca28" }} />
                    ) : (
                      <FileIcon sx={{ fontSize: 64, color: "#90caf9" }} />
                    )}
                  </Box>

                  {/* Name and info */}
                  <Box sx={{ mt: "auto" }}>
                    <Typography
                      sx={{
                        width: "100%",
                        fontSize: "0.95rem",
                        fontWeight: "medium",
                        textAlign: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {name}
                    </Typography>

                    {details.type === "file" && (
                      <Typography
                        variant="caption"
                        color="#90caf9"
                        sx={{
                          fontSize: "0.75rem",
                          mt: 0.5,
                          display: "block",
                          textAlign: "center",
                        }}
                      >
                        {details.size}
                      </Typography>
                    )}

                    {isSearchResults && (
                      <Typography
                        variant="caption"
                        color="#90caf9"
                        sx={{
                          fontSize: "0.7rem",
                          mt: 1,
                          display: "block",
                          textAlign: "center",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {details.path.slice(0, -1).join(" / ")}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    )
  }

  // Render list view
  const renderListView = (items, isSearchResults = false) => {
    return (
      <List sx={{ bgcolor: "#1a1a2e", borderRadius: 1 }}>
        {items.map(([name, details], index) => (
          <Box key={index}>
            <ListItem
              disablePadding
              secondaryAction={
                details.type === "file" && (
                  <Tooltip title="Download">
                    <IconButton
                      edge="end"
                      aria-label="download"
                      onClick={() => downloadFile(name)}
                      sx={{
                        color: "#64b5f6",
                        "&:hover": {
                          color: "white",
                        },
                      }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                )
              }
            >
              <ListItemButton
                onClick={() => {
                  if (details.type === "folder") {
                    if (isSearchResults) {
                      navigateTo(details.path.slice(0, -1))
                      setTimeout(() => openFolder(details.path[details.path.length - 1]), 100)
                    } else {
                      openFolder(name)
                    }
                  } else {
                    // For files, do nothing as we have the download button
                  }
                }}
                sx={{
                  "&:hover": {
                    bgcolor: "#334155",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {details.type === "folder" ? (
                    <FolderIcon sx={{ color: "#ffca28" }} />
                  ) : (
                    <FileIcon sx={{ color: "#90caf9" }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={name}
                  secondary={
                    <>
                      {details.type === "file" && details.size}
                      {isSearchResults && (
                        <Typography
                          variant="caption"
                          component="div"
                          sx={{
                            color: "#90caf9",
                            fontSize: "0.7rem",
                          }}
                        >
                          Path: {details.path.slice(0, -1).join(" / ")}
                        </Typography>
                      )}
                    </>
                  }
                  primaryTypographyProps={{
                    sx: {
                      color: "white",
                    },
                  }}
                  secondaryTypographyProps={{
                    sx: {
                      color: "#90caf9",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
            {index < items.length - 1 && <Divider sx={{ bgcolor: "#334155", opacity: 0.3 }} />}
          </Box>
        ))}
      </List>
    )
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        color: "white",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        boxSizing: "border-box",
        margin: 0,
        padding: 0,
      }}
    >

        {/* Search Bar */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search folders and files..."
          value={searchTerm}
          type="search"
          onChange={(e) => handleSearch(e.target.value)}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              bgcolor: "#1a1a2e",
              color: "white",
              "& fieldset": {
                borderColor: "#334155",
              },
              "&:hover fieldset": {
                borderColor: "#4d96da",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#64b5f6",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#90caf9",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#90caf9" }} />
              </InputAdornment>
            ),
            endAdornment:
              isSearching && loading ? (
                <InputAdornment position="end">
                  <Loader size={24} color="inherit" />
                </InputAdornment>
              ) : null,
          }}
        />

        {/* Breadcrumbs Navigation */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            bgcolor: "#1a1a2e",
            borderRadius: 1,
            overflowX: "auto",
            "&::-webkit-scrollbar": {
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#132f4c",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#334155",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#4d96da",
            },
          }}
        >
          <IconButton onClick={goBack} disabled={currentPath.length <= 1} sx={{ color: "white", mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>

          <IconButton onClick={goHome} sx={{ color: "white", mr: 1 }}>
            <HomeIcon />
          </IconButton>

          <Breadcrumbs
            separator="›"
            aria-label="breadcrumb"
            sx={{
              mt: '13px',
              color: "#90caf9",
              "& .MuiBreadcrumbs-separator": {
                color: "#64b5f6",
              },
            }}
          >
            {currentPath.map((segment, index) => {
              const isLast = index === currentPath.length - 1
              const pathToHere = currentPath.slice(0, index + 1)

              return isLast ? (
                <Typography key={index} color="white" fontWeight="bold">
                  {segment}
                </Typography>
              ) : (
                <Link
                  key={index}
                  component="button"
                  underline="hover"
                  color="#90caf9"
                  onClick={() => navigateTo(pathToHere)}
                  sx={{
                    "&:hover": {
                      color: "white",
                    },
                  }}
                >
                  {segment}
                </Link>
              )
            })}
          </Breadcrumbs>

          {/* View Mode Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
            sx={{
              mr:'9px',
              ml: "auto",
              "& .MuiToggleButton-root": {
                color: "#90caf9",
                borderColor: "#334155",
                "&.Mui-selected": {
                  color: "white",
                  bgcolor: "#334155",
                },
                "&:hover": {
                  bgcolor: "rgba(45, 109, 163, 0.2)",
                },
              },
            }}
          >
            <ToggleButton value="list" aria-label="list view">
              <ListViewIcon />
            </ToggleButton>
            <ToggleButton value="grid" aria-label="grid view">
              <GridViewIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Content Area */}
        <Paper
          sx={{
            bgcolor: "#1a1a2e",
            p: 2,
            borderRadius: 1,
            minHeight: "400px",
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <Loader />
            </Box>
          ) : isSearching ? (
            // Search Results
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Search Results for "{searchTerm}"
              </Typography>

              {searchResults.length === 0 ? (
                <Typography color="#90caf9">No results found</Typography>
              ) : viewMode === "grid" ? (
                renderGridView(
                  searchResults.map((item) => [
                    item.name,
                    {
                      type: item.type,
                      size: item.size,
                      path: item.path,
                    },
                  ]),
                  true,
                )
              ) : (
                renderListView(
                  searchResults.map((item) => [
                    item.name,
                    {
                      type: item.type,
                      size: item.size,
                      path: item.path,
                    },
                  ]),
                  true,
                )
              )}
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{ color:"#fff" }}>
                Folder: {currentPath[currentPath.length - 1]}
              </Typography>

              {Object.keys(currentItems).length === 0 ? (
                <Typography color="#90caf9">This folder is empty</Typography>
              ) : viewMode === "grid" ? (
                renderGridView(Object.entries(currentItems))
              ) : (
                renderListView(Object.entries(currentItems))
              )}
            </>
          )}
        </Paper>
    </Box>
  )
}
