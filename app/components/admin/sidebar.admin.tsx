'use client';
import {
    BarChart3,
    Package,
    Settings,
    Users,
    X,
    ShoppingCart,
    MessageSquare,
    Menu,
    LogOut,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from 'next-auth/react';
import { useSidebar } from './SidebarProvider';

interface NavItem {
    key: string;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    url?: string;
    badge?: number;
}

const navItems: NavItem[] = [
    { key: 'stats', label: 'Thống kê', icon: BarChart3, url: '/admin/dashboard' },
    { key: 'orders', label: 'Đơn hàng', icon: ShoppingCart, url: '/admin/orders' },
    { key: 'products', label: 'Sản phẩm', icon: Package, url: '/admin/product' },
    { key: 'users', label: 'Người dùng', icon: Users, url: '/admin/users' },
    { key: 'brands', label: 'Thương hiệu', icon: MessageSquare, url: '/admin/brands' },
    { key: 'settings', label: 'Cài đặt', icon: Settings, url: '/admin/settings' },
];

const SidebarAdmin = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { isCollapsed, setIsCollapsed } = useSidebar();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();

    const getSelectedKey = () => {
        if (pathname?.includes('/admin/orders')) return 'orders';
        if (pathname?.includes('/admin/product')) return 'products';
        if (pathname?.includes('/admin/users')) return 'users';
        if (pathname?.includes('/admin/brands')) return 'brands';
        if (pathname?.includes('/admin/settings')) return 'settings';
        return 'stats';
    };

    const selected = getSelectedKey();

    const handleClick = (url: string) => {
        router.push(url);
        setSidebarOpen(false);
    };

    const handleLogout = () => {
        signOut({ callbackUrl: '/' });
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-40 p-3 rounded-2xl bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100"
            >
                <Menu size={22} className="text-gray-700" />
            </button>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-all duration-500"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside 
                style={{ width: isCollapsed ? '88px' : '280px' }}
                className={`
                    fixed inset-y-0 left-0 z-50 
                    bg-white
                    shadow-2xl shadow-black/10 
                    transition-[width] duration-300 ease-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    lg:translate-x-0
                `}>
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-violet-300/30 to-fuchsia-200/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-1/3 -left-32 w-64 h-64 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute -bottom-32 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-indigo-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.06]" style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.04) 1px, transparent 1px)`,
                        backgroundSize: '32px 32px'
                    }} />
                </div>

                <div className="relative h-full flex flex-col">
                    {/* Header */}
                    <div className="p-5 border-b border-white/5">
                        <div className="flex items-center justify-between">
                            {!isCollapsed ? (
                                <div className="flex items-center gap-4">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                                        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-xl">
                                            <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-gray-900">
                                            Perfume
                                        </h1>
                                        <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                                            Admin Panel
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full flex justify-center">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                                        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-xl">
                                            <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-300 active:scale-95"
                            >
                                <X size={20} className="text-gray-700" />
                            </button>
                        </div>
                    </div>

                    {/* Collapse Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex absolute -right-3 top-24 w-7 h-7 rounded-full bg-white border border-gray-300 items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-lg group"
                    >
                        <ChevronRight 
                            size={14} 
                            className={`text-gray-700 group-hover:text-gray-900 transition-all duration-500 ${isCollapsed ? '' : 'rotate-180'}`} 
                        />
                    </button>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        {navItems.map((item, index) => {
                            const Icon = item.icon;
                            const isActive = selected === item.key;
                            const isHovered = hoveredItem === item.key;
                            
                            return (
                                <button
                                    key={item.key}
                                    onClick={() => handleClick(item.url || '/admin/dashboard')}
                                    onMouseEnter={() => setHoveredItem(item.key)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                    className={`
                                        group w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl
                                        transition-all duration-300 ease-out relative overflow-hidden
                                        ${isActive 
                                            ? 'bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50' 
                                            : 'hover:bg-gray-50'
                                        }
                                        ${isCollapsed ? 'justify-center px-3' : ''}
                                    `}
                                >
                                    {/* Active/Hover Background Effect */}
                                    {(isActive || isHovered) && (
                                        <div className={`
                                            absolute inset-0 rounded-2xl transition-opacity duration-300
                                            ${isActive ? 'opacity-100' : 'opacity-50'}
                                        `}>
                                            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent rounded-2xl" />
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-400 via-purple-500 to-fuchsia-500 rounded-full" />
                                        </div>
                                    )}

                                    {/* Icon */}
                                    <div className={`
                                        relative flex items-center justify-center w-10 h-10 rounded-xl
                                        transition-all duration-300
                                        ${isActive 
                                            ? 'bg-gradient-to-br from-violet-100 to-purple-100' 
                                            : 'group-hover:bg-gray-100'
                                        }
                                    `}>
                                        <Icon className={`
                                            w-5 h-5 transition-all duration-300
                                            ${isActive 
                                                ? 'text-violet-600' 
                                                : 'text-gray-600 group-hover:text-gray-800'
                                            }
                                        `} />
                                        {isActive && (
                                            <div className="absolute inset-0 bg-violet-200/30 rounded-xl blur-xl" />
                                        )}
                                    </div>
                                    
                                    {/* Label */}
                                    {!isCollapsed && (
                                        <span className={`
                                            relative font-medium text-[15px] tracking-wide
                                            transition-all duration-300
                                            ${isActive 
                                                ? 'text-gray-900' 
                                                : 'text-gray-700 group-hover:text-gray-800'
                                            }
                                        `}>
                                            {item.label}
                                        </span>
                                    )}

                                    {/* Active Indicator */}
                                    {!isCollapsed && isActive && (
                                        <div className="ml-auto flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 shadow-lg shadow-violet-500/50 animate-pulse" />
                                        </div>
                                    )}

                                    {/* Tooltip for collapsed state */}
                                    {isCollapsed && (
                                        <div className="absolute left-full ml-3 px-3 py-2 bg-gray-800 text-white text-sm font-medium rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50 border border-gray-700/50">
                                            {item.label}
                                            <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45 border-l border-b border-gray-700/50" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-gray-200">
                        {!isCollapsed ? (
                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 group">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl blur opacity-50" />
                                    <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">
                                        <span className="text-white font-bold text-sm">
                                            {session?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                                        </span>
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-gray-900" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {session?.user?.name || 'Admin'}
                                    </p>
                                    <p className="text-xs text-gray-600 truncate">
                                        {session?.user?.email || 'admin@example.com'}
                                    </p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2.5 rounded-xl text-gray-700 hover:text-red-600 hover:bg-red-100 transition-all duration-300 opacity-0 group-hover:opacity-100"
                                    title="Đăng xuất"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl blur opacity-50" />
                                    <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">
                                        <span className="text-white font-bold text-sm">
                                            {session?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                                        </span>
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-gray-900" />
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2.5 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                                    title="Đăng xuất"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}

export default SidebarAdmin;