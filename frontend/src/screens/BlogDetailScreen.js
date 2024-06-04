import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
const BlogDetailScreen = ({ id }) => {
    const { id: blogId } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`/api/users/blogs/${id}/`);
                setBlog(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchBlogDetail();
    }, [id]);

    return (
        <>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {blog && (
                <div>
                    <div >
                        <img src={blog.image} alt={blog.title} style={{ width: '600px', height: 'auto' }} />
                    </div>
                    <h1>{blog.title}</h1>
                    Ngày tạo: {blog.created_at}
                    <div> {blog.description}</div>
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    {/* Add more details here if needed */}
                </div>
            )}
        </>
    );
}

export default BlogDetailScreen;
