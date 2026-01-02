import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { receiptAPI } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatCurrency, formatDate, formatPhoneNumber } from '../lib/utils';
import {
  CheckCircle,
  Clock,
  XCircle,
  Share2,
  ArrowLeft,
  Receipt as ReceiptIcon,
  ShieldCheck,
  Building2,
  Tag
} from 'lucide-react';

const SerratedEdge = ({ position = 'bottom' }) => (
  <div className={`absolute left-0 right-0 h-4 flex overflow-hidden ${position === 'top' ? '-top-4 rotate-180' : '-bottom-4'}`}>
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="w-8 h-8 bg-white rotate-45 transform origin-top-left -ml-4 shadow-sm"
        style={{ marginTop: '-1rem' }}
      />
    ))}
  </div>
);

export default function ReceiptView() {
  const { receiptId } = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (receiptId) {
      fetchReceipt();
    }
  }, [receiptId]);

  const fetchReceipt = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await receiptAPI.getById(receiptId);
      setReceipt(response.data.receipt);
    } catch (err) {
      setError(err.response?.data?.error || 'Receipt not found');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppShare = async () => {
    try {
      const response = await receiptAPI.getWhatsAppLink(receiptId);
      window.open(response.data.whatsappUrl, '_blank');
    } catch (err) {
      console.error('Failed to generate WhatsApp link:', err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-primary" />;
      case 'pending':
        return <Clock className="w-8 h-8 text-amber-600" />;
      case 'failed':
        return <XCircle className="w-8 h-8 text-red-600" />;
      default:
        return <Clock className="w-8 h-8 text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <ReceiptIcon className="w-12 h-12 text-primary animate-pulse mx-auto mb-2" />
          <p className="text-neutral-600 font-medium">Retrieving secure receipt...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-none shadow-xl">
          <CardContent className="pt-8 text-center px-6">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Receipt Not Found</h2>
            <p className="text-neutral-600 mb-6">{error}</p>
            <Button
              onClick={() => navigate('/receipt-search')}
              className="w-full h-12 text-lg bg-primary hover:bg-opacity-90"
            >
              Back to Search
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 py-6 sm:py-12 px-4">
      <div className="max-w-md mx-auto relative mt-8 sm:mt-0">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="absolute -top-12 left-0 text-neutral-600 flex items-center gap-2 hover:bg-white/50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Paper Receipt Container */}
        <div className="bg-white shadow-2xl relative mb-8 sm:mb-12">
          {/* Top Edge */}
          <SerratedEdge position="top" />

          <CardContent className="pt-10 pb-12 px-6 sm:px-8">
            {/* Merchant Info */}
            <div className="text-center mb-8 px-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-xl font-black uppercase tracking-wider text-neutral-900 break-words line-clamp-2">
                {receipt.merchant.name}
              </h1>
              <p className="text-sm text-neutral-500 font-mono mt-1">
                {formatPhoneNumber(receipt.merchant.phone)}
              </p>
            </div>

            {/* Verification Status */}
            <div className={`p-4 rounded-xl mb-8 flex flex-col items-center gap-2 ${receipt.payment.status === 'success' ? 'bg-primary/10' : 'bg-amber-50'
              }`}>
              {getStatusIcon(receipt.payment.status)}
              <div className="text-center">
                <p className={`font-black uppercase tracking-widest text-lg ${receipt.payment.status === 'success' ? 'text-primary' : 'text-amber-700'
                  }`}>
                  {receipt.payment.status === 'success' ? 'Verified Payment' : receipt.payment.status}
                </p>
                <p className="text-[10px] sm:text-xs text-neutral-500 font-medium font-mono uppercase">
                  ID: {receipt.receiptId}
                </p>
              </div>
            </div>

            {/* Purpose Tag */}
            <div className="flex items-center justify-between py-4 border-y border-neutral-100 border-dashed mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Tag className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-tighter">Purpose</p>
                  <p className="text-sm sm:text-base text-neutral-900 font-bold leading-tight">{receipt.payment.purpose}</p>
                </div>
              </div>
              <p className="text-[10px] sm:text-xs font-mono text-neutral-400 text-right">
                {formatDate(receipt.payment.createdAt, { hideYear: true })}
              </p>
            </div>

            {/* Amount Section */}
            <div className="text-center mb-10">
              <p className="text-3xl sm:text-4xl font-black text-neutral-900">
                {formatCurrency(receipt.payment.amount)}
              </p>
              <p className="text-[10px] sm:text-sm text-neutral-400 font-medium mt-1 uppercase tracking-widest italic leading-tight">Total Amount Paid</p>
            </div>

            {/* Detailed Info */}
            <div className="space-y-4 mb-10 pt-6 border-t border-neutral-100 border-dashed text-xs sm:text-sm">
              <div className="flex justify-between items-center text-neutral-500 gap-4">
                <span className="font-mono uppercase text-[10px] sm:text-xs tracking-wider shrink-0">Ref Number</span>
                <span className="font-mono text-neutral-900 select-all truncate">{receipt.payment.reference}</span>
              </div>
              {receipt.payment.customerName && (
                <div className="flex justify-between items-center text-neutral-500 gap-4">
                  <span className="font-mono uppercase text-[10px] sm:text-xs tracking-wider shrink-0">Customer</span>
                  <span className="font-medium text-neutral-900 truncate text-right">
                    {receipt.payment.customerName}
                  </span>
                </div>
              )}
              {receipt.payment.customerPhone && (
                <div className="flex justify-between items-center text-neutral-500 gap-4">
                  <span className="font-mono uppercase text-[10px] sm:text-xs tracking-wider shrink-0">Phone</span>
                  <span className="font-medium text-neutral-900">
                    {formatPhoneNumber(receipt.payment.customerPhone)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-neutral-500 gap-4">
                <span className="font-mono uppercase text-[10px] sm:text-xs tracking-wider shrink-0">Date</span>
                <span className="font-medium text-neutral-900">
                  {new Date(receipt.payment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-neutral-500 gap-4">
                <span className="font-mono uppercase text-[10px] sm:text-xs tracking-wider shrink-0">Time</span>
                <span className="font-medium text-neutral-900">
                  {new Date(receipt.payment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Verification Shield */}
            <div className="bg-primary text-white rounded-2xl p-6 text-center relative overflow-hidden shadow-lg shadow-primary/20">
              <div className="relative z-10 flex flex-col items-center gap-3">
                <ShieldCheck className="w-10 h-10 text-white opacity-90" />
                <div>
                  <h3 className="font-black uppercase tracking-tighter text-lg leading-tight">Authentic Receipt</h3>
                  <p className="text-[10px] sm:text-xs text-white/80 font-medium leading-relaxed">
                    Scanned & Verified by Proof Platform Secured Systems. No dispute can overrule this proof.
                  </p>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <ShieldCheck className="w-32 h-32" />
              </div>
            </div>
          </CardContent>

          {/* Bottom Edge */}
          <SerratedEdge position="bottom" />
        </div>

        {/* Share Action */}
        <div className="space-y-4 px-2 sm:px-0">
          <Button
            onClick={handleWhatsAppShare}
            className="w-full h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-lg shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            <Share2 className="w-5 h-5" />
            Share to WhatsApp
          </Button>

          <p className="text-center text-neutral-400 text-[10px] font-medium uppercase tracking-[0.15em] px-4 leading-relaxed">
            Every payment generates a proof. This receipt is permanent and cannot be deleted.
          </p>
        </div>
      </div>
    </div>
  );
}
