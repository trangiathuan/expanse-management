import axios from "axios";
import { ChartNoAxesCombined, Eye, History, PlusCircle, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import API from "../configs/API";
import { jwtDecode } from "jwt-decode";

const Home = () => {
    const [history, setHistory] = useState(true)
    const [addExpense, setAddExpense] = useState(false)


    const [expenses, setExpense] = useState([])
    const [totalMoney, setTotalMoney] = useState({})

    const [filterDate, setFilterDate] = useState('')
    const [filterType, setFilterType] = useState('')

    const [type, setType] = useState('')
    const [amount, setAmount] = useState()
    const [category, setCategory] = useState('')
    const [date, setDate] = useState()
    const [description, setDescription] = useState()







    const filterExpenses = expenses.filter(expense => {
        const date = new Date(expense.date); // Đảm bảo rằng date là một đối tượng Date
        return (
            date.toLocaleDateString('vi-VN').includes(filterDate) &&
            expense.type.includes(filterType)
        )
    });



    localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODA4OGNiZjgyYTcxNGMzNjg4YzZjMjkiLCJ1c2VybmFtZSI6ImdpYXRodWFuIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDU0MzAyMDUsImV4cCI6MTc0NTUxNjYwNX0.SyoDkw8NAqFM84HupE5I3stcOoVLXR-cwvG4r3x655I')
    const token = localStorage.getItem('token')
    const decoded = jwtDecode(token);
    let userId = decoded.userId

    useEffect(() => {
        getExpense();
        getTotal();
    }, [])

    const getExpense = async () => {
        const results = await axios.post(`${API}/expense/getExpense`, { userId })
        if (results.data.EC === 0) {
            setExpense(results.data.response)
        }
    }
    const getTotal = async () => {
        const results = await axios.post(`${API}/expense/getTotalMoney`, { userId })
        if (results.data.EC === 0) {
            await setTotalMoney(results.data.response[0])
        }
    }

    const handleAddExpenseData = async () => {
        console.log(amount);
        console.log(type);
        console.log(category);
        console.log(date);
        console.log(description);
        const results = await axios.post(`${API}/expense/addExpense`, { userId, type, category, amount, date, description })
        if (results.data.EC === 0) {
            console.log(results.data);
            await getExpense()
            await getTotal()
            handleHistory()
            setAmount()
            setType('')
            setCategory('')
            setDate('')
            setDescription('')
        }
    }

    const handleHistory = () => {
        setHistory(!history)
        setAddExpense(false)
    }

    const handleAddExpense = () => {
        setAddExpense(!addExpense)
        setHistory(false)
    }




    return (
        <div className="w-screen overflow-x-hidden flex justify-center bg-gray-200">
            <div className="shadow-lg w-[550px] min-h-screen mt-2 bg-gray-100 rounded-lg">
                <div className="flex flex-col items-center mt-5 min-h-screen bg-gray-100">
                    <div className=" shadow-lg rounded-lg p-6 mb-6 w-[375px] max-w-sm">
                        <div className="flex items-centr space-x-5">
                            <img className="w-16 h-16 rounded-full object-cover" src='https://scontent.fsgn18-1.fna.fbcdn.net/v/t39.30808-6/479512658_1351962522704344_8795569477034108113_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHZ3GtCb8fAyfyxbYVX7ws9e4aEFlagktJ7hoQWVqCS0m5PPEugp9fl3txXdOHWO-E_nd0ucVcxCcEKPgW77XLW&_nc_ohc=Kq0UjzbkW-IQ7kNvwFdzh1f&_nc_oc=AdmWwmMe2Hxjg7SSH1X_Wv7_LmY0ZLXOiiW3181atfYtCGdG2pc8Q5NhMzHQo9ceDZIdGI9GyBjNY4dDwbgniB8E&_nc_zt=23&_nc_ht=scontent.fsgn18-1.fna&_nc_gid=35A_POF1O0iUUP30LrvZHQ&oh=00_AfEDzRy69r1xfulO2CjNHwMAinJKFoPQx6dr1zkupSKyTA&oe=680FEC07' />
                            <p className="text-2xl font-bold">Trần Gia Thuận</p>
                            <QrCode className="w-10 h-10 mt-1" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-green-600 -mt-6 ms-[86px]"><span className="text-black">Số dư: </span>{totalMoney.total ? totalMoney.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 0}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 w-full max-w-[375px]">

                        <div onClick={handleAddExpense} className="cursor-pointer shadow-lg bg-green-500 text-white rounded-lg p-0 text-center shadow-md hover:bg-green-600 transition duration-200 flex items-center justify-center">
                            <PlusCircle />
                            <p className="p-2 font-semibold">Thêm</p>

                        </div>
                        <div className="cursor-pointer shadow-lg bg-blue-500 text-white rounded-lg p-0 text-center shadow-md hover:bg-blue-600 transition duration-200 flex items-center justify-center">
                            <ChartNoAxesCombined />
                            <p className="p-2 font-semibold">Thống kê</p>
                        </div>
                        <div onClick={handleHistory} className="cursor-pointer shadow-lg bg-gray-500 text-white rounded-lg text-center shadow-md hover:bg-gray-600 transition duration-200 flex items-center justify-center">
                            <History />
                            <p className="p-2 font-semibold">Lịch sử</p>
                        </div>
                    </div>
                    {history && (
                        <div className='w-full max-w-[375px] mt-4'>
                            <div className='flex w-full'>
                                <div className="ms-auto space-x-2">
                                    <select onChange={(e) => setFilterType(e.target.value)} className="bg-white rounded-lg shadow-lg p-1 outline-none text-center font-semibold ">
                                        <option value=''>Loại</option>
                                        <option value='Thu nhập'>Thu nhập</option>
                                        <option value='Chi tiêu'>Chi tiêu</option>
                                    </select>
                                    <select onChange={(e) => setFilterDate(e.target.value)} className="bg-white rounded-lg shadow-lg p-1 outline-none text-center font-semibold ">
                                        <option value=''>Tất cả</option>
                                        <option value={new Date().toLocaleDateString('vi-VN')}>Hôm nay</option>
                                        <option value={`/1/${new Date().getFullYear()}`}>Tháng 1</option>
                                        <option value={`/2/${new Date().getFullYear()}`}>Tháng 2</option>
                                        <option value={`/3/${new Date().getFullYear()}`}>Tháng 3</option>
                                        <option value={`/4/${new Date().getFullYear()}`}>Tháng 4</option>
                                        <option value={`/5/${new Date().getFullYear()}`}>Tháng 5</option>
                                        <option value={`/6/${new Date().getFullYear()}`}>Tháng 6</option>
                                        <option value={`/7/${new Date().getFullYear()}`}>Tháng 7</option>
                                        <option value={`/8/${new Date().getFullYear()}`}>Tháng 8</option>
                                        <option value={`/9/${new Date().getFullYear()}`}>Tháng 9</option>
                                        <option value={`/10/${new Date().getFullYear()}`}>Tháng 10</option>
                                        <option value={`/11/${new Date().getFullYear()}`}>Tháng 11</option>
                                        <option value={`/12/${new Date().getFullYear()}`}>Tháng 12</option>
                                    </select>
                                </div>

                            </div>
                            {expenses.length > 0 ? (
                                filterExpenses.map((item, index) => {
                                    const date = new Date(item.date);
                                    const formattedDate = isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString('vi-VN');
                                    return (
                                        <div key={index} className="shadow-lg rounded-lg mt-2 bg-white">
                                            <div className="cursor-pointer flex justify-between">
                                                <p className="mt-1 ms-2 text-sm font-semibold text-gray-500">{formattedDate}</p>
                                                <p className="mt-1 me-2 text-sm font-semibold text-gray-500 flex items-center"><Eye className="w-4 h-4 me-1" />Chi tiết</p>
                                            </div>
                                            <div className="flex space-x-1 p-1 text-sm pb-2">
                                                <p className={`${item.type === 'Chi tiêu' ? 'bg-red-200 text-red-600 rounded-lg' : 'bg-green-200 text-green-600 rounded-lg'} font-semibold w-24 h-7 p-1 flex justify-center items-center`}>{item.type}</p>
                                                <p className={`bg-gray-100 ${item.type === 'Chi tiêu' ? 'text-red-600' : 'text-green-600'}  rounded-lg font-semibold w-28 h-7 p-1 flex justify-center`}>{item.type === 'Chi tiêu' ? '-' : '+'} {item.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                                <p className="bg-yellow-200 text-yellow-600 rounded-lg font-semibold w-20 h-7 p-1 flex justify-center">{item.category}</p>
                                                <p className="bg-blue-200 text-blue-600 rounded-lg font-semibold w-28 h-7 p-1 flex justify-center">{item.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) :
                                (
                                    <div className="text-center mt-20">Loading...</div>
                                )
                            }

                        </div>
                    )}

                    {addExpense && (
                        <div className='w-full max-w-[375px] mt-5 shadow-lg rounded-lg border bg-white'>
                            <p className="font-bold text-xl text-center pt-2 pb-2">THÊM CHI PHÍ</p>
                            <div className="grid grid-cols-2 gap-2 p-2">
                                <div className="flex flex-col">
                                    <label className="font-semibold pb-1">Loại phí</label>
                                    <select onChange={(e) => { setType(e.target.value) }} className="border rounded-lg h-9 text-center bg-white shadow-md outline-none">
                                        <option value=''>Chọn loại phí</option>
                                        <option value='Thu nhập'>Thu nhập</option>
                                        <option value='Chi tiêu'>Chi tiêu</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-semibold pb-1">Số tiền</label>
                                    <input value={amount} onChange={(e) => { setAmount(e.target.value) }} type="number" placeholder="Nhập số tiền" className="border rounded-lg h-9 w-44 mt-1 text-center outline-none shadow-md " />
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-semibold pb-1">Nhãn</label>
                                    <select value={category} onChange={(e) => { setCategory(e.target.value) }} className="border rounded-lg h-9 text-center bg-white shadow-md outline-none">
                                        <option value=''>Chọn nhãn</option>
                                        <option value='Đi chơi'>Đi chơi</option>
                                        <option value='Ăn uống'>Ăn uống</option>
                                        <option value='Mua sắm'>Mua sắm</option>
                                        <option value='Giải trí'>Giải trí</option>
                                        <option value='Nhận tiền'>Nhận tiền</option>
                                        <option value='Khác'>Khác</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-semibold pb-1">Ngày</label>
                                    <input value={date} onChange={(e) => { setDate(e.target.value) }} type="date" className="border rounded-lg h-9 w-44 text-center outline-none bg-white shadow-md" />
                                </div>

                            </div>
                            <div className="p-2 flex flex-col">
                                <label className="font-semibold pb-1">Ghi chú</label>
                                <textarea value={description} onChange={(e) => { setDescription(e.target.value) }} type="text" className="border rounded-lg h-16 p-2 shadow-md outline-none" />
                            </div>
                            <div className="w-full flex">
                                <button onClick={handleAddExpenseData} className="font-semibold border ms-auto m-2 rounded-lg h-9 w-16 bg-green-500 text-white hover:bg-green-700 text-center transition duration-200">Thêm</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div >

    );
}
export default Home