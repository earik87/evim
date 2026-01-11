import { useState } from 'react'

const MAX_LOAN = 2_500_000 // Maximum loan: 2.5 million TRY
const LOAN_TERM_YEARS: number = 10
const MONTHLY_INTEREST_RATE: number = 0.0265 // 2.65% monthly rate

const calculateMonthlyPayment = (principal: number): number => {
  if (principal <= 0) return 0
  
  const numberOfPayments = LOAN_TERM_YEARS * 12
  
  if (MONTHLY_INTEREST_RATE === 0) return principal / numberOfPayments
  
  const monthlyPayment = 
    (principal * MONTHLY_INTEREST_RATE * Math.pow(1 + MONTHLY_INTEREST_RATE, numberOfPayments)) /
    (Math.pow(1 + MONTHLY_INTEREST_RATE, numberOfPayments) - 1)
  
  return monthlyPayment
}

const translations = {
  en: {
    title: 'Mortgage Calculator',
    subtitle: 'Turkey',
    bddk: '📋 BDDK Regulations',
    houseTypeLabel: 'House Type',
    secondHand: 'Second-hand',
    new: 'New',
    housePriceLabel: 'House Price (₺)',
    housePricePlaceholder: 'Enter house price',
    loanAmountLabel: 'Loan Amount',
    monthlyPaymentLabel: 'Monthly Payment',
    totalPaymentLabel: 'Total Payment',
    downPaymentLabel: 'Down Payment',
    secondhandRules: 'Second-hand Rules:',
    newRules: 'New House Rules:',
    noLoan: 'No loan available for houses 10M+ TRY',
    invalidPrice: 'Please enter a valid house price.',
  },
  tr: {
    title: 'Mortgage Hesaplayıcı',
    subtitle: 'Türkiye',
    bddk: '📋 BDDK Yönetmelikleri',
    houseTypeLabel: 'Ev Türü',
    secondHand: 'İkinci El',
    new: 'Yeni',
    housePriceLabel: 'Ev Fiyatı (₺)',
    housePricePlaceholder: 'Ev fiyatını girin',
    loanAmountLabel: 'Kredi Tutarı',
    monthlyPaymentLabel: 'Aylık Ödeme',
    totalPaymentLabel: 'Toplam Ödeme',
    downPaymentLabel: 'Peşinat',
    secondhandRules: 'İkinci El Kuralları:',
    newRules: 'Yeni Ev Kuralları:',
    noLoan: '10M+ TRY için kredi bulunmamaktadır',
    invalidPrice: 'Lütfen geçerli bir ev fiyatı girin.',
  }
}

const getSecondHandLoanPercentage = (price: number): number => {
  if (price < 1_000_000) return 0.9 // 90% for under 1M
  if (price < 2_000_000) return 0.6 // 60% for 1-2M
  return 0.5 // 50% for 2M and above
}

const getNewHouseLoanPercentage = (price: number): number => {
  if (price < 5_000_000) return 0.8 // 80% for under 5M
  if (price < 10_000_000) return 0.7 // 70% for 5-10M
  if (price < 20_000_000) return 0.6 // 60% for 10-20M
  return 0.5 // 50% for 20M and above
}

