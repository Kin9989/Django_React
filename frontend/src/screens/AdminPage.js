import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';


// import page 
import UserListScreen from "./UserListScreen";
import UserEditScreen from "./UserEditScreen";
import ProductListScreen from "./ProductListScreen";
import ProductEditScreen from "./ProductEditScreen";
import ProductCreateScreen from "./ProductCreateScreen";

import CategoryListScreen from "./CategoryListScreen";
import CategoryCreateScreen from "./CategoryCreateScreen";
import CategoryEditScreen from "./CategoryEditScreen";

import OrderListScreen from "./OrderListScreen";
import ProductViewComments from "./ProductViewComments";


import { HashRouter as Router, Route } from "react-router-dom";

import AdminDashboard from '../components/AdminCom/AdminDashboard';
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function FullWidthGrid() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={3} md={2}>

                    <AdminDashboard></AdminDashboard>

                </Grid>
                <Grid item xs={9} md={10}>
                    <Router>

                        {/* admin manage category  */}
                        <Route path="/admin/categorieslist" component={CategoryListScreen} />
                        <Route path="/admin/category/create" component={CategoryCreateScreen} />
                        <Route path="/admin/category/:id/edit" component={CategoryEditScreen} />

                        <Route path="/admin/userlist" component={UserListScreen} />
                        <Route path="/admin/user/:id/edit" component={UserEditScreen} />

                        {/* admin manage product  */}
                        <Route path="/admin/product/:id/edit" component={ProductEditScreen} />
                        <Route path="/admin/product/create" component={ProductCreateScreen} />
                        <Route path="/admin/productlist" component={ProductListScreen} />

                        {/* admin manage oder */}
                        <Route path="/admin/orderlist" component={OrderListScreen} />

                        <Route path="/admin/product/:productId/reviews" component={ProductViewComments} />

                    </Router>

                </Grid>

            </Grid>
        </Box>
    );
}
