import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  Divider
} from '@mui/material';

const allowedFileTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const AccountInfo = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orgName: '',
    orgAddress: '',
    registrationId: null,
    gstDoc: null,
    taxDoc: null,
    agreementDoc: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file && allowedFileTypes.includes(file.type)) {
      setFormData(prev => ({ ...prev, [name]: file }));
    } else {
      alert("Please upload a valid PDF or Word document.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // You would typically send this form data to your backend here
    console.log('Submitted Data:', formData);
  };

  return (
    <Box  component="form" onSubmit={handleSubmit} sx={{ p: 2, backgroundColor: '#fff', borderRadius: 2 }}>
      <Typography variant="h5" mb={2} sx={{ textAlign: 'left' }}>User Information</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" mb={1}>Full Name</Typography>
          <TextField fullWidth name="name" value={formData.name} onChange={handleInputChange} required variant="standard" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" mb={1}>Email</Typography>
          <TextField fullWidth type="email" name="email" value={formData.email} onChange={handleInputChange} required variant="standard" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" mb={1}>Phone</Typography>
          <TextField fullWidth type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required variant="standard" />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" mb={2} sx={{ textAlign: 'left' }}>Organization Information</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" mb={1}>Organization Name</Typography>
          <TextField fullWidth name="orgName" value={formData.orgName} onChange={handleInputChange} required variant="standard" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" mb={1}>Organization Address</Typography>
          <TextField fullWidth name="orgAddress" value={formData.orgAddress} onChange={handleInputChange} required variant="standard" />
        </Grid>

        {/* File Uploads */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" mb={1}>Registration ID Document (PDF, Word)</Typography>
          <input type="file" name="registrationId" onChange={handleFileChange} accept=".pdf,.doc,.docx" required />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" mb={1}>GST Document (PDF, Word)</Typography>
          <input type="file" name="gstDoc" onChange={handleFileChange} accept=".pdf,.doc,.docx" required />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" mb={1}>Tax Document (PDF, Word)</Typography>
          <input type="file" name="taxDoc" onChange={handleFileChange} accept=".pdf,.doc,.docx" required />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" mb={1}>Agreement Document (PDF, Word)</Typography>
          <input type="file" name="agreementDoc" onChange={handleFileChange} accept=".pdf,.doc,.docx" required />
        </Grid>
      </Grid>

      <Box mt={4}>
        <Button type="submit" variant="contained" color="primary">Submit</Button>
      </Box>
    </Box>
  );
};

export default AccountInfo;
