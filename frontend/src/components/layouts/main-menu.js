import axios from "axios";
import { ChartNoAxesCombined, Check, Eye, EyeOff, FilePenLine, History, Menu, PlusCircle, QrCode, Settings, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import API from "../../configs/API";
import HistoryExpense from "../modals/history-expense";
import DetailExpense from "../modals/detail-expense";
import AddExpense from "../modals/add-expense";
import Statistical from "../modals/statistical-expense";
import { useNavigate } from "react-router-dom";


const MainMenu = ({ setLoading, hiddenMoney, getExpense, getTotal, expenses, totalMoney }) => {
    const token = localStorage.getItem('token')
    const decoded = jwtDecode(token);
    let userId = decoded.userId

    const [history, setHistory] = useState(true)
    const [addExpense, setAddExpense] = useState(false)
    const [edit, setEdit] = useState(false)
    const [detail, setDetail] = useState(null)
    const [statistical, setStatistical] = useState(false)

    const [type, setType] = useState('')
    const [amount, setAmount] = useState()
    const [category, setCategory] = useState('')
    const [date, setDate] = useState()
    const [description, setDescription] = useState()

    const [filterDate, setFilterDate] = useState('')
    const [filterDateEnter, setFilterDateEnter] = useState('')
    const [filterType, setFilterType] = useState('')

    const filterExpenses = expenses.filter(expense => {
        const date = new Date(expense.date);
        return (
            date.toLocaleDateString('vi-VN').includes(filterDate || filterDateEnter) &&
            expense.type.includes(filterType)
        )
    });





    const handleHistory = () => {
        setHistory(!history)
        setAddExpense(false)
        setStatistical(false)
    }

    const handleAddExpense = () => {
        setAddExpense(!addExpense)
        setHistory(false)
        setStatistical(false)

    }

    const handleStatistical = () => {
        setStatistical(!statistical)
        setHistory(false)
        setAddExpense(false)
    }

    const validation = () => {
        if (!type) {
            toast.warn('Hạng mục không dược bỏ trống')
            setLoading(false)
            return false
        }
        if (!amount) {
            toast.warn('Bạn chưa nhập số tiền')
            setLoading(false)
            return false
        }
        if (!category) {
            toast.warn('Bạn chưa chọn nhãn')
            setLoading(false)
            return false
        }
        if (!date) {
            toast.warn('Bạn chưa chọn ngày')
            setLoading(false)
            return false
        }
        return true
    }

    const handleAddExpenseData = async () => {
        setLoading(true)
        setTimeout(() => {
            if (!validation()) return
        }, 200);
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
            setLoading(false)
        }
    }

    const handleDelete = async (expenseId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa không?')) {
            setLoading(true)
            const results = await axios.post(`${API}/expense/deleteExpense`, { expenseId })
            if (results.data.EC === 0) {
                toast.success(results.data.message)
                await getExpense()
                await getTotal()
                setTimeout(() => {
                    setDetail(false)
                    setLoading(false)
                }, 100);
            }
        }

    }

    const handleUpdateExpense = async (expenseId) => {
        setLoading(true)
        const results = await axios.post(`${API}/expense/updateExpense`, { expenseId, description })
        if (results.data.EC === 0) {
            toast.success(results.data.message)
            await getExpense()
            setEdit(false)
            setTimeout(() => {
                setDetail(false)
            }, 100);
            setLoading(false)
        }
    }


    return (
        <div>
            <div className="grid grid-cols-3 gap-4 w-full min-w-[375px]">
                <div onClick={handleAddExpense} className="cursor-pointer shadow-lg bg-green-500 text-white rounded-lg p-0 text-center shadow-md hover:bg-green-600 transition duration-200 flex items-center justify-center">
                    <PlusCircle />
                    <p className="p-2 font-semibold">Thêm</p>

                </div>
                <div onClick={handleStatistical} className="cursor-pointer shadow-lg bg-blue-500 text-white rounded-lg p-0 text-center shadow-md hover:bg-blue-600 transition duration-200 flex items-center justify-center">
                    <ChartNoAxesCombined />
                    <p className="p-2 font-semibold">Thống kê</p>
                </div>
                <div onClick={handleHistory} className="cursor-pointer shadow-lg bg-gray-500 text-white rounded-lg text-center shadow-md hover:bg-gray-600 transition duration-200 flex items-center justify-center">
                    <History />
                    <p className="p-2 font-semibold">Lịch sử</p>
                </div>
            </div>
            {
                history && (
                    expenses.length > 0 ? (
                        <div className='w-full max-w-[375px] mt-4'>
                            <HistoryExpense
                                filterExpenses={filterExpenses}
                                hiddenMoney={hiddenMoney}
                                setDetail={setDetail}
                                setFilterDateEnter={setFilterDateEnter}
                                setFilterType={setFilterType}
                                setFilterDate={setFilterDate}
                            />
                        </div>
                    ) : (
                        <div className="text-center mt-5">
                            <div className={`${totalMoney && expenses.length > 0 ? 'hidden' : ''} text-center mt-5 text-red-500 font-semibold w-full`}>Bạn chưa có dữ liệu chi tiêu</div>
                        </div>
                    )
                )
            }

            {
                detail && (
                    <DetailExpense
                        detail={detail}
                        setDetail={setDetail}
                        edit={edit}
                        setEdit={setEdit}
                        hiddenMoney={hiddenMoney}
                        description={description}
                        setDescription={setDescription}
                        handleUpdateExpense={handleUpdateExpense}
                        handleDelete={handleDelete}

                    />
                )
            }

            {
                addExpense && (
                    < AddExpense
                        setType={setType}
                        setAmount={setAmount}
                        setCategory={setCategory}
                        setDescription={setDescription}
                        setDate={setDate}
                        amount={amount}
                        category={category}
                        date={date}
                        description={description}
                        handleAddExpenseData={handleAddExpenseData}
                    />
                )
            }

            {
                statistical && (
                    <Statistical
                        expenses={expenses}
                    />
                )
            }



        </div>
    )
}
export default MainMenu