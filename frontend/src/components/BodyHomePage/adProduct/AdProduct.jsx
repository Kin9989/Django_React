import React from "react";

import './adproduct.css'
const AdProduct = () => {
    return (
        <div style={{ overflow: "hidden" }}>
            <div>
                <section className="hero">
                    <div className="hero-inner" id="section-0">
                        <figure />
                        <h2 className="hero__title">Explore our world</h2>
                    </div>
                    <div className="hero-inner" id="section-1">
                        <figure />
                        <h2 className="hero__title">View all its beauty</h2>
                    </div>
                    <div className="hero-inner" id="section-2">
                        <figure />
                        <h2 className="hero__title">Take lots of photos</h2>
                    </div>
                    <div className="hero-inner" id="section-3">
                        <figure />
                        <h2 className="hero__title">Chào mừng bạn đến với <br></br> Nội Thất Việt Thành</h2>


                    </div>
                </section>
                <section className="content" style={{ background: '#f8bbd0' }}>
                    <article className="content__inner">
                        <h1 className="content__title">Giới Thiệu về sản phẩm chúng tôi</h1>
                        <h3 className="content__author">noithatvietthanh.com</h3>

                        <blockquote cite="Bob Ross">AbcXyz</blockquote>
                        <h5>
                            dadasdasdajsdjjsd ajd
                            dá
                            đá
                            ád
                        </h5>

                    </article>
                </section>
            </div>


            <div className="swiper-container">
                <div className="swiper-wrapper">

                    <div className="swiper-slide">
                        <div className="container-general">
                            <div className="gallery-wrap wrap-effect-3">
                                <div className="item" />
                                <div className="item" />
                                <div className="item" />
                                <div className="item" />
                                <div className="item" />
                            </div>
                        </div>
                    </div>


                </div>
            </div>

        </div>
    );
}

export default AdProduct;