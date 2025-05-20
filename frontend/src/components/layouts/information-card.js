import axios from "axios";
import { ChartNoAxesCombined, Check, Eye, EyeOff, FilePenLine, History, LogOut, Menu, PlusCircle, QrCode, QrCodeIcon, Settings, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import { ClipLoader } from 'react-spinners';
import { useNavigate } from "react-router-dom";
import API from "../../configs/API";





const InformationCard = ({ totalMoney, hiddenMoney, setHiddenMoney }) => {
    const token = localStorage.getItem('token')
    const decoded = jwtDecode(token);
    let userId = decoded.userId
    let fullName = decoded.fullName
    let avt = decoded.avt

    const [qr, setQr] = useState(false)
    const [setting, setSetting] = useState(false)
    const navigate = useNavigate()
    const [qrImages, setQrImages] = useState([])


    useEffect(() => {
        getAllQRCode();
    }, [])
    const getAllQRCode = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.post(`${API}/qrcode/getAllQRCode`, {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (res.data.EC === 0) {
                setQrImages(res.data.response);
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {

        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')

    }

    return (
        <div className=" shadow-md rounded-lg p-6 mb-6 w-[375px] max-w-sm">
            <div className="flex">
                <img className="w-16 h-16 rounded-full object-cover" src={avt} />
                <p className="ms-5 w-44 text-xl font-bold truncate">{fullName}</p>
            </div>
            <div className="flex">
                <p className="text-lg font-bold text-green-600 -mt-8 ms-[86px]  transition duration-200"><span className="text-black">Số dư: </span>{totalMoney.total ? hiddenMoney ? totalMoney.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : <span className="text-sm transition duration-200">✷✷✷✷✷✷</span> : 0}</p>
                {hiddenMoney ? <Eye onClick={() => setHiddenMoney(false)} className="w-4 h-4 -mt-7 ms-auto me-8 transition duration-200" />
                    : <EyeOff onClick={() => setHiddenMoney(true)} className="w-4 h-4 -mt-7 ms-auto me-8 transition duration-200" />}
            </div>
            <div className="flex">
                <Menu onClick={() => { setSetting(true) }} className="w-5 h-5 mt-2 ms-[86px] me-5 cursor-pointer" />
                <QrCode onClick={() => { setQr(true) }} className="w-5 h-5 mt-2 cursor-pointer" />
            </div>
            {qr && (
                <div className="fixed inset-0 flex justify-center pt-20 z-50 overflow-x-hidden">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative z-10">
                        <div className="flex w-[270px] h-[500px] bg-white rounded-lg">
                            <div className="flex">
                                <X onClick={() => { setQr(false) }} className="fixed ms-[230px] pt-2 w-8 h-8 cursor-pointer" />
                            </div>
                            <div className="overflow-y-auto p-2 text-xl font-semibold space-y-1 pt-12 pb-12 hide-scrollbar">
                                {qrImages.map((items, index) => (
                                    <img className="rounded-lg h-auto object-cover" src={items.url} key={index} />
                                ))}
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
                            <div className="p-8 text-xl font-semibold space-y-2 pt-12 pb-12">
                                <p className="flex ps-3 bg-gray-100 w-52 rounded-lg h-12 items-center">
                                    <a href="/QRcode" className="flex items-center">
                                        <QrCodeIcon className="me-2" />QR Code
                                    </a>
                                </p>
                                <p className="flex ps-3 bg-gray-100 w-52 rounded-lg h-12 items-center">Coming soon</p>
                                <p className="flex ps-3 bg-gray-100 w-52 rounded-lg h-12 items-center">Coming soon</p>
                                <p onClick={handleLogout} className="flex ps-3 bg-gray-100 w-52 rounded-lg h-12 items-center">
                                    <LogOut className="me-2" />Đăng xuất</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

}
export default InformationCard