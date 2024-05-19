import * as React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import TextAnimate from './TextAnimate';
function Header() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: 'smooth' });
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
      setOpen(false);
    }
  };


  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
        {/* <Button size="small">home</Button> */}
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          {/* {title} */}
          VIệt Thành

          
        </Typography>
        {/* <IconButton>
          <SearchIcon />
        </IconButton> */}
        <Button variant="outlined" size="small">
          Sign-in
        </Button>
        
        <Button variant="outlined" size="small" sx={{ ml: 1 }}>
          Sign up
        </Button>
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: 'space-between', overflowX: 'auto', height:"10px"}}
      >
         <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: "50px",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          variant="regular"
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            borderRadius: '999px',
            bgcolor:
              theme.palette.mode === 'light'
                ? 'hsla(220, 60%, 99%, 0.6)'
                : 'hsla(220, 0%, 0%, 0.7)',
            backdropFilter: 'blur(24px)',
            maxHeight: 40,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow:
              theme.palette.mode === 'light'
                ? '0 1px 2px hsla(210, 0%, 0%, 0.05), 0 2px 12px hsla(210, 100%, 80%, 0.5)'
                : '0 1px 2px hsla(210, 0%, 0%, 0.5), 0 2px 12px hsla(210, 100%, 25%, 0.3)',
          })}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              px: 0,
            }}
          >


            <div >dddd</div>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => scrollToSection('features')}
                href="products"
              >
                Sản Phẩm
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => scrollToSection('testimonials')}
              >
                Testimonials
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => scrollToSection('highlights')}
              >
                Highlights
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => scrollToSection('pricing')}
              >
                Pricing
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => scrollToSection('faq')}
                sx={{ minWidth: 0 }}
              >
                FAQ
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 0.5,
              alignItems: 'center',
            }}
          >
            {/* <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} /> */}
            <Button
              color="primary"
              variant="text"
              size="small"
              component="a"
              href="/material-ui/getting-started/templates/sign-in/"
              target="_blank"
            >
              Sign in
            </Button>
            <Button
              color="primary"
              variant="contained"
              size="small"
              component="a"
              href="/material-ui/getting-started/templates/sign-up/"
              target="_blank"
            >
              Sign up
            </Button>
          </Box>
          <Box sx={{ display: { sm: 'flex', md: 'none' } }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: 'background.default',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} /> */}
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <Divider sx={{ my: 3 }} />
                <MenuItem onClick={() => scrollToSection('features')}>
                  Features
                </MenuItem>
                <MenuItem onClick={() => scrollToSection('testimonials')}>
                  Testimonials
                </MenuItem>
                <MenuItem onClick={() => scrollToSection('highlights')}>
                  Highlights
                </MenuItem>
                <MenuItem onClick={() => scrollToSection('pricing')}>
                  Pricing
                </MenuItem>
                <MenuItem onClick={() => scrollToSection('faq')}>FAQ</MenuItem>
                <MenuItem>
                  <Button
                    color="primary"
                    variant="contained"
                    component="a"
                    href="/material-ui/getting-started/templates/sign-up/"
                    target="_blank"
                    fullWidth
                  >
                    Sign up
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button
                    color="primary"
                    variant="outlined"
                    component="a"
                    href="/material-ui/getting-started/templates/sign-in/"
                    target="_blank"
                    fullWidth
                  >
                    Sign in
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
      </Toolbar>
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;

// import React, { useEffect } from "react";
// import AppBar from '@mui/material/AppBar';
// /* REACT BOOTSTRAP */
// import { Navbar, Nav, Container, NavDropdown, } from "react-bootstrap";

// /* REACT ROUTER BOOTSTRAP */
// import { LinkContainer } from "react-router-bootstrap";

// /* REACT - REDUX */
// import { useDispatch, useSelector } from "react-redux";

// /* ACTION CREATORS */
// import { logout } from "../actions/userActions";
// import { listCategories } from "../actions/categoryActions";
// /* COMPONENTS */
// import SearchBox from "./SearchBox";

// import logo from "../logo.png";

// import { useHistory } from "react-router-dom";


// function Header() {
//   /* PULLING A PART OF STATE FROM THE ACTUAL STATE IN THE REDUX STORE */
//   const categoryList = useSelector((state) => state.categoryList);
//   const userLogin = useSelector((state) => state.userLogin);
//   const history = useHistory();
//   const { userInfo } = userLogin;
//   const { loading, error, categories } = categoryList;
//   /* HANDLER */
//   const dispatch = useDispatch();

