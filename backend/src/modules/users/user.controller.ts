import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('register')
    register(@Body() body: RegisterDto) {
        return this.userService.register(body.fullName, body.username, body.password);
    }

    @Post('login')
    login(@Body() body: LoginDto) {
        return this.userService.login(body.username, body.password);
    }

    @Put('update/:id')
    async updateUser(
        @Param('id') id: string,
        @Body() body: { password?: string }
    ) {
        return await this.userService.update(id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    profile(@Req() req) {
        return req.user;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('admin')
    adminData() {
        return { message: 'Chào admin' };
    }
}