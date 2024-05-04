import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { createProduct } from "../actions/productActions";
import { listCategories } from "../actions/categoryActions";
import axios from "axios";

const ProductCreateScreen = ({ match, history }) => {
    const productId = match.params.id;
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState(""); // Khởi tạo mà không có giá trị mặc định
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState("");

    const [uploading, setUploading] = useState(false);
    const dispatch = useDispatch();

    const productCreate = useSelector((state) => state.productCreate);
    const { loading, error, success } = productCreate;

    const categoryList = useSelector((state) => state.categoryList);
    const { loading: categoryLoading, error: categoryError, categories } = categoryList;

    useEffect(() => {
        if (success) {
            history.push("/admin/productlist");
        }
        dispatch(listCategories());
        console.log("Categories:", categories);
    }, [dispatch, history, success]);

    const submitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('brand', brand);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('countInStock', countInStock);
        formData.append('image', image); // Thêm hình ảnh vào FormData

        dispatch(createProduct(formData));
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();

        formData.append("image", file);
        // Kiểm tra nếu productId tồn tại thì mới thêm vào formData
        if (productId) {
            formData.append("product_id", productId);
        }

        setUploading(true);

        try {
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            const { data } = await axios.post(
                "/api/products/upload/",
                formData,
                config
            );

            setImage(data); // Ở đây data trả về từ server sẽ là URL của ảnh
            setUploading(false);
        } catch (error) {
            setUploading(false);
        }
    };


    return (
        <FormContainer>
            <h1>Create Product</h1>
            {loading && <Loader />}
            {error && <Message variant="danger">{error}</Message>}
            {categoryLoading ? (
                <Loader />
            ) : categoryError ? (
                <Message variant="danger">{categoryError}</Message>
            ) : (
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="price">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="image">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])} // Lưu hình ảnh vào state khi người dùng chọn
                        />
                        {uploading && <Loader />}
                    </Form.Group>

                    <Form.Group controlId="brand">
                        <Form.Label>Brand</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter brand"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Control
                        as="select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </Form.Control>



                    <Form.Group controlId="countInStock">
                        <Form.Label>Count In Stock</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter countInStock"
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary">
                        Create
                    </Button>
                </Form>
            )}

            <Link to="/admin/productlist" className="btn btn-light my-3">
                Go Back
            </Link>
        </FormContainer>
    );
};

export default ProductCreateScreen;
