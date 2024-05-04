import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createCategory } from "../actions/categoryActions";

const CategoryCreateScreen = () => {
    const [name, setName] = useState("");

    const dispatch = useDispatch();

    const categoryCreate = useSelector((state) => state.categoryCreate);

    // Kiểm tra nếu categoryCreate không được khởi tạo
    if (!categoryCreate) {
        return <p>Loading...</p>; // Hoặc hiển thị bất kỳ UI loading nào bạn muốn
    }

    const { loading, error, success } = categoryCreate;

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(createCategory(name));
    };

    return (
        <div>
            <h1>Create Category</h1>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {success && <p>Category created successfully</p>}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter category name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>
                <Button type="submit" variant="primary">
                    Create
                </Button>
            </Form>
        </div>
    );
};

export default CategoryCreateScreen;
