import axios from "axios";
import { ChartNoAxesCombined, Check, Eye, EyeOff, FilePenLine, History, Menu, PlusCircle, QrCode, Settings, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import API from "../configs/API";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import { ClipLoader } from 'react-spinners';
import { useNavigate } from "react-router-dom";
import InformationCard from "../components/layouts/information-card";
import MainMenu from "../components/layouts/main-menu";

const Home = () => {
    const [history, setHistory] = useState(true)
    const [hiddenMoney, setHiddenMoney] = useState(false)
    const [loading, setLoading] = useState(false)

    const [expenses, setExpense] = useState([])
    const [totalMoney, setTotalMoney] = useState({})

    useEffect(() => {
        getExpense();
        getTotal();
    }, [])

    const getExpense = async () => {
        const token = localStorage.getItem('token')
        if (token) {
            const decoded = jwtDecode(token);
            let userId = decoded.userId
            const results = await axios.post(`${API}/expense/getExpense`, { userId })
            if (results.data.EC === 0) {
                setExpense(results.data.response)
            }
        }

    }
    const getTotal = async () => {
        const token = localStorage.getItem('token')
        if (token) {
            const decoded = jwtDecode(token);
            let userId = decoded.userId
            const results = await axios.post(`${API}/expense/getTotalMoney`, { userId })
            if (results.data.EC === 0) {
                await setTotalMoney(results.data.response[0])
            }
        }

    }


    return (
        <div className="w-full overflow-x-hidden flex justify-center bg-gray-200">
            <ToastContainer />
            <div className="shadow-lg w-[550px] min-h-screen mt-2 mb-2 bg-gray-100 rounded-lg overflow-y-hidden">
                <div className="flex flex-col items-center mt-4 mb-4 min-h-screen bg-gray-100">
                    <InformationCard
                        totalMoney={totalMoney}
                        hiddenMoney={hiddenMoney}
                        setHiddenMoney={setHiddenMoney}
                    />
                    <MainMenu
                        setLoading={setLoading}
                        hiddenMoney={hiddenMoney}
                        getExpense={getExpense}
                        expenses={expenses}
                        getTotal={getTotal}
                        totalMoney={totalMoney}
                    />

                    {loading && (
                        <div className="fixed inset-0 flex justify-center items-center z-50 overflow-x-hidden">
                            <div className="absolute inset-0 bg-black opacity-50"></div>
                            <div className="relative z-10">
                                <ClipLoader size={50} color="#000000" />
                            </div>
                        </div>
                    )}
                </div >
            </div >

        </div >

    );
}
export default Home