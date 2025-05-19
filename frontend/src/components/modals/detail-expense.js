import { ChartNoAxesCombined, Check, Eye, EyeOff, FilePenLine, History, Menu, PlusCircle, QrCode, Settings, Trash2, X } from "lucide-react";

const DetailExpense = ({ detail, setDetail, edit, setEdit, hiddenMoney, description, setDescription, handleUpdateExpense, handleDelete }) => {

    const date = new Date(detail.date);
    const formattedDate = isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString('vi-VN');
    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 overflow-x-hidden">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10">
                <div className="w-[270px] h-auto bg-white rounded-lg pb-4 pt-4">
                    <div onClick={() => setEdit()} className="flex justify-center">
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
                            <p className={`bg-gray-100 ${detail.type === 'Chi tiêu' ? 'text-red-600' : 'text-green-600'} rounded-lg font-semibold w-28 h-6 p-1 flex justify-center items-center truncate`}>
                                {detail.type === 'Chi tiêu' ? '-' : '+'} {detail.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <p className="font-semibold">Nhãn:</p>
                            <p className="bg-yellow-200 text-yellow-600 rounded-lg font-semibold w-20 h-6 p-1 flex justify-center items-center">{detail.category}</p>
                        </div>
                        <div className="flex space-x-2">
                            <p className="font-semibold">Số dư:</p>
                            <p className="bg-blue-200 text-blue-600 rounded-lg font-semibold w-28 h-6 p-1 flex justify-center items-center truncate">
                                {hiddenMoney ? detail.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '✷✷✷✷✷✷'}
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <p className="font-semibold">Ngày:</p>
                            <p className="text-gray-500 font-semibold w-16 h-6 p-1 flex justify-center items-center">{formattedDate}</p>
                        </div>
                        <div className="flex flex-wrap flex-col">
                            <p className="font-semibold">Ghi chú:</p>
                            <p className={`${edit ? 'hidden' : ''} font-semibold w-48 h-14 ps-1 rounded-lg text-gray-500 break-words shadow-sm outline-none border`}>{detail.description}</p>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={`${edit ? '' : 'hidden'} font-semibold w-48 h-14 ps-1 rounded-lg text-gray-500 break-words shadow-sm outline-none border`} />
                        </div>
                        <div className="flex">
                            <button onClick={() => handleUpdateExpense(detail._id)} className={`${edit ? '' : 'hidden'} bg-green-400 w-7 h-7 rounded-lg justify-center flex items-center me-2 ms-auto`}>
                                <Check />
                            </button>
                            <button onClick={() => setEdit(false)} className={`${edit ? '' : 'hidden'} bg-red-500 w-7 h-7 rounded-lg justify-center flex items-center me-4`}>
                                <X />
                            </button>
                            <button onClick={() => setEdit(true)} className={`${edit ? 'hidden' : ''} bg-blue-400 w-7 h-7 rounded-lg justify-center flex items-center me-2 ms-auto`}>
                                <FilePenLine />
                            </button>
                            <button onClick={() => handleDelete(detail._id)} className={`${edit ? 'hidden' : ''} bg-red-500 w-7 h-7 rounded-lg justify-center flex items-center me-4`}>
                                <Trash2 />
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}
export default DetailExpense