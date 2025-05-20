import React, { use, useEffect, useState } from 'react';
import { toast, ToastContainer } from "react-toastify";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { ClipLoader } from 'react-spinners';
import API from '../configs/API';
import { ArrowLeft, QrCode, QrCodeIcon, Trash, Trash2 } from 'lucide-react';



const AddQRCode = () => {
    const token = localStorage.getItem('token')
    const decoded = jwtDecode(token);
    let userId = decoded.userId
    let fullName = decoded.fullName
    let avt = decoded.avt

    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
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
            toast.error('Không thể lấy danh sách QR code!');
        }
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Vui lòng chọn file ảnh QR code!');
            return;
        }
        setLoading(true);
        setMessage('');
        try {
            const formData = new FormData();
            formData.append('file', file);
            // Gửi request lên backend (cần thay đổi URL cho phù hợp với môi trường thực tế)
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API}/qrcode/add`, formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (res.data.EC === 0) {
                toast.success(res.data.message || 'Thêm QR code thành công!');
                await getAllQRCode();
            }
            setFile(null);
        } catch (err) {
            setMessage(
                err.response?.data?.message || 'Có lỗi xảy ra khi thêm QR code!'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" overflow-x-hidden flex justify-center bg-gray-200">

            <ToastContainer />
            <div className="shadow-lg w-[550px] min-h-screen mt-0 mb-2 bg-gray-100 rounded-lg overflow-y-hidden">
                <div className='shadow-sm bg-white h-16 flex items-center m-2 rounded-sm'>
                    <a href='/home'>
                        <ArrowLeft className='w-8 h-7 ms-2' />
                    </a>
                    <div className='flex-1 flex items-center justify-center me-12'>
                        <QrCodeIcon />
                        <p className="text-2xl font-bold ms-2"> QR Code</p>
                    </div>
                </div>
                <div className="flex flex-col items-center mt-1 mb-4 min-h-screen bg-gray-100">
                    <div className="max-w-md mx-auto mt-2 p-6 bg-white rounded shadow">

                        <div>
                            {qrImages.map((items, index) => (
                                <div key={index} className="flex flex-col items-center mb-4 ">
                                    <img
                                        src={items.url}
                                        alt={`QR Code ${index + 1}`}
                                        className="w-52 h-52 object-cover mb-2 rounded-lg"
                                    />
                                    <p className="flex text-sm text-gray-600 font-semibold items-center">
                                        QR Code {index + 1}
                                        <Trash2
                                            className='ms-3 text-red-500 cursor-pointer'
                                            onClick={async () => {
                                                if (window.confirm('Bạn có chắc muốn xoá QR code này?')) {
                                                    try {
                                                        const token = localStorage.getItem('token');
                                                        const res = await axios.post(
                                                            `${API}/qrcode/delete`,
                                                            { _id: items._id },
                                                            {
                                                                headers: {
                                                                    Authorization: `Bearer ${token}`,
                                                                },
                                                            }
                                                        );
                                                        if (res.data.EC === 0) {
                                                            toast.success(res.data.message || 'Xoá thành công!');
                                                            await getAllQRCode();
                                                        } else {
                                                            toast.error(res.data.message || 'Xoá thất bại!');
                                                        }
                                                    } catch (err) {
                                                        toast.error('Có lỗi xảy ra khi xoá QR code!');
                                                    }
                                                }
                                            }}
                                        />
                                    </p>
                                </div>
                            ))}
                        </div>
                        <p className='mb-2 font-semibold'>Thêm QR Code</p>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full mb-4 border rounded px-3 py-2"
                                key={file ? file.name + loading : loading}
                            />
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                                disabled={loading}
                            >
                                {loading ? 'Đang tải lên...' : 'Thêm QR Code'}
                            </button>
                        </form>
                        {message && (
                            <div className="mt-4 text-center text-red-600">{message}</div>
                        )}
                    </div>
                </div>
            </div>
            {loading && (
                <div className="fixed inset-0 flex justify-center items-center z-50 overflow-x-hidden">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative z-10">
                        <ClipLoader size={50} color="#000000" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddQRCode;
