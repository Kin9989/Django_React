// import React, { useState } from 'react';
// import {
//   MDBNavbar,
//   MDBNavbarNav,
//   MDBNavbarItem,
//   MDBNavbarLink,
//   MDBNavbarToggler,
//   MDBContainer,
//   MDBIcon,
//   MDBCollapse,
//   MDBBtn
// } from 'mdb-react-ui-kit';

// export default function App() {
//   const [showBasic, setShowBasic] = useState(false);

//   return (
//     <header>
//       <MDBNavbar expand='lg' light bgColor='white'>
//         <MDBContainer fluid>
//           <MDBNavbarToggler
//             onClick={() => setShowBasic(!showBasic)}
//             aria-controls='navbarExample01'
//             aria-expanded='false'
//             aria-label='Toggle navigation'
//           >
//             <MDBIcon fas icon='bars' />
//           </MDBNavbarToggler>
//           <MDBCollapse navbar show={showBasic}>
//             <MDBNavbarNav right className='mb-2 mb-lg-0'>
//               <MDBNavbarItem active>
//                 <MDBNavbarLink aria-current='page' href='#'>
//                   Home
//                 </MDBNavbarLink>
//               </MDBNavbarItem>
//               <MDBNavbarItem>
//                 <MDBNavbarLink href='#'>Features</MDBNavbarLink>
//               </MDBNavbarItem>
//               <MDBNavbarItem>
//                 <MDBNavbarLink href='#'>Pricing</MDBNavbarLink>
//               </MDBNavbarItem>
//               <MDBNavbarItem>
//                 <MDBNavbarLink href='#'>About</MDBNavbarLink>
//               </MDBNavbarItem>
//             </MDBNavbarNav>
//           </MDBCollapse>
//         </MDBContainer>
//       </MDBNavbar>


//     </header>
//   );
// }

import React, { useEffect } from "react";
import AppBar from '@mui/material/AppBar';
/* REACT BOOTSTRAP */
import { Navbar, Nav, Container, NavDropdown, } from "react-bootstrap";

/* REACT ROUTER BOOTSTRAP */
import { LinkContainer } from "react-router-bootstrap";

/* REACT - REDUX */
import { useDispatch, useSelector } from "react-redux";

/* ACTION CREATORS */
import { logout } from "../actions/userActions";
import { listCategories } from "../actions/categoryActions";
/* COMPONENTS */
import SearchBox from "./SearchBox";

import logo from "../logo.png";

import { useHistory } from "react-router-dom";


function Header() {
  /* PULLING A PART OF STATE FROM THE ACTUAL STATE IN THE REDUX STORE */
  const categoryList = useSelector((state) => state.categoryList);
  const userLogin = useSelector((state) => state.userLogin);
  const history = useHistory();
  const { userInfo } = userLogin;
  const { loading, error, categories } = categoryList;
  /* HANDLER */
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  };

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  const handleCategorySelect = (categoryId) => {
    // Điều hướng người dùng đến màn hình hiển thị sản phẩm của danh mục đó
    history.push(`/category/${categoryId}/products`);
  };
  return (
    <header >
      {/* <AppBar
      // position="fixed"
      // sx={{
      //   boxShadow: 0,
      //   bgcolor: 'transparent',
      //   backgroundImage: 'none',
      //   mt: 0,
      // }}
      >
       
      </AppBar> */}
      <Navbar bg="" variant="" expand="sm" collapseOnSelect style={{ height: '69px' }}>
        <Container>



          <Navbar.Toggle aria-controls="navbarScroll" />

          <Navbar.Collapse id="navbarScroll">
            <LinkContainer to="/">
              <Navbar.Brand>
                {/* <img alt=" Logo web" /> */} VIỆT THÀNH
              </Navbar.Brand>
            </LinkContainer>

            <LinkContainer to="/">
              <Nav.Link>
                TRANG CHỦ
              </Nav.Link>
            </LinkContainer>

            <LinkContainer to="/login">
              <Nav.Link>
                GIỚI THIỆU
              </Nav.Link>
            </LinkContainer>

            <LinkContainer to="">
              <NavDropdown title="DANH MỤC" id="basic-nav-dropdown">
                {loading ? (
                  <NavDropdown.Item>Loading...</NavDropdown.Item>
                ) : error ? (
                  <NavDropdown.Item>Error! Không thể tải danh mục.</NavDropdown.Item>
                ) : (
                  categories.map((category) => (
                    <NavDropdown.Item key={category.id} onClick={() => handleCategorySelect(category.id)}>
                      {category.name}
                    </NavDropdown.Item>
                  ))
                )}
              </NavDropdown>
            </LinkContainer>

            <Nav
              className="ms-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            ><SearchBox />
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart"></i> GIỎ HÀNG
                </Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>

                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Login
                  </Nav.Link>
                </LinkContainer>
              )}

              {userInfo && userInfo.isAdmin && (
                <LinkContainer to="/admin">
                  <Nav.Link>
                    <i className="fas fa-user"></i> ADMIN
                  </Nav.Link>
                </LinkContainer>
                // <NavDropdown title="Admin" id="adminmenu">
                //   <LinkContainer to="/admin/userlist">
                //     <NavDropdown.Item>Users</NavDropdown.Item>
                //   </LinkContainer>

                //   <LinkContainer to="/admin/category/create">
                //     <NavDropdown.Item>Categories</NavDropdown.Item>
                //   </LinkContainer>

                //   <LinkContainer to="/admin/productlist">
                //     <NavDropdown.Item>Products</NavDropdown.Item>
                //   </LinkContainer>

                //   <LinkContainer to="/admin/orderlist">
                //     <NavDropdown.Item>Orders</NavDropdown.Item>
                //   </LinkContainer>
                // </NavDropdown>
              )}
            </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar>

    </header>
  );
}

export default Header;
