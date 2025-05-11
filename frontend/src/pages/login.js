import axios from "axios";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import API from "../configs/API";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault(); // Chặn reload trang
        setLoading(true);
        try {
            const res = await axios.post(`${API}/user/login`, {
                username,
                password
            });

            if (res.data.EC == 0) {
                toast.success("Đăng ký thành công!");
                console.log("Register success:", res.data);
                localStorage.setItem("token", res.data.token);
                setTimeout(() => {
                    navigate('/home')
                }, 1500);
            }
        } catch (error) {
            console.error(error);
            toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full overflow-x-hidden flex justify-center bg-gray-200">
            <ToastContainer />
            <div className="shadow-lg w-[550px] min-h-screen mt-2 mb-2 bg-gray-100 rounded-lg overflow-y-hidden">
                <div className="flex flex-col items-center mt-4 mb-4 min-h-screen bg-gray-100">
                    <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-md mt-40">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Đăng nhập</h2>
                        <form onSubmit={handleLogin} className="space-y-5 w-full">
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
                                {loading ? "Đang xử lý..." : "Đăng nhập"}
                            </button>
                        </form>
                        <a
                            href="/register"
                            className="w-full text-center text-blue-600 hover:underline mt-4 block cursor-pointer"
                        >
                            Đăng ký tài khoản
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
