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

    const dispatch = useDispatch();
    const orderStats = useSelector((state) => state.orderStats);
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

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

    }, [dispatch]);

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
                Slide in alert dialog
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
                        <div>
                            <label htmlFor="day">Day:</label>
                            <input
                                type="number"
                                id="day"
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="month">Month:</label>
                            <input
                                type="number"
                                id="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="year">Year:</label>
                            <input
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
                                    {statsData.orders?.map((order) => (
                                        <li key={order._id}>
                                            Order ID: {order._id}, Total Price: {order.totalPrice}, Paid At: {order.paidAt.substring(0, 10)}
                                        </li>
                                    ))}
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