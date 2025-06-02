import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Link } from "@mui/material";

const Breadcrumb = ({ items }) => {
  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index < items.length - 1 ? (
            <Link
              component="button"
              onClick={() => handleClick(item.path)}
              sx={{
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "0.875rem",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {item.label}
            </Link>
          ) : (
            <Typography
              sx={{
                color: "#ffffff",
                fontSize: "0.875rem",
              }}
            >
              {item.label}
            </Typography>
          )}
          {index < items.length - 1 && (
            <Typography
              sx={{
                margin: "0 8px",
                color: "#a0a0b0",
                fontSize: "0.875rem",
              }}
            >
              /
            </Typography>
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default Breadcrumb;