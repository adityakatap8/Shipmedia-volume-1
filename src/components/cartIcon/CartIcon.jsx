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



  const fetchCartMovies = async () => {
    try {
      const response = await axios.get(`https://media-shippers-backend.vercel.app/api/cart/get-cart/${user?._id}`)
      console.log("response", response)
      const movies = response.data
      dispatch(setCartMovies(movies))
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
