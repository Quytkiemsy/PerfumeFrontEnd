'use client';

import { Camera, Edit, Key, Mail, Phone, Save, User, Calendar, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sendRequest } from '@/app/util/api';

interface ProfilePageProps {
    user: IUser;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user: initialUser }) => {
    const [user, setUser] = useState<IUser>(initialUser);
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [editForm, setEditForm] = useState<{
        name: string;
        phoneNumber: string;
        gender: 'MALE' | 'FEMALE' | 'OTHER' | '';
        dateOfBirth: string;
    }>({
        name: user.name || '',
        phoneNumber: user.phoneNumber || '',
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth || '',
    });
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const { data: session } = useSession();
    const router = useRouter();

    const handleSaveProfile = async () => {
        try {
            const res = await sendRequest<IBackendRes<IUser>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/profile`,
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`
                },
                body: editForm
            });

            if (res.error) {
                toast.error(res.message || 'Lỗi cập nhật thông tin');
                return;
            }

            toast.success('Cập nhật thông tin thành công');
            if (res.data) {
                setUser(res.data);
            }
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const handleChangePassword = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        try {
            const res = await sendRequest<IBackendRes<void>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/change-password`,
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`
                },
                body: {
                    oldPassword: passwordForm.oldPassword,
                    newPassword: passwordForm.newPassword
                }
            });

            if (res.error) {
                toast.error(res.message || 'Lỗi đổi mật khẩu');
                return;
            }

            toast.success('Đổi mật khẩu thành công');
            setShowPasswordDialog(false);
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Thông tin cá nhân</h1>
                    <p className="text-gray-600">Quản lý thông tin tài khoản của bạn</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Avatar Card */}
                    <Card className="lg:col-span-1">
                        <CardContent className="p-6 text-center">
                            <div className="relative w-32 h-32 mx-auto mb-4">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
                                    {user.avatar ? (
                                        <Image
                                            src={user.avatar}
                                            alt={user.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <User className="w-16 h-16 text-white" />
                                    )}
                                </div>
                                <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                                    <Camera className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                            <p className="text-gray-500">@{user.username || user.email?.split('@')[0]}</p>
                            <div className="mt-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    user.role === 'ADMIN' 
                                        ? 'bg-purple-100 text-purple-700' 
                                        : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {user.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profile Info Card */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Thông tin chi tiết</CardTitle>
                            {!isEditing ? (
                                <Button variant="outline" onClick={() => setIsEditing(true)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Chỉnh sửa
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => {
                                        setIsEditing(false);
                                        setEditForm({
                                            name: user.name || '',
                                            phoneNumber: user.phoneNumber || '',
                                            gender: user.gender || '',
                                            dateOfBirth: user.dateOfBirth || '',
                                        });
                                    }}>
                                        <X className="w-4 h-4 mr-2" />
                                        Hủy
                                    </Button>
                                    <Button onClick={handleSaveProfile}>
                                        <Save className="w-4 h-4 mr-2" />
                                        Lưu
                                    </Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {isEditing ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Họ và tên</Label>
                                            <Input
                                                value={editForm.name || ''}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Email</Label>
                                            <Input value={user.email || ''} disabled className="bg-gray-50" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Số điện thoại</Label>
                                            <Input
                                                value={editForm.phoneNumber || ''}
                                                onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                                                placeholder="Nhập số điện thoại"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Giới tính</Label>
                                            <Select
                                                value={editForm.gender || ''}
                                                onValueChange={(value) => setEditForm({ ...editForm, gender: value as 'MALE' | 'FEMALE' | 'OTHER' | '' })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn giới tính" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="MALE">Nam</SelectItem>
                                                    <SelectItem value="FEMALE">Nữ</SelectItem>
                                                    <SelectItem value="OTHER">Khác</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Ngày sinh</Label>
                                            <Input
                                                type="date"
                                                value={editForm.dateOfBirth || ''}
                                                onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Họ và tên</p>
                                                <p className="font-medium">{user.name || ''}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-medium">{user.email || ''}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                                <Phone className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Số điện thoại</p>
                                                <p className="font-medium">{user.phoneNumber || 'Chưa cập nhật'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Giới tính</p>
                                                <p className="font-medium">
                                                    {user.gender === 'MALE' ? 'Nam' : user.gender === 'FEMALE' ? 'Nữ' : 'Chưa cập nhật'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-pink-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Ngày sinh</p>
                                                <p className="font-medium">{user.dateOfBirth || 'Chưa cập nhật'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Ngày tham gia</p>
                                                <p className="font-medium">{formatDate(user.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Security Card */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Bảo mật</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                        <Key className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Mật khẩu</p>
                                        <p className="text-sm text-gray-500">Thay đổi mật khẩu đăng nhập</p>
                                    </div>
                                </div>
                                <Button variant="outline" onClick={() => setShowPasswordDialog(true)}>
                                    Đổi mật khẩu
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Change Password Dialog */}
                <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Đổi mật khẩu</DialogTitle>
                            <DialogDescription>
                                Nhập mật khẩu cũ và mật khẩu mới để thay đổi
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Mật khẩu hiện tại</Label>
                                <Input
                                    type="password"
                                    value={passwordForm.oldPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                                    placeholder="Nhập mật khẩu hiện tại"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Mật khẩu mới</Label>
                                <Input
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    placeholder="Nhập mật khẩu mới"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Xác nhận mật khẩu mới</Label>
                                <Input
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => {
                                    setShowPasswordDialog(false);
                                    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                                }}>
                                    Hủy
                                </Button>
                                <Button onClick={handleChangePassword}>
                                    Đổi mật khẩu
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default ProfilePage;
