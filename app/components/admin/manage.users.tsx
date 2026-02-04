'use client';

import { Ban, Check, Edit, Mail, MoreHorizontal, Phone, RefreshCw, Search, Shield, Trash2, User, UserPlus, X } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { formatDateLong, formatDateTime } from '@/app/util/dateUtils';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { revalidateAdminUsers } from '@/app/actions/revalidate';

interface ManageUsersProps {
    users: IUser[];
}

const ManageUsers: React.FC<ManageUsersProps> = ({ users: initialUsers }) => {
    const [users, setUsers] = useState<IUser[]>(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'USER' | 'ADMIN'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'ACTIVE' | 'INACTIVE' | 'BANNED'>('all');
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editForm, setEditForm] = useState<Partial<IUser>>({});
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        setUsers(initialUsers);
    }, [initialUsers]);

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'USER':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'INACTIVE':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'BANNED':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };


    const handleEditUser = (user: IUser) => {
        setSelectedUser(user);
        setEditForm({
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            status: user.status,
        });
        setShowEditDialog(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedUser) return;

        try {
            const res = await sendRequest<IBackendRes<IUser>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/users/${selectedUser.id}`,
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`
                },
                body: editForm
            });

            if (res.error) {
                toast.error(res.message || 'Lỗi cập nhật người dùng');
                return;
            }

            toast.success('Cập nhật thành công');
            setShowEditDialog(false);
            setSelectedUser(null);
            router.refresh();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        try {
            const res = await sendRequest<IBackendRes<void>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/users/${selectedUser.id}`,
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`
                }
            });

            if (res.error) {
                toast.error(res.message || 'Lỗi xóa người dùng');
                return;
            }

            toast.success('Xóa thành công');
            setShowDeleteDialog(false);
            setSelectedUser(null);
            router.refresh();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const handleToggleStatus = async (user: IUser) => {
        try {
            const newStatus = user.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
            const res = await sendRequest<IBackendRes<IUser>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/users/${user.id}`,
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

            toast.success(`Đã ${newStatus === 'ACTIVE' ? 'kích hoạt' : 'khóa'} tài khoản`);
            router.refresh();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phoneNumber?.includes(searchTerm) ||
            user.username?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    // Statistics
    const stats = {
        total: users.length,
        admins: users.filter(u => u.role === 'ADMIN').length,
        users: users.filter(u => u.role === 'USER').length,
        active: users.filter(u => u.status === 'ACTIVE').length,
        banned: users.filter(u => u.status === 'BANNED').length,
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
                    <p className="text-gray-500 mt-1">Quản lý tài khoản và phân quyền</p>
                </div>
                <Button onClick={async () => { await revalidateAdminUsers(); router.refresh(); }} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Làm mới
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        <p className="text-sm text-gray-500">Tổng người dùng</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
                        <p className="text-sm text-gray-500">Admin</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">{stats.users}</p>
                        <p className="text-sm text-gray-500">Khách hàng</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                        <p className="text-sm text-gray-500">Đang hoạt động</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-red-600">{stats.banned}</p>
                        <p className="text-sm text-gray-500">Đã khóa</p>
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
                                placeholder="Tìm theo tên, email, SĐT, username..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as any)}>
                            <SelectTrigger className="w-full md:w-40">
                                <SelectValue placeholder="Vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả vai trò</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="USER">Khách hàng</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                            <SelectTrigger className="w-full md:w-40">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                                <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                                <SelectItem value="BANNED">Đã khóa</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Người dùng</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Số điện thoại</TableHead>
                                <TableHead>Vai trò</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id} className="hover:bg-gray-50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                {user.avatar ? (
                                                    <Image
                                                        src={user.avatar}
                                                        alt={user.name}
                                                        width={40}
                                                        height={40}
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-5 h-5 text-gray-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-gray-500">@{user.username || user.id.slice(0, 8)}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <span>{user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.phoneNumber ? (
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <span>{user.phoneNumber}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getRoleColor(user.role)}>
                                            <Shield className="w-3 h-3 mr-1" />
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(user.status)}>
                                            {user.status === 'ACTIVE' ? 'Hoạt động' : user.status === 'BANNED' ? 'Đã khóa' : 'Không hoạt động'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDateTime(user.createdAt)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => {
                                                    setSelectedUser(user);
                                                    setShowDetailDialog(true);
                                                }}>
                                                    <User className="w-4 h-4 mr-2" />
                                                    Xem chi tiết
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Chỉnh sửa
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                                                    {user.status === 'ACTIVE' ? (
                                                        <>
                                                            <Ban className="w-4 h-4 mr-2" />
                                                            Khóa tài khoản
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Check className="w-4 h-4 mr-2" />
                                                            Kích hoạt
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowDeleteDialog(true);
                                                    }}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Xóa
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12">
                            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Không tìm thấy người dùng nào</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* User Detail Dialog */}
            <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Thông tin người dùng</DialogTitle>
                    </DialogHeader>

                    {selectedUser && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                    {selectedUser.avatar ? (
                                        <Image
                                            src={selectedUser.avatar}
                                            alt={selectedUser.name}
                                            width={64}
                                            height={64}
                                            className="object-cover"
                                        />
                                    ) : (
                                        <User className="w-8 h-8 text-gray-500" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                                    <p className="text-gray-500">@{selectedUser.username || selectedUser.id.slice(0, 8)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{selectedUser.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Số điện thoại</p>
                                    <p className="font-medium">{selectedUser.phoneNumber || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Vai trò</p>
                                    <Badge className={getRoleColor(selectedUser.role)}>{selectedUser.role}</Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Trạng thái</p>
                                    <Badge className={getStatusColor(selectedUser.status)}>
                                        {selectedUser.status === 'ACTIVE' ? 'Hoạt động' : selectedUser.status === 'BANNED' ? 'Đã khóa' : 'Không hoạt động'}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Giới tính</p>
                                    <p className="font-medium">
                                        {selectedUser.gender === 'MALE' ? 'Nam' : selectedUser.gender === 'FEMALE' ? 'Nữ' : '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Ngày sinh</p>
                                    <p className="font-medium">{selectedUser.dateOfBirth || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Ngày tạo</p>
                                    <p className="font-medium">{formatDateTime(selectedUser.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                                    <p className="font-medium">{formatDateTime(selectedUser.updatedAt)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Họ tên</Label>
                            <Input
                                value={editForm.name || ''}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                value={editForm.email || ''}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Số điện thoại</Label>
                            <Input
                                value={editForm.phoneNumber || ''}
                                onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Vai trò</Label>
                            <Select
                                value={editForm.role}
                                onValueChange={(value) => setEditForm({ ...editForm, role: value as 'USER' | 'ADMIN' })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USER">Khách hàng</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Trạng thái</Label>
                            <Select
                                value={editForm.status}
                                onValueChange={(value) => setEditForm({ ...editForm, status: value as any })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                                    <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                                    <SelectItem value="BANNED">Đã khóa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                                Hủy
                            </Button>
                            <Button onClick={handleSaveEdit}>
                                Lưu thay đổi
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa người dùng "{selectedUser?.name}"? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteUser}>
                            Xóa
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManageUsers;
