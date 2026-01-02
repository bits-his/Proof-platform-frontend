import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { User, ShieldCheck, Landmark, Phone, Building2, MapPin, RefreshCw, Plus, Loader2 } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { Spinner } from '../components/ui/spinner';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "../components/ui/dialog";

export default function Profile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Bank Account Form State
    const [bankForm, setBankForm] = useState({
        bank_name: '',
        account_number: '',
        account_name: '',
        settlement_cycle: 'T+1 (Daily)'
    });

    // Business Form State
    const [businessForm, setBusinessForm] = useState({
        category: 'Transport & Logistics',
        cac_number: '',
        address: '',
        bvn: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await authAPI.getProfile();
            const p = response.data.profile;
            setProfile(p);

            // Sync form state
            setBusinessForm({
                category: p.business_category || 'Transport & Logistics',
                cac_number: p.cac_number || '',
                address: p.address || '',
                bvn: p.bvn || ''
            });
        } catch (err) {
            console.error('Failed to load profile:', err);
            setError('Failed to load profile details');
            toast.error('Could not load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await authAPI.updateProfile({
                address: businessForm.address,
                bvn: businessForm.bvn,
                business_category: businessForm.category,
                cac_number: businessForm.cac_number
            });

            toast.success('Business details updated successfully!');
            fetchProfile();
        } catch (err) {
            console.error('Update profile error:', err);
            toast.error(err.response?.data?.error || 'Failed to update business details');
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddBank = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await authAPI.addBank({
                bank_name: bankForm.bank_name,
                account_number: bankForm.account_number,
                account_name: bankForm.account_name,
                settlement_cycle: bankForm.settlement_cycle
            });

            toast.success('Bank account linked successfully!');
            // Refresh profile to see new bank
            fetchProfile();
            setBankForm({
                bank_name: '',
                account_number: '',
                account_name: '',
                settlement_cycle: 'T+1 (Daily)'
            });
        } catch (err) {
            console.error('Add bank error:', err);
            toast.error(err.response?.data?.error || 'Failed to link bank account');
        } finally {
            setSubmitting(false);
        }
    };

    const getVerificationStatus = (level) => {
        const currentLevel = profile?.verification_level || 'Tier 1';
        const levels = ['Tier 1', 'Tier 2', 'Tier 3'];
        const currentIndex = levels.indexOf(currentLevel);
        const targetIndex = levels.indexOf(level);

        if (targetIndex < currentIndex) return 'Verified';
        if (targetIndex === currentIndex) return 'Verified';
        if (targetIndex === currentIndex + 1) return 'Pending';
        return 'Locked';
    };

    const isCurrentLevel = (level) => {
        return profile?.verification_level === level || (!profile?.verification_level && level === 'Tier 1');
    };

    const verificationLevels = [
        {
            level: 'Tier 1',
            status: getVerificationStatus('Tier 1'),
            description: 'Basic identification and phone verification.',
            current: isCurrentLevel('Tier 1')
        },
        {
            level: 'Tier 2',
            status: getVerificationStatus('Tier 2'),
            description: 'BVN and address verification for higher limits.',
            current: isCurrentLevel('Tier 2')
        },
        {
            level: 'Tier 3',
            status: getVerificationStatus('Tier 3'),
            description: 'Full business documentation for enterprise features.',
            current: isCurrentLevel('Tier 3')
        },
    ];

    if (loading) {
        return (
            <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <Skeleton className="h-8 w-32" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-[400px] col-span-1" />
                    <Skeleton className="h-[400px] lg:col-span-2" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto px-1 sm:px-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tighter text-neutral-900">Merchant Profile</h1>
                    <p className="text-neutral-500 font-medium">Manage your business information and verification status.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="success" className="bg-primary/10 text-primary border-primary/20 text-sm py-2 px-4 rounded-xl font-bold">
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Verified Merchant
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Verification Status */}
                <Card className="lg:col-span-1 border-none shadow-sm bg-neutral-50 rounded-3xl overflow-hidden">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-black flex items-center gap-3 text-neutral-900 uppercase tracking-tight">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                            Verification
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8 pb-10">
                        {verificationLevels.map((tier) => (
                            <div key={tier.level} className={`relative pl-8 pb-2 border-l-2 ${tier.current ? 'border-primary' : 'border-neutral-200'} last:border-l-0`}>
                                <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 bg-white ${tier.current ? 'border-primary' : 'border-neutral-300'}`} />
                                <div className="flex flex-col mb-1">
                                    <h3 className={`font-black text-sm uppercase tracking-wider ${tier.current ? 'text-primary' : 'text-neutral-400'}`}>{tier.level}</h3>
                                    <div className="mt-1">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${tier.status === 'Verified' ? 'bg-primary text-white' : tier.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-neutral-200 text-neutral-500'}`}>
                                            {tier.status}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-xs font-medium text-neutral-500 mt-2 leading-relaxed">{tier.description}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Business Information & Verification Form */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-xl shadow-neutral-200/50 rounded-3xl overflow-hidden">
                        <CardHeader className="bg-white border-b border-neutral-100 flex flex-row items-center justify-between py-6 px-8">
                            <CardTitle className="text-lg font-black flex items-center gap-3 text-neutral-900 tracking-tight">
                                <Building2 className="w-6 h-6 text-primary" />
                                Business Details
                            </CardTitle>
                            {profile?.verification_level === 'Tier 1' && (
                                <Badge className="bg-amber-500 text-white border-none rounded-lg text-[10px] font-black uppercase tracking-widest px-2 py-1 animate-pulse">Action Required</Badge>
                            )}
                        </CardHeader>
                        <CardContent className="p-8">
                            <form className="space-y-6" onSubmit={handleUpdateProfile}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Business Name</label>
                                        <div className="p-4 bg-neutral-50 border-none rounded-2xl text-sm font-bold text-neutral-500 flex items-center justify-between shadow-inner">
                                            {profile?.name || user?.name}
                                            <ShieldCheck className="w-4 h-4 text-primary opacity-50" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Phone Number</label>
                                        <div className="p-4 bg-neutral-50 border-none rounded-2xl text-sm font-bold text-neutral-500 shadow-inner">
                                            {profile?.phone || user?.phone}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Business Address</label>
                                    {profile?.address ? (
                                        <div className="p-4 bg-neutral-50 border-none rounded-2xl text-sm font-bold text-neutral-500 shadow-inner">
                                            {profile.address}
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            value={businessForm.address}
                                            onChange={(e) => setBusinessForm({ ...businessForm, address: e.target.value })}
                                            className="w-full p-4 bg-neutral-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all shadow-inner"
                                            placeholder="Enter Business Address"
                                        />
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">BVN / NIN</label>
                                        {profile?.bvn ? (
                                            <div className="p-4 bg-neutral-50 border-none rounded-2xl text-sm font-bold text-neutral-500 shadow-inner">
                                                ******{profile.bvn.slice(-4)}
                                            </div>
                                        ) : (
                                            <input
                                                type="text"
                                                maxLength={11}
                                                value={businessForm.bvn}
                                                onChange={(e) => setBusinessForm({ ...businessForm, bvn: e.target.value })}
                                                className="w-full p-4 bg-neutral-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all shadow-inner font-mono"
                                                placeholder="222********"
                                            />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Business Category</label>
                                        <select
                                            value={businessForm.category}
                                            onChange={(e) => setBusinessForm({ ...businessForm, category: e.target.value })}
                                            className="w-full p-4 bg-neutral-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all shadow-inner"
                                        >
                                            <option>Transport & Logistics</option>
                                            <option>Retail & Trade</option>
                                            <option>Food & Services</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-neutral-100">
                                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-widest mb-4">Registration Details</h4>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">CAC Number (RC-XXXXXX)</label>
                                        <input
                                            type="text"
                                            placeholder="RC-1234567"
                                            value={businessForm.cac_number}
                                            onChange={(e) => setBusinessForm({ ...businessForm, cac_number: e.target.value })}
                                            className="w-full p-4 bg-neutral-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all shadow-inner"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                                    <button type="button" className="px-6 py-4 text-sm font-black text-neutral-400 hover:text-neutral-600 transition-colors uppercase tracking-widest">Discard</button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-8 py-4 text-sm font-black text-white bg-primary hover:bg-opacity-90 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 min-w-[200px] disabled:opacity-70 uppercase tracking-widest"
                                    >
                                        {submitting ? <Spinner className="w-5 h-5 border-white" /> : 'Update Account'}
                                    </button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-neutral-200/50 rounded-3xl overflow-hidden">
                        <CardHeader className="bg-white border-b border-neutral-100 py-6 px-8">
                            <CardTitle className="text-lg font-black flex items-center gap-3 text-neutral-900 tracking-tight">
                                <Landmark className="w-6 h-6 text-primary" />
                                Settlements
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {profile?.banks && profile.banks.length > 0 ? (
                                <div className="divide-y divide-neutral-100">
                                    {profile.banks.map((bank, index) => (
                                        <div key={bank.id} className="p-6 hover:bg-neutral-50 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-sm font-black text-neutral-900 flex items-center gap-3">
                                                    {bank.bank_name}
                                                    {bank.is_primary && (
                                                        <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black px-2 py-0.5 uppercase tracking-widest">Primary</Badge>
                                                    )}
                                                </h4>
                                                <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded-lg">
                                                    {bank.settlement_cycle}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-black text-neutral-400 font-mono tracking-tighter">
                                                    •••• •••• •••{bank.account_number.slice(-3)}
                                                </span>
                                                <span className="text-neutral-300 font-bold text-[10px] uppercase tracking-widest">Linked {new Date(profile.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-10 text-center text-neutral-400 font-medium italic">
                                    No settlement accounts linked.
                                </div>
                            )}

                            <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex justify-center">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="text-primary text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-2 transition-all hover:gap-3">
                                            <Plus className="w-4 h-4" />
                                            Add Settlement Account
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[450px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
                                        <div className="bg-primary p-8 text-white relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                            <div className="relative z-10">
                                                <DialogHeader>
                                                    <DialogTitle className="text-2xl font-black text-white tracking-tighter">Link Bank Account</DialogTitle>
                                                    <DialogDescription className="text-white/80 font-medium">
                                                        Add a new account for instant settlements.
                                                    </DialogDescription>
                                                </DialogHeader>
                                            </div>
                                        </div>
                                        <form onSubmit={handleAddBank} className="p-8 space-y-6">
                                            <div className="grid gap-6">
                                                <div className="space-y-2">
                                                    <label htmlFor="bankName" className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Select Bank</label>
                                                    <select
                                                        id="bankName"
                                                        value={bankForm.bank_name}
                                                        onChange={(e) => setBankForm({ ...bankForm, bank_name: e.target.value })}
                                                        className="w-full p-4 bg-neutral-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all shadow-inner"
                                                        required
                                                    >
                                                        <option value="">Select a bank</option>
                                                        <option value="Access Bank">Access Bank PLC</option>
                                                        <option value="First Bank">First Bank of Nigeria</option>
                                                        <option value="GTBank">Guaranty Trust Bank</option>
                                                        <option value="UBA">United Bank for Africa (UBA)</option>
                                                        <option value="Zenith Bank">Zenith Bank PLC</option>
                                                        <option value="Kuda Bank">Kuda Microfinance Bank</option>
                                                        <option value="Moniepoint">Moniepoint MFB</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="accNumber" className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Account Number</label>
                                                    <input
                                                        id="accNumber"
                                                        type="text"
                                                        maxLength={10}
                                                        placeholder="0123456789"
                                                        value={bankForm.account_number}
                                                        onChange={(e) => setBankForm({ ...bankForm, account_number: e.target.value })}
                                                        className="w-full p-4 bg-neutral-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all shadow-inner font-mono text-lg"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="accName" className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Account Name</label>
                                                    <input
                                                        id="accName"
                                                        type="text"
                                                        placeholder="CHINEDU OKEKE"
                                                        value={bankForm.account_name}
                                                        onChange={(e) => setBankForm({ ...bankForm, account_name: e.target.value })}
                                                        className="w-full p-4 bg-neutral-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all shadow-inner uppercase"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Settlement Cycle</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setBankForm({ ...bankForm, settlement_cycle: 'T+1 (Daily)' })}
                                                            className={`p-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${bankForm.settlement_cycle === 'T+1 (Daily)' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-neutral-50 text-neutral-400 hover:bg-neutral-100'}`}
                                                        >
                                                            Daily
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setBankForm({ ...bankForm, settlement_cycle: 'T+7 (Weekly)' })}
                                                            className={`p-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${bankForm.settlement_cycle === 'T+7 (Weekly)' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-neutral-50 text-neutral-400 hover:bg-neutral-100'}`}
                                                        >
                                                            Weekly
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <DialogFooter className="pt-6 gap-3">
                                                <DialogClose asChild>
                                                    <button type="button" className="px-6 py-4 text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-600 transition-colors">
                                                        Cancel
                                                    </button>
                                                </DialogClose>
                                                <button
                                                    type="submit"
                                                    disabled={submitting}
                                                    className="flex-1 px-8 py-4 text-xs font-black uppercase tracking-widest text-white bg-primary hover:bg-opacity-90 rounded-2xl shadow-xl shadow-primary/20 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                                                >
                                                    {submitting ? <Spinner className="w-5 h-5 border-white" /> : 'Link Account'}
                                                </button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
