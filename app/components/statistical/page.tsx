'use client'
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, DollarSign, Filter, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface IStatisticalProps {
    orders: IOrder[];
}



const OrderDashboard: React.FC<IStatisticalProps> = ({ orders }) => {
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
    const [timeRange, setTimeRange] = useState<string>('7d');

    // Filter orders based on selected filters
    const filteredOrders = useMemo(() => {
        let filtered = orders;

        if (selectedStatus !== 'all') {
            filtered = filtered.filter(order => order.status === selectedStatus);
        }

        // Simple time range filter (last 7 days, 30 days, etc.)
        if (timeRange !== 'all') {
            const now = new Date();
            const days = parseInt(timeRange.replace('d', ''));
            const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
            filtered = filtered.filter(order => new Date(order.createdAt) >= cutoffDate);
        }

        return filtered;
    }, [selectedStatus, timeRange]);

    // Calculate statistics
    const stats = useMemo(() => {
        const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        const totalOrders = filteredOrders.length;
        const completedOrders = filteredOrders.filter(order => order.status === 'SHIPPING').length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        return {
            totalRevenue,
            totalOrders,
            completedOrders,
            averageOrderValue,
            completionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
        };
    }, [filteredOrders]);

    // Prepare chart data
    const revenueByDate = useMemo(() => {
        const dateMap = new Map();
        filteredOrders.forEach(order => {
            const date = new Date(order.createdAt).toISOString().split('T')[0];
            const current = dateMap.get(date) || 0;
            dateMap.set(date, current + order.totalPrice);
        });

        return Array.from(dateMap.entries())
            .map(([date, revenue]) => ({
                date: new Date(date).toLocaleDateString('vi-VN'),
                revenue: revenue / 1000000
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [filteredOrders]);

    const statusData = useMemo(() => {
        const statusCount = filteredOrders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(statusCount).map(([status, count]) => ({
            status,
            count
        }));
    }, [filteredOrders]);

    const brandData = useMemo(() => {
        const brandRevenue = new Map();
        filteredOrders.forEach(order => {
            order.items.forEach(item => {
                const brandName = item.perfumeVariants?.product?.brand?.name || 'Unknown';
                const current = brandRevenue.get(brandName) || 0;
                brandRevenue.set(brandName, current + item.totalPrice);
            });
        });

        return Array.from(brandRevenue.entries())
            .map(([brand, revenue]) => ({
                brand,
                revenue: revenue / 1000000
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
    }, [filteredOrders]);

    const getStatusBadgeVariant = (status: OrderStatus) => {
        switch (status) {
            case 'SHIPPING':
                return 'default';
            case 'PENDING':
                return 'secondary';
            case 'PAID':
                return 'outline';
            case 'CANCELLED':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    const formatCurrency = (value: number) => {
        return `${(value / 1000000).toFixed(1)}M VND`;
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Order Dashboard</h1>
                    <p className="text-muted-foreground">
                        Overview of your perfume store orders and sales performance
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4">
                    <Select value={selectedStatus} onValueChange={value => setSelectedStatus(value as OrderStatus | 'all')}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="SHIPPING">Shipped</SelectItem>
                            <SelectItem value="PAID">Paid</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[180px]">
                            <Calendar className="mr-2 h-4 w-4" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="90d">Last 90 days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(stats.totalRevenue)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                +12.1% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.totalOrders}</div>
                            <p className="text-xs text-muted-foreground">
                                +8.2% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">
                                {formatCurrency(stats.averageOrderValue)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                +3.5% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-pink-600">
                                {stats.completionRate.toFixed(1)}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                +2.1% from last month
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid gap-4 md:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Revenue Over Time</CardTitle>
                            <CardDescription>Daily revenue trends</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={revenueByDate}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis label={{ value: 'Revenue (M VND)', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip formatter={(value) => [`${value} M VND`, 'Revenue']} />
                                    <Legend />
                                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Order Status</CardTitle>
                            <CardDescription>Distribution of order statuses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ status, percent }) => `${status}: ${(percent as number * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Revenue by Brand</CardTitle>
                        <CardDescription>Top 5 performing brands</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={brandData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="brand" />
                                <YAxis label={{ value: 'Revenue (M VND)', angle: -90, position: 'insideLeft' }} />
                                <Tooltip formatter={(value) => [`${value} M VND`, 'Revenue']} />
                                <Bar dataKey="revenue" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Orders Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Latest orders from your customers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Products</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.slice(0, 10).map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">#{order.id}</TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="font-medium">{order?.shippingInfo?.fullName}</div>
                                                    <div className="text-sm text-muted-foreground">{order?.shippingInfo?.email}</div>
                                                    <div className="text-sm text-muted-foreground">{order?.user?.username}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    {order.items.slice(0, 2).map((item) => (
                                                        <div key={item.id} className="text-sm">
                                                            {item.perfumeVariants?.product?.name} ({item.quantity}x)
                                                        </div>
                                                    ))}
                                                    {order.items.length > 2 && (
                                                        <div className="text-xs text-muted-foreground">
                                                            +{order.items.length - 2} more
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {formatCurrency(order.totalPrice)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusBadgeVariant(order.status)}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {order.paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                            </TableCell>
                                        </TableRow>
                                    ))}
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