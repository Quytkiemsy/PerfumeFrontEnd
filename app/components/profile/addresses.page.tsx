'use client';

import { Edit, Mail, MapPin, Phone, Plus, Star, Trash2, User, Check } from 'lucide-react';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sendRequest } from '@/app/util/api';

interface AddressesPageProps {
    addresses: IAddress[];
}

const AddressesPage: React.FC<AddressesPageProps> = ({ addresses: initialAddresses }) => {
    const [addresses, setAddresses] = useState<IAddress[]>(initialAddresses);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
    const [addressForm, setAddressForm] = useState({
        fullName: '',
        phone: '',
        email: '',
        province: '',
        district: '',
        ward: '',
        addressDetail: '',
        isDefault: false,
    });
    const { data: session } = useSession();
    const router = useRouter();

    const resetForm = () => {
        setAddressForm({
            fullName: '',
            phone: '',
            email: '',
            province: '',
            district: '',
            ward: '',
            addressDetail: '',
            isDefault: false,
        });
    };

    const handleAddAddress = async () => {
        if (!addressForm.fullName || !addressForm.phone || !addressForm.addressDetail) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }

        try {
            const res = await sendRequest<IBackendRes<IAddress>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/addresses`,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`
                },
                body: addressForm
            });

            if (res.error) {
                toast.error(res.message || 'Lỗi thêm địa chỉ');
                return;
            }

            toast.success('Thêm địa chỉ thành công');
            setShowAddDialog(false);
            resetForm();
            router.refresh();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const handleEditAddress = async () => {
        if (!selectedAddress) return;

        try {
            const res = await sendRequest<IBackendRes<IAddress>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/addresses/${selectedAddress.id}`,
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`
                },
                body: addressForm
            });

            if (res.error) {
                toast.error(res.message || 'Lỗi cập nhật địa chỉ');
                return;
            }

            toast.success('Cập nhật địa chỉ thành công');
            setShowEditDialog(false);
            setSelectedAddress(null);
            resetForm();
            router.refresh();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const handleDeleteAddress = async () => {
        if (!selectedAddress) return;

        try {
            const res = await sendRequest<IBackendRes<void>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/addresses/${selectedAddress.id}`,
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`
                }
            });

            if (res.error) {
                toast.error(res.message || 'Lỗi xóa địa chỉ');
                return;
            }

            toast.success('Xóa địa chỉ thành công');
            setShowDeleteDialog(false);
            setSelectedAddress(null);
            router.refresh();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const handleSetDefault = async (address: IAddress) => {
        try {
            const res = await sendRequest<IBackendRes<IAddress>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/addresses/${address.id}/set-default`,
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`
                }
            });

            if (res.error) {
                toast.error(res.message || 'Lỗi đặt địa chỉ mặc định');
                return;
            }

            toast.success('Đã đặt làm địa chỉ mặc định');
            router.refresh();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const openEditDialog = (address: IAddress) => {
        setSelectedAddress(address);
        setAddressForm({
            fullName: address.fullName,
            phone: address.phone,
            email: address.email || '',
            province: address.province,
            district: address.district,
            ward: address.ward,
            addressDetail: address.addressDetail,
            isDefault: address.isDefault,
        });
        setShowEditDialog(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Địa chỉ giao hàng</h1>
                        <p className="text-gray-600">Quản lý danh sách địa chỉ của bạn</p>
                    </div>
                    <Button onClick={() => setShowAddDialog(true)} className="mt-4 md:mt-0">
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm địa chỉ mới
                    </Button>
                </div>

                {/* Addresses List */}
                <div className="space-y-4">
                    {addresses.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 mb-4">Bạn chưa có địa chỉ nào</p>
                                <Button onClick={() => setShowAddDialog(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Thêm địa chỉ đầu tiên
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        addresses.map((address) => (
                            <Card key={address.id} className={`${address.isDefault ? 'ring-2 ring-indigo-500' : ''}`}>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-semibold text-lg">{address.fullName}</h3>
                                                {address.isDefault && (
                                                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                                                        Mặc định
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                                <Phone className="w-4 h-4" />
                                                <span>{address.phone}</span>
                                            </div>
                                            {address.email && (
                                                <div className="flex items-center gap-2 text-gray-600 mb-1">
                                                    <Mail className="w-4 h-4" />
                                                    <span>{address.email}</span>
                                                </div>
                                            )}
                                            <div className="flex items-start gap-2 text-gray-600">
                                                <MapPin className="w-4 h-4 mt-1" />
                                                <span>
                                                    {address.addressDetail}
                                                    {address.ward && `, ${address.ward}`}
                                                    {address.district && `, ${address.district}`}
                                                    {address.province && `, ${address.province}`}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-row md:flex-col gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEditDialog(address)}
                                            >
                                                <Edit className="w-4 h-4 mr-1" />
                                                Sửa
                                            </Button>
                                            {!address.isDefault && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleSetDefault(address)}
                                                    >
                                                        <Star className="w-4 h-4 mr-1" />
                                                        Đặt mặc định
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedAddress(address);
                                                            setShowDeleteDialog(true);
                                                        }}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Xóa
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Add Address Dialog */}
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Thêm địa chỉ mới</DialogTitle>
                            <DialogDescription>
                                Điền thông tin địa chỉ giao hàng của bạn
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Họ và tên *</Label>
                                    <Input
                                        value={addressForm.fullName}
                                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                                        placeholder="Nguyễn Văn A"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Số điện thoại *</Label>
                                    <Input
                                        value={addressForm.phone}
                                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                        placeholder="0123456789"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Email (tùy chọn)</Label>
                                <Input
                                    type="email"
                                    value={addressForm.email}
                                    onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                                    placeholder="example@email.com"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Tỉnh/Thành phố</Label>
                                    <Input
                                        value={addressForm.province}
                                        onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
                                        placeholder="Hà Nội"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Quận/Huyện</Label>
                                    <Input
                                        value={addressForm.district}
                                        onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                                        placeholder="Cầu Giấy"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phường/Xã</Label>
                                    <Input
                                        value={addressForm.ward}
                                        onChange={(e) => setAddressForm({ ...addressForm, ward: e.target.value })}
                                        placeholder="Dịch Vọng"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Địa chỉ chi tiết *</Label>
                                <Input
                                    value={addressForm.addressDetail}
                                    onChange={(e) => setAddressForm({ ...addressForm, addressDetail: e.target.value })}
                                    placeholder="Số nhà, tên đường..."
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    checked={addressForm.isDefault}
                                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300"
                                />
                                <Label htmlFor="isDefault" className="font-normal cursor-pointer">
                                    Đặt làm địa chỉ mặc định
                                </Label>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => {
                                    setShowAddDialog(false);
                                    resetForm();
                                }}>
                                    Hủy
                                </Button>
                                <Button onClick={handleAddAddress}>
                                    Thêm địa chỉ
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Edit Address Dialog */}
                <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Chỉnh sửa địa chỉ</DialogTitle>
                            <DialogDescription>
                                Cập nhật thông tin địa chỉ giao hàng
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Họ và tên *</Label>
                                    <Input
                                        value={addressForm.fullName}
                                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Số điện thoại *</Label>
                                    <Input
                                        value={addressForm.phone}
                                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Email (tùy chọn)</Label>
                                <Input
                                    type="email"
                                    value={addressForm.email}
                                    onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                                    placeholder="example@email.com"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Tỉnh/Thành phố</Label>
                                    <Input
                                        value={addressForm.province}
                                        onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Quận/Huyện</Label>
                                    <Input
                                        value={addressForm.district}
                                        onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phường/Xã</Label>
                                    <Input
                                        value={addressForm.ward}
                                        onChange={(e) => setAddressForm({ ...addressForm, ward: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Địa chỉ chi tiết *</Label>
                                <Input
                                    value={addressForm.addressDetail}
                                    onChange={(e) => setAddressForm({ ...addressForm, addressDetail: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => {
                                    setShowEditDialog(false);
                                    setSelectedAddress(null);
                                    resetForm();
                                }}>
                                    Hủy
                                </Button>
                                <Button onClick={handleEditAddress}>
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
                                Bạn có chắc chắn muốn xóa địa chỉ này? Hành động này không thể hoàn tác.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => {
                                setShowDeleteDialog(false);
                                setSelectedAddress(null);
                            }}>
                                Hủy
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteAddress}>
                                Xóa
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default AddressesPage;
