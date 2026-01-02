import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Label } from '../components/ui/Input';
import { Switch } from '../components/ui/Switch';
import { Bell, Globe, Moon, Sun, Smartphone, ShieldCheck, Languages } from 'lucide-react';

export default function Settings() {
    const [notifications, setNotifications] = useState({
        whatsapp: true,
        sms: false,
        email: true,
        push: true
    });

    const [language, setLanguage] = useState('English');
    const [theme, setTheme] = useState('Light');

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'Light' ? 'Dark' : 'Light');
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto px-1 sm:px-0">
            <div className="space-y-1">
                <h1 className="text-3xl font-black tracking-tighter text-neutral-900">System Settings</h1>
                <p className="text-neutral-500 font-medium">Configure your account preferences and application behavior.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Main Content (Large Column) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Notifications */}
                    <Card className="border-none shadow-xl shadow-neutral-200/50 rounded-3xl overflow-hidden">
                        <CardHeader className="py-6 px-8 border-b border-neutral-100">
                            <CardTitle className="text-lg font-black flex items-center gap-3 text-neutral-900 tracking-tight">
                                <Bell className="w-6 h-6 text-primary" />
                                Notifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-neutral-50 rounded-2xl gap-4 transition-all hover:bg-white hover:shadow-lg hover:shadow-neutral-200/50 group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-primary/10 rounded-2xl transition-transform group-hover:scale-110">
                                        <Smartphone className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-neutral-900 uppercase tracking-tight">WhatsApp Receipts</p>
                                        <p className="text-xs font-medium text-neutral-500">Send copies of receipts directly via WhatsApp.</p>
                                    </div>
                                </div>
                                <Button
                                    variant={notifications.whatsapp ? "primary" : "outline"}
                                    className={`w-full sm:w-auto h-12 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${notifications.whatsapp ? 'bg-primary shadow-lg shadow-primary/20' : 'text-neutral-400 border-neutral-200'}`}
                                    onClick={() => toggleNotification('whatsapp')}
                                >
                                    {notifications.whatsapp ? "Enabled" : "Disabled"}
                                </Button>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-neutral-50 rounded-2xl gap-4 transition-all hover:bg-white hover:shadow-lg hover:shadow-neutral-200/50 group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 rounded-2xl transition-transform group-hover:scale-110">
                                        <Bell className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-neutral-900 uppercase tracking-tight">Push Notifications</p>
                                        <p className="text-xs font-medium text-neutral-500">Alerts for incoming payments in real-time.</p>
                                    </div>
                                </div>
                                <Button
                                    variant={notifications.push ? "primary" : "outline"}
                                    className={`w-full sm:w-auto h-12 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${notifications.push ? 'bg-primary shadow-lg shadow-primary/20' : 'text-neutral-400 border-neutral-200'}`}
                                    onClick={() => toggleNotification('push')}
                                >
                                    {notifications.push ? "Enabled" : "Disabled"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security */}
                    <Card className="border-none shadow-xl shadow-neutral-200/50 rounded-3xl overflow-hidden">
                        <CardHeader className="py-6 px-8 border-b border-neutral-100">
                            <CardTitle className="text-lg font-black flex items-center gap-3 text-neutral-900 tracking-tight">
                                <ShieldCheck className="w-6 h-6 text-primary" />
                                Security & Privacy
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 border border-neutral-100 rounded-3xl group transition-all hover:border-primary/20">
                                <div>
                                    <h4 className="text-sm font-black text-neutral-900 uppercase tracking-tight">Update security PIN</h4>
                                    <p className="text-xs font-medium text-neutral-500 mt-1">Keep your account secure by rotating your PIN regularly.</p>
                                </div>
                                <Button variant="outline" className="h-12 px-8 rounded-xl font-black text-xs uppercase tracking-widest text-primary border-primary/20 hover:bg-primary/5 transition-all">Update PIN</Button>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 border border-neutral-100 rounded-3xl group transition-all hover:border-red-100">
                                <div>
                                    <h4 className="text-sm font-black text-neutral-900 uppercase tracking-tight">Global logout</h4>
                                    <p className="text-xs font-medium text-neutral-500 mt-1">Log out of all other devices currently active on your account.</p>
                                </div>
                                <Button variant="outline" className="h-12 px-8 rounded-xl font-black text-xs uppercase tracking-widest text-red-500 border-red-100 hover:bg-red-50 transition-all">Logout All</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar (Small Column) */}
                <div className="space-y-8">
                    {/* Appearance */}
                    <Card className="border-none shadow-xl shadow-neutral-200/50 rounded-3xl overflow-hidden bg-neutral-50">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-black flex items-center gap-3 text-neutral-900 tracking-tight">
                                <Sun className="w-6 h-6 text-amber-500" />
                                Appearance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pb-8">
                            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Select your theme</p>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm border border-neutral-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-50 rounded-xl">
                                        <Sun className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <span className="text-sm font-bold text-neutral-900">{theme} Mode</span>
                                </div>
                                <Switch
                                    checked={theme === 'Dark'}
                                    onCheckedChange={toggleTheme}
                                    disabled // Dark mode not yet fully implemented
                                    className="data-[state=checked]:bg-primary"
                                />
                            </div>
                            <p className="text-[10px] text-neutral-400 text-center font-black uppercase tracking-widest opacity-50">Dark mode coming soon</p>
                        </CardContent>
                    </Card>

                    {/* Language */}
                    <Card className="border-none shadow-xl shadow-neutral-200/50 rounded-3xl overflow-hidden bg-neutral-50">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-black flex items-center gap-3 text-neutral-900 tracking-tight">
                                <Languages className="w-6 h-6 text-primary" />
                                Language
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pb-8">
                            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Select language</p>
                            <div className="grid grid-cols-2 gap-3">
                                {['English', 'Pidgin', 'Yoruba', 'Igbo', 'Hausa'].map((lang) => (
                                    <Button
                                        key={lang}
                                        variant={language === lang ? "primary" : "outline"}
                                        className={`h-11 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${language === lang ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-white border-neutral-100 text-neutral-400 overflow-hidden text-ellipsis'}`}
                                        onClick={() => setLanguage(lang)}
                                    >
                                        {lang}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-start gap-4 mt-12 pt-8 border-t border-neutral-100">
                <Button variant="outline" className="h-14 px-10 rounded-2xl font-black text-xs uppercase tracking-widest text-neutral-400 border-neutral-200 hover:text-neutral-600">Discard Changes</Button>
                <Button variant="primary" className="h-14 px-10 rounded-2xl font-black text-xs uppercase tracking-widest bg-primary shadow-xl shadow-primary/20 transition-all active:scale-95">Save Preferences</Button>
            </div>
        </div>
    );
}