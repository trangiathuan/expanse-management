import { useState } from "react";
import {
    Line
} from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Legend,
    Tooltip
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip);

const today = new Date();
const currentMonth = today.getMonth() + 1;
const currentYear = today.getFullYear();




const Statistical = ({ expenses }) => {
    const [hiddenDate, setHiddenDate] = useState(false);
    const [hiddenMounth, setHiddenMounth] = useState(true);
    const [hiddenYear, setHiddenYear] = useState(false);
    const [mode, setMode] = useState("thang");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedMonth, setSelectedMonth] = useState(`${currentMonth} / ${currentYear}`);
    const [selectedYear, setSelectedYear] = useState("");

    const filterData = () => {
        let data = [];

        if (mode === "ngay" && selectedDate) {
            const dateSelected = new Date(selectedDate);
            const dayStr = dateSelected.toDateString();

            // Lọc ra các expense trong ngày đó
            const filtered = expenses.filter(e => {
                const d = new Date(e.createdAt || e.date); // ưu tiên createdAt nếu có
                return d.toDateString() === dayStr;
            });

            // Gom theo giờ
            const hourMap = {};

            filtered.forEach(e => {
                const d = new Date(e.createdAt || e.date);
                const hour = d.getHours();

                if (!hourMap[hour]) {
                    hourMap[hour] = { income: 0, expense: 0 };
                }

                if (e.type === "Thu nhập") {
                    hourMap[hour].income += e.amount;
                } else if (e.type === "Chi tiêu") {
                    hourMap[hour].expense += e.amount;
                }
            });

            data = Object.entries(hourMap).map(([hour, values]) => ({
                label: `${hour}:00`,
                income: values.income,
                expense: values.expense
            }));

            // Sắp xếp theo giờ
            data.sort((a, b) => parseInt(a.label) - parseInt(b.label));
        }

        if (mode === "thang" && selectedMonth) {
            const [month, year] = selectedMonth.split("/").map(str => parseInt(str));

            // Lọc các khoản chi tiêu/thunhap trong tháng
            const filtered = expenses.filter(e => {
                const d = new Date(e.date);
                return d.getMonth() + 1 === month && d.getFullYear() === year;
            });

            // Gom theo từng ngày
            const dayMap = {};

            filtered.forEach(e => {
                const d = new Date(e.date);
                const key = d.toISOString().split('T')[0]; // YYYY-MM-DD

                if (!dayMap[key]) {
                    dayMap[key] = { income: 0, expense: 0 };
                }

                if (e.type === "Thu nhập") {
                    dayMap[key].income += e.amount;
                } else if (e.type === "Chi tiêu") {
                    dayMap[key].expense += e.amount;
                }
            });

            // Chỉ lấy ngày có dữ liệu
            data = Object.entries(dayMap).map(([date, values]) => ({
                label: new Date(date).toLocaleDateString("vi-VN"),
                income: values.income,
                expense: values.expense
            }));

            data.sort((a, b) => {
                const [dayA, monthA, yearA] = a.label.split("/").map(Number);
                const [dayB, monthB, yearB] = b.label.split("/").map(Number);
                return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
            });
        }



        if (mode === "nam" && selectedYear) {
            const year = parseInt(selectedYear);
            data = Array.from({ length: 12 }, (_, i) => {
                const monthData = expenses.filter(e => {
                    const d = new Date(e.date);
                    return d.getFullYear() === year && d.getMonth() === i;
                });

                const thuNhap = monthData.filter(e => e.type === "Thu nhập").reduce((sum, e) => sum + e.amount, 0);
                const chiTieu = monthData.filter(e => e.type === "Chi tiêu").reduce((sum, e) => sum + e.amount, 0);

                return {
                    label: `Tháng ${i + 1}`,
                    income: thuNhap,
                    expense: chiTieu
                };
            });
        }

        return data;
    };

    const chartData = () => {
        const data = filterData();
        return {
            labels: data.map(d => d.label),
            datasets: [
                {
                    label: "Tổng thu nhập",
                    data: data.map(d => d.income),
                    borderColor: "green",
                    backgroundColor: "green",
                    tension: 0.4
                },
                {
                    label: "Tổng chi tiêu",
                    data: data.map(d => d.expense),
                    borderColor: "red",
                    backgroundColor: "red",
                    tension: 0.4
                }
            ]
        };
    };

    return (
        <div>
            <div className="flex">
                <div className="ms-auto space-x-2 mt-4">
                    <input
                        type="date"
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className={` ${hiddenDate ? '' : 'hidden'} bg-white rounded-lg shadow-lg p-1 outline-none text-center font-semibold w-[157px] placeholder-black `}
                    />
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className={`${hiddenMounth ? '' : 'hidden'} bg-white rounded-lg shadow-lg p-[5px] outline-none text-center font-semibold`}>
                        <option value=''>Chọn tháng</option>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={`${i + 1}/${new Date().getFullYear()}`}>Tháng {i + 1}</option>
                        ))}
                    </select>
                    <select
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className={`${hiddenYear ? '' : 'hidden'} bg-white rounded-lg shadow-lg p-[5px] outline-none text-center font-semibold `}>
                        <option value=''>Chọn năm</option>
                        <option value='2024'>2024</option>
                        <option value='2025'>2025</option>
                    </select>
                    <select
                        className="bg-white rounded-lg shadow-lg p-[5px] outline-none text-center font-semibold"
                        onChange={(e) => {
                            const value = e.target.value;
                            setMode(value);
                            const today = new Date();
                            const currentMonth = today.getMonth() + 1;
                            const currentYear = today.getFullYear();

                            if (value === 'ngay') {
                                setHiddenDate(true);
                                setHiddenMounth(false);
                                setHiddenYear(false);
                                setSelectedDate('');  // reset giá trị ngày khi chuyển mode
                            } else if (value === 'thang') {
                                setSelectedMonth(`${currentMonth}/${currentYear}`);
                                setHiddenMounth(true);
                                setHiddenDate(false);
                                setHiddenYear(false);
                                setSelectedDate('');  // reset ngày
                                setSelectedYear('');  // reset năm
                            } else if (value === 'nam') {
                                setSelectedYear(`${currentYear}`);
                                setHiddenYear(true);
                                setHiddenMounth(false);
                                setHiddenDate(false);
                                setSelectedDate('');  // reset ngày
                                setSelectedMonth(''); // reset tháng
                            }
                        }}
                        value={mode}
                    >
                        <option value='ngay'>Ngày</option>
                        <option value='thang'>Tháng</option>
                        <option value='nam'>Năm</option>
                    </select>
                </div>
            </div>

            <div className='shadow-sm border rounded-lg mt-4 p-1 mb-6 w-[375px] font-semibold'>
                <Line
                    className="h-[280px]"
                    data={chartData()}
                    options={{
                        maintainAspectRatio: false
                    }} />
            </div>
        </div>
    );
};

export default Statistical;
