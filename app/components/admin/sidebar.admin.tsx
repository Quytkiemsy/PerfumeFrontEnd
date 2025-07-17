'use client';
import {
    BarChart3,
    Package,
    Settings,
    Users,
    X
} from 'lucide-react';
import { useState } from 'react';

// shadcn/ui components
import { Button } from '@/components/ui/button';
const SidebarAdmin = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        /*  Sidebar  */
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Perfume Admin</h1>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden"
                    >
                        <X size={20} />
                    </Button>
                </div>

                <nav className="space-y-2">
                    <Button variant="secondary" className="w-full justify-start">
                        <Package className="mr-2 h-4 w-4" />
                        Sản phẩm
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                        <Users className="mr-2 h-4 w-4" />
                        Thương hiệu
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Thống kê
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                        <Settings className="mr-2 h-4 w-4" />
                        Cài đặt
                    </Button>
                </nav>
            </div>
        </div >
    );
}
export default SidebarAdmin;