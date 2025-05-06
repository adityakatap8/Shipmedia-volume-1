import React from 'react';
import { IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';


const CartIcon = ({ cartCount }) => {
    const navigate = useNavigate();
  
    return (
      <IconButton
        aria-label="cart"
        onClick={() => navigate('/cart')}
        sx={{ position: 'relative', color:"#fff" }}
      >
        <Badge
          badgeContent={cartCount}
          color="error"
          overlap="circular"
          sx={{
            '& .MuiBadge-badge': {
              right: 0,
              top: 0,
              border: '2px solid white',
              padding: '0 4px',
            },
          }}
        >
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
    );
  };

export default CartIcon;
  