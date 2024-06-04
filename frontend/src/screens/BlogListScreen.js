
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../components/Loader";
import Message from "../components/Message";
import Button from '@mui/material/Button';

// mui
// as RouterLink 
import { Link as RouterLink } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Grid } from "@mui/material";
import CommentIcon from '@mui/icons-material/Comment';
const BlogListScreen = () => {
    return (<>

        <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
                <h1>QUẢN LÝ Bài Viết</h1>
            </Grid>
            <Grid item xs={12} md={5} style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>

                <Button className="my-3" variant="contained" style={{ background: 'black' }} component={RouterLink} to="/admin/blog/create">
                    <i className="fas fa-plus"></i> Tạo bài viết
                </Button>

            </Grid>

        </Grid>
    </>);
}

export default BlogListScreen;