import { useState } from "react"
import { Typography, Box } from "@mui/material"
import FileUploader from "./FileUploader"

function DocumentUpload({ onFileChange }) {
    const [uploadStatus, setUploadStatus] = useState({
        orgCorpPdf: false,
        orgGstPdf: false,
        orgAgreementPdf: false,
    })

    const handleFileUpload = (name, file) => {
        onFileChange(name, file)
        setUploadStatus((prev) => ({
            ...prev,
            [name]: !!file,
        }))
    }

    return (
        <Box style={{ display: "flex", flexDirection: "row", gap: "24px", flexWrap: "wrap", justifyContent:"center" }}>
            <FileUploader
                label="Corporate Registration Document"
                description="Upload your corporate registration certificate (PDF only)"
                name="orgCorpPdf"
                accept=".pdf"
                onFileSelected={(file) => handleFileUpload("orgCorpPdf", file)}
                isUploaded={uploadStatus.orgCorpPdf}
            />

            <FileUploader
                label="GST Registration Document"
                description="Upload your GST registration certificate (PDF only)"
                name="orgGstPdf"
                accept=".pdf"
                onFileSelected={(file) => handleFileUpload("orgGstPdf", file)}
                isUploaded={uploadStatus.orgGstPdf}
            />

            <FileUploader
                label="Agreement Document"
                description="Upload the signed agreement document (PDF only)"
                name="orgAgreementPdf"
                accept=".pdf"
                onFileSelected={(file) => handleFileUpload("orgAgreementPdf", file)}
                isUploaded={uploadStatus.orgAgreementPdf}
            />
        </Box>
    )
}

export default DocumentUpload
