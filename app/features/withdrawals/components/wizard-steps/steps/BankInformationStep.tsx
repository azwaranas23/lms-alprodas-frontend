import { useState } from 'react';
import { CheckCircle, Building2, CreditCard, User, ArrowLeft, ArrowRight, ShieldAlert, AlertTriangle, Search, X, Banknote, ChevronDown } from 'lucide-react';
import { useWithdrawal } from '~/contexts/WithdrawalContext';
import { Button } from '~/components/atoms/Button';
import { Input } from '~/components/atoms/Input';

interface Bank {
  code: string;
  name: string;
  logo: string;
  description: string;
}

interface BankInformationStepProps {
  onNext: () => void;
  onBack: () => void;
}

const banks: Bank[] = [
  {
    code: 'bca',
    name: 'Bank Central Asia (BCA)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/200px-Bank_Central_Asia.svg.png',
    description: 'Most popular bank in Indonesia'
  },
  {
    code: 'mandiri',
    name: 'Bank Mandiri',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/200px-Bank_Mandiri_logo_2016.svg.png',
    description: "Indonesia's largest state-owned bank"
  },
  {
    code: 'bni',
    name: 'Bank Negara Indonesia (BNI)',
    logo: 'https://www.bni.co.id/Portals/1/BNI/Images/logo-bni-new.png',
    description: 'Leading commercial bank'
  },
  {
    code: 'bri',
    name: 'Bank Rakyat Indonesia (BRI)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/BRI_2020.svg/200px-BRI_2020.svg.png',
    description: 'People\'s bank of Indonesia'
  },
  {
    code: 'cimb',
    name: 'CIMB Niaga',
    logo: 'https://media.licdn.com/dms/image/v2/C560BAQE0UE-6hjzwPA/company-logo_200_200/company-logo_200_200/0/1631355002048?e=2147483647&v=beta&t=u5ba8KYyPpsXU79lgKfLNCmPGxHeUYL5s4MHR3Ivs4A',
    description: 'Malaysian-Indonesian joint venture bank'
  },
  {
    code: 'permata',
    name: 'Bank Permata',
    logo: 'https://awsimages.detik.net.id/visual/2024/10/11/permata-bank_169.png?w=1200',
    description: 'Full-service commercial bank'
  }
];

