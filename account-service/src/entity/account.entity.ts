import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

export enum AccountType {
    SAVINGS = "SAVINGS",
    CURRENT = "CURRENT",
}
export enum TransactionType {
    CREDIT = "CREDIT",
    DEBIT = "DEBIT",
}
export enum AccountStatus {
    ACTIVE = 'active',
    FROZEN = 'frozen',
    CLOSED = 'closed',
}
export class DecimalColumnTransformer {
    to(data: number): number {
        return data;
    }
    from(data: string): number {
        return parseFloat(data);
    }
}
@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({
        name: 'account_number',
        length: 15,
        unique: true,
        comment: 'Unique account number for the account',
    })
    accountNumber: string;

    @Column({ name: 'account_name', nullable: true })
    accountName: string;

    @Column({
        name: 'account_type',
        type: 'enum',
        enum: AccountType,
        default: AccountType.SAVINGS,
    })
    accountType: string;

    @Column({
        name: 'balance',
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0,
        transformer: new DecimalColumnTransformer(),
    })
    balance: number;

    @Column({
        name: 'account_status',
        type: 'enum',
        enum: AccountStatus,
        default: AccountStatus.ACTIVE,
    })
    accountStatus: string;

    @Column({ name: 'currency', default: 'INR', length: 3 })
    currency: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}