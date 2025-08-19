import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Stepper,
    Step,
    StepLabel,
    LinearProgress,
    Alert,
    Grid,
    Paper,
    Chip,
    CircularProgress,
    Container,
    StepIcon,
    styled,
} from "@mui/material"
import {
    Business as BusinessIcon,
    People as PeopleIcon,
    Description as DocumentIcon,
    CheckCircle as CheckCircleIcon,
    Add as AddIcon,
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";

// Import sub-components (these would need to be created)
import OrganizationDetails from "./components/OrganizationDetails"
import PrimaryContactDetails from "./components/PrimaryContactDetails"
import UserDetails from "./components/UserDetails"
import DocumentUpload from "./components/DocumentUpload"
import axios from "axios"
import { useSelector } from "react-redux"

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

const steps = [
    { id: "mode", title: "Organization Mode", icon: BusinessIcon, description: "Choose how to proceed" },
    { id: "organization", title: "Organization", icon: BusinessIcon, description: "Company details" },
    { id: "contact", title: "Primary Contact", icon: PeopleIcon, description: "Main contact person" },
    { id: "user", title: "User Details", icon: PeopleIcon, description: "Account information" },
    { id: "documents", title: "Documents", icon: DocumentIcon, description: "Required files" },
]

// Styled components for better visual appeal
const StyledCard = styled(Card)(({ theme, selected }) => ({
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: selected ? `2px solid ${theme.palette.primary.main}` : "2px solid transparent",
    backgroundColor: selected ? theme.palette.primary.light + "20" : "#26334d",
    "&:hover": {
        boxShadow: theme.shadows[4],
        transform: "translateY(-2px)",
    },
}))

const GradientBackground = styled(Box)({
    minHeight: "100vh",
    background: "#0b192c",
    padding: "24px",
})

const CustomStepIcon = styled(StepIcon)(({ theme, active, completed }) => ({
    color: completed ? theme.palette.success.main : active ? theme.palette.primary.main : theme.palette.grey[400],
    fontSize: "2rem",
}))

export default function UserOrgManagementMUI() {
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth.user) || {};
    console.log("User from Redux:", user);
    const [currentStep, setCurrentStep] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [orgMode, setOrgMode] = useState(null)
    const [orgList, setOrgList] = useState([])
    const [selectedOrgId, setSelectedOrgId] = useState("")
    const [files, setFiles] = useState({
        orgCorpPdf: null,
        orgGstPdf: null,
        orgAgreementPdf: null,
    })
    const [alert, setAlert] = useState(null)
    const [orgSearch, setOrgSearch] = useState(""); // Add this state
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        trigger,
        setValue,
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

    const fetchOrganizations = async () => {
        const response = await axios.get("http://localhost:3000/api/organization/get-org");
        console.log("Fetched organizations:", response.data);
        if (response.status === 200) {
            setOrgList(response.data?.organizations || []);
        };
    };

    // Fetch organizations when selecting existing
    useEffect(() => {
        if (orgMode === "select") {
            fetchOrganizations();
        }
    }, [orgMode])

    // Auto-fill form when organization is selected
    useEffect(() => {
        if (orgMode === "select" && selectedOrgId) {
            const org = orgList.find((o) => o._id === selectedOrgId);
            if (org) {
                setValue("orgName", org.orgName);
                setValue("orgAddress", org.orgAddress);
                setValue("orgCorpRegNo", org.orgCorpRegNo);
                setValue("orgGstNo", org.orgGstNo);
            }
        }
    }, [selectedOrgId, orgMode, orgList, setValue]);

    useEffect(() => {
        if (orgMode === "create") {
            setValue("orgName", "");
            setValue("orgAddress", "");
            setValue("orgCorpRegNo", "");
            setValue("orgGstNo", "");
            setSelectedOrgId(""); // Optionally clear selected org
        }
    }, [orgMode, setValue]);

    const progress = ((currentStep + 1) / steps.length) * 100

    const nextStep = async () => {
        let fieldsToValidate = []

        switch (currentStep) {
            case 0: // Mode selection
                if (!orgMode) {
                    setAlert({ message: "Please select an organization mode", type: "error" })
                    return
                }
                if (orgMode === "select" && !selectedOrgId) {
                    setAlert({ message: "Please select an organization", type: "error" })
                    return
                }
                break
            case 1: // Organization
                if (orgMode === "create") {
                    fieldsToValidate = ["orgName", "orgAddress", "orgCorpRegNo", "orgGstNo"]
                }
                break
            case 2: // Primary contact
                fieldsToValidate = ["primaryName", "primaryEmail", "primaryNo"]
                break
            case 3: // User details
                fieldsToValidate = ["userName", "userEmail", "role", "password", "confirmPassword"]
                break
            case 4: // Documents
                if (!files.orgCorpPdf || !files.orgGstPdf || !files.orgAgreementPdf) {
                    setAlert({ message: "Please upload all required documents", type: "error" })
                    return
                }
                break
        }

        if (fieldsToValidate.length > 0) {
            const isStepValid = await trigger(fieldsToValidate)
            if (!isStepValid) {
                setAlert({ message: "Please fix errors in this step before proceeding", type: "error" })
                return
            }
        }

        setAlert(null)
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
            setAlert(null)
        }
    }

    // Helper to show snackbar
    const showSnackbar = (message, severity = "info") => {
        setSnackbar({ open: true, message, severity });
    };

    const onSubmit = async (values) => {
        setIsSubmitting(true)
        try {
            let formData = new FormData();
            formData.append("createdBy", user?._id);
            if (orgMode === "select" && selectedOrgId) {
                // Only send organizationId and orgName for selected org
                formData.append("organizationId", selectedOrgId);
                const selectedOrg = orgList.find((o) => o._id === selectedOrgId);
                formData.append("orgName", selectedOrg?.orgName || "");
            } else {
                // Send all organization details for new org
                formData.append("orgName", values.orgName);
                formData.append("orgAddress", values.orgAddress);
                formData.append("orgCorpRegNo", values.orgCorpRegNo);
                formData.append("orgGstNo", values.orgGstNo);
            }

            // Always send user/contact details
            formData.append("primaryName", values.primaryName);
            formData.append("primaryEmail", values.primaryEmail);
            formData.append("primaryNo", values.primaryNo);
            formData.append("userName", values.userName);
            formData.append("userEmail", values.userEmail);
            formData.append("role", values.role);
            formData.append("password", values.password);

            // Add files if any
            Object.entries(files).forEach(([key, file]) => {
                if (file) {
                    formData.append(key, file);
                }
            });

            console.log("FormData entries:")
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value)
            }

            const response = await axios.post(
                "http://localhost:3000/api/organization/register",
                formData,
            );
            // Redirect to /users-list on success
            navigate("/users-list");
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Registration failed. Please try again.";
            showSnackbar(errorMessage, "error");
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

    return (
        <GradientBackground>
            <Container maxWidth="lg">

                {/* Progress Bar */}
                <Card sx={{ mb: 1, overflow: "visible" }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="body2" fontWeight="medium" color="text.secondary">
                                Progress
                            </Typography>
                            <Typography variant="body2" fontWeight="medium" color="text.secondary">
                                {Math.round(progress)}%
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: "grey.200",
                                "& .MuiLinearProgress-bar": {
                                    borderRadius: 4,
                                    background: "linear-gradient(45deg, #FF6B35 30%, #F7931E 90%)",
                                },
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Steps Navigation */}
                <Card sx={{ mb: 1 }}>
                    <CardContent>
                        <Stepper activeStep={currentStep} alternativeLabel>
                            {steps.map((step, index) => {
                                const StepIconComponent = step.icon
                                return (
                                    <Step key={step.id}>
                                        <StepLabel
                                            StepIconComponent={() => (
                                                <Box
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: "50%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        backgroundColor:
                                                            index === currentStep
                                                                ? "#0b192c"
                                                                : index < currentStep
                                                                    ? "success.main"
                                                                    : "grey.300",
                                                        color: "white",
                                                        transition: "all 0.3s ease",
                                                    }}
                                                >
                                                    {index < currentStep ? (
                                                        <CheckCircleIcon />
                                                    ) : (
                                                        <StepIconComponent sx={{ fontSize: "1.5rem" }} />
                                                    )}
                                                </Box>
                                            )}
                                        >
                                            <Typography
                                                variant="body2"
                                                fontWeight="medium"
                                                color={index === currentStep ? "#0b192c" : "text.secondary"}
                                            >
                                                {step.title}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {step.description}
                                            </Typography>
                                        </StepLabel>
                                    </Step>
                                )
                            })}
                        </Stepper>
                    </CardContent>
                </Card>

                {/* Alert */}
                {alert && (
                    <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
                        {alert.message}
                    </Alert>
                )}

                {/* Main Content */}
                <Card sx={{ boxShadow: 4 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box display="flex" alignItems="center" gap={2} mb={3}>
                            {React.createElement(steps[currentStep].icon, {
                                sx: { fontSize: "2rem", color: "primary.main" },
                            })}
                            <Box>
                                <Typography variant="h5" component="h2" fontWeight="bold">
                                    {steps[currentStep].title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {steps[currentStep].description}
                                </Typography>
                            </Box>
                        </Box>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Step 0: Organization Mode Selection */}
                            {currentStep === 0 && (
                                <Box>
                                    <Box textAlign="center" mb={4}>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            How would you like to proceed?
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Choose whether to create a new organization or select an existing one
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={3} mb={4}>
                                        <Grid item xs={12} md={6}>
                                            <StyledCard selected={orgMode === "create"} onClick={() => setOrgMode("create")}>
                                                <CardContent sx={{ textAlign: "center", p: 4 }}>
                                                    <Box
                                                        sx={{
                                                            width: 80,
                                                            height: 80,
                                                            borderRadius: "50%",
                                                            backgroundColor: orgMode === "create" ? "primary.main" : "grey.100",
                                                            color: orgMode === "create" ? "white" : "grey.600",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            mx: "auto",
                                                            mb: 2,
                                                            transition: "all 0.3s ease",
                                                        }}
                                                    >
                                                        <AddIcon sx={{ fontSize: "2.5rem" }} />
                                                    </Box>
                                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                        Create New Organization
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Set up a brand new organization with all details
                                                    </Typography>
                                                </CardContent>
                                            </StyledCard>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <StyledCard selected={orgMode === "select"} onClick={() => setOrgMode("select")}>
                                                <CardContent sx={{ textAlign: "center", p: 4 }}>
                                                    <Box
                                                        sx={{
                                                            width: 80,
                                                            height: 80,
                                                            borderRadius: "50%",
                                                            backgroundColor: orgMode === "select" ? "primary.main" : "grey.100",
                                                            color: orgMode === "select" ? "white" : "grey.600",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            mx: "auto",
                                                            mb: 2,
                                                            transition: "all 0.3s ease",
                                                        }}
                                                    >
                                                        <BusinessIcon sx={{ fontSize: "2.5rem" }} />
                                                    </Box>
                                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                        Select Existing Organization
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Choose from previously registered organizations
                                                    </Typography>
                                                </CardContent>
                                            </StyledCard>
                                        </Grid>
                                    </Grid>

                                    {/* Organization Selection Grid */}
                                    {orgMode === "select" && (
                                        <Box>

                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Search & Select an Organization
                                                </Typography>
                                                <TextField
                                                    label="Search organization"
                                                    variant="outlined"
                                                    type="search"
                                                    value={orgSearch}
                                                    onChange={e => setOrgSearch(e.target.value)}
                                                    sx={{ mb: 2, backgroundColor: "#fff", borderRadius: 2, width: 500, maxWidth: 700 }}
                                                />
                                            </div>
                                            <Grid container spacing={2}>
                                                {orgList
                                                    .filter(org =>
                                                        org.orgName.toLowerCase().includes(orgSearch.toLowerCase())
                                                    )
                                                    .map(org => (
                                                        <Grid item xs={12} key={org._id}>
                                                            <StyledCard selected={selectedOrgId === org._id} onClick={() => setSelectedOrgId(org._id)}>
                                                                <CardContent>
                                                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                                                        <Box flex={1}>
                                                                            <Typography variant="h6" fontWeight="bold" color="#000000" gutterBottom>
                                                                                {org.orgName}
                                                                            </Typography>
                                                                            <Typography variant="body2" color="#000000" gutterBottom>
                                                                                {org.orgAddress}
                                                                            </Typography>
                                                                            <Box display="flex" justifyContent="space-between" gap={2} mt={1}>
                                                                                <Typography variant="caption" color="#000000">
                                                                                    Corp Reg: {org.orgCorpRegNo}
                                                                                </Typography>
                                                                                <Typography variant="caption" color="#000000">
                                                                                    GST: {org.orgGstNo}
                                                                                </Typography>
                                                                            </Box>
                                                                        </Box>
                                                                        <Box textAlign="right">
                                                                            {selectedOrgId === org._id && (
                                                                                <CheckCircleIcon
                                                                                    sx={{ color: "success.main", mt: 1, display: "block", ml: "auto" }}
                                                                                />
                                                                            )}
                                                                        </Box>
                                                                    </Box>
                                                                </CardContent>
                                                            </StyledCard>
                                                        </Grid>
                                                    ))}
                                                {orgList.filter(org =>
                                                    org.orgName.toLowerCase().includes(orgSearch.toLowerCase())
                                                ).length === 0 && (
                                                        <Grid item xs={12}>
                                                            <Paper sx={{ p: 3, textAlign: "center", backgroundColor: "#26334d", color: "#fff" }}>
                                                                <Typography variant="h6" fontWeight="bold">
                                                                    No organizations found.
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    Try a different search term or create a new organization.
                                                                </Typography>
                                                            </Paper>
                                                        </Grid>
                                                    )}
                                            </Grid>
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {/* Step 1: Organization Details */}
                            {currentStep === 1 && (
                                <Box>
                                    {orgMode === "create" ? (
                                        <OrganizationDetails control={control} errors={errors} />
                                    ) : (
                                        <Paper sx={{ p: 4, textAlign: "center", backgroundColor: "success.light" }}>
                                            <CheckCircleIcon sx={{ fontSize: "4rem", color: "success.main", mb: 2 }} />
                                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                                Organization Selected
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary" gutterBottom>
                                                Using details from the selected organization
                                            </Typography>
                                            <Paper sx={{ p: 3, mt: 3, maxWidth: 400, mx: "auto", backgroundColor: "white" }}>
                                                <Typography variant="h6" fontWeight="bold">
                                                    {orgList.find((o) => o._id === selectedOrgId)?.orgName}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" mt={1}>
                                                    {orgList.find((o) => o._id === selectedOrgId)?.orgAddress}
                                                </Typography>
                                            </Paper>
                                        </Paper>
                                    )}
                                </Box>
                            )}

                            {/* Step 2: Primary Contact */}
                            {currentStep === 2 && <PrimaryContactDetails control={control} errors={errors} />}

                            {/* Step 3: User Details */}
                            {currentStep === 3 && <UserDetails control={control} errors={errors} />}

                            {/* Step 4: Documents */}
                            {currentStep === 4 && <DocumentUpload onFileChange={handleFileChange} />}

                            {/* Navigation Buttons */}
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                mt={4}
                                pt={3}
                                borderTop="1px solid"
                                borderColor="grey.200"
                            >
                                <Button
                                    variant="outlined"
                                    onClick={prevStep}
                                    disabled={currentStep === 0}
                                    startIcon={<ArrowBackIcon />}
                                    sx={{ minWidth: 120 }}
                                >
                                    Previous
                                </Button>

                                {currentStep < steps.length - 1 && (
                                    <Button
                                        variant="contained"
                                        onClick={nextStep}
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{
                                            minWidth: 120,
                                            background: "linear-gradient(45deg, #FF6B35 30%, #F7931E 90%)",
                                            "&:hover": {
                                                background: "linear-gradient(45deg, #E55A2B 30%, #E8841A 90%)",
                                            },
                                        }}
                                    >
                                        Next
                                    </Button>
                                )}
                                {currentStep === 4 && (
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={isSubmitting}
                                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                                        sx={{
                                            minWidth: 180,
                                            backgroundColor: "success.main",
                                            "&:hover": {
                                                backgroundColor: "success.dark",
                                            },
                                        }}
                                    >
                                        {isSubmitting ? "Processing..." : "Complete Registration"}
                                    </Button>
                                )}
                            </Box>
                        </form>
                    </CardContent>
                </Card>

                {/* Snackbar for errors */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    message={snackbar.message}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                />
            </Container>
        </GradientBackground>
    )
}
