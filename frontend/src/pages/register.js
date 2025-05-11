import axios from "axios";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import API from "../configs/API";
import { ClipLoader } from "react-spinners";
import { Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const login = async (e) => {
        e.preventDefault(); // chặn reload trang
        setLoading(true);

        const res = await axios.post(`${API}/user/register`, {
            fullName,
            username,
            password
        });
        if (res.data.EC == 0) {
            setLoading(false);
            toast.success(res.data.message);
            console.log("Register success:", res.data);
            navigate('/')
        } else {
            setLoading(false);
            setTimeout(() => {
                toast.warn(res.data.message);
            }, 200);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full mt-80">
                <ClipLoader size={50} color="#000000" />
            </div>

        )
    }

    return (
        <div className="w-full overflow-x-hidden flex justify-center bg-gray-200">
            <ToastContainer />
            <div className="shadow-lg w-[550px] min-h-screen mt-2 mb-2 bg-gray-100 rounded-lg overflow-y-hidden">
                <div className="flex flex-col items-center mt-4 mb-4 min-h-screen bg-gray-100">
                    <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-md mt-40">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Đăng ký tài khoản</h2>
                        <form onSubmit={login} className="space-y-5 w-full">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fullname">Họ và tên</label>
                                <input
                                    id="fullname"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    placeholder="Nhập họ và tên"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">Tên đăng nhập</label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    placeholder="Tên đăng nhập"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Mật khẩu</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    placeholder="Nhập mật khẩu"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
                            >
                                Đăng ký
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
