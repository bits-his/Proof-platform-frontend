import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { paymentAPI } from '../api/client';
import { Button } from '../components/ui/Button';
import {
  RefreshCw,
  QrCode,
  CheckCircle
} from 'lucide-react';
import { SectionCards } from '../components/dashboard/SectionCards';
import { PaymentsTable } from '../components/dashboard/PaymentsTable';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export default function MerchantHome() {
  const [summary, setSummary] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [summaryRes, paymentsRes] = await Promise.all([
        paymentAPI.getDailySummary(),
        paymentAPI.getPayments()
      ]);
      setSummary(summaryRes.data.summary);
      setPayments(paymentsRes.data.payments);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8 px-4 sm:px-0">
      {/* Hero Summary - "Explain My Money" */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-8 shadow-sm mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-neutral-900 tracking-tighter">
              Hello, {user?.name || 'Partner'}
            </h2>
            <p className="text-neutral-500 font-medium text-lg max-w-lg leading-tight">
              {summary?.message || "Welcome back to your proof platform."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/qr-payment')}
              className="h-14 px-8 rounded-2xl bg-primary hover:bg-opacity-90 text-white font-black shadow-xl flex items-center gap-3 active:scale-95 transition-transform"
            >
              <QrCode className="h-5 w-5" />
              <span>Show My QR</span>
            </Button>
            <Button
              variant="outline"
              onClick={fetchData}
              className="h-14 w-14 p-0 rounded-2xl border-neutral-100 bg-white shadow-sm flex items-center justify-center hover:bg-neutral-50 active:rotate-180 transition-transform duration-500"
            >
              <RefreshCw className="h-8 w-8 text-neutral-400" />
            </Button>
          </div>
        </div>
      </div>

      {/* Section Cards */}
      <SectionCards summary={summary} />

      {/* Payments Table Area */}
      <div className="mt-8 w-full max-w-[100vw] overflow-hidden">
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-neutral-50 border-b border-neutral-100 px-8 py-6">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-400">Transaction History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <PaymentsTable data={payments} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

