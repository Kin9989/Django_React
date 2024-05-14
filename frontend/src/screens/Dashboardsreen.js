import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getOrderStatsUP } from '../actions/orderActions'; // Đảm bảo import action creator để gọi API
import { useDispatch, useSelector } from 'react-redux';
import StatsDMY from '../components/AdminCom/StatDMY';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { fileToObject } from 'antd/lib/upload/utils';
const TrangCuaBan = () => {
    const dispatch = useDispatch();
    const orderStats = useSelector((state) => state.orderStats);
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    useEffect(() => {
        // Dispatch action to fetch order statistics
        dispatch(getOrderStatsUP());
    }, [dispatch]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/orders/stats/UP/');
                setStatsData(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (error) {
        return <div>Lỗi: {error.message}</div>;
    }

    return (
        <div>
            <StatsDMY></StatsDMY>
            <h1>Sản phẩm được mua nhiều nhất </h1>
            <p>Tên sản phẩm :{statsData.topProductPaid.name}</p>
            <p>Tổng Số Lượng: {statsData.topProductPaid.total_qty}</p>

            <h1>Người dùng chi tiêu nhiều nhất:</h1>
            <p>ID Người dùng: {statsData.userPaidMoneyHigh.user_id}</p>
            <p>Tên người dùng: {statsData.userPaidMoneyHigh.user__username}</p>
            <p>Tổng số tiền: {statsData.userPaidMoneyHigh.total_money}</p>

            <h1>Người dùng có số lượng đơn hàng cao nhất:</h1>
            <p>ID Người dùng: {statsData.userBoughtHigh.user_id}</p>
            <p>Tên người dùng: {statsData.userBoughtHigh.user__username}</p>
            <p>Tổng số đơn hàng: {statsData.userBoughtHigh.total_orders}</p>

            <Grid container spacing={2}>
                <Grid xs={12} md={5}>
                    <h1>Đánh giá sản phẩm:</h1>
                    {/* 
                    {statsData.rateProduct.map((product, index) => (
                        <div key={index}>
                            <p>Tên: {product.name}</p>
                            <p>Tổng số đơn hàng: {product.total_orders}</p>
                        </div>
                    ))} */}

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 'fit-content' }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Xếp hạng</TableCell>
                                    <TableCell>Tên sản phẩm</TableCell>
                                    <TableCell>Tổng số đơn hàng</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>


                                {statsData.rateProduct.map((product, index) => (
                                    <TableRow
                                        key={index}

                                    >

                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.total_orders}</TableCell>


                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid xs={12} md={7}>
                    <h1>Đánh giá người dùng:</h1>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 'fit-content' }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Xếp hạng</TableCell>
                                    <TableCell>Tên Khách hàng</TableCell>


                                    <TableCell>Tổng số tiền đã mua</TableCell>
                                    <TableCell>Tổng số đơn hàng đã mua</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>


                                {statsData.rateUser.map((user, index) => (
                                    <TableRow
                                        key={index}

                                    >

                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{user.user__first_name}</TableCell>
                                        <TableCell>{user.total_money}</TableCell>
                                        <TableCell>{user.total_orders}</TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* {statsData.rateUser.map((user, index) => (
                <div key={index}>
                    <p>ID Người dùng: {user.user_id}</p>
                    <p>Tên người dùng: {user.user__username}</p>
                    <p>Tổng số đơn hàng: {user.total_orders}</p>
                    <p>Tổng số tiền: {user.total_money}</p>
                </div>
            ))} */}
                </Grid>

            </Grid>





        </div>
    );
};

export default TrangCuaBan;
