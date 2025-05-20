import { Controller, Post, UseGuards, Req, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { QRCodeService } from './qrcode.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('qrcode')
export class QRCodeController {
    constructor(private readonly qrcodeService: QRCodeService) { }

    @UseGuards(JwtAuthGuard)
    @Post('add')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = path.extname(file.originalname);
                cb(null, file.fieldname + '-' + uniqueSuffix + ext);
            },
        }),
    }))
    async addQRCode(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
        const userId = req.user.userId;
        // Gọi service để upload ảnh từ file.path và lưu QR code
        const result = await this.qrcodeService.create({ userId, imagePath: file.path });
        // Xóa file trong thư mục uploads sau khi upload thành công
        const fs = await import('fs/promises');
        try {
            await fs.unlink(file.path);
        } catch (err) {
            // Nếu xóa file lỗi thì chỉ log, không làm hỏng flow
            console.error('Không thể xóa file tạm:', err.message);
        }
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Post('getAllQRCode')
    async getAllQRCodes(@Req() req: any) {
        const userId = req.user.userId;
        console.log('getAllQRCodes', userId);

        return this.qrcodeService.findAllByUser(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('delete')
    async deleteQRCode(@Req() req: any, @Body('_id') _id: string) {
        const userId = req.user.userId;
        return this.qrcodeService.deleteByIdAndUser(_id, userId);
    }
}
