import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ExpenseService } from "./expense.service";
import { CreateTotalMoneyDto } from "./DTO/total-money.dto";
import { CreateExpenseDto } from "./DTO/expense.dto";
import { Types } from 'mongoose';


@Controller('expense')
export class ExpenseController {
    constructor(private readonly expenseService: ExpenseService) { }

    @Post('addTotalMoney')
    addTotalMoney(@Body() body: CreateTotalMoneyDto) {
        return this.expenseService.addTotalMoney(new Types.ObjectId(body.userId), body.total);
    }

    @Post('addExpense')
    addExpense(@Body() body: CreateExpenseDto) {
        return this.expenseService.addExpense(new Types.ObjectId(body.userId), body.category, body.type, body.amount, body.description, body.date)
    }


    @Post('getExpense')
    getExpense(@Body() body: CreateExpenseDto) {
        return this.expenseService.getExpense(new Types.ObjectId(body.userId));
    }


    @Post('getTotalMoney')
    getTotalMoney(@Body() body: CreateTotalMoneyDto) {
        return this.expenseService.getTotalMoney(new Types.ObjectId(body.userId))
    }

    @Post('deleteExpense')
    deleteExpense(
        @Body() body: { expenseId: string }) {
        return this.expenseService.deleteExpense(body.expenseId)
    }

    @Post('updateExpense')
    udpateExpense(
        @Body() body: { expenseId: string, description: string }) {
        return this.expenseService.updateExpense(body.expenseId, body.description)
    }

    @Get('ping')
    ping() {
        return 'pong';
    }


}