export default function App() {
  const [housePrice, setHousePrice] = useState<string>('')
  const [houseType, setHouseType] = useState<'secondhand' | 'new'>('secondhand')
  const [language, setLanguage] = useState<'en' | 'tr'>('tr')
  const t = translations[language]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHousePrice(e.target.value)
  }

  const calculateMortgage = () => {
    const price = parseFloat(housePrice)
    if (!price || price <= 0) return null

    // For second-hand houses 10M TRY and above, no loan available (100% down payment)
    if (price >= 10_000_000 && houseType === 'secondhand') {
      return {
        loanAmount: 0,
        downPayment: price,
        loanPercentage: 0,
      }
    }

    // Get loan percentage based on house type and price tier
    const loanPercentage = houseType === 'new' 
      ? getNewHouseLoanPercentage(price)
      : getSecondHandLoanPercentage(price)
    
    // Apply max loan limit only for second-hand houses
    const loanAmount = houseType === 'secondhand'
      ? Math.min(price * loanPercentage, MAX_LOAN)
      : price * loanPercentage
    
    const downPayment = price - loanAmount

    return {
      loanAmount,
      downPayment,
      loanPercentage,
    }
  }

  const mortgage = calculateMortgage()

  const formatCurrency = (value: number) => {
    return value.toLocaleString('tr-TR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{t.title}</h1>
            <p className="text-sm text-gray-600">{t.subtitle}</p>
          </div>
          <button
            onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
            className="px-3 py-1 text-xs font-semibold bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            {language.toUpperCase()}
          </button>
        </div>

        <div className="flex gap-4 mb-8">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="houseType"
              value="new"
              checked={houseType === 'new'}
              onChange={(e) => setHouseType(e.target.value as 'secondhand' | 'new')}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">{language === 'en' ? 'New' : 'Yeni'}</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="houseType"
              value="secondhand"
              checked={houseType === 'secondhand'}
              onChange={(e) => setHouseType(e.target.value as 'secondhand' | 'new')}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">{language === 'en' ? 'Second-hand' : 'İkinci El'}</span>
          </label>
        </div>
        
        <a
          href="https://www.bddk.org.tr/Mevzuat/DokumanGetir/1164"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs text-blue-600 hover:text-blue-800 underline mb-6"
        >
          {t.bddk}
        </a>
        
        <div className="mb-8">
          <label htmlFor="housePrice" className="block text-sm font-medium text-gray-700 mb-2">
            {t.housePriceLabel}
          </label>
          <input
            id="housePrice"
            type="number"
            value={housePrice}
            onChange={handleChange}
            placeholder={t.housePricePlaceholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>

        {mortgage && (
          <div className="space-y-4">
            {/* House Price */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600 text-sm font-medium mb-1">
                {language === 'en' ? 'House Price' : 'Ev Fiyatı'}
              </p>
              <p className="text-2xl font-bold text-gray-800">
                ₺{formatCurrency(mortgage.loanAmount + mortgage.downPayment)}
              </p>
            </div>

            {/* Loan Amount */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-gray-600 text-sm font-medium mb-1">{t.loanAmountLabel}</p>
              <p className="text-2xl font-bold text-blue-600">
                ₺{formatCurrency(mortgage.loanAmount)}
              </p>
              <p className="text-xs text-blue-600 mt-1">({Math.round(mortgage.loanPercentage * 100)}% {language === 'en' ? 'of price' : 'fiyatının'})</p>
              {mortgage.loanAmount > 0 && (
                <div className="mt-3 pt-3 border-t border-blue-200 space-y-3">
                  <div>
                    <p className="text-gray-600 text-xs font-medium mb-1">{t.monthlyPaymentLabel}</p>
                    <p className="text-xl font-bold text-blue-600">
                      ₺{formatCurrency(calculateMonthlyPayment(mortgage.loanAmount))}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-medium mb-1">{t.totalPaymentLabel}</p>
                    <p className="text-xl font-bold text-blue-600">
                      ₺{formatCurrency(calculateMonthlyPayment(mortgage.loanAmount) * LOAN_TERM_YEARS * 12)}
                    </p>
                  </div>
                  <p className="text-xs text-blue-500">{LOAN_TERM_YEARS} years @ {(MONTHLY_INTEREST_RATE * 100).toFixed(2)}% monthly</p>
                </div>
              )}
              {mortgage.loanAmount === 0 && (
                <p className="text-xs text-blue-600 mt-2">{t.noLoan}</p>
              )}
            </div>

            {/* Down Payment */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-gray-600 text-sm font-medium mb-1">{t.downPaymentLabel}</p>
              <p className="text-2xl font-bold text-green-600">
                ₺{formatCurrency(mortgage.downPayment)}
              </p>
            </div>

            {/* Loan Info */}
            <div className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200 space-y-1">
              {houseType === 'secondhand' ? (
                <>
                  <p className="font-semibold text-gray-700">{t.secondhandRules}</p>
                  {language === 'en' ? (
                    <>
                      <p>• Under 1M TRY: 90% loan</p>
                      <p>• 1-2M TRY: 60% loan</p>
                      <p>• 2M+ TRY: 50% loan (max 2.5M)</p>
                      <p>• 10M+ TRY: No loan available</p>
                    </>
                  ) : (
                    <>
                      <p>• 1M TRY altı: %90 kredi</p>
                      <p>• 1-2M TRY: %60 kredi</p>
                      <p>• 2M+ TRY: %50 kredi (max 2.5M)</p>
                      <p>• 10M+ TRY: Kredi yok</p>
                    </>
                  )}
                </>
              ) : (
                <>
                  <p className="font-semibold text-gray-700">{t.newRules}</p>
                  {language === 'en' ? (
                    <>
                      <p>• Under 5M TRY: 80% loan</p>
                      <p>• 5-10M TRY: 70% loan</p>
                      <p>• 10-20M TRY: 60% loan</p>
                      <p>• 20M+ TRY: 50% loan (max 2.5M)</p>
                    </>
                  ) : (
                    <>
                      <p>• 5M TRY altı: %80 kredi</p>
                      <p>• 5-10M TRY: %70 kredi</p>
                      <p>• 10-20M TRY: %60 kredi</p>
                      <p>• 20M+ TRY: %50 kredi (max 2.5M)</p>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {housePrice && !mortgage && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-sm">
            {t.invalidPrice}
          </div>
        )}
      </div>
    </div>
  )
}
