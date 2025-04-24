import { useState, useRef } from "react"
import { Typography, Box, Button, Paper } from "@mui/material"
import FileUploadIcon from "@mui/icons-material/FileUpload"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CloseIcon from "@mui/icons-material/Close"

function FileUploader({ label, description, name, accept, onFileSelected, isUploaded }) {
    const [fileName, setFileName] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef(null)

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null
        if (file) {
            setFileName(file.name)
            onFileSelected(file)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files?.[0] || null
        if (file && file.type === "application/pdf") {
            setFileName(file.name)
            onFileSelected(file)

            // Update the file input for consistency
            if (fileInputRef.current) {
                const dataTransfer = new DataTransfer()
                dataTransfer.items.add(file)
                fileInputRef.current.files = dataTransfer.files
            }
        }
    }

    const clearFile = () => {
        setFileName(null)
        onFileSelected(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <Box style={{
            display: "flex", flexDirection: "column", gap: "8px"
        }}>
            <Box
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",

                }}
            >
                <Typography
                    style={{
                        color: "#aaa",
                        fontWeight: 500,
                    }}
                >
                    {label}
                </Typography>
                {isUploaded && (
                    <Box
                        style={{
                            display: "flex",
                            alignItems: "center",
                            color: "#F26430",
                            fontSize: "14px",
                        }}
                    >
                        <CheckCircleIcon
                            style={{
                                height: "16px",
                                width: "16px",
                                marginRight: "4px",
                            }}
                        />
                        <span>Uploaded</span>
                    </Box>
                )}
            </Box>

            <Paper
                elevation={0}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                    border: "2px dashed",
                    borderColor: isDragging ? "#F26430" : isUploaded ? "rgba(242, 100, 48, 0.5)" : "#444",
                    borderRadius: "8px",
                    padding: "24px",
                    backgroundColor: isDragging
                        ? "rgba(242, 100, 48, 0.1)"
                        : isUploaded
                            ? "rgba(242, 100, 48, 0.05)"
                            : "rgba(51, 51, 51, 0.5)",
                    transition: "all 0.2s ease",
                }}
            >
                {fileName ? (
                    <Box
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Box
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                color: "#aaa",
                            }}
                        >
                            <FileUploadIcon style={{ height: "20px", width: "20px" }} />
                            <Typography
                                style={{
                                    maxWidth: "250px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {fileName}
                            </Typography>
                        </Box>
                        <Button
                            variant="text"
                            size="small"
                            onClick={clearFile}
                            style={{
                                color: "#777",
                                minWidth: "auto",
                                padding: "4px",
                            }}
                        >
                            <CloseIcon style={{ height: "16px", width: "16px" }} />
                        </Button>
                    </Box>
                ) : (
                    <Box
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            gap: "16px",
                        }}
                    >
                        <Box
                            style={{
                                borderRadius: "50%",
                                backgroundColor: "#222",
                                padding: "12px",
                            }}
                        >
                            <FileUploadIcon
                                style={{
                                    height: "24px",
                                    width: "24px",
                                    color: "#777",
                                }}
                            />
                        </Box>
                        <Box style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <Typography style={{ fontSize: "14px", color: "#aaa" }}>{description}</Typography>
                            <Typography style={{ fontSize: "12px", color: "#777" }}>
                                Drag and drop or{" "}
                                <label
                                    htmlFor={name}
                                    style={{
                                        color: "#F26430",
                                        cursor: "pointer",
                                        "&:hover": {
                                            color: "#e05a2a",
                                        },
                                    }}
                                >
                                    browse
                                </label>
                            </Typography>
                        </Box>
                    </Box>
                )}
                <input
                    ref={fileInputRef}
                    id={name}
                    name={name}
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
            </Paper>
        </Box>
    )
}

export default FileUploader
