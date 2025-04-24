import { Body, Controller, Post } from "@nestjs/common";
import { ExpenseService } from "./expense.service";
import { CreateTotalMoneyDto } from "./DTO/total-money.dto";
import { Schema } from "mongoose";  // Import Schema từ mongoose thay vì Types
import { CreateExpenseDto } from "./DTO/expense.dto";

@Controller('expense')
export class ExpenseController {
    constructor(private readonly expenseService: ExpenseService) { }

    @Post('addTotalMoney')
    addTotalMoney(@Body() body: CreateTotalMoneyDto) {
        return this.expenseService.addTotalMoney(new Schema.Types.ObjectId(body.userId), body.total);
    }

    @Post('addExpense')
    addExpense(@Body() body: CreateExpenseDto) {
        return this.expenseService.addExpense(new Schema.Types.ObjectId(body.userId), body.category, body.type, body.amount, body.description, body.date)
    }

    @Post('getExpense')
    getExpense(@Body() body: CreateExpenseDto) {
        return this.expenseService.getExpense(new Schema.Types.ObjectId(body.userId))
    }

    @Post('getTotalMoney')
    getTotalMoney(@Body() body: CreateTotalMoneyDto) {
        return this.expenseService.getTotalMoney(new Schema.Types.ObjectId(body.userId))
    }
}