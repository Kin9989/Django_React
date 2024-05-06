// ProductViewComments.js

import React from "react";
import { useParams } from "react-router-dom";
import ProductComponent from '../components/ProductComponent';

const ProductViewComments = () => {
    const { productId } = useParams();
    console.log("chỗ này v", productId)

    return (
        <>
            <hiii />
            <ProductComponent productId={productId} />
        </>
    );
}

export default ProductViewComments;