export default function BankInformationStep({ onNext, onBack }: BankInformationStepProps) {
  const { formData, updateFormData } = useWithdrawal();
  const [selectedBank, setSelectedBank] = useState<Bank | null>(
    formData.bankName ? banks.find(bank => bank.name === formData.bankName) || null : null
  );
  const [accountNumber, setAccountNumber] = useState(formData.accountNumber || '');
  const [accountHolderName, setAccountHolderName] = useState(formData.accountHolderName || formData.userProfile.name);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [bankSearchTerm, setBankSearchTerm] = useState('');

  const filteredBanks = banks.filter(bank =>
    bank.name.toLowerCase().includes(bankSearchTerm.toLowerCase()) ||
    bank.description.toLowerCase().includes(bankSearchTerm.toLowerCase())
  );

  const selectBank = (bank: Bank) => {
    setSelectedBank(bank);
    setIsBankModalOpen(false);
    setBankSearchTerm('');
  };

  const clearBankSelection = () => {
    setSelectedBank(null);
  };

  const validateAccountNumber = (value: string) => {
    const cleanValue = value.replace(/[^\d]/g, '');
    if (cleanValue.length <= 20) {
      setAccountNumber(cleanValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBank && accountNumber && accountHolderName) {
      // Save bank information to context
      updateFormData({
        bankName: selectedBank.name,
        accountNumber,
        accountHolderName
      });
      onNext();
    }
  };

  const isAccountNumberValid = accountNumber.length >= 8 && accountNumber.length <= 20;

  return (
    <>
      <div className="flex gap-6 pl-5 items-start">
        {/* Form Section */}
        <div className="flex-1">
          {/* Withdrawal Summary Card */}
          <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-[12px] flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-brand-dark text-xl font-bold">Withdrawal Summary</h3>
                <p className="text-brand-light text-sm font-normal">Amount you requested to withdraw</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-[16px] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-brand-light text-sm font-medium">Withdrawal Amount</p>
                  <p className="text-brand-dark text-3xl font-extrabold leading-tight my-2">
                    {formData.amount > 0 ? `Rp ${formData.amount.toLocaleString('id-ID')}` : 'Rp 0'}
                  </p>
                  <p className="text-brand-light text-sm">Processing fee: FREE</p>
                </div>
                <div className="w-16 h-16 bg-blue-50 rounded-[20px] flex items-center justify-center">
                  <Banknote className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Bank Information Section */}
            <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-brand-dark text-xl font-bold">Bank Information</h3>
                  <p className="text-brand-light text-sm font-normal">Select your bank and provide account details</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Select Bank */}
                <div className="mb-6">
                  <label className="block text-brand-dark text-base font-semibold mb-1">Select Bank *</label>
                  <button type="button" onClick={() => setIsBankModalOpen(true)}
                      className="w-full border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300 font-semibold px-4 py-3 flex items-center gap-3 text-left">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <span className={`flex-1 ${selectedBank ? 'text-brand-dark font-semibold' : 'text-[#0D2929] font-normal'}`}>
                      {selectedBank ? selectedBank.name : 'Select your bank'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {/* Selected Bank Info */}
                  {selectedBank && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-[12px] border border-[#DCDEDD]">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-16 relative overflow-hidden rounded-[8px] bg-white flex items-center justify-center">
                          <img src={selectedBank.logo} alt={selectedBank.name} className="max-w-20 max-h-12 object-contain" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-brand-dark text-base font-semibold">{selectedBank.name}</h4>
                          <p className="text-brand-light text-sm">Selected bank for withdrawal</p>
                        </div>
                        <button type="button" onClick={clearBankSelection} className="text-brand-light hover:text-brand-dark transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Account Number */}
                <div className="mb-4">
                  <Input
                    type="text"
                    label="Account Number *"
                    value={accountNumber}
                    onChange={(e) => validateAccountNumber(e.target.value)}
                    icon={<CreditCard className="w-5 h-5" />}
                    placeholder="Enter your account number"
                    helperText="Please double-check your account number"
                    required
                    error={accountNumber.length > 0 && !isAccountNumberValid ? "Account number must be 8-20 digits" : ""}
                  />
                </div>

                {/* Account Holder Name */}
                <div className="mb-4">
                  <Input
                    type="text"
                    label="Account Holder Name *"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    icon={<User className="w-5 h-5" />}
                    placeholder="Account holder name"
                    helperText="Must match the name on your bank account"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Form Navigation */}
            <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-brand-dark text-sm font-medium">Step 3 of 4</p>
                  <p className="text-brand-light text-xs font-normal mt-1">Provide your bank account information</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="px-6 py-3"
                  >
                    <ArrowLeft className="w-4 h-4 text-gray-600" />
                    <span className="text-brand-dark text-base font-semibold">Back</span>
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!selectedBank || !isAccountNumberValid || !accountHolderName}
                    className="px-6 py-3"
                  >
                    <span className="text-brand-white text-base font-semibold">Continue</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="w-80 flex-shrink-0 pr-5">
          <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 sticky top-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-50 rounded-[12px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-brand-dark text-lg font-bold">Important Notes</h3>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-3 h-3 text-yellow-600" />
                </div>
                <div>
                  <p className="text-brand-dark text-base font-semibold">Account verification</p>
                  <p className="text-brand-light text-xs font-normal">Ensure the account details are correct to avoid delays</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-3 h-3 text-yellow-600" />
                </div>
                <div>
                  <p className="text-brand-dark text-base font-semibold">Processing time</p>
                  <p className="text-brand-light text-xs font-normal">Bank transfers typically take 1-3 business days</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-3 h-3 text-yellow-600" />
                </div>
                <div>
                  <p className="text-brand-dark text-base font-semibold">Name verification</p>
                  <p className="text-brand-light text-xs font-normal">Account holder name must match your registered name</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Selection Modal */}
      {isBankModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-[20px] border border-[#DCDEDD] w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#DCDEDD]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-brand-dark text-xl font-bold">Select Bank</h3>
                    <p className="text-brand-light text-sm font-normal">Choose your bank for withdrawal</p>
                  </div>
                </div>
                <button type="button" onClick={() => setIsBankModalOpen(false)}
                    className="w-10 h-10 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-6 border-b border-[#DCDEDD]">
              <Input
                type="text"
                value={bankSearchTerm}
                onChange={(e) => setBankSearchTerm(e.target.value)}
                icon={<Search className="w-5 h-5" />}
                placeholder="Search banks..."
              />
            </div>

            {/* Banks List */}
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBanks.map((bank) => (
                  <div key={bank.code}
                      onClick={() => selectBank(bank)}
                      className="border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 hover:shadow-lg transition-all duration-300 p-4 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-28 h-16 relative overflow-hidden rounded-[12px] bg-white flex items-center justify-center p-2">
                        <img src={bank.logo} alt={bank.name} className="max-w-24 max-h-12 object-contain" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-brand-dark text-base font-bold">{bank.name}</h4>
                        <p className="text-brand-light text-sm font-normal">{bank.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}