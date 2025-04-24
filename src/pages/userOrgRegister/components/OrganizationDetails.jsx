import { Controller } from "react-hook-form"
import { TextField, Typography, Box, InputAdornment } from "@mui/material"
import BusinessIcon from "@mui/icons-material/Business"
import ArticleIcon from "@mui/icons-material/Article"
import TagIcon from "@mui/icons-material/Tag"


function OrganizationDetails({ control, errors }) {

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
        <Box style={{ marginBottom: "24px", maxWidth:"700px", margin:"auto" }}>
            <Typography
                variant="h6"
                style={{
                    color: "#F26430",
                    fontWeight: 600,
                }}
            >
                Organization Information
            </Typography>

            <Box style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <Controller
                    name="orgName"
                    control={control}
                    rules={{ required: "Organization name is required" }}
                    render={({ field }) => (
                        <div>
                            <label style={labelStyle}>Organization Name</label>
                            <div style={inputWrapper}>
                                <BusinessIcon style={iconContainer} />
                                <input
                                    {...field}
                                    type="text"
                                    placeholder="Enter organization name"
                                    style={inputStyle}
                                />
                            </div>
                            {errors.orgName && <p style={errorText}>{errors.orgName.message}</p>}
                        </div>
                    )}
                />

                {/* Organization Address */}
                <Controller
                    name="orgAddress"
                    control={control}
                    rules={{ required: "Address is required" }}
                    render={({ field }) => (
                        <div>
                            <label style={labelStyle}>Organization Address</label>
                            <textarea
                                {...field}
                                rows={4}
                                placeholder="Enter complete address"
                                style={{ ...inputStyle, padding: "12px" }}
                            />
                            {errors.orgAddress && <p style={errorText}>{errors.orgAddress.message}</p>}
                        </div>
                    )}
                />

                {/* Corporate Reg & GST */}
                <Box
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "16px",
                    }}
                >
                    <Controller
                        name="orgCorpRegNo"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <label style={labelStyle}>Corporate Registration Number</label>
                                <div style={inputWrapper}>
                                    <ArticleIcon style={iconContainer} />
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="Enter registration number"
                                        style={inputStyle}
                                    />
                                </div>
                                {errors.orgCorpRegNo && (
                                    <p style={errorText}>{errors.orgCorpRegNo.message}</p>
                                )}
                            </div>
                        )}
                    />

                    <Controller
                        name="orgGstNo"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <label style={labelStyle}>GST Number</label>
                                <div style={inputWrapper}>
                                    <TagIcon style={iconContainer} />
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="Enter GST number"
                                        style={inputStyle}
                                    />
                                </div>
                                {errors.orgGstNo && <p style={errorText}>{errors.orgGstNo.message}</p>}
                            </div>
                        )}
                    />
                </Box>
            </Box>
        </Box>
    )
}

export default OrganizationDetails
