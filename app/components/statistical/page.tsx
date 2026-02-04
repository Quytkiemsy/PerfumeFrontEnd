'use client'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    ArrowDownRight,
    ArrowUpRight,
    Calendar,
    CreditCard,
    DollarSign,
    Download,
    Package,
    RefreshCw,
    Search,
    ShoppingBag,
    ShoppingCart,
    Sparkles,
    TrendingUp,
    Users
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { formatDate, formatDateTime } from '@/app/util/dateUtils';

interface IStatisticalProps {
    orders: IOrder[];
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-3 shadow-lg">
                <p className="text-sm font-medium text-gray-900">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: {entry.value.toFixed(2)} M VND
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const OrderDashboard: React.FC<IStatisticalProps> = ({ orders }) => {
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
    const [timeRange, setTimeRange] = useState<string>('30d');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Filter orders based on selected filters
    const filteredOrders = useMemo(() => {
        let filtered = orders;

        if (selectedStatus !== 'all') {
            filtered = filtered.filter(order => order.status === selectedStatus);
        }

        // Time range filter
        if (timeRange !== 'all') {
            const now = new Date();
            const days = parseInt(timeRange.replace('d', ''));
            const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
            filtered = filtered.filter(order => new Date(order.createdAt) >= cutoffDate);
        }

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(order =>
                order.id.toString().includes(query) ||
                order.shippingInfo?.fullName?.toLowerCase().includes(query) ||
                order.shippingInfo?.email?.toLowerCase().includes(query) ||
                order.user?.username?.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [orders, selectedStatus, timeRange, searchQuery]);

    // Calculate statistics with comparison
    const stats = useMemo(() => {
        const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        const totalOrders = filteredOrders.length;
        const completedOrders = filteredOrders.filter(order => order.status === 'SHIPPING').length;
        const paidOrders = filteredOrders.filter(order => order.status === 'PAID').length;
        const pendingOrders = filteredOrders.filter(order => order.status === 'PENDING').length;
        const cancelledOrders = filteredOrders.filter(order => order.status === 'CANCELLED').length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const totalItems = filteredOrders.reduce((sum, order) => sum + order.items.length, 0);

        // Calculate unique customers
        const uniqueCustomers = new Set(filteredOrders.map(order => order.user._id)).size;

        return {
            totalRevenue,
            totalOrders,
            completedOrders,
            paidOrders,
            pendingOrders,
            cancelledOrders,
            averageOrderValue,
            totalItems,
            uniqueCustomers,
            completionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
            // Mock growth rates - in real app, compare with previous period
            revenueGrowth: 12.5,
            ordersGrowth: 8.3,
            avgValueGrowth: -2.1,
            customersGrowth: 15.7
        };
    }, [filteredOrders]);

    // Revenue by date for area chart
    const revenueByDate = useMemo(() => {
        const dateMap = new Map();
        const orderCountMap = new Map();

        filteredOrders.forEach(order => {
            const date = new Date(order.createdAt).toISOString().split('T')[0];
            dateMap.set(date, (dateMap.get(date) || 0) + order.totalPrice);
            orderCountMap.set(date, (orderCountMap.get(date) || 0) + 1);
        });

        return Array.from(dateMap.entries())
            .map(([date, revenue]) => ({
                date: formatDate(date),
                fullDate: date,
                revenue: (revenue as number) / 1000000,
                orders: orderCountMap.get(date) || 0
            }))
            .sort((a, b) => a.fullDate.localeCompare(b.fullDate));
    }, [filteredOrders]);

    // Status distribution
    const statusData = useMemo(() => {
        const statusConfig: Record<string, { color: string; label: string }> = {
            'PENDING': { color: '#F59E0B', label: 'Chờ xử lý' },
            'PAID': { color: '#3B82F6', label: 'Đã thanh toán' },
            'SHIPPING': { color: '#10B981', label: 'Đang giao' },
            'CANCELLED': { color: '#EF4444', label: 'Đã hủy' }
        };

        const statusCount = filteredOrders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(statusCount).map(([status, count]) => ({
            status,
            label: statusConfig[status]?.label || status,
            count,
            color: statusConfig[status]?.color || '#6B7280'
        }));
    }, [filteredOrders]);

    // Top brands data
    const brandData = useMemo(() => {
        const brandStats = new Map();

        filteredOrders.forEach(order => {
            order.items.forEach(item => {
                const brandName = item.perfumeVariants?.product?.brand?.name || 'Khác';
                const current = brandStats.get(brandName) || { revenue: 0, quantity: 0 };
                brandStats.set(brandName, {
                    revenue: current.revenue + item.totalPrice,
                    quantity: current.quantity + item.quantity
                });
            });
        });

        return Array.from(brandStats.entries())
            .map(([brand, data]) => ({
                brand,
                revenue: (data as any).revenue / 1000000,
                quantity: (data as any).quantity
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 6);
    }, [filteredOrders]);

    // Top products
    const topProducts = useMemo(() => {
        const productStats = new Map();

        filteredOrders.forEach(order => {
            order.items.forEach(item => {
                const productName = item.perfumeVariants?.product?.name || 'Unknown';
                const productId = item.perfumeVariants?.product?.id || item.id;
                const current = productStats.get(productId) || { name: productName, revenue: 0, quantity: 0 };
                productStats.set(productId, {
                    name: productName,
                    revenue: current.revenue + item.totalPrice,
                    quantity: current.quantity + item.quantity
                });
            });
        });

        return Array.from(productStats.values())
            .sort((a: any, b: any) => b.revenue - a.revenue)
            .slice(0, 5);
    }, [filteredOrders]);

    // Payment method distribution
    const paymentData = useMemo(() => {
        const paymentCount = filteredOrders.reduce((acc, order) => {
            const method = order.paymentMethod || 'OTHER';
            acc[method] = (acc[method] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const paymentLabels: Record<string, string> = {
            'BANK_TRANSFER': 'Chuyển khoản',
            'COD': 'COD',
            'CREDIT_CARD': 'Thẻ tín dụng',
            'MOMO': 'MoMo',
            'VNPAY': 'VNPay',
            'OTHER': 'Khác'
        };

        return Object.entries(paymentCount).map(([method, count]) => ({
            method,
            label: paymentLabels[method] || method,
            count,
            percentage: filteredOrders.length > 0 ? ((count / filteredOrders.length) * 100).toFixed(1) : 0
        }));
    }, [filteredOrders]);

    const getStatusBadge = (status: OrderStatus) => {
        const config: Record<OrderStatus, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
            'PENDING': { variant: 'secondary', className: 'bg-amber-500 hover:bg-amber-600 text-white' },
            'PAID': { variant: 'outline', className: 'border-blue-500 text-blue-600 bg-blue-50' },
            'PROCESSING': { variant: 'default', className: 'bg-indigo-500 hover:bg-indigo-600' },
            'SHIPPING': { variant: 'default', className: 'bg-emerald-500 hover:bg-emerald-600' },
            'DELIVERED': { variant: 'default', className: 'bg-green-600 hover:bg-green-700' },
            'CANCELLED': { variant: 'destructive', className: 'bg-red-500 hover:bg-red-600' },
            'REFUNDED': { variant: 'outline', className: 'border-purple-500 text-purple-600 bg-purple-50' }
        };
        return config[status] || { variant: 'secondary' as const, className: '' };
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(value);
    };

    const formatShortCurrency = (value: number) => {
        if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
        return value.toString();
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const CHART_COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F97316', '#EAB308'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
                                <Sparkles className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-violet-900 bg-clip-text text-transparent">
                                Bảng Điều Khiển
                            </h1>
                        </div>
                        <p className="text-gray-500">
                            Tổng quan về đơn hàng và doanh số của cửa hàng nước hoa
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            className="gap-2"
                        >
                            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Làm mới
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            Xuất báo cáo
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="relative flex-1 min-w-[200px] max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Tìm kiếm đơn hàng, khách hàng..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                />
                            </div>

                            <Select value={selectedStatus} onValueChange={value => setSelectedStatus(value as OrderStatus | 'all')}>
                                <SelectTrigger className="w-[160px] bg-gray-50 border-gray-200">
                                    <Package className="mr-2 h-4 w-4 text-gray-500" />
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                    <SelectItem value="PENDING">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                                            Chờ xử lý
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="PAID">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                                            Đã thanh toán
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="SHIPPING">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                            Đang giao
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="CANCELLED">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-red-500" />
                                            Đã hủy
                                        </span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={timeRange} onValueChange={setTimeRange}>
                                <SelectTrigger className="w-[160px] bg-gray-50 border-gray-200">
                                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                                    <SelectValue placeholder="Thời gian" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7d">7 ngày qua</SelectItem>
                                    <SelectItem value="30d">30 ngày qua</SelectItem>
                                    <SelectItem value="90d">90 ngày qua</SelectItem>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="ml-auto text-sm text-gray-500">
                                Hiển thị <span className="font-semibold text-gray-900">{filteredOrders.length}</span> đơn hàng
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Revenue Card */}
                    <Card className="border-0 shadow-lg shadow-emerald-100/50 bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-100">Tổng Doanh Thu</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {formatShortCurrency(stats.totalRevenue)} VND
                            </div>
                            <div className="flex items-center gap-1 mt-2 text-emerald-100">
                                {stats.revenueGrowth >= 0 ? (
                                    <ArrowUpRight className="h-4 w-4" />
                                ) : (
                                    <ArrowDownRight className="h-4 w-4" />
                                )}
                                <span className="text-sm font-medium">
                                    {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth}% so với tháng trước
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Orders Card */}
                    <Card className="border-0 shadow-lg shadow-blue-100/50 bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-100">Tổng Đơn Hàng</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg">
                                <ShoppingCart className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.totalOrders}</div>
                            <div className="flex items-center gap-1 mt-2 text-blue-100">
                                {stats.ordersGrowth >= 0 ? (
                                    <ArrowUpRight className="h-4 w-4" />
                                ) : (
                                    <ArrowDownRight className="h-4 w-4" />
                                )}
                                <span className="text-sm font-medium">
                                    {stats.ordersGrowth >= 0 ? '+' : ''}{stats.ordersGrowth}% so với tháng trước
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Average Order Value */}
                    <Card className="border-0 shadow-lg shadow-purple-100/50 bg-gradient-to-br from-purple-500 to-violet-600 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-100">Giá Trị TB/Đơn</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {formatShortCurrency(stats.averageOrderValue)} VND
                            </div>
                            <div className="flex items-center gap-1 mt-2 text-purple-100">
                                {stats.avgValueGrowth >= 0 ? (
                                    <ArrowUpRight className="h-4 w-4" />
                                ) : (
                                    <ArrowDownRight className="h-4 w-4" />
                                )}
                                <span className="text-sm font-medium">
                                    {stats.avgValueGrowth >= 0 ? '+' : ''}{stats.avgValueGrowth}% so với tháng trước
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customers Card */}
                    <Card className="border-0 shadow-lg shadow-orange-100/50 bg-gradient-to-br from-orange-500 to-rose-500 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-orange-100">Khách Hàng</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Users className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.uniqueCustomers}</div>
                            <div className="flex items-center gap-1 mt-2 text-orange-100">
                                {stats.customersGrowth >= 0 ? (
                                    <ArrowUpRight className="h-4 w-4" />
                                ) : (
                                    <ArrowDownRight className="h-4 w-4" />
                                )}
                                <span className="text-sm font-medium">
                                    {stats.customersGrowth >= 0 ? '+' : ''}{stats.customersGrowth}% so với tháng trước
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <Package className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                                <p className="text-xs text-gray-500">Đang chờ</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <CreditCard className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.paidOrders}</p>
                                <p className="text-xs text-gray-500">Đã thanh toán</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
                                <p className="text-xs text-gray-500">Đang giao</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-rose-100 rounded-lg">
                                <Package className="h-5 w-5 text-rose-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.cancelledOrders}</p>
                                <p className="text-xs text-gray-500">Đã hủy</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row 1 */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Revenue Chart */}
                    <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-semibold">Doanh Thu Theo Thời Gian</CardTitle>
                                    <CardDescription>Xu hướng doanh thu và số đơn hàng</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={320}>
                                <AreaChart data={revenueByDate}>
                                    <defs>
                                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 12, fill: '#6B7280' }}
                                        tickLine={false}
                                        axisLine={{ stroke: '#E5E7EB' }}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: '#6B7280' }}
                                        tickLine={false}
                                        axisLine={{ stroke: '#E5E7EB' }}
                                        tickFormatter={(value) => `${value}M`}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        name="Doanh thu (M VND)"
                                        stroke="#6366F1"
                                        strokeWidth={2}
                                        fill="url(#revenueGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Status Distribution */}
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Phân Bố Trạng Thái</CardTitle>
                            <CardDescription>Tỷ lệ các trạng thái đơn hàng</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="count"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number, name: string, props: any) => [
                                            `${value} đơn`,
                                            props.payload.label
                                        ]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                {statusData.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-sm text-gray-600">{item.label}</span>
                                        <span className="text-sm font-semibold ml-auto">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row 2 */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Brand Revenue */}
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Doanh Thu Theo Thương Hiệu</CardTitle>
                            <CardDescription>Top 6 thương hiệu bán chạy nhất</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={brandData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={true} vertical={false} />
                                    <XAxis
                                        type="number"
                                        tick={{ fontSize: 12, fill: '#6B7280' }}
                                        tickFormatter={(value) => `${value}M`}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="brand"
                                        tick={{ fontSize: 12, fill: '#6B7280' }}
                                        width={100}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => [`${value.toFixed(2)} M VND`, 'Doanh thu']}
                                        contentStyle={{
                                            backgroundColor: 'rgba(255,255,255,0.95)',
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                                        {brandData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Top Products & Payment Methods */}
                    <div className="space-y-6">
                        {/* Top Products */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold">Sản Phẩm Bán Chạy</CardTitle>
                                <CardDescription>Top 5 sản phẩm theo doanh thu</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {topProducts.map((product: any, index: number) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm
                                            ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                                                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                                                    index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' :
                                                        'bg-gray-200 text-gray-600'}`}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                            <p className="text-xs text-gray-500">{product.quantity} sản phẩm</p>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {formatShortCurrency(product.revenue)}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Payment Methods */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold">Phương Thức Thanh Toán</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {paymentData.map((payment, index) => (
                                    <div key={index} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">{payment.label}</span>
                                            <span className="font-medium">{payment.count} đơn ({payment.percentage}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${payment.percentage}%`,
                                                    backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Orders Table */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <CardTitle className="text-lg font-semibold">Đơn Hàng Gần Đây</CardTitle>
                                <CardDescription>Danh sách đơn hàng mới nhất từ khách hàng</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-xl border border-gray-200 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/80">
                                        <TableHead className="font-semibold">Mã Đơn</TableHead>
                                        <TableHead className="font-semibold">Khách Hàng</TableHead>
                                        <TableHead className="font-semibold">Sản Phẩm</TableHead>
                                        <TableHead className="font-semibold text-right">Tổng Tiền</TableHead>
                                        <TableHead className="font-semibold">Trạng Thái</TableHead>
                                        <TableHead className="font-semibold">Thanh Toán</TableHead>
                                        <TableHead className="font-semibold">Ngày Tạo</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-12">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="p-4 bg-gray-100 rounded-full">
                                                        <Package className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                    <p className="text-gray-500">Không tìm thấy đơn hàng nào</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredOrders.slice(0, 10).map((order) => (
                                            <TableRow key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                                <TableCell>
                                                    <span className="font-mono font-medium text-violet-600">#{order.id}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-0.5">
                                                        <div className="font-medium text-gray-900">{order?.shippingInfo?.fullName || '—'}</div>
                                                        <div className="text-xs text-gray-500">{order?.shippingInfo?.email || order?.user?.username}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1 max-w-[200px]">
                                                        {order.items.slice(0, 2).map((item) => (
                                                            <div key={item.id} className="text-sm text-gray-700 truncate">
                                                                {item.perfumeVariants?.product?.name}
                                                                <span className="text-gray-400 ml-1">×{item.quantity}</span>
                                                            </div>
                                                        ))}
                                                        {order.items.length > 2 && (
                                                            <span className="text-xs text-violet-600 font-medium">
                                                                +{order.items.length - 2} sản phẩm khác
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span className="font-semibold text-gray-900">
                                                        {formatCurrency(order.totalPrice)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={getStatusBadge(order.status).variant}
                                                        className={`${getStatusBadge(order.status).className} font-medium`}
                                                    >
                                                        {order.status === 'PENDING' && 'Chờ xử lý'}
                                                        {order.status === 'PAID' && 'Đã thanh toán'}
                                                        {order.status === 'SHIPPING' && 'Đang giao'}
                                                        {order.status === 'CANCELLED' && 'Đã hủy'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-gray-600">
                                                        {order.paymentMethod === 'BANK' && 'Chuyển khoản'}
                                                        {order.paymentMethod === 'COD' && 'COD'}
                                                        {order.paymentMethod === 'CREDIT_CARD' && 'Thẻ tín dụng'}
                                                        {order.paymentMethod === 'MOMO' && 'MoMo'}
                                                        {order.paymentMethod === 'VNPAY' && 'VNPay'}
                                                        {!['BANK', 'COD', 'CREDIT_CARD', 'MOMO', 'VNPAY'].includes(order.paymentMethod) && order.paymentMethod}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-gray-600">
                                                        {formatDateTime(order.createdAt)}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {filteredOrders.length > 10 && (
                            <div className="flex justify-center mt-4">
                                <Button variant="outline" className="gap-2">
                                    Xem tất cả {filteredOrders.length} đơn hàng
                                    <ArrowUpRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OrderDashboard;