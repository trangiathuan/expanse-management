import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/user.shema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) { }

    async register(username: string, password: string): Promise<any> {
        const existingUser = await this.userModel.findOne({ username });
        if (existingUser) return { EC: -1, message: 'Tài khoản đã tồn tại' };

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new this.userModel({ username, password: hashedPassword });
        await user.save();
        return { EC: 0, message: 'Đăng ký thành công', response: user };
    }

    async login(username: string, password: string): Promise<any> {
        const user = await this.userModel.findOne({ username });

        if (!user) {
            return { EC: -1, message: 'Tài khoản không tồn tại' };
        }
        if (!await bcrypt.compare(password, user.password)) {
            return { EC: -1, message: 'Mật khẩu không chính xác' };
        }
        const payload = { userId: user._id, username: user.username, role: user.role };
        return {
            EC: 0,
            message: 'Đăng nhập thành công',
            token: this.jwtService.sign(payload),
        };
    }
}