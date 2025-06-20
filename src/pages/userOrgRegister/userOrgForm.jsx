import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardHeader, Typography, Tabs, Tab, Box, Button, CircularProgress } from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import PrimaryContactDetails from "./components/PrimaryContactDetails"
import UserDetails from "./components/UserDetails"
import DocumentUpload from "./components/DocumentUpload"
import OrganizationDetails from "./components/OrganizationDetails"
import axios from "axios"
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Breadcrumb from "../../components/breadcrumb/Breadcrumb"; // Import Breadcrumb

const formSchema = z
    .object({
        // Organization details
        orgName: z.string().min(2, { message: "Organization name is required" }),
        orgAddress: z.string().min(5, { message: "Organization address is required" }),
        orgCorpRegNo: z.string().min(1, { message: "Corporate registration number is required" }),
        orgGstNo: z.string().min(1, { message: "GST number is required" }),

        // Primary contact details
        primaryName: z.string().min(2, { message: "Primary contact name is required" }),
        primaryEmail: z.string().email({ message: "Invalid email address" }),
        primaryNo: z.string().min(10, { message: "Valid phone number is required" }),

        // User details
        userName: z.string().min(2, { message: "User name is required" }),
        userEmail: z.string().email({ message: "Invalid email address" }),
        role: z.string().min(1, { message: "Role is required" }),
        password: z.string().min(8, { message: "Password must be at least 8 characters" }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

function UserOrgManagement() {
    const navigate = useNavigate(); // Initialize useNavigate
    const [activeTab, setActiveTab] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [files, setFiles] = useState({
        orgCorpPdf: null,
        orgGstPdf: null,
        orgAgreementPdf: null,
    })

    const breadcrumbItems = [
        { label: "Users", path: "/users-list" },
        { label: "Organization Registration", path: "/user-org-register" },
    ];

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        watch,
    } = useForm({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            orgName: "",
            orgAddress: "",
            orgCorpRegNo: "",
            orgGstNo: "",
            primaryName: "",
            primaryEmail: "",
            primaryNo: "",
            userName: "",
            userEmail: "",
            role: "",
            password: "",
            confirmPassword: "",
        },
    })

    // Watch all form values for debugging
    const formValues = watch()
    console.log("Current form values:", formValues)

    const onSubmit = async (values) => {
        setIsSubmitting(true)
        try {
            // Log form values for debugging
            console.log("Form values:", values)
            
            // Check for validation errors
            if (Object.keys(errors).length > 0) {
                console.error("Form validation errors:", errors)
                return
            }

            // Create FormData to handle file uploads
            const formData = new FormData()

            // Add all form values
            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value)
            })

            // Add files
            Object.entries(files).forEach(([key, file]) => {
                if (file) {
                    formData.append(key, file)
                }
            })

            console.log("FormData entries:")
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value)
            }

            const response = await axios.post(
                "https://www.mediashippers.com/api/organization/register",
                formData,
              );
          
              console.log("Response from server:", response.data);

            // Redirect to /users-list on success
            navigate("/users-list");
        } catch (error) {
            console.error("Registration error:", error)
            // You might want to show an error message to the user here
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleFileChange = (name, file) => {
        setFiles((prev) => ({
            ...prev,
            [name]: file,
        }))
    }

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
    }

    const nextStep = (e) => {
        e?.preventDefault();
        if (activeTab < 3) {
            setActiveTab((prevTab) => prevTab + 1)
        }
    }

    const prevStep = (e) => {
        e?.preventDefault();
        if (activeTab > 0) {
            setActiveTab((prevTab) => prevTab - 1)
        }
    }

    return (
        <Card
            style={{
                width: "100%",
                color: "white",
                backgroundColor: "transparent",
            }}
        >
            <CardContent sx={{padding: '16px'}}>
                {/* Breadcrumb */}
                <Breadcrumb items={breadcrumbItems} />

                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (activeTab === 3) {
                        handleSubmit(onSubmit)(e);
                    }
                }}>
                    <Box
                        sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                            marginBottom: "24px",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Box
                            sx={{
                                width: "80%", // 👈 reduce width as per your need (e.g., 60%, 500px, etc.)
                                maxWidth: "800px",
                            }}
                        >
                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                variant="fullWidth"
                                sx={{
                                    "& .MuiTabs-indicator": {
                                        backgroundColor: "#F26430",
                                    },
                                    "& .Mui-selected": {
                                        color: "#F26430 !important",
                                    },
                                    "& .MuiTab-root": {
                                        color: "#aaa",
                                    },
                                }}
                            >
                                <Tab label="Organization" />
                                <Tab label="Primary Contact" />
                                <Tab label="User Details" />
                                <Tab label="Documents" />
                            </Tabs>
                        </Box>
                    </Box>

                    <TabPanel value={activeTab} index={0}>
                        <OrganizationDetails control={control} errors={errors} />
                    </TabPanel>
                    <TabPanel value={activeTab} index={1}>
                        <PrimaryContactDetails control={control} errors={errors} />
                    </TabPanel>
                    <TabPanel value={activeTab} index={2}>
                        <UserDetails control={control} errors={errors} />
                    </TabPanel>
                    <TabPanel value={activeTab} index={3}>
                        <DocumentUpload onFileChange={handleFileChange} />
                    </TabPanel>

                    <Box
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "24px",
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={prevStep}
                            disabled={activeTab === 0}
                            style={{
                                borderColor: "#444",
                                color: "#aaa",
                            }}
                        >
                            Previous
                        </Button>

                        {activeTab !== 3 ? (
                            <Button
                                type="button"
                                variant="contained"
                                onClick={(e) => nextStep(e)}
                                style={{
                                    backgroundColor: "#F26430",
                                    "&:hover": {
                                        backgroundColor: "#e05a2a",
                                    },
                                }}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isSubmitting}
                                style={{
                                    backgroundColor: "#F26430",
                                    "&:hover": {
                                        backgroundColor: "#e05a2a",
                                    },
                                }}
                            >
                                {isSubmitting ? <CircularProgress size={24} style={{ color: "white" }} /> : "Complete Registration"}
                            </Button>
                        )}
                    </Box>
                </form>
            </CardContent>
        </Card>
    )
}

function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    )
}

export default UserOrgManagement
