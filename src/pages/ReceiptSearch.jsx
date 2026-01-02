import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { receiptAPI } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { Search, ArrowLeft, Phone, Calendar, Hash, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ReceiptSearch() {
  const [query, setQuery] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query && !(amount && date)) {
      toast.error('Please enter a search term or amount/date');
      return;
    }

    setLoading(true);
    try {
      const params = {};
      if (query) params.q = query;
      if (amount) params.amount = amount;
      if (date) params.time = date;

      const response = await receiptAPI.universalSearch(params);
      if (response.data.success && response.data.receipt) {
        navigate(`/receipt/${response.data.receipt.receiptId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'No receipt found matching your search');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8 sm:py-12 px-4">
      <div className="max-w-md mx-auto relative mt-6 sm:mt-0">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="absolute -top-12 left-0 text-neutral-600 flex items-center gap-2 hover:bg-white/50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-neutral-900 tracking-tighter">Universal Search</h1>
          <p className="text-neutral-500 font-medium">Verify any payment instantly.</p>
        </div>

        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-primary text-white pt-8 pb-10 px-8">
            <CardTitle className="text-xl font-bold uppercase tracking-widest text-primary-100">Security Clearance</CardTitle>
            <p className="text-white/80 text-sm mt-1">
              Search by ID, Phone Number, or Amount + Date.
            </p>
          </CardHeader>

          <CardContent className="px-6 sm:px-8 py-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="query" className="text-xs uppercase font-black text-neutral-400 tracking-widest px-1">ID or Phone Number</Label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <Input
                    id="query"
                    placeholder="RCP-... or +234..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-12 h-14 rounded-2xl border-neutral-100 bg-neutral-50 focus:bg-white transition-all text-lg font-medium shadow-inner"
                  />
                </div>
              </div>

              <div className="relative py-4 px-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-100 border-dashed"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-neutral-400 font-black tracking-widest">OR USE DETAILS</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-xs uppercase font-black text-neutral-400 tracking-widest px-1">Amount (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-12 rounded-xl border-neutral-100 bg-neutral-50 font-bold shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-xs uppercase font-black text-neutral-400 tracking-widest px-1">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-12 rounded-xl border-neutral-100 bg-neutral-50 font-medium shadow-inner"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-16 rounded-2xl bg-primary hover:bg-opacity-90 text-white font-black text-xl shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    Searching...
                  </>
                ) : (
                  "Verify Payment"
                )}
              </Button>
            </form>

            <div className="mt-10 p-5 bg-neutral-50 rounded-2xl border border-neutral-100 border-dashed">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Hash className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest mb-1 leading-none">Public Guarantee</p>
                  <p className="text-[10px] sm:text-xs text-neutral-500 font-medium leading-relaxed">
                    Every payment on this platform is permanent and visible to everyone with the right details. This eliminates disputes permanently.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
