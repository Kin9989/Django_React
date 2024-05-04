// CategoryListScreen.js

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { listCategories, deleteCategory } from "../actions/categoryActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const CategoryListScreen = ({ history }) => {
    const dispatch = useDispatch();

    const categoryList = useSelector((state) => state.categoryList);
    const { loading, error, categories } = categoryList;

    const categoryDelete = useSelector((state) => state.categoryDelete);
    const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
    } = categoryDelete;

    useEffect(() => {
        dispatch(listCategories());
    }, [dispatch, successDelete]);

    const deleteHandler = (id) => {
        if (window.confirm("Are you sure?")) {
            dispatch(deleteCategory(id));
        }
    };

    return (
        <div>
            <h1>Categories</h1>
            {loadingDelete && <Loader />}
            {errorDelete && <Message variant="danger">{errorDelete}</Message>}
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>
                                    <Link
                                        to={`/admin/category/${category._id}/edit`}
                                        className="btn btn-sm btn-primary"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </Link>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => deleteHandler(category._id)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CategoryListScreen;
