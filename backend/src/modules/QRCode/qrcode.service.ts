import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QRCode, QRCodeDocument } from './qrcode.shema';
import { CloudinaryService } from '../../common/services/cloudinary.service';

@Injectable()
export class QRCodeService {
    constructor(
        @InjectModel(QRCode.name) private readonly qrcodeModel: Model<QRCodeDocument>,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    async create(data: { userId: string; imagePath: string }) {
        // Upload ảnh lên Cloudinary trước bằng CloudinaryService
        const url = await this.cloudinaryService.uploadImage(data.imagePath);
        const created = new this.qrcodeModel({
            userId: data.userId,
            url: url,
        });
        await created.save();
        return { EC: 0, message: 'Thêm QR code thành công', response: created };
    }

    async findAllByUser(userId: string) {
        // Lấy tất cả QR code theo userId, chỉ trả về mảng url
        const qrCodes = await this.qrcodeModel.find({ userId })
        return { EC: 0, message: 'Lấy QR code thành công', response: qrCodes };
    }

    async deleteByIdAndUser(_id: string, userId: string) {
        const qr = await this.qrcodeModel.findOneAndDelete({ _id, userId });
        if (!qr) {
            return { EC: -1, message: 'Không tìm thấy hoặc không có quyền xoá QR code này!' };
        }
        return { EC: 0, message: 'Xoá QR code thành công!' };
    }
}
