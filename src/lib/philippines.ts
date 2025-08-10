// Philippine-specific features and configurations

export const PHILIPPINE_BANKS = [
  'BDO', 'BPI', 'Metrobank', 'PNB', 'UnionBank',
  'Security Bank', 'RCBC', 'Chinabank', 'EastWest Bank',
  'Landbank', 'DBP', 'PSBank', 'AUB', 'PBCom'
]

export const COMMON_FILIPINO_CATEGORIES = {
  income: [
    'Salary',
    'Freelance',
    '13th Month Pay',
    'Bonus',
    'Business Income',
    'Remittance',
    'Side Hustle',
    'Commission',
    'Allowance',
    'Investment Returns'
  ],
  expense: [
    'Groceries',
    'Transportation',
    'Utilities',
    'Rent/Housing',
    'Load/Data',
    'Dining Out',
    'Healthcare',
    'Education',
    'Bayanihan/Utang',
    'Pasalubong',
    'Family Support',
    'Insurance',
    'Entertainment',
    'Personal Care',
    'Clothing',
    'Home Maintenance',
    'Gadgets',
    'Subscription Services',
    'Savings',
    'Emergency Fund'
  ]
}

export const BIR_TAX_BRACKETS_2024 = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 400000, rate: 0.15 },
  { min: 400000, max: 800000, rate: 0.20 },
  { min: 800000, max: 2000000, rate: 0.25 },
  { min: 2000000, max: 8000000, rate: 0.30 },
  { min: 8000000, max: Infinity, rate: 0.35 }
]

export const FILIPINO_HOLIDAYS_2024 = [
  { date: '2024-01-01', name: 'New Year\'s Day' },
  { date: '2024-02-10', name: 'Chinese New Year' },
  { date: '2024-02-25', name: 'EDSA People Power Revolution Anniversary' },
  { date: '2024-03-28', name: 'Maundy Thursday' },
  { date: '2024-03-29', name: 'Good Friday' },
  { date: '2024-03-30', name: 'Black Saturday' },
  { date: '2024-04-09', name: 'Araw ng Kagitingan' },
  { date: '2024-05-01', name: 'Labor Day' },
  { date: '2024-06-12', name: 'Independence Day' },
  { date: '2024-08-21', name: 'Ninoy Aquino Day' },
  { date: '2024-08-26', name: 'National Heroes Day' },
  { date: '2024-11-01', name: 'All Saints\' Day' },
  { date: '2024-11-02', name: 'All Souls\' Day' },
  { date: '2024-11-30', name: 'Bonifacio Day' },
  { date: '2024-12-08', name: 'Feast of the Immaculate Conception' },
  { date: '2024-12-24', name: 'Christmas Eve' },
  { date: '2024-12-25', name: 'Christmas Day' },
  { date: '2024-12-30', name: 'Rizal Day' },
  { date: '2024-12-31', name: 'New Year\'s Eve' }
]

export const PAYMENT_METHODS = [
  'Cash',
  'Bank Transfer',
  'Credit Card',
  'Debit Card',
  'GCash',
  'PayMaya',
  'GrabPay',
  'ShopeePay',
  'PayPal',
  'Bank Deposit',
  'Check',
  'Installment'
]

export function calculateWithholdingTax(annualIncome: number): number {
  const bracket = BIR_TAX_BRACKETS_2024.find(
    b => annualIncome > b.min && annualIncome <= b.max
  )
  
  if (!bracket) return 0
  
  let tax = 0
  let previousMax = 0
  
  for (const b of BIR_TAX_BRACKETS_2024) {
    if (annualIncome <= b.min) break
    
    const taxableAmount = Math.min(annualIncome, b.max) - b.min
    tax += taxableAmount * b.rate
    
    if (annualIncome <= b.max) break
  }
  
  return tax
}

export function formatPhilippineMobile(number: string): string {
  // Remove all non-numeric characters
  const cleaned = number.replace(/\D/g, '')
  
  // Check if it starts with 63 (Philippines country code)
  if (cleaned.startsWith('63')) {
    const withoutCountryCode = cleaned.slice(2)
    return `+63 ${withoutCountryCode.slice(0, 3)} ${withoutCountryCode.slice(3, 6)} ${withoutCountryCode.slice(6)}`
  }
  
  // Check if it starts with 09 (local format)
  if (cleaned.startsWith('09')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
  }
  
  // Return as is if format is not recognized
  return number
}
