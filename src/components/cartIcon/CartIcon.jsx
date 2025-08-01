import React, { useEffect } from 'react';
import { IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCartMovies } from '../../redux/cartSlice/cartSlice';

const CartIcon = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth.user);
  const cartCount = useSelector((state) => state.cart.movies.length);
  console.log("cartCount", cartCount)



  const fetchCartMovies = async () => {
    try {
      const response = await axios.get(`https://www.mediashippers.com/api/cart/get-cart/${user?._id}`)
      console.log("cart response", response)
      const {deals} = response.data
      dispatch(setCartMovies(deals))
    } catch (error) {
      console.error("Error fetching movies:", error)
    }
  }

  useEffect(() => {
    fetchCartMovies()
  }, []);

  return (
    <IconButton
      aria-label="cart"
      onClick={() => navigate('/cart')}
      sx={{ position: 'relative', color: "#fff" }}
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
