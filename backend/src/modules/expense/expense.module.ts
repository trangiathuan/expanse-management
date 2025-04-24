import { Module } from '@nestjs/common';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Expense, ExpenseSchema } from './expense.shema';
import { TotalMoney, TotalMoneySchema } from './total-money.shema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }]),
        MongooseModule.forFeature([{ name: TotalMoney.name, schema: TotalMoneySchema }]),
    ],
    providers: [ExpenseService],
    controllers: [ExpenseController],
})
export class ExpenserModule { }
