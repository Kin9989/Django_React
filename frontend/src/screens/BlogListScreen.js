
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import Loader from "../components/Loader";
import Message from "../components/Message";
import Button from '@mui/material/Button';
import { LinkContainer } from "react-router-bootstrap";
// import { Table, Button } from "react-bootstrap";
// mui
// as RouterLink 
import { Link as RouterLink } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Grid } from "@mui/material";
import CommentIcon from '@mui/icons-material/Comment';
import Box from '@mui/material/Box';
const BlogListScreen = () => {

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('/api/users/blogs/');
                const blogsWithId = response.data.map((blog, index) => ({
                    id: index, // Add a unique id for each blog
                    ...blog,
                }));
                setBlogs(blogsWithId);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const deleteHandler = async (id) => {
        try {
            const response = await axios.delete(`/api/users/blogs/delete/${id}/`);
            if (response.status === 200) {
                window.location.reload();
            } else {
                alert('Đang có lỗi xảy ra vui lòng chờ trong giây lát');
            }
        } catch (error) {

        }
    };


    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'title', headerName: 'Title', width: 200 },
        { field: 'description', headerName: 'Description', width: 400 },
        {
            field: 'action',
            headerName: 'ACTION',
            sortable: false,
            width: 400,
            renderCell: (params) => (
                <div>


                    <LinkContainer
                        to={`/admin/blog/${params.row.id}/edit`}
                        style={{ marginLeft: '5px' }}>
                        <Button variant="dark" className="btn-sm" >
                            Chỉnh sửa
                        </Button>
                    </LinkContainer>



                    <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        style={{ marginLeft: '5px' }}
                        onClick={() => deleteHandler(params.row.id)}

                    >
                        Delete
                    </Button>


                </div>
            ),
        },

    ];


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

        <Box sx={{ height: 400, width: '100%' }}>
            <div style={{ height: 'fitContent', width: '100%' }}>

                <DataGrid rows={blogs}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5]}

                    disableRowSelectionOnClick
                />

            </div>


        </Box>

    </>);
}

export default BlogListScreen;