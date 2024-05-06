import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReviewsProduct } from '../actions/productActions';

const ProductComponent = ({ productId }) => {
    const dispatch = useDispatch();
    console.log("tại sao chỗ này lại là ", productId)
    // Sử dụng useSelector để lấy dữ liệu từ store
    const { loading, reviews, error } = useSelector(state => state.getReviewsProduct);

    useEffect(() => {
        const getcmtReviewsProduct = () => {
            // Dispatch the action to get the comments for the given product ID
            dispatch(getReviewsProduct(productId));
        };

        getcmtReviewsProduct(); // Call the function when the component mounts
    }, [dispatch, productId]); // Add dispatch and productId to the dependency array

    return (
        <div>
            <h2>Product Details</h2>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {reviews && reviews.length > 0 && (
                <div>
                    <h3>Reviews</h3>
                    <ul>
                        {reviews.map(review => (
                            <li key={review._id}>
                                <p>Name: {review.name}</p>
                                <p>Rating: {review.rating}</p>
                                <p>Comment: {review.comment}</p>
                                <p>Created At: {review.createdAt}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default ProductComponent;




// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { Button, Typography, Grid } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { listCategories } from "../actions/categoryActions";
// import { listProducts, deleteProduct, createProduct } from "../actions/productActions";
// import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
// import Message from "../components/Message";
// import Loader from "../components/Loader";
// import Paginate from "../components/Paginate";
// import { Link as RouterLink } from "react-router-dom";
// import { DataGrid } from '@mui/x-data-grid';

// import CommentIcon from '@mui/icons-material/Comment';
// // Import the getComment action from your actions file
// import { getReviewsProduct } from '../actions/productActions';
// function ProductListScreen({ history }) {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(listCategories());
//     console.log("Categoriesssssssssssss:", categories);
//   }, [dispatch]);
//   useEffect(() => {
//     dispatch(listCategories());
//   }, [dispatch]);

//   const categoryList = useSelector((state) => state.categoryList);
//   const { categories } = categoryList;

//   const productList = useSelector((state) => state.productList);
//   const { products, pages, page, loading, error } = productList;
//   const [comments, setComments] = useState([]);
//   const productDelete = useSelector((state) => state.productDelete);
//   const { success: successDelete, loading: loadingDelete, error: errorDelete } = productDelete;

//   const productCreate = useSelector((state) => state.productCreate);
//   const {
//     product: createdProduct,
//     success: successCreate,
//     loading: loadingCreate,
//     error: errorCreate,
//   } = productCreate;

//   const userLogin = useSelector((state) => state.userLogin);
//   const { userInfo } = userLogin;

//   let keyword = history.location.search;

//   useEffect(() => {
//     dispatch({ type: PRODUCT_CREATE_RESET });

//     if (!userInfo.isAdmin) {
//       history.push("/login");
//     }

//     if (successCreate) {
//       history.push(`/admin/product/${createdProduct._id}/edit`);
//     } else {
//       dispatch(listProducts(keyword));
//     }
//   }, [
//     dispatch,
//     history,
//     userInfo,
//     successDelete,
//     successCreate,
//     createdProduct,
//     keyword,
//   ]);

//   const deleteHandler = (id) => {
//     if (window.confirm("Are you sure you want to delete this product ?")) {
//       dispatch(deleteProduct(id));
//     }
//   };

//   const createProductHandler = () => {
//     dispatch(createProduct());
//   };

//   const getcmtReviewsProduct = (productId) => {
//     // Dispatch the action to get the comments for the given product ID
//     // tôi cân bạn consolog ra dữ liệu
//     dispatch(getReviewsProduct(productId));
//   };



//   const columns = [
//     { field: '_id', headerName: 'ID', width: 70 },
//     { field: 'name', headerName: 'NAME', width: 200 },
//     { field: 'price', headerName: 'PRICE', width: 130 },
//     { field: 'categoryName', headerName: 'CATEGORY', width: 200, },
//     { field: 'brand', headerName: 'BRAND', width: 130 },
//     {
//       field: 'action',
//       headerName: 'ACTION',
//       sortable: false,
//       width: 330,
//       renderCell: (params) => (
//         <div >
//           <Button
//             component={RouterLink}
//             to={`/admin/product/${params.row._id}/edit`}
//             variant="outlined"
//             size="small"
//             color="primary"
//             style={{ marginLeft: '5px' }}
//           >
//             Edit
//           </Button>
//           <Button
//             variant="outlined"
//             size="small"
//             color="error"
//             style={{ marginLeft: '5px' }}
//             onClick={() => deleteHandler(params.row._id)}
//           >
//             Delete
//           </Button>
//           <Button
//             startIcon={<CommentIcon />}
//             variant="outlined"
//             size="small"
//             style={{ marginLeft: '5px' }}
//             onClick={() => getcmtReviewsProduct(params.row._id)}
//           >
//             Xem
//           </Button>

//         </div>
//       ),
//     },
//   ];

//   columns.forEach(column => {
//     // console.log(column.field);
//   });

//   console.log(columns[3].field);

//   return (
//     <div>
//       <Grid container alignItems="center" justifyContent="space-between">
//         <Grid item>
//           <Typography variant="h4" component="h1">
//             Products
//           </Typography>
//         </Grid>
//         <Grid item>
//           <Button
//             component={RouterLink}
//             to="/admin/product/create"
//             variant="contained"
//             color="primary"
//           >
//             Create Product
//           </Button>
//         </Grid>
//       </Grid>

//       {loadingCreate && <Loader />}
//       {errorCreate && <Message variant="danger">{errorCreate}</Message>}

//       {loadingDelete && <Loader />}
//       {errorDelete && <Message variant="danger">{errorDelete}</Message>}

//       {loading ? (
//         <Loader />
//       ) : error ? (
//         <Message variant="danger">{error}</Message>
//       ) : (
//         <div style={{ height: 400, width: '100%' }}>
//           <DataGrid
//             rows={products}
//             columns={columns}
//             pageSize={5}
//             // checkboxSelection
//             getRowId={(row) => row._id}
//           />

//         </div>
//       )}

//       <Paginate pages={pages} page={page} isAdmin={true} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
//     </div>
//   );
// }

// export default ProductListScreen;

