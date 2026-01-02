import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/client';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { InputOTP } from '../components/ui/InputOTP';
import { Smartphone, Lock, CheckCircle, PilcrowSquare } from 'lucide-react';
import { Spinner } from '../components/ui/spinner';
import { toast } from 'sonner';

export default function Signup() {
    const [step, setStep] = useState('phone'); // phone, otp, name, pin
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.requestOTP(phone);
            setMessage(response.data.message);
            toast.success('OTP sent successfully');
            setStep('otp');
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to send OTP';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.verifyOTP(phone, otp, name || undefined);

            if (response.data.requiresName) {
                setStep('name');
                setLoading(false);
                return;
            }

            if (response.data.requiresPinSetup) {
                setStep('pin');
                setLoading(false);
                return;
            }

            // If already has account, redirect to login
            const msg = 'Account already exists. Please sign in instead.';
            setError(msg);
            toast.error(msg);
            setLoading(false);
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to verify OTP';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleSetName = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.verifyOTP(phone, otp, name);

            if (response.data.requiresPinSetup) {
                setStep('pin');
            }
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to create account';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleSetPin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authAPI.setPin(phone, pin);
            // After setting PIN, log them in automatically
            const response = await authAPI.login(phone, pin);
            login(response.data.token, response.data.merchant);
            toast.success('Account created successfully! Welcome to Proof Platform.');
            navigate('/home');
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to set PIN';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-screen lg:grid lg:grid-cols-2">
            {/* Left Side (Form) */}
            <div className="flex items-center justify-center p-6 bg-white lg:p-12">
                <div className="w-full max-w-sm space-y-8">
                    <div className="lg:hidden text-center mb-10">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-4 shadow-lg shadow-primary/20">
                            <PilcrowSquare className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-neutral-900 tracking-tighter">Proof Platform</h1>
                    </div>

                    <div className="space-y-2 text-center lg:text-left">
                        <h1 className="text-3xl font-black tracking-tighter text-neutral-900">
                            {step === 'phone' && 'Create an account'}
                            {step === 'otp' && 'Verify your phone'}
                            {step === 'name' && 'Complete your profile'}
                            {step === 'pin' && 'Set up security'}
                        </h1>
                        <p className="text-neutral-500 font-medium">
                            {step === 'phone' && 'Join Proof Platform to start accepting verified payments'}
                            {step === 'otp' && 'We sent a code to your phone number'}
                            {step === 'name' && 'Tell us your business name'}
                            {step === 'pin' && 'Secure your account with a 4-digit PIN'}
                        </p>
                    </div>

                    <div className="mt-8">
                        {step === 'phone' && (
                            <form onSubmit={handleRequestOTP} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Phone Number</Label>
                                    <div className="relative">
                                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+2348012345678"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="pl-12 h-14 rounded-2xl bg-neutral-50 border-none focus:bg-white transition-all shadow-inner"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                                        {error}
                                    </div>
                                )}

                                <Button type="submit" className="w-full h-14 rounded-2xl bg-primary hover:bg-opacity-90 text-white font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95" disabled={loading}>
                                    {loading ? (
                                        <div className="flex items-center gap-3">
                                            <Spinner className="w-5 h-5 border-white" />
                                            <span>Sending...</span>
                                        </div>
                                    ) : 'Get Started'}
                                </Button>

                                <div className="text-center pt-4">
                                    <span className="text-neutral-500 font-medium text-sm">Already have an account? </span>
                                    <Link to="/login" className="text-primary hover:underline font-black text-sm uppercase tracking-wider">
                                        Sign in
                                    </Link>
                                </div>
                            </form>
                        )}

                        {step === 'otp' && (
                            <form onSubmit={handleVerifyOTP} className="space-y-6">
                                {message && (
                                    <div className="bg-primary/5 border border-primary/10 text-primary px-4 py-3 rounded-xl text-sm font-medium">
                                        {message}
                                        <p className="mt-1 font-mono text-[10px] opacity-70">Dev Mode: Use 123456</p>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="flex justify-center">
                                        <InputOTP
                                            maxLength={6}
                                            value={otp}
                                            onChange={(value) => setOtp(value)}
                                        />
                                    </div>
                                </div>

                                {error && <p className="text-red-600 text-sm font-medium text-center">{error}</p>}

                                <Button
                                    type="submit"
                                    className="w-full h-14 rounded-2xl bg-primary hover:bg-opacity-90 text-white font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95"
                                    disabled={loading || otp.length !== 6}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-3">
                                            <Spinner className="w-5 h-5 border-white" />
                                            <span>Verifying...</span>
                                        </div>
                                    ) : 'Verify OTP'}
                                </Button>

                                <button
                                    type="button"
                                    onClick={() => setStep('phone')}
                                    className="w-full text-center text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-600"
                                >
                                    Change phone number
                                </button>
                            </form>
                        )}

                        {step === 'name' && (
                            <form onSubmit={handleSetName} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Business / Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="e.g. Balogun Traders"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-14 rounded-2xl bg-neutral-50 border-none focus:bg-white transition-all shadow-inner font-bold px-5"
                                        required
                                        autoFocus
                                    />
                                </div>

                                {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

                                <Button type="submit" className="w-full h-14 rounded-2xl bg-primary hover:bg-opacity-90 text-white font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95" disabled={loading}>
                                    {loading ? (
                                        <div className="flex items-center gap-3">
                                            <Spinner className="w-5 h-5 border-white" />
                                            <span>Saving...</span>
                                        </div>
                                    ) : 'Continue'}
                                </Button>
                            </form>
                        )}

                        {step === 'pin' && (
                            <form onSubmit={handleSetPin} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="pin" className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Create 4-Digit PIN</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                        <Input
                                            id="pin"
                                            type="password"
                                            placeholder="••••"
                                            value={pin}
                                            onChange={(e) => setPin(e.target.value)}
                                            maxLength={4}
                                            className="pl-12 h-14 rounded-2xl bg-neutral-50 border-none focus:bg-white transition-all shadow-inner"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

                                <Button type="submit" className="w-full h-14 rounded-2xl bg-primary hover:bg-opacity-90 text-white font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95" disabled={loading}>
                                    {loading ? (
                                        <div className="flex items-center gap-3">
                                            <Spinner className="w-5 h-5 border-white" />
                                            <span>Completing...</span>
                                        </div>
                                    ) : 'Create Account'}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Side (Branding) */}
            <div className="hidden lg:flex flex-col justify-between bg-primary text-white p-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 opacity-100" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                <div className="relative z-10 flex justify-end">
                    <Link to="/" className="flex items-center gap-2 text-lg font-bold">
                        <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                            <PilcrowSquare className="w-5 h-5 text-white" />
                        </div>
                        Proof Platform
                    </Link>
                </div>

                <div className="relative z-10 max-w-md">
                    <blockquote className="space-y-4">
                        <p className="text-2xl font-black leading-tight tracking-tighter">
                            A permanent record for every kobo. <br />
                            Built for hard-working Nigerians.
                        </p>
                        <p className="text-lg font-medium text-white/80 leading-relaxed">
                            Join thousands of merchants who trust Proof Platform to handle their daily payments securely and eliminate disputes instantly.
                        </p>
                        <footer className="text-sm font-bold uppercase tracking-widest text-white/60">
                            — Secure Verification for Nigeria
                        </footer>
                    </blockquote>
                </div>
            </div>
        </div>
    );
}
