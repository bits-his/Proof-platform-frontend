import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl opacity-60 animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-3xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-xl w-full p-8 text-center z-10">
                <div className="relative mb-12">
                    <div className="text-[12rem] sm:text-[16rem] font-black text-neutral-50 select-none leading-none tracking-tighter">
                        404
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-2 tracking-tighter">Oops! Lost in space?</h1>
                        <p className="text-base sm:text-lg font-medium text-neutral-500 max-w-sm mx-auto leading-relaxed">
                            We couldn't find the page you're looking for. It might have been moved or doesn't exist anymore.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/home" className="w-full sm:w-auto">
                        <Button className="w-full h-14 px-8 rounded-2xl bg-primary hover:bg-opacity-90 text-white font-black text-base shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-3">
                            <Home className="w-5 h-5" />
                            Go to Dashboard
                        </Button>
                    </Link>
                    <Button
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-black text-base transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </Button>
                </div>

                <div className="mt-16 pt-10 border-t border-neutral-100">
                    <p className="text-xs font-black text-neutral-400 mb-6 uppercase tracking-widest flex items-center justify-center gap-2">
                        <Search className="w-4 h-4" />
                        Quick Links
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link to="/profile" className="text-xs font-black text-neutral-500 hover:text-primary transition-all bg-neutral-50 hover:bg-primary/5 px-6 py-3 rounded-xl uppercase tracking-widest shadow-sm">
                            Profile
                        </Link>
                        <Link to="/receipt-search" className="text-xs font-black text-neutral-500 hover:text-primary transition-all bg-neutral-50 hover:bg-primary/5 px-6 py-3 rounded-xl uppercase tracking-widest shadow-sm">
                            Search
                        </Link>
                        <Link to="/settings" className="text-xs font-black text-neutral-500 hover:text-primary transition-all bg-neutral-50 hover:bg-primary/5 px-6 py-3 rounded-xl uppercase tracking-widest shadow-sm">
                            Settings
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
