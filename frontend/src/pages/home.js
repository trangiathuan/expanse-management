import axios from "axios";
import { ChartNoAxesCombined, Eye, EyeOff, History, PlusCircle, QrCode, Settings, X } from "lucide-react";
import { useEffect, useState } from "react";
import API from "../configs/API";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import { ClipLoader } from 'react-spinners';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [history, setHistory] = useState(true)
    const [addExpense, setAddExpense] = useState(false)
    const [qr, setQr] = useState(false)
    const [setting, setSetting] = useState(false)
    const [hiddenMoney, setHiddenMoney] = useState(false)

    const navigate = useNavigate()


    const [expenses, setExpense] = useState([])
    const [totalMoney, setTotalMoney] = useState({})
    const [detail, setDetail] = useState(null)

    console.log(detail);

    const [filterDate, setFilterDate] = useState('')
    const [filterDateEnter, setFilterDateEnter] = useState('')
    const [filterType, setFilterType] = useState('')

    const [type, setType] = useState('')
    const [amount, setAmount] = useState()
    const [category, setCategory] = useState('')
    const [date, setDate] = useState()
    const [description, setDescription] = useState()

    const filterExpenses = expenses.filter(expense => {
        const date = new Date(expense.date); // Đảm bảo rằng date là một đối tượng Date
        return (
            date.toLocaleDateString('vi-VN').includes(filterDate || filterDateEnter) &&
            expense.type.includes(filterType)
        )
    });

    const token = localStorage.getItem('token')
    const decoded = jwtDecode(token);
    let userId = decoded.userId
    let fullName = decoded.fullName
    let avt = decoded.avt

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
        if (!validation()) return
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
    const validation = () => {
        if (!type) {
            toast.warn('Hạng mục không dược bỏ trống')
            return false
        }
        if (!amount) {
            toast.warn('Bạn chưa nhập số tiền')
            return false
        }
        if (!category) {
            toast.warn('Bạn chưa chọn nhãn')
            return false
        }
        if (!date) {
            toast.warn('Bạn chưa chọn ngày')
            return false
        }
        return true
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')

    }

    return (
        <div className="w-full overflow-x-hidden flex justify-center bg-gray-200">
            <ToastContainer />
            <div className="shadow-lg w-[550px] min-h-screen mt-2 mb-2 bg-gray-100 rounded-lg overflow-y-hidden">
                <div className="flex flex-col items-center mt-4 mb-4 min-h-screen bg-gray-100">
                    <div className=" shadow-md rounded-lg p-6 mb-6 w-[375px] max-w-sm">
                        <div className="flex">
                            <img className="w-16 h-16 rounded-full object-cover" src={avt} />
                            <p className="ms-5 w-44 text-xl font-bold truncate">{fullName}</p>
                        </div>
                        <div className="flex">
                            <p className="text-xl font-bold text-green-600 -mt-9 ms-[86px]  transition duration-200"><span className="text-black">Số dư: </span>{totalMoney.total ? hiddenMoney ? totalMoney.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : <span className="text-sm transition duration-200">✷✷✷✷✷✷</span> : 0}</p>
                            {hiddenMoney ? <Eye onClick={() => setHiddenMoney(false)} className="w-4 h-4 -mt-7 ms-auto me-8 transition duration-200" />
                                : <EyeOff onClick={() => setHiddenMoney(true)} className="w-4 h-4 -mt-7 ms-auto me-8 transition duration-200" />}
                        </div>
                        <div className="flex">
                            <QrCode onClick={() => { setQr(true) }} className="w-5 h-5 mt-0 ms-[86px] me-5 cursor-pointer" />
                            <Settings onClick={() => { setSetting(true) }} className="w-5 h-5 mt-0 cursor-pointer" />
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
                    {qr && (
                        <div className="fixed inset-0 flex justify-center pt-48 z-50 overflow-x-hidden">
                            <div className="absolute inset-0 bg-black opacity-50"></div>
                            <div className="relative z-10">
                                <div className="flex w-[270px] h-[290px] bg-white rounded-lg">
                                    <div className="flex">
                                        <X onClick={() => { setQr(false) }} className="fixed ms-[230px] pt-2 w-8 h-8 cursor-pointer" />
                                    </div>
                                    <div>
                                        <img className="rounded-lg" src='https://res.cloudinary.com/dteuqunrm/image/upload/v1745506633/QR_code_hpbssw.jpg' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {setting && (
                        <div className="fixed inset-0 flex justify-center pt-48 z-50 overflow-x-hidden">
                            <div className="absolute inset-0 bg-black opacity-50"></div>
                            <div className="relative z-10">
                                <div className="flex w-[270px] h-auto bg-white rounded-lg">
                                    <div className="flex">
                                        <X onClick={() => { setSetting(false) }} className="fixed ms-[230px] pt-2 w-8 h-8 cursor-pointer" />
                                    </div>
                                    <div className="p-8 text-xl font-semibold space-y-1 pt-12 pb-12">
                                        <p className="flex ps-1 bg-gray-100 w-52 rounded-lg h-12 items-center">optin 1</p>
                                        <p className="flex ps-1 bg-gray-100 w-52 rounded-lg h-12 items-center">optin 2</p>
                                        <p className="flex ps-1 bg-gray-100 w-52 rounded-lg h-12 items-center">optin 3</p>
                                        <p onClick={handleLogout} className="flex ps-1 bg-gray-100 w-52 rounded-lg h-12 items-center">Đăng xuất</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    {history && (

                        expenses.length > 0 ? (
                            <div className='w-full max-w-[375px] mt-4'>
                                <div className='flex w-full'>
                                    <div className="ms-auto space-x-2">
                                        <input onChange={(e) => setFilterDateEnter(e.target.value)} type="text" placeholder="Tìm theo ngày" className="bg-white rounded-lg shadow-lg p-1 outline-none text-center font-semibold w-[157px] placeholder-black" />
                                        <select onChange={(e) => setFilterType(e.target.value)} className="bg-white rounded-lg shadow-lg p-[5px] outline-none text-center font-semibold ">
                                            <option value=''>Hạng mục</option>
                                            <option value='Thu nhập'>Thu nhập</option>
                                            <option value='Chi tiêu'>Chi tiêu</option>
                                        </select>
                                        <select onChange={(e) => setFilterDate(e.target.value)} className="bg-white rounded-lg shadow-lg p-[5px] outline-none text-center font-semibold ">
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
                                {filterExpenses.length > 0 ? (filterExpenses.map((item, index) => {
                                    const date = new Date(item.date);
                                    const formattedDate = isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString('vi-VN');
                                    return (
                                        <div key={index} className="shadow-lg rounded-lg mt-2 bg-white">
                                            <div className="cursor-pointer flex justify-between">
                                                <p className="mt-1 ms-2 text-sm font-semibold text-gray-500">{formattedDate}</p>
                                                <p className="mt-1 ms-2 text-sm font-semibold text-gray-500 truncate w-44">{item.description}</p>
                                                <p onClick={() => { setDetail(item) }} className="mt-1 me-2 text-sm font-semibold text-gray-500 flex items-center"><Eye className="w-4 h-4 me-1" />Chi tiết</p>
                                            </div>
                                            <div className="flex space-x-1 p-1 text-sm pb-2">
                                                <p className={`${item.type === 'Chi tiêu' ? 'bg-red-200 text-red-600 rounded-lg' : 'bg-green-200 text-green-600 rounded-lg'} font-semibold w-24 h-7 p-1 flex justify-center items-center`}>{item.type}</p>
                                                <p className={`bg-gray-100 ${item.type === 'Chi tiêu' ? 'text-red-600' : 'text-green-600'}  rounded-lg font-semibold w-28 h-7 p-1 flex justify-center`}>{item.type === 'Chi tiêu' ? '-' : '+'} {item.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                                <p className="bg-yellow-200 text-yellow-600 rounded-lg font-semibold w-20 h-7 p-1 flex justify-center">{item.category}</p>
                                                <p className="bg-blue-200 text-blue-600 rounded-lg font-semibold w-28 h-7 p-1 flex justify-center">{hiddenMoney ? item.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '✷✷✷✷✷✷'}</p>
                                            </div>
                                        </div>
                                    );
                                })) : (
                                    <div className="text-center mt-10 text-red-500 font-semibold">Dữ liệu không tồn tại</div>
                                )}

                            </div>
                        ) : (
                            <div className="text-center mt-5">
                                <div className={`${totalMoney ? 'hidden' : ''}`}>
                                    <ClipLoader size={50} color="#000000" />
                                    <p className="mt-2 mx-4 text-red-500 font-semibold">Server triển khai trên nền tảng render.com gói miễn phí nên cần thời gian để khơi động</p>
                                    <p className="mt-2 mx-4 font-semibold">Donate cho tôi tại đây, để có thêm chi phí nâng cấp server tốt hơn. Xin cảm ơn !</p>
                                    <img className="h-auto w-60 mx-auto mt-5" src="https://res.cloudinary.com/dteuqunrm/image/upload/v1745506633/QR_code_hpbssw.jpg" />
                                </div>
                                <div className={`${totalMoney && expenses.length > 0 ? 'hidden' : ''} text-center mt-5 text-red-500 font-semibold w-80`}>Bạn chưa có dữ liệu chi tiêu</div>
                            </div>
                        )
                    )}
                    {detail && (
                        (() => {
                            const date = new Date(detail.date);
                            const formattedDate = isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString('vi-VN');
                            return (
                                <div className="fixed inset-0 flex justify-center items-center z-50 overflow-x-hidden">
                                    <div className="absolute inset-0 bg-black opacity-50"></div>
                                    <div className="relative z-10">
                                        <div className="w-[270px] h-auto bg-white rounded-lg pb-4 pt-4">
                                            <div className="flex justify-center">
                                                <X onClick={() => setDetail()} className="fixed ms-[230px] -mt-3 pt-1 w-8 h-8 cursor-pointer" />
                                            </div>
                                            <div className="space-y-4 p-5 ps-10 pb-3">
                                                <div className="flex space-x-2">
                                                    <p className="font-semibold">Hạng mục: </p>
                                                    <p className={`${detail.type === 'Chi tiêu' ? 'bg-red-200 text-red-600' : 'bg-green-200 text-green-600'} rounded-lg font-semibold w-24 h-6 p-1 flex justify-center items-center`}>
                                                        {detail.type}
                                                    </p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <p className="font-semibold">Số tiền:</p>
                                                    <p className={`bg-gray-100 ${detail.type === 'Chi tiêu' ? 'text-red-600' : 'text-green-600'} rounded-lg font-semibold w-28 h-6 p-1 flex justify-center items-center`}>
                                                        {detail.type === 'Chi tiêu' ? '-' : '+'} {detail.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                    </p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <p className="font-semibold">Nhãn:</p>
                                                    <p className="bg-yellow-200 text-yellow-600 rounded-lg font-semibold w-20 h-6 p-1 flex justify-center items-center">{detail.category}</p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <p className="font-semibold">Số dư:</p>
                                                    <p className="bg-blue-200 text-blue-600 rounded-lg font-semibold w-28 h-6 p-1 flex justify-center items-center">
                                                        {hiddenMoney ? detail.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '✷✷✷✷✷✷'}
                                                    </p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <p className="font-semibold">Ngày:</p>
                                                    <p className="text-gray-500 font-semibold w-16 h-6 p-1 flex justify-center items-center">{formattedDate}</p>
                                                </div>
                                                <div className="flex flex-wrap space-x-2">
                                                    <p className="font-semibold">Ghi chú:</p>
                                                    <p className="font-semibold text-gray-500 break-words w-32">{detail.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div >
                                </div >
                            );
                        })()
                    )}

                    {
                        addExpense && (
                            <div className='w-full max-w-[375px] mt-5 shadow-md rounded-lg border bg-gray'>
                                <p className="font-bold text-xl text-center pt-2 pb-2">THÊM CHI PHÍ</p>
                                <div className="grid grid-cols-2 gap-2 p-2">
                                    <div className="flex flex-col">
                                        <label className="font-semibold pb-1">Hạng mục</label>
                                        <select onChange={(e) => { setType(e.target.value) }} className="text-gray-400 rounded-lg h-9 text-center bg-white shadow-md outline-none">
                                            <option value=''>Chọn hạng mục</option>
                                            <option value='Thu nhập'>Thu nhập</option>
                                            <option value='Chi tiêu'>Chi tiêu</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="font-semibold pb-1">Số tiền</label>
                                        <input value={amount} onChange={(e) => { setAmount(e.target.value) }} type="number" placeholder="Nhập số tiền" className=" rounded-lg h-9 w-44 mt-1 text-center outline-none shadow-md " />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="font-semibold pb-1">Nhãn</label>
                                        <select value={category} onChange={(e) => { setCategory(e.target.value) }} className="text-gray-400 rounded-lg h-9 text-center bg-white shadow-md outline-none">
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
                                        <input value={date} onChange={(e) => { setDate(e.target.value) }} type="date" className="text-gray-400 rounded-lg h-9 w-44 text-center outline-none bg-white shadow-md" />
                                    </div>

                                </div>
                                <div className="p-2 flex flex-col">
                                    <label className="font-semibold pb-1">Ghi chú</label>
                                    <textarea value={description} onChange={(e) => { setDescription(e.target.value) }} type="text" className=" rounded-lg h-16 p-2 shadow-md outline-none" />
                                </div>
                                <div className="w-full flex">
                                    <button onClick={handleAddExpenseData} className="font-semibold border ms-auto m-2 rounded-lg h-9 w-16 bg-green-500 text-white hover:bg-green-700 text-center transition duration-200">Thêm</button>
                                </div>
                            </div>
                        )
                    }
                </div >
            </div >

        </div >

    );
}
export default Home