
import { Eye } from "lucide-react";
const HistoryExpense = ({ filterExpenses, hiddenMoney, setDetail, setFilterDate, setFilterDateEnter, setFilterType }) => {
    return (
        <div>
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
                            <p className={`bg-gray-100 ${item.type === 'Chi tiêu' ? 'text-red-600' : 'text-green-600'}  rounded-lg font-semibold w-28 h-7 p-1 flex justify-center truncate`}>{item.type === 'Chi tiêu' ? '-' : '+'} {item.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                            <p className="bg-yellow-200 text-yellow-600 rounded-lg font-semibold w-20 h-7 p-1 flex justify-center">{item.category}</p>
                            <p className="bg-blue-200 text-blue-600 rounded-lg font-semibold w-28 h-7 p-1 flex justify-center">{hiddenMoney ? item.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '✷✷✷✷✷✷'}</p>
                        </div>
                    </div>
                );
            })) : (
                <div className="text-center mt-10 text-red-500 font-semibold">Dữ liệu không tồn tại</div>
            )}
        </div>
    )
}
export default HistoryExpense