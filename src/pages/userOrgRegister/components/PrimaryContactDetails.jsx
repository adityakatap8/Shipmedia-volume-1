import { Controller } from "react-hook-form"
import { TextField, Typography, Box, InputAdornment } from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"

function PrimaryContactDetails({ control, errors }) {

    const labelStyle = {
        color: "#aaa",
        marginBottom: "4px",
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "left",
        display: "block",
      };
      
      const inputStyle = {
        backgroundColor: "#333",
        border: "1px solid #555",
        borderRadius: "4px",
        padding: "12px",
        color: "white",
        width: "100%",
      };
      
      const errorStyle = {
        color: "#f44336",
        fontSize: "12px",
        marginTop: "4px",
        textAlign: 'left',
        display: "block"
      };

  return (
    <Box style={{ marginBottom: "24px", maxWidth:"700px", margin: "auto" }}>
  <Typography
    variant="h6"
    style={{
      color: "#F26430",
      fontWeight: 600,
    }}
  >
    Primary Contact Information
  </Typography>

  <Box style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
    <Controller
      name="primaryName"
      control={control}
      render={({ field }) => (
        <div>
          <label style={labelStyle}>Primary Contact Name</label>
          <input
            {...field}
            type="text"
            placeholder="Enter contact person's name"
            style={inputStyle}
          />
          {errors.primaryName && (
            <p style={errorStyle}>{errors.primaryName.message}</p>
          )}
        </div>
      )}
    />

    <Controller
      name="primaryEmail"
      control={control}
      render={({ field }) => (
        <div>
          <label style={labelStyle}>Primary Contact Email</label>
          <input
            {...field}
            type="email"
            placeholder="Enter contact email"
            style={inputStyle}
          />
          {errors.primaryEmail && (
            <p style={errorStyle}>{errors.primaryEmail.message}</p>
          )}
        </div>
      )}
    />

    <Controller
      name="primaryNo"
      control={control}
      render={({ field }) => (
        <div>
          <label style={labelStyle}>Primary Contact Number</label>
          <input
            {...field}
            type="text"
            placeholder="Enter contact phone number"
            style={inputStyle}
          />
          {errors.primaryNo && (
            <p style={errorStyle}>{errors.primaryNo.message}</p>
          )}
        </div>
      )}
    />
  </Box>
</Box>
  )
}

export default PrimaryContactDetails
