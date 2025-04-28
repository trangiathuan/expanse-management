import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Date, Model, ObjectId, Types } from 'mongoose';
import { Expense, ExpenseDocument } from './expense.shema';
import { TotalMoney, TotalMoneyDocument } from './total-money.shema';

@Injectable()
export class ExpenseService {
    constructor(
        @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
        @InjectModel(TotalMoney.name) private totalMoneyModel: Model<TotalMoneyDocument>
    ) { }

    async addTotalMoney(userId: Types.ObjectId, total: number): Promise<any> {
        const user = await this.totalMoneyModel.findOne({ userId })
        if (user) {
            const update = await this.totalMoneyModel.updateOne(
                { userId },
                { $set: { total: total } }
            );
            if (update.modifiedCount > 0) {
                const updatedUser = await this.totalMoneyModel.findOne({ userId });
                return { EC: 0, message: 'Cập nhật tổng tiền thành công', response: updatedUser };
            } else {
                return { EC: 1, message: 'Không có thay đổi nào được thực hiện', response: null };
            }
        } else {
            const result = await this.totalMoneyModel.create({ userId, total });
            return { EC: 0, message: 'Thêm tổng tiền thành công', response: result }
        }
    }

    async addExpense(userId: Types.ObjectId, category: string, type: string, amount: number, description: string, date: string) {
        try {
            const totalMoney = await this.totalMoneyModel.findOne({ userId });

            if (!totalMoney) {
                return { EC: -1, message: 'Không tìm thấy thông tin tổng tiền của người dùng', response: null };
            }

            let newTotal = Number(totalMoney.total);
            amount = Number(amount);

            if (type === 'Thu nhập') {
                newTotal += amount;
            } else if (type === 'Chi tiêu') {
                newTotal -= amount;
            } else {
                return { EC: -1, message: 'Loại chi tiêu không hợp lệ', response: null };
            }

            await this.totalMoneyModel.updateOne({ userId }, { total: newTotal });

            const expense = new this.expenseModel({
                userId: userId,
                category: category,
                type: type,
                amount: amount,
                total: newTotal,
                description: description,
                date: new Date(date)
            })
            const result = await expense.save()
            return { EC: 0, message: 'Thêm chi tiêu thành công', response: result }
        } catch (error) {
            console.log(error);
            return { EC: -1, message: 'Thêm chi tiêu thất bại', response: null }
        }
    }

    async getExpense(userId: Types.ObjectId) {
        const result = await this.expenseModel.find({ userId }).sort({ date: -1, createdAt: -1 })
        if (result && result.length > 0) {
            return { EC: 0, message: 'Lấy dữ liệu thu chi thành công', response: result }
        } else {
            return { EC: -1, message: 'Không tìm thấy dữ liệu thu chi', response: null }
        }
    }

    async getTotalMoney(userId: Types.ObjectId) {
        const result = await this.totalMoneyModel.find({ userId })
        if (result && result.length > 0) {
            return { EC: 0, message: 'Lấy dữ liệu tổng số dư thành công', response: result }
        } else {
            return { EC: -1, message: 'Không tìm thấy dữ liệu số dư', response: null }
        }
    }

    onModuleInit() {
        setInterval(() => {
            const userId = '68088cbf82a714c3688c6c29';
            this.getTotalMoney(new Types.ObjectId(userId))
                .then(result => console.log('Total money:', result))
                .catch(error => console.error('Error getting total money:', error));
        }, 60 * 1000);
    }

}