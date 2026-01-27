'use client';
import {
    BarChart3,
    Package,
    Settings,
    Users,
    X,
    ShoppingCart,
    MessageSquare
} from 'lucide-react';
import { useState } from 'react';
import { useRouter, usePathname } from "next/navigation";

interface NavItem {
    key: string;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    url? : string;
}

const navItems: NavItem[] = [
    { key: 'stats', label: 'Thống kê', icon: BarChart3, url: '/admin/dashboard' },
    { key: 'orders', label: 'Đơn hàng', icon: ShoppingCart, url: '/admin/orders' },
    { key: 'products', label: 'Sản phẩm', icon: Package, url: '/admin/product' },
    { key: 'users', label: 'Người dùng', icon: Users, url: '/admin/users' },
    { key: 'brands', label: 'Thương hiệu', icon: MessageSquare, url: '/admin/brands' },
    { key: 'settings', label: 'Cài đặt', icon: Settings, url: '/admin/settings' },
];

// shadcn/ui components
import { Button } from '@/components/ui/button';
const SidebarAdmin = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

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
  };
    return (
        /*  Sidebar  */
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Perfume Admin</h1>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setSidebarOpen(false)}}
                        className="lg:hidden"
                    >
                        <X size={20} />
                    </Button>
                </div>

                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = selected === item.key;
                        return (
                            <Button
                                key={item.key}
                                variant={isActive ? 'secondary' : 'ghost'}
                                className={`w-full justify-start ${isActive ? 'shadow-sm' : ''}`}
                                onClick={() => { handleClick(item.url || '/admin/dashboard'); }}
                                aria-pressed={isActive}
                            >
                                <Icon className="mr-2 h-4 w-4" />
                                {item.label}
                            </Button>
                        );
                    })}
                </nav>
            </div>
        </div >
    );
}
export default SidebarAdmin;