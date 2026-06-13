// ── Account ──────────────────────────────────────────────────
export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  firstname: string
  lastname: string
  address: string
  country: string
  dateOfBirth: string
  phone: string
  username: string
  email: string
  accountType: string
  currency: string
  password: string
}

export interface NewUserDto {
  userId: string
  userName: string
  email: string
  token: string
  walletBalance: number
  createdAt: string
}

export interface UserProfileDto {
  userId: string
  userName: string
  firstName: string
  lastName: string
  accountNumber: string
  type: string
  walletBalance: number
  email: string
  address: string
  country: string
  dateOfBirth: string
  phoneNumber: string | null
  createdAt: string
}

// ── Wallet ────────────────────────────────────────────────────
export interface WalletTransactionDto {
  id: number
  amount: number
  type: string
  status: string
  description: string
  reference: string | null
  balanceAfter: number
  createdAt: string
}

export interface WalletDto {
  userId: string
  balance: number
  recentTransactions: WalletTransactionDto[]
}

export interface TransferResultDto {
  reference: string
  fromAccount: string
  toAccount: string
  amount: number
  newBalance: number
  status: string
  createdAt: string
}

// ── Investment ────────────────────────────────────────────────
export interface InvestmentPlanDto {
  id: number
  name: string
  description: string
  minimumAmount: number
  maximumAmount: number
  returnRate: number
  durationDays: number
  isActive: boolean
}

export interface InvestmentDto {
  id: number
  planName: string
  planDescription: string
  amountInvested: number
  expectedReturn: number
  returnRate: number
  status: 'Active' | 'Matured' | 'Cancelled'
  createdAt: string
  maturityDate: string
  daysRemaining: number
}

// ── Loan ──────────────────────────────────────────────────────
export interface LoanDto {
  id: number
  type: string
  status: string
  principalAmount: number
  totalRepayable: number
  amountRepaid: number
  outstandingBalance: number
  interestRate: number
  termMonths: number
  monthlyPayment: number
  disbursedAt: string | null
  maturityDate: string | null
  createdAt: string
}

// ── Card ──────────────────────────────────────────────────────
export interface CardDto {
  id: number
  maskedNumber: string
  cardHolderName: string
  type: string
  status: string
  spendingLimit: number
  expiryDate: string
  createdAt: string
}
