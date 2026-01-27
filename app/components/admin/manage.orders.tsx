'use client';

import { Calendar, ChevronDown, ChevronUp, CreditCard, Eye, Mail, MapPin, Package, Phone, Search, Truck, User, X, Check, Ban, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { sendRequest } from '@/app/util/api';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const statusList: OrderStatus[] = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

interface ManageOrdersProps {
    orders: IOrder[];
}

const ManageOrders: React.FC<ManageOrdersProps> = ({ orders: initialOrders }) => {
    const [orders, setOrders] = useState<IOrder[]>(initialOrders);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
    const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [showStatusDialog, setShowStatusDialog] = useState(false);
    const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');
    const { data: session } = useSession();
    const router = useRouter();

    const toggleOrderExpansion = (orderId: number) => {
        const newExpanded = new Set(expandedOrders);
        if (newExpanded.has(orderId)) {
            newExpanded.delete(orderId);
        } else {
            newExpanded.add(orderId);
        }
        setExpandedOrders(newExpanded);
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'PAID':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'PROCESSING':
                return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'SHIPPING':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'DELIVERED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'REFUNDED':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: OrderStatus) => {
        switch (status) {
            case 'PENDING': return 'Chờ xử lý';
            case 'PAID': return 'Đã thanh toán';
            case 'PROCESSING': return 'Đang xử lý';
            case 'SHIPPING': return 'Đang giao';
            case 'DELIVERED': return 'Đã giao';
            case 'CANCELLED': return 'Đã hủy';
            case 'REFUNDED': return 'Hoàn tiền';
            default: return status;
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleUpdateStatus = async () => {
        if (!selectedOrder || !newStatus) return;

        try {
            const res = await sendRequest<IBackendRes<IOrder>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/${selectedOrder.id}/status`,
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`
                },
                body: { status: newStatus }
            });

            if (res.error) {
                toast.error(res.message || 'Lỗi cập nhật trạng thái');
                return;
            }

            toast.success('Cập nhật trạng thái thành công');
            setShowStatusDialog(false);
            setSelectedOrder(null);
            setNewStatus('');
            router.refresh();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.orderCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerPhone?.includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Statistics
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'PENDING').length,
        processing: orders.filter(o => o.status === 'PROCESSING' || o.status === 'PAID').length,
        shipping: orders.filter(o => o.status === 'SHIPPING').length,
        delivered: orders.filter(o => o.status === 'DELIVERED').length,
        cancelled: orders.filter(o => o.status === 'CANCELLED').length,
        totalRevenue: orders.filter(o => o.status === 'DELIVERED').reduce((sum, o) => sum + o.totalAmount, 0),
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
                    <p className="text-gray-500 mt-1">Theo dõi và xử lý các đơn hàng</p>
                </div>
                <Button onClick={() => router.refresh()} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Làm mới
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        <p className="text-sm text-gray-500">Tổng đơn</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                        <p className="text-sm text-gray-500">Chờ xử lý</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
                        <p className="text-sm text-gray-500">Đang xử lý</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-purple-600">{stats.shipping}</p>
                        <p className="text-sm text-gray-500">Đang giao</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                        <p className="text-sm text-gray-500">Đã giao</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                        <p className="text-sm text-gray-500">Đã hủy</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-lg font-bold text-green-600">{formatPrice(stats.totalRevenue)}</p>
                        <p className="text-sm text-gray-500">Doanh thu</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Tìm theo mã đơn, tên, email, SĐT..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                {statusList.map(status => (
                                    <SelectItem key={status} value={status}>
                                        {getStatusText(status)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12"></TableHead>
                                <TableHead>Mã đơn</TableHead>
                                <TableHead>Khách hàng</TableHead>
                                <TableHead>Ngày đặt</TableHead>
                                <TableHead>Tổng tiền</TableHead>
                                <TableHead>Thanh toán</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.map((order) => (
                                <React.Fragment key={order.id}>
                                    <TableRow className="hover:bg-gray-50">
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleOrderExpansion(order.id)}
                                            >
                                                {expandedOrders.has(order.id) ? (
                                                    <ChevronUp className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            #{order.orderCode || order.id}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{order.customerName}</p>
                                                <p className="text-sm text-gray-500">{order.customerPhone}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                                        <TableCell className="font-medium text-green-600">
                                            {formatPrice(order.totalAmount)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {order.paymentMethod === 'COD' ? 'COD' : order.paymentMethod}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(order.status)}>
                                                {getStatusText(order.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowDetailDialog(true);
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setNewStatus(order.status);
                                                        setShowStatusDialog(true);
                                                    }}
                                                >
                                                    <RefreshCw className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Expanded Row - Order Items */}
                                    {expandedOrders.has(order.id) && (
                                        <TableRow>
                                            <TableCell colSpan={8} className="bg-gray-50 p-4">
                                                <div className="space-y-3">
                                                    <p className="font-medium text-gray-700">Chi tiết sản phẩm:</p>
                                                    {order.orderItems?.map((item, index) => (
                                                        <div key={index} className="flex items-center gap-4 bg-white p-3 rounded-lg">
                                                            {item.product?.images?.[0] && (
                                                                <Image
                                                                    src={`/api/image?filename=${item.product.images[0]}`}
                                                                    alt={item.product?.name || ''}
                                                                    width={50}
                                                                    height={50}
                                                                    className="rounded-md object-cover"
                                                                />
                                                            )}
                                                            <div className="flex-1">
                                                                <p className="font-medium">{item.product?.name}</p>
                                                                <p className="text-sm text-gray-500">
                                                                    {item.perfumeVariant?.variantType} - {item.perfumeVariant?.volume}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-medium">{formatPrice(item.price)} x {item.quantity}</p>
                                                                <p className="text-sm text-green-600">{formatPrice(item.price * item.quantity)}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className="flex justify-between pt-3 border-t">
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <MapPin className="w-4 h-4" />
                                                            <span className="text-sm">{order.shippingAddress}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Không tìm thấy đơn hàng nào</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Order Detail Dialog */}
            <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chi tiết đơn hàng #{selectedOrder?.orderCode || selectedOrder?.id}</DialogTitle>
                        <DialogDescription>Thông tin chi tiết đơn hàng</DialogDescription>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-6">
                            {/* Customer Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">Khách hàng</p>
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span>{selectedOrder.customerName}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">Số điện thoại</p>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span>{selectedOrder.customerPhone}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">Email</p>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span>{selectedOrder.customerEmail}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">Ngày đặt</p>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span>{formatDate(selectedOrder.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                                    <span>{selectedOrder.shippingAddress}</span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-3">
                                <p className="font-medium">Sản phẩm</p>
                                {selectedOrder.orderItems?.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                                        {item.product?.images?.[0] && (
                                            <Image
                                                src={`/api/image?filename=${item.product.images[0]}`}
                                                alt={item.product?.name || ''}
                                                width={60}
                                                height={60}
                                                className="rounded-md object-cover"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <p className="font-medium">{item.product?.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {item.perfumeVariant?.variantType} - {item.perfumeVariant?.volume}
                                            </p>
                                            <p className="text-sm">Số lượng: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-green-600">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center pt-4 border-t">
                                <div>
                                    <Badge className={getStatusColor(selectedOrder.status)}>
                                        {getStatusText(selectedOrder.status)}
                                    </Badge>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Tổng cộng</p>
                                    <p className="text-2xl font-bold text-green-600">{formatPrice(selectedOrder.totalAmount)}</p>
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedOrder.notes && (
                                <div className="p-3 bg-yellow-50 rounded-lg">
                                    <p className="text-sm font-medium text-yellow-800">Ghi chú:</p>
                                    <p className="text-sm text-yellow-700">{selectedOrder.notes}</p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Update Status Dialog */}
            <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
                        <DialogDescription>
                            Đơn hàng #{selectedOrder?.orderCode || selectedOrder?.id}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Trạng thái mới</label>
                            <Select value={newStatus} onValueChange={(value) => setNewStatus(value as OrderStatus)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusList.map(status => (
                                        <SelectItem key={status} value={status}>
                                            {getStatusText(status)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
                                Hủy
                            </Button>
                            <Button onClick={handleUpdateStatus}>
                                Cập nhật
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManageOrders;
