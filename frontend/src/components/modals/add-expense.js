const AddExpense = ({ setType, setAmount, setCategory, setDate, setDescription, amount, category, date, description, handleAddExpenseData }) => {
    return (
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
export default AddExpense