import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/user.shema';
import { ExpenseService } from '../expense/expense.service';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
        private readonly expenseService: ExpenseService
    ) { }

    async register(fullName: string, username: string, password: string): Promise<any> {
        const existingUser = await this.userModel.findOne({ username });
        if (existingUser) return { EC: -1, message: 'Tài khoản đã tồn tại' };

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new this.userModel({ fullName, username, password: hashedPassword });
        await user.save();
        await this.expenseService.addTotalMoney(new Types.ObjectId(user._id as string), 0);
        return { EC: 0, message: 'Đăng ký thành công', response: user };
    }

    async login(username: string, password: string): Promise<any> {
        const user = await this.userModel.findOne({ username });

        if (!user) {
            return { EC: -1, message: 'Tên đăng nhập không chính xác' };
        }
        if (!await bcrypt.compare(password, user.password)) {
            return { EC: -1, message: 'Mật khẩu không chính xác' };
        }
        const payload = { fullName: user.fullName, userId: user._id, username: user.username, role: user.role, avt: user.avt };
        return {
            EC: 0,
            message: 'Đăng nhập thành công',
            token: this.jwtService.sign(payload),
        };
    }

    async update(userId: string, updates: { password?: string }): Promise<any> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            return { EC: -1, message: 'Người dùng không tồn tại' };
        }

        if (updates.password) {
            user.password = await bcrypt.hash(updates.password, 10);
        }

        await user.save();

        return { EC: 0, message: 'Cập nhật thông tin thành công', response: user };
    }

}