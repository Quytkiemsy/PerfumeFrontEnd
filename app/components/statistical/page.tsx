'use client'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dashboardApi } from '@/app/util/dashboardApi';
import {
    AlertTriangle,
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    CreditCard,
    DollarSign,
    Download,
    Eye,
    Flame,
    Loader2,
    Minus,
    Package,
    RefreshCw,
    ShoppingBag,
    ShoppingCart,
    Sparkles,
    TrendingUp,
    Users
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

interface IStatisticalProps {
    accessToken: string;
    initialData?: DashboardDTO | null;
}

// --- Growth Indicator ---
const GrowthIndicator = ({ value, className = '' }: { value: number; className?: string }) => {
    if (value > 0) {
        return (
            <span className={`inline-flex items-center gap-0.5 text-sm font-medium ${className || 'text-emerald-200'}`}>
                <ArrowUpRight className="h-4 w-4" />+{value.toFixed(1)}%
            </span>
        );
    }
    if (value < 0) {
        return (
            <span className={`inline-flex items-center gap-0.5 text-sm font-medium ${className || 'text-red-300'}`}>
                <ArrowDownRight className="h-4 w-4" />{value.toFixed(1)}%
            </span>
        );
    }
    return (
        <span className={`inline-flex items-center gap-0.5 text-sm font-medium ${className || 'text-gray-300'}`}>
            <Minus className="h-4 w-4" />0%
        </span>
    );
};

const OrderDashboard: React.FC<IStatisticalProps> = ({ accessToken, initialData }) => {
    const [period, setPeriod] = useState<DashboardPeriod>('month');
    const [data, setData] = useState<DashboardDTO | null>(initialData || null);
    const [loading, setLoading] = useState(!initialData);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDashboard = useCallback(async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            const res = await dashboardApi.getFullDashboard(period, accessToken);
            if (res.data) {
                setData(res.data);
            }
        } catch (err) {
            console.error('Failed to fetch dashboard:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [period, accessToken]);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    // --- Helpers ---
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);

    const formatShort = (value: number) => {
        if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
        if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
        if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
        return value.toString();
    };

    const formatChartDate = (label: string) => {
        if (period === 'year') {
            const month = parseInt(label.split('-')[1]);
            return `T${month}`;
        }
        const parts = label.split('-');
        return `${parts[2]}/${parts[1]}`;
    };

    const statusConfig: Record<string, { color: string; label: string; bg: string }> = {
        'PENDING': { color: '#F59E0B', label: 'Chờ xử lý', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
        'PAID': { color: '#3B82F6', label: 'Đã thanh toán', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
        'SHIPPING': { color: '#8B5CF6', label: 'Đang giao', bg: 'bg-violet-50 text-violet-700 border-violet-200' },
        'DELIVERED': { color: '#10B981', label: 'Đã giao', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        'CANCELLED': { color: '#EF4444', label: 'Đã hủy', bg: 'bg-red-50 text-red-700 border-red-200' },
    };

    const paymentLabels: Record<string, string> = {
        'BANK': 'Chuyển khoản',
        'COD': 'COD',
        'CREDIT_CARD': 'Thẻ tín dụng',
        'MOMO': 'MoMo',
        'VNPAY': 'VNPay',
    };

    const CHART_COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F97316', '#10B981', '#EAB308'];

    const periodLabels: Record<DashboardPeriod, string> = {
        week: '7 ngày',
        month: 'Tháng này',
        year: 'Năm nay',
    };

    // --- Loading State ---
    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
                    <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center p-8">
                    <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Không thể tải dữ liệu</h2>
                    <p className="text-gray-500 mb-4">Đã xảy ra lỗi khi tải dashboard</p>
                    <Button onClick={() => fetchDashboard()}>Thử lại</Button>
                </div>
            </div>
        );
    }

    // --- Computed chart data ---
    const revenueChartData = (data.revenueChart || []).map(item => ({
        ...item,
        displayLabel: formatChartDate(item.label),
        revenueM: item.revenue / 1_000_000,
    }));

    const statusDistribution = Object.entries(data.orderStatusDistribution || {}).map(([status, count]) => ({
        status,
        label: statusConfig[status]?.label || status,
        count,
        color: statusConfig[status]?.color || '#6B7280',
    }));
    const totalStatusOrders = statusDistribution.reduce((sum, s) => sum + s.count, 0);

    const brandChartData = (data.revenueByBrand || []).map(item => ({
        ...item,
        revenueM: item.revenue / 1_000_000,
    }));

    const paymentMethodData = Object.entries(data.revenueByPaymentMethod || {});
    const totalPaymentRevenue = paymentMethodData.reduce((sum, [, val]) => sum + val, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
                {/* ===== Header ===== */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-200">
                                <Sparkles className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-violet-900 bg-clip-text text-transparent">
                                    Bảng Điều Khiển
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Tổng quan doanh thu & hoạt động cửa hàng
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Period Selector */}
                        <div className="inline-flex rounded-xl bg-gray-100 p-1 shadow-inner">
                            {(['week', 'month', 'year'] as DashboardPeriod[]).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${period === p
                                        ? 'bg-white text-violet-700 shadow-md'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {periodLabels[p]}
                                </button>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchDashboard(true)}
                            disabled={refreshing}
                            className="gap-2 rounded-xl"
                        >
                            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                            Làm mới
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                            <Download className="h-4 w-4" />
                            Xuất
                        </Button>
                    </div>
                </div>

                {/* ===== Overview Cards ===== */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Revenue */}
                    <Card className="border-0 shadow-lg shadow-emerald-100/50 bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden relative group hover:shadow-xl transition-shadow">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-100">Tổng Doanh Thu</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl md:text-3xl font-bold">{formatShort(data.totalRevenue)} ₫</div>
                            <div className="mt-2">
                                <GrowthIndicator value={data.revenueGrowthPercent} />
                                <span className="text-xs text-emerald-200 ml-1">so với kỳ trước</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Orders */}
                    <Card className="border-0 shadow-lg shadow-blue-100/50 bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden relative group hover:shadow-xl transition-shadow">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-100">Tổng Đơn Hàng</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <ShoppingCart className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl md:text-3xl font-bold">{data.totalOrders.toLocaleString()}</div>
                            <div className="mt-2">
                                <GrowthIndicator value={data.orderGrowthPercent} />
                                <span className="text-xs text-blue-200 ml-1">so với kỳ trước</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Users */}
                    <Card className="border-0 shadow-lg shadow-purple-100/50 bg-gradient-to-br from-purple-500 to-violet-600 text-white overflow-hidden relative group hover:shadow-xl transition-shadow">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-100">Người Dùng</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Users className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl md:text-3xl font-bold">{data.totalUsers.toLocaleString()}</div>
                            <div className="mt-2">
                                <GrowthIndicator value={data.userGrowthPercent} />
                                <span className="text-xs text-purple-200 ml-1">so với kỳ trước</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Products */}
                    <Card className="border-0 shadow-lg shadow-orange-100/50 bg-gradient-to-br from-orange-500 to-rose-500 text-white overflow-hidden relative group hover:shadow-xl transition-shadow">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-orange-100">Sản Phẩm</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Package className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl md:text-3xl font-bold">{data.totalProducts.toLocaleString()}</div>
                            <div className="mt-2">
                                <span className="text-sm text-orange-200">Tổng trong hệ thống</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ===== Order Status Quick Stats ===== */}
                {statusDistribution.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {statusDistribution.map((item) => (
                            <Card key={item.status} className="border-0 shadow-md bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="w-3 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                    <div className="min-w-0">
                                        <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                                        <p className="text-xs text-gray-500 truncate">{item.label}</p>
                                    </div>
                                    {totalStatusOrders > 0 && (
                                        <span className="ml-auto text-xs font-medium text-gray-400 flex-shrink-0">
                                            {((item.count / totalStatusOrders) * 100).toFixed(0)}%
                                        </span>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* ===== Charts Row 1: Revenue + Status Pie ===== */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Revenue Area Chart */}
                    <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-violet-500" />
                                        Doanh Thu Theo Thời Gian
                                    </CardTitle>
                                    <CardDescription>
                                        {period === 'week' ? 'Theo ngày trong 7 ngày qua' :
                                            period === 'month' ? 'Theo ngày trong tháng' :
                                                'Theo tháng trong năm'}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {revenueChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={320}>
                                    <AreaChart data={revenueChartData}>
                                        <defs>
                                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.02} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                        <XAxis
                                            dataKey="displayLabel"
                                            tick={{ fontSize: 12, fill: '#6B7280' }}
                                            tickLine={false}
                                            axisLine={{ stroke: '#E5E7EB' }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12, fill: '#6B7280' }}
                                            tickLine={false}
                                            axisLine={{ stroke: '#E5E7EB' }}
                                            tickFormatter={(v) => `${v}M`}
                                        />
                                        <Tooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const rev = payload[0]?.payload;
                                                    return (
                                                        <div className="bg-white/95 backdrop-blur-sm border rounded-xl p-3 shadow-xl">
                                                            <p className="text-xs text-gray-500 mb-1">{rev?.label}</p>
                                                            <p className="text-sm font-semibold text-violet-600">
                                                                Doanh thu: {formatCurrency(rev?.revenue || 0)}
                                                            </p>
                                                            <p className="text-sm font-medium text-gray-600">
                                                                Đơn hàng: {rev?.orders || 0}
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenueM"
                                            name="Doanh thu (M ₫)"
                                            stroke="#6366F1"
                                            strokeWidth={2.5}
                                            fill="url(#revenueGradient)"
                                            dot={{ r: 3, fill: '#6366F1', strokeWidth: 0 }}
                                            activeDot={{ r: 6, fill: '#6366F1', stroke: '#fff', strokeWidth: 2 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-[320px] text-gray-400">
                                    <div className="text-center">
                                        <BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                        <p>Chưa có dữ liệu</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Status Donut */}
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 text-violet-500" />
                                Phân Bố Đơn Hàng
                            </CardTitle>
                            <CardDescription>Trạng thái đơn hàng hiện tại</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {statusDistribution.length > 0 ? (
                                <>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie
                                                data={statusDistribution}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={55}
                                                outerRadius={85}
                                                paddingAngle={3}
                                                dataKey="count"
                                                strokeWidth={0}
                                            >
                                                {statusDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value: number, _name: string, props: any) => [
                                                    `${value} đơn (${totalStatusOrders > 0 ? ((value / totalStatusOrders) * 100).toFixed(1) : 0}%)`,
                                                    props.payload.label,
                                                ]}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {statusDistribution.map((item) => (
                                            <div key={item.status} className="flex items-center gap-2 text-sm">
                                                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                                <span className="text-gray-600 truncate">{item.label}</span>
                                                <span className="font-semibold ml-auto">{item.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-[280px] text-gray-400">
                                    Chưa có dữ liệu
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* ===== Charts Row 2: Brand Revenue + Top Selling & Payments ===== */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Brand Revenue Horizontal Bar */}
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-violet-500" />
                                Doanh Thu Theo Thương Hiệu
                            </CardTitle>
                            <CardDescription>Thương hiệu có doanh thu cao nhất</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {brandChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={brandChartData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal vertical={false} />
                                        <XAxis
                                            type="number"
                                            tick={{ fontSize: 12, fill: '#6B7280' }}
                                            tickFormatter={(v) => `${v}M`}
                                        />
                                        <YAxis
                                            type="category"
                                            dataKey="brandName"
                                            tick={{ fontSize: 12, fill: '#374151' }}
                                            width={100}
                                        />
                                        <Tooltip
                                            formatter={(value: number) => [`${formatCurrency(value * 1_000_000)}`, 'Doanh thu']}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar dataKey="revenueM" radius={[0, 6, 6, 0]}>
                                            {brandChartData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-[300px] text-gray-400">
                                    Chưa có dữ liệu
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Right column: Top Selling + Payment Methods */}
                    <div className="space-y-6">
                        {/* Top Selling Products */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <Flame className="h-5 w-5 text-orange-500" />
                                    Sản Phẩm Bán Chạy
                                </CardTitle>
                                <CardDescription>Top sản phẩm theo doanh thu</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {data.topSellingProducts && data.topSellingProducts.length > 0 ? (
                                    <div className="space-y-3">
                                        {data.topSellingProducts.slice(0, 5).map((product, index) => (
                                            <div key={product.productId} className="flex items-center gap-3 group">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0
                                                    ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-md shadow-orange-200' :
                                                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                                                            index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' :
                                                                'bg-gray-200 text-gray-600'}`}>
                                                    {index + 1}
                                                </div>
                                                {product.image && (
                                                    <img
                                                        src={product.image}
                                                        alt={product.productName}
                                                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-violet-600 transition-colors">
                                                        {product.productName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">Đã bán: {product.totalSold ?? 0}</p>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                                                    {formatShort(product.totalRevenue || 0)} ₫
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 text-center py-4">Chưa có dữ liệu</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Payment Methods */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-violet-500" />
                                    Phương Thức Thanh Toán
                                </CardTitle>
                                <CardDescription>Doanh thu theo phương thức</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {paymentMethodData.length > 0 ? (
                                    paymentMethodData.map(([method, revenue], index) => {
                                        const pct = totalPaymentRevenue > 0 ? (revenue / totalPaymentRevenue) * 100 : 0;
                                        return (
                                            <div key={method} className="space-y-1.5">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600 font-medium">{paymentLabels[method] || method}</span>
                                                    <span className="font-semibold text-gray-900">
                                                        {formatShort(revenue)} ₫ ({pct.toFixed(1)}%)
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                                    <div
                                                        className="h-2.5 rounded-full transition-all duration-700 ease-out"
                                                        style={{
                                                            width: `${pct}%`,
                                                            backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-gray-400 text-center py-4">Chưa có dữ liệu</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* ===== Row 3: Top Visited + Low Stock ===== */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Top Visited Products */}
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <Eye className="h-5 w-5 text-blue-500" />
                                Sản Phẩm Xem Nhiều
                            </CardTitle>
                            <CardDescription>Top sản phẩm có lượt xem cao nhất</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data.topVisitedProducts && data.topVisitedProducts.length > 0 ? (
                                <div className="space-y-3">
                                    {data.topVisitedProducts.slice(0, 5).map((product, index) => (
                                        <div key={product.productId} className="flex items-center gap-3 group">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0
                                                ${index === 0 ? 'bg-blue-100 text-blue-700' :
                                                    index === 1 ? 'bg-sky-100 text-sky-700' :
                                                        index === 2 ? 'bg-cyan-100 text-cyan-700' :
                                                            'bg-gray-100 text-gray-600'}`}>
                                                {index + 1}
                                            </div>
                                            {product.image && (
                                                <img
                                                    src={product.image}
                                                    alt={product.productName}
                                                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                                    {product.productName}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm font-semibold text-blue-600 flex-shrink-0">
                                                <Eye className="h-3.5 w-3.5" />
                                                {(product.visitCount || 0).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 text-center py-4">Chưa có dữ liệu</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Low Stock Warning */}
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                Sắp Hết Hàng
                            </CardTitle>
                            <CardDescription>Sản phẩm có tồn kho ≤ 10 đơn vị</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data.lowStockProducts && data.lowStockProducts.length > 0 ? (
                                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                                    {data.lowStockProducts.map((item) => (
                                        <div
                                            key={item.variantId}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-100 hover:border-amber-200 transition-colors"
                                        >
                                            <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                                                <Package className="h-4 w-4 text-amber-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                                                <p className="text-xs text-gray-500">{item.variantInfo}</p>
                                            </div>
                                            <Badge
                                                variant={item.stockQuantity <= 3 ? 'destructive' : 'secondary'}
                                                className={`flex-shrink-0 ${item.stockQuantity <= 3
                                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                                    }`}
                                            >
                                                Còn {item.stockQuantity}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                    <Package className="h-10 w-10 mb-2 opacity-40" />
                                    <p className="text-sm">Tất cả sản phẩm đều đủ hàng</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* ===== Recent Orders Table ===== */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-violet-500" />
                            Đơn Hàng Gần Đây
                        </CardTitle>
                        <CardDescription>10 đơn hàng mới nhất từ khách hàng</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-xl border border-gray-200 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/80">
                                        <TableHead className="font-semibold">Mã Đơn</TableHead>
                                        <TableHead className="font-semibold">Khách Hàng</TableHead>
                                        <TableHead className="font-semibold text-right">Tổng Tiền</TableHead>
                                        <TableHead className="font-semibold">Trạng Thái</TableHead>
                                        <TableHead className="font-semibold">Thanh Toán</TableHead>
                                        <TableHead className="font-semibold">Ngày Tạo</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.recentOrders && data.recentOrders.length > 0 ? (
                                        data.recentOrders.map((order) => (
                                            <TableRow key={order.orderId} className="hover:bg-gray-50/50 transition-colors">
                                                <TableCell>
                                                    <span className="font-mono font-medium text-violet-600">#{order.orderId}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{order.customerName || '—'}</div>
                                                        <div className="text-xs text-gray-500">{order.customerEmail}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span className="font-semibold text-gray-900">{formatCurrency(order.totalPrice)}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`font-medium ${statusConfig[order.status]?.bg || ''}`}
                                                    >
                                                        {statusConfig[order.status]?.label || order.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-gray-600">
                                                        {paymentLabels[order.paymentMethod] || order.paymentMethod}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-gray-600">
                                                        {order.createdAt.split(' ')[0]?.split('-').reverse().join('/')}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {order.createdAt.split(' ')[1]?.substring(0, 5)}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-12">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="p-4 bg-gray-100 rounded-full">
                                                        <Package className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                    <p className="text-gray-500">Chưa có đơn hàng nào</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OrderDashboard;
