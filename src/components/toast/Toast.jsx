import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Toast = ({ message, severity = 'success', open, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // ⬆️ Top right
      sx={{ width: '40%' }} // ✅ Width 40%
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          width: '100%',
          backgroundColor: '#4caf50', // ✅ Custom green color (MUI success green)
          color: '#fff',
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
