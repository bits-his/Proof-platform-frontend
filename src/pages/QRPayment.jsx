import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentAPI } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import {
  ArrowLeft,
  RefreshCw,
  QrCode as QrIcon,
  Coins as HandCoins,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  ChevronDown,
  Tag
} from 'lucide-react';
import { toast } from 'sonner';

export default function QRPayment() {
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [showManualEntry, setShowManualEntry] = useState(false);

  // Manual payment form
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('transport_fare');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchQRCode();
  }, []);

  const fetchQRCode = async () => {
    setLoading(true);
    try {
      const response = await paymentAPI.getMerchantQR();
      setQrCode(response.data.qrCode);
    } catch (err) {
      console.error('Failed to load QR code:', err);
      toast.error('Failed to load QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleManualPayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const createResponse = await paymentAPI.create(
        parseFloat(amount),
        purpose,
        customerPhone || null,
        customerName || null
      );

      const reference = createResponse.data.payment.reference;
      const confirmResponse = await paymentAPI.confirm(reference);

      if (confirmResponse.data.success) {
        setSuccess({
          receiptId: confirmResponse.data.receipt.receiptId,
          amount: amount,
        });
        toast.success('Payment successful!');
        // Small delay then navigate
        setTimeout(() => {
          navigate(`/receipt/${confirmResponse.data.receipt.receiptId}`);
        }, 1500);
      } else {
        toast.error(confirmResponse.data.error || 'Payment failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  const purposeOptions = [
    { value: 'transport_fare', label: 'Transport Fare', icon: '🚕' },
    { value: 'market_levy', label: 'Market Levy', icon: '🏪' },
    { value: 'goods_purchase', label: 'Goods Purchase', icon: '🛍️' },
    { value: 'service_payment', label: 'Service Payment', icon: '🛠️' },
    { value: 'cooperative_dues', label: 'Cooperative Dues', icon: '🤝' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-neutral-900 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-12">
      {/* Premium Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-20">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/home')}
            className="p-2 -ml-2 text-neutral-400 hover:text-neutral-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-sm font-black uppercase tracking-widest text-neutral-900">Collection Point</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 pt-8 space-y-8">

        {/* Verification Shield Notice */}
        {!success && (
          <div className="flex items-center gap-3 bg-white border border-neutral-100 rounded-2xl p-4 shadow-sm">
            <div className="bg-primary/10 p-2 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-tight">
              Instant Smart Receipts Guaranteed
            </p>
          </div>
        )}

        {/* Success Modal Overlay (Simplified) */}
        {success && (
          <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300">
            <CardContent className="pt-12 pb-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-black text-neutral-900 mb-2">Payment Received</h2>
              <p className="text-neutral-400 font-medium mb-6">Generating your smart receipt...</p>
              <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-primary animate-progress" />
              </div>
            </CardContent>
          </Card>
        )}

        {!success && (
          <>
            {/* QR Code Display */}
            <div className={`transition-all duration-500 ${showManualEntry ? 'opacity-30 scale-95 blur-sm' : ''}`}>
              <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="text-center pt-8 pb-4">
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Merchant QR Code</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center pb-12">
                  {qrCode ? (
                    <div className="relative group">
                      <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                      <div className="bg-white p-8 rounded-[2rem] shadow-xl border-8 border-neutral-50 relative z-10">
                        <img src={qrCode} alt="Payment QR Code" className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px]" />
                      </div>
                      <div className="absolute -bottom-4 -right-4 bg-primary text-white p-3 rounded-2xl shadow-xl">
                        <Smartphone className="w-5 h-5" />
                      </div>
                    </div>
                  ) : (
                    <p className="text-red-600">Failed to load QR code</p>
                  )}
                  <p className="text-neutral-900 font-black text-lg mt-10 tracking-tight">Scan to Pay Instantly</p>
                  <p className="text-neutral-400 text-sm font-medium px-8 text-center mt-2 leading-tight">
                    Customer scans this on their phone or your printed copy.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Manual Entry Section */}
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => setShowManualEntry(!showManualEntry)}
                className="w-full h-14 rounded-2xl text-neutral-500 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white"
              >
                <HandCoins className="w-4 h-4" />
                {showManualEntry ? 'Close Manual Entry' : 'Manual Payment fall-back'}
              </Button>

              {showManualEntry && (
                <Card className="border-none shadow-2xl rounded-3xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                  <CardHeader className="bg-primary text-white py-6 px-8">
                    <CardTitle className="text-sm font-black uppercase tracking-widest">Manual Collection</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 sm:p-8">
                    <form onSubmit={handleManualPayment} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="amount" className="text-xs font-black uppercase text-neutral-400 tracking-widest">Amount to Collect</Label>
                        <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-2xl text-primary">₦</span>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="pl-12 h-16 rounded-2xl bg-neutral-50 border-none text-2xl font-black text-neutral-900 focus:bg-white transition-all shadow-inner"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="purpose" className="text-xs font-black uppercase text-neutral-400 tracking-widest">Primary Purpose</Label>
                        <div className="relative">
                          <Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                          <select
                            id="purpose"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            className="w-full pl-14 pr-10 h-16 rounded-2xl bg-neutral-50 border-none text-lg font-bold text-neutral-900 appearance-none focus:bg-white transition-all shadow-inner cursor-pointer"
                            required
                          >
                            {purposeOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.icon} &nbsp; {opt.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customerPhone" className="text-xs font-black uppercase text-neutral-400 tracking-widest">Customer Phone</Label>
                          <Input
                            id="customerPhone"
                            type="tel"
                            placeholder="+234..."
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="h-12 rounded-xl bg-neutral-50 border-none font-medium shadow-inner"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-16 rounded-2xl bg-primary hover:bg-opacity-90 text-white font-black text-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                        disabled={processing}
                      >
                        {processing ? (
                          <>
                            <RefreshCw className="w-6 h-6 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-6 h-6" />
                            Log & Verify Payment
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}

        {/* Footer Guarantee */}
        <p className="text-center text-[10px] font-black uppercase tracking-[0.25em] text-neutral-300 px-12 leading-relaxed">
          Proof Platform Secured. Permanent. Verifiable. Trusted nationwide.
        </p>

      </div>
    </div>
  );
}
