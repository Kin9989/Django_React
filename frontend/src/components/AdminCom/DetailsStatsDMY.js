import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function DetailsStatsDMY() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const dispatch = useDispatch();
    const orderStats = useSelector((state) => state.orderStats);
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get('/api/orders/stats/UP/');
    //             setStatsData(response.data);
    //             setLoading(false);
    //         } catch (error) {
    //             setError(error);
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();

    // }, [dispatch]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post('api/orders/stats/total/DMY/', {
                day: selectedDay,
                month: selectedMonth,
                year: selectedYear
            });
            setStatsData(response.data);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                Xem thống kê chi tiết
            </Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Xem thống kê chi tiết</DialogTitle>
                <DialogContent style={{ width: 'fit-content', height: 'fit-content' }}>
                    <div>
                        <div style={{ display: 'flex', }}>

                            <TextField label="Day" variant="outlined"
                                style={{ marginRight: '10px' }}
                                type="number"
                                id="day"
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(e.target.value)}
                            />



                            <TextField
                                style={{ marginRight: '10px' }}

                                label="Month"
                                variant="outlined"
                                type="number"
                                id="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            />

                            <TextField
                                label="Year"
                                variant="outlined"
                                type="number"
                                id="year"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            />


                        </div>
                        <button onClick={handleSubmit}>Get Statistics</button>

                        {loading && <div>Loading...</div>}
                        {error && <div>Error: {error.message}</div>}
                        {statsData && (
                            <div>

                                <h2>Total Orders: {statsData.total_orders}</h2>
                                <h2>Total Revenue: {statsData.total_revenue}</h2>
                                <h2>Orders:</h2>
                                <ul>
                                    {/* {statsData.orders?.map((order) => (
                                        <li key={order._id}>
                                            Order ID: {order._id}, Total Price: {order.totalPrice},
                                        </li>
                                    ))} */}


                                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                        <TableContainer sx={{ maxHeight: 440 }}>
                                            <Table stickyHeader aria-label="sticky table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Mã đơn hàng</TableCell>
                                                        <TableCell>Tổng tiền</TableCell>

                                                    </TableRow>

                                                </TableHead>

                                                <TableBody>
                                                    {statsData.orders
                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        .map((order) => (
                                                            <TableRow hover role="checkbox" tabIndex={-1} key={order._id}>
                                                                <TableCell>{order._id}</TableCell>
                                                                <TableCell>{order.totalPrice}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                </TableBody>
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 25, 100]}
                                                    component="div"
                                                    count={statsData.orders ? statsData.orders.length : 0}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                                />
                                            </Table>
                                        </TableContainer>

                                    </Paper>
                                </ul>

                            </div>
                        )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Đóng</Button>

                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// import { useDispatch, useSelector } from 'react-redux';

// const StatsDMY = () => {
//     const dispatch = useDispatch();
//     const orderStats = useSelector((state) => state.orderStats);
//     const [statsData, setStatsData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedDay, setSelectedDay] = useState('');
//     const [selectedMonth, setSelectedMonth] = useState('');
//     const [selectedYear, setSelectedYear] = useState('');

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get('/api/orders/stats/UP/');
//                 setStatsData(response.data);
//                 setLoading(false);
//             } catch (error) {
//                 setError(error);
//                 setLoading(false);
//             }
//         };

//         fetchData();

//     }, [dispatch]);

//     const handleSubmit = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.post('api/orders/stats/total/DMY/', {
//                 day: selectedDay,
//                 month: selectedMonth,
//                 year: selectedYear
//             });
//             setStatsData(response.data);
//             setLoading(false);
//         } catch (error) {
//             setError(error);
//             setLoading(false);
//         }
//     };

//     return (
// <div>
//     <div>
//         <label htmlFor="day">Day:</label>
//         <input
//             type="number"
//             id="day"
//             value={selectedDay}
//             onChange={(e) => setSelectedDay(e.target.value)}
//         />
//     </div>
//     <div>
//         <label htmlFor="month">Month:</label>
//         <input
//             type="number"
//             id="month"
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(e.target.value)}
//         />
//     </div>
//     <div>
//         <label htmlFor="year">Year:</label>
//         <input
//             type="number"
//             id="year"
//             value={selectedYear}
//             onChange={(e) => setSelectedYear(e.target.value)}
//         />
//     </div>
//     <button onClick={handleSubmit}>Get Statistics</button>

//     {loading && <div>Loading...</div>}
//     {error && <div>Error: {error.message}</div>}
//     {statsData && (
//         <div>

//             <h2>Total Orders: {statsData.total_orders}</h2>
//             <h2>Total Revenue: {statsData.total_revenue}</h2>
//             <h2>Orders:</h2>
//             <ul>
//                 {statsData.orders?.map((order) => (
//                     <li key={order._id}>
//                         Order ID: {order._id}, Total Price: {order.totalPrice}, Paid At: {order.paidAt.substring(0, 10)}
//                     </li>
//                 ))}
//             </ul>

//         </div>
//     )}
// </div>
//     );
// };

// export default StatsDMY;