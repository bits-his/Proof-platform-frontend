import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/client';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { Smartphone, Lock, PilcrowSquare } from 'lucide-react';
import { Spinner } from '../components/ui/spinner';
import { toast } from 'sonner';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(phone, pin);
      login(response.data.token, response.data.merchant);
      toast.success('Welcome back, ' + response.data.merchant.name);
      navigate('/home');
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please check your credentials.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2">
      {/* Left Side (Visual) */}
      <div className="hidden lg:flex flex-col justify-between bg-primary text-white p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 opacity-100" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

        <div className="relative z-10">
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
              Verify payments instantly. <br />
              End disputes forever.
            </p>
            <p className="text-lg font-medium text-white/80 leading-relaxed">
              Welcome back to Nigeria's most trusted payment proof system. Secure, fast, and immutable.
            </p>
            <footer className="text-sm font-bold uppercase tracking-widest text-white/60">
              — Proof Platform
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side (Form) */}
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
              Welcome back
            </h1>
            <p className="text-neutral-500 font-medium">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
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

            <div className="space-y-2">
              <Label htmlFor="pin" className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">PIN</Label>
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
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-14 rounded-2xl bg-primary hover:bg-opacity-90 text-white font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-3">
                  <Spinner className="w-5 h-5 border-white" />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>

            <div className="text-center pt-4">
              <span className="text-neutral-500 font-medium text-sm">Don't have an account? </span>
              <Link to="/signup" className="text-primary hover:underline font-black text-sm uppercase tracking-wider">
                Create one now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
