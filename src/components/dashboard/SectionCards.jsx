import { TrendingUp, CreditCard, Wallet, Receipt, Ban } from 'lucide-react';
import { Badge } from "@/components/ui/Badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/Card"
import { formatCurrency } from '@/lib/utils';

export function SectionCards({ summary }) {
  const totalCollected = summary?.totalCollected || 0;
  const successCount = summary?.successfulPayments || 0;
  const pendingCount = summary?.pendingPayments || 0;
  const netAmount = summary?.netAmount || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Today's Take Home (Net) */}
      <Card className="bg-neutral-900 border-none shadow-2xl overflow-hidden relative group">
        <CardHeader className="pb-2 relative z-10">
          <CardDescription className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Today's Take-Home</CardDescription>
          <CardTitle className="text-4xl font-black text-white tabular-nums tracking-tighter">
            {formatCurrency(netAmount)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="pt-0 relative z-10">
          <Badge className="bg-primary text-white border-none font-bold">
            NET RECEIVABLE
          </Badge>
        </CardFooter>
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Wallet className="w-24 h-24 text-white -mr-8 -mt-8" />
        </div>
      </Card>

      {/* Total Collected (Gross) */}
      <Card className="bg-white border-neutral-100 shadow-xl overflow-hidden relative">
        <CardHeader className="pb-2">
          <CardDescription className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Total Collected</CardDescription>
          <CardTitle className="text-3xl font-black text-neutral-900 tabular-nums tracking-tighter">
            {formatCurrency(totalCollected)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="pt-0 flex items-center gap-2">
          <span className="text-sm font-bold text-neutral-400">{successCount} PAYMENTS</span>
          <div className="h-1 w-1 bg-neutral-200 rounded-full" />
          <span className="text-xs font-mono text-neutral-400">GROSS</span>
        </CardFooter>
      </Card>

      {/* Pending Settlements */}
      <Card className="bg-white border-neutral-100 shadow-xl overflow-hidden relative">
        <CardHeader className="pb-2">
          <CardDescription className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Settled vs Pending</CardDescription>
          <div className="flex items-baseline gap-2">
            <CardTitle className="text-3xl font-black text-neutral-900 tabular-nums tracking-tighter">
              {successCount}
            </CardTitle>
            <span className="text-neutral-300 font-black text-xl">/</span>
            <span className="text-xl font-bold text-neutral-400">{pendingCount}</span>
          </div>
        </CardHeader>
        <CardFooter className="pt-0">
          <Badge variant="outline" className={`${pendingCount > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'
            } font-bold`}>
            {pendingCount > 0 ? 'WAITING ON BANK' : 'ALL CLEAR'}
          </Badge>
        </CardFooter>
      </Card>

      {/* platform Fees */}
      <Card className="bg-white border-neutral-100 shadow-xl overflow-hidden relative">
        <CardHeader className="pb-2">
          <CardDescription className="text-neutral-500 font-bold uppercase tracking-widest text-xs">System Fees</CardDescription>
          <CardTitle className="text-3xl font-black text-neutral-900 tabular-nums tracking-tighter">
            {formatCurrency(summary?.fees || 0)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="pt-0">
          <span className="text-xs font-black uppercase text-neutral-400 tracking-tighter">1.5% FLAT RATE APPLIED</span>
        </CardFooter>
      </Card>
    </div>
  );
}
