import { Controller } from "react-hook-form"
import {
    TextField,
    Typography,
    Box,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
} from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"
import EmailIcon from "@mui/icons-material/Email"
import LockIcon from "@mui/icons-material/Lock"

function UserDetails({ control, errors }) {

    const inputStyle = {
        backgroundColor: "#333",
        color: "#fff",
        border: "1px solid #555",
        borderRadius: "4px",
        padding: "10px 12px 10px 40px",
        fontSize: "16px",
        width: "100%",
        outline: "none",
    };

    const labelStyle = {
        color: "#aaa",
        marginBottom: "4px",
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "left",
        display: "block",
    };

    const errorText = {
        color: "#f44336",
        fontSize: "12px",
        marginTop: "4px",
        textAlign: 'left',
        display: "block"
    };

    const iconContainer = {
        position: "absolute",
        top: "50%",
        left: "12px",
        transform: "translateY(-50%)",
        color: "#aaa",
    };

    const inputWrapper = {
        position: "relative",
    };

    return (
        <Box style={{ marginBottom: "24px", maxWidth: "700px", margin: "auto" }}>
            <Typography
                variant="h6"
                style={{
                    color: "#F26430",
                    fontWeight: 600,
                }}
            >
                User Account Information
            </Typography>
            <Box style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                <Controller
                    name="userName"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <label style={labelStyle}>User Name</label>
                            <div style={inputWrapper}>
                                <PersonIcon style={iconContainer} />
                                <input
                                    {...field}
                                    type="text"
                                    placeholder="Enter user name"
                                    style={inputStyle}
                                />
                            </div>
                            {errors.userName && <p style={errorText}>{errors.userName.message}</p>}
                        </div>
                    )}
                />

                <Controller
                    name="userEmail"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <label style={labelStyle}>User Email</label>
                            <div style={inputWrapper}>
                                <EmailIcon style={iconContainer} />
                                <input
                                    {...field}
                                    type="text"
                                    placeholder="Enter user email"
                                    style={inputStyle}
                                />
                            </div>
                            {errors.userEmail && <p style={errorText}>{errors.userEmail.message}</p>}
                        </div>
                    )}
                />


                <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                        <div style={{ marginBottom: "16px" }}>
                            <label
                                htmlFor="role"
                                style={{
                                    color: "#aaa",
                                    fontWeight: "bold",
                                    display: "block",
                                    marginBottom: "6px",
                                    textAlign: "left"
                                }}
                            >
                                User Role
                            </label>
                            <select
                                {...field}
                                id="role"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "1px solid #444",
                                    borderRadius: "4px",
                                    backgroundColor: "#333",
                                    color: "white",
                                    fontSize: "16px",
                                    outline: "none",
                                }}
                            >
                                <option value="">Select a role</option>
                                <option value="Admin">Admin</option>
                                <option value="Seller">Seller</option>
                                <option value="Buyer">Buyer</option>
                            </select>
                            {errors.role && (
                                <p style={{ color: "#f44336", fontSize: "12px", marginTop: "4px", textAlign:"left" }}>
                                    {errors.role.message}
                                </p>
                            )}
                        </div>
                    )}
                />

                <Box
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "16px",
                    }}
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <label style={labelStyle}>User Password</label>
                                <div style={inputWrapper}>
                                    <LockIcon style={iconContainer} />
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="Enter user password"
                                        style={inputStyle}
                                    />
                                </div>
                                {errors.password && <p style={errorText}>{errors.password.message}</p>}
                            </div>
                        )}
                    />

                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <label style={labelStyle}>Confirm Password</label>
                                <div style={inputWrapper}>
                                    <LockIcon style={iconContainer} />
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="Enter user confirmPassword"
                                        style={inputStyle}
                                    />
                                </div>
                                {errors.confirmPassword && <p style={errorText}>{errors.confirmPassword.message}</p>}
                            </div>
                        )}
                    />
                </Box>
            </Box>
        </Box>
    )
}

export default UserDetails
