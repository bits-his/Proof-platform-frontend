import * as React from "react"
import { useState, useEffect } from "react"
import {
    LayoutDashboard,
    QrCode,
    Receipt,
    Package2,
    BookOpen,
    LifeBuoy,
    Send,
    Settings2,
    PilcrowSquare,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { NavMain } from "@/components/dashboard/NavMain"
import { NavProjects } from "@/components/dashboard/NavProjects"
import { NavUser } from "@/components/dashboard/NavUser"
import { TeamSwitcher } from "@/components/dashboard/TeamSwitcher"
import { authAPI } from "@/api/client";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from '@/context/AuthContext';

const data = {
    teams: [
        {
            name: "Proof Platform",
            logo: PilcrowSquare,
            plan: "Enterprise",
        },
    ],
    navMain: [
        {
            title: "Dashboard",
            url: "/home",
            icon: LayoutDashboard,
            isActive: true,
        },
        {
            title: "Payments",
            url: "#",
            icon: QrCode,
            items: [
                {
                    title: "Show QR Code",
                    url: "/qr-payment",
                },
                // {
                //     title: "Manual Entry",
                //     url: "/qr-payment",
                // },
            ],
        },
        {
            title: "Verification",
            url: "#",
            icon: Receipt,
            items: [
                {
                    title: "Search Receipt",
                    url: "/receipt-search",
                },
                {
                    title: "Public Verification",
                    url: "/receipt-search1",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "Profile",
                    url: "/profile",
                },
                {
                    title: "System Settings",
                    url: "/settings",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Documentation",
            url: "#",
            icon: BookOpen,
        },
        {
            name: "Support",
            url: "#",
            icon: LifeBuoy,
        },
        {
            name: "Feedback",
            url: "#",
            icon: Send,
        },
    ],
}

export function DashboardSidebar({ ...props }) {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await authAPI.getProfile();
                setProfile(response.data.profile);
            } catch (err) {
                console.error('Sidebar: Failed to fetch profile:', err);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const teams = [
        {
            name: profile?.name || user?.name || "Proof Platform",
            logo: PilcrowSquare,
            plan: profile?.verification_level || "Enterprise",
        },
    ];

    const userData = {
        name: profile?.name || user?.name || "Merchant",
        email: profile?.phone || user?.phone || "",
        avatar: "",
    };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                {/* <NavProjects projects={data.projects} /> */}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={userData} onLogout={handleLogout} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
