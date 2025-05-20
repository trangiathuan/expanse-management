import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class CloudinaryService {
    async uploadImage(imagePath: string): Promise<string> {
        try {
            const result = await cloudinary.uploader.upload(imagePath, {
                resource_type: 'image',
                folder: 'expense/QR',
            });
            return result.secure_url;
        } catch (err) {
            throw new Error('Upload hình ảnh thất bại: ' + err.message);
        }
    }

    async uploadVideo(videoPath: string): Promise<string> {
        try {
            const result = await cloudinary.uploader.upload(videoPath, {
                resource_type: 'video',
                folder: 'movies',
            });
            return result.secure_url;
        } catch (err) {
            throw new Error('Upload video thất bại: ' + err.message);
        }
    }
}
