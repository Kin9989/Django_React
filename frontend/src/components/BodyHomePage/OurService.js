import React from "react";
import "../BodyHomePage/adProduct/adproduct.css";
const OurService = () => {
    return (
        <div>
            <h1>Dịch vụ của chúng tôi</h1>

            <div className="swiper-container">
                <div className="swiper-wrapper">
                    <div className="swiper-slide">
                        <div className="container-general">
                            <div className="gallery-wrap wrap-effect-3">
                                <div className="item" style={{ display: 'flex', }}>
                                    <span className="item_span_text"
                                        style={{ display: 'flex', margin: '0 auto', alignItems: "flex-end", }}>
                                        Thiết Kế</span></div>

                                <div className="item" style={{ display: 'flex', }}>
                                    <span className="item_span_text"
                                        style={{ display: 'flex', margin: '0 auto', alignItems: "flex-end", }}>
                                        Thi Công </span>
                                </div>

                                <div className="item" style={{ display: 'flex', }}>
                                    <span className="item_span_text"
                                        style={{ display: 'flex', margin: '0 auto', alignItems: "flex-end", }}
                                    >Bán Lẻ</span>
                                </div>

                                <div className="item" style={{ display: 'flex', }}>
                                    <span className="item_span_text"
                                        style={{ display: 'flex', margin: '0 auto', alignItems: "flex-end", }}>
                                        Sản Xuất</span>
                                </div>
                                {/* <div className="item"></div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OurService;