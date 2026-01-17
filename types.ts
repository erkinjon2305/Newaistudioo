
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isCustom?: boolean;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  categoryId: string;
  amount: number;
  note: string;
  date: string; // ISO format
}

export interface AppState {
  startingBalance: number;
  transactions: Transaction[];
  categories: Category[];
}