//   const logoutHandler = () => {
//     dispatch(logout());
//   };

//   useEffect(() => {
//     dispatch(listCategories());
//   }, [dispatch]);

//   const handleCategorySelect = (categoryId) => {
//     // Điều hướng người dùng đến màn hình hiển thị sản phẩm của danh mục đó
//     history.push(`/category/${categoryId}/products`);
//   };
//   return (
//     <header >
//       {/* <AppBar
//       // position="fixed"
//       // sx={{
//       //   boxShadow: 0,
//       //   bgcolor: 'transparent',
//       //   backgroundImage: 'none',
//       //   mt: 0,
//       // }}
//       >
       
//       </AppBar> */}
//       <Navbar bg="" variant="" expand="sm" collapseOnSelect style={{ height: '69px' }}>
//         <Container>



//           <Navbar.Toggle aria-controls="navbarScroll" />

//           <Navbar.Collapse id="navbarScroll">
//             <LinkContainer to="/">
//               <Navbar.Brand>
//                 {/* <img alt=" Logo web" /> */} VIỆT THÀNH
//               </Navbar.Brand>
//             </LinkContainer>

//             <LinkContainer to="/">
//               <Nav.Link>
//                 TRANG CHỦ
//               </Nav.Link>
//             </LinkContainer>

//             <LinkContainer to="/login">
//               <Nav.Link>
//                 GIỚI THIỆU
//               </Nav.Link>
//             </LinkContainer>

//             <LinkContainer to="">
//               <NavDropdown title="DANH MỤC" id="basic-nav-dropdown">
//                 {loading ? (
//                   <NavDropdown.Item>Loading...</NavDropdown.Item>
//                 ) : error ? (
//                   <NavDropdown.Item>Error! Không thể tải danh mục.</NavDropdown.Item>
//                 ) : (
//                   categories.map((category) => (
//                     <NavDropdown.Item key={category.id} onClick={() => handleCategorySelect(category.id)}>
//                       {category.name}
//                     </NavDropdown.Item>
//                   ))
//                 )}
//               </NavDropdown>
//             </LinkContainer>

//             <Nav
//               className="ms-auto my-2 my-lg-0"
//               style={{ maxHeight: "100px" }}
//               navbarScroll
//             ><SearchBox />
//               <LinkContainer to="/cart">
//                 <Nav.Link>
//                   <i className="fas fa-shopping-cart"></i> GIỎ HÀNG
//                 </Nav.Link>
//               </LinkContainer>

//               {userInfo ? (
//                 <NavDropdown title={userInfo.name} id="username">
//                   <LinkContainer to="/profile">
//                     <NavDropdown.Item>Profile</NavDropdown.Item>
//                   </LinkContainer>

//                   <NavDropdown.Item onClick={logoutHandler}>
//                     Logout
//                   </NavDropdown.Item>
//                 </NavDropdown>
//               ) : (
//                 <LinkContainer to="/login">
//                   <Nav.Link>
//                     <i className="fas fa-user"></i> Login
//                   </Nav.Link>
//                 </LinkContainer>
//               )}

//               {userInfo && userInfo.isAdmin && (
//                 <LinkContainer to="/admin">
//                   <Nav.Link>
//                     <i className="fas fa-user"></i> ADMIN
//                   </Nav.Link>
//                 </LinkContainer>
//                 // <NavDropdown title="Admin" id="adminmenu">
//                 //   <LinkContainer to="/admin/userlist">
//                 //     <NavDropdown.Item>Users</NavDropdown.Item>
//                 //   </LinkContainer>

//                 //   <LinkContainer to="/admin/category/create">
//                 //     <NavDropdown.Item>Categories</NavDropdown.Item>
//                 //   </LinkContainer>

//                 //   <LinkContainer to="/admin/productlist">
//                 //     <NavDropdown.Item>Products</NavDropdown.Item>
//                 //   </LinkContainer>

//                 //   <LinkContainer to="/admin/orderlist">
//                 //     <NavDropdown.Item>Orders</NavDropdown.Item>
//                 //   </LinkContainer>
//                 // </NavDropdown>
//               )}
//             </Nav>

//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//     </header>
//   );
// }

// export default Header;
