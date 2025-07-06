'use client';
import { useState } from 'react';

// shadcn/ui components
import { FRAGRANCE_TYPES_OPTIONS } from '@/app/util/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface IProps {
    product?: IProduct | null;
    isOpen: boolean;
    onClose: () => void;
    brands?: IBrand[];
    tiers?: string[];
}
const ProductFormDialog = ({ product = null, isOpen, onClose, brands, tiers }: IProps) => {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        description: product?.description || '',
        brand: product?.brand?.name || '',
        fragranceType: product?.fragranceTypes?.name || '',
        tier: product?.tier || '',
        sex: product?.sex || 'Unisex',
    });

    const handleSubmit = () => {
        if (!formData.name) return;

        const newProduct = {
            id: product?.id || Date.now(),
            ...formData,
            brand: { name: formData.brand, origin: "Unknown" },
            fragranceTypes: { id: 1, name: formData.fragranceType },
            perfumeVariants: product?.perfumeVariants || [],
            new: !product,
            createdAt: product?.createdAt || new Date().toISOString().split('T')[0],
            images: product?.images || []
        };

        // call api to save the product
        // if (product) {
        //     setProducts(products.map(p => p.id === product.id ? newProduct : p));
        // } else {
        //     setProducts([...products, newProduct]);
        // }

        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên sản phẩm</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nhập tên sản phẩm"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Nhập mô tả sản phẩm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="brand">Thương hiệu</Label>
                            <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn thương hiệu" />
                                </SelectTrigger>
                                <SelectContent>
                                    {brands?.map(brand => (
                                        <SelectItem key={brand.name} value={brand.name}>{brand.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fragranceType">Loại hương</Label>
                            <Select value={formData.fragranceType} onValueChange={(value) => setFormData({ ...formData, fragranceType: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại hương" />
                                </SelectTrigger>
                                <SelectContent>
                                    {FRAGRANCE_TYPES_OPTIONS?.map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="tier">Phân khúc</Label>
                            <Select value={formData.tier} onValueChange={(value) => setFormData({ ...formData, tier: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn phân khúc" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tiers?.map(tier => (
                                        <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sex">Giới tính</Label>
                            <Select value={formData.sex} onValueChange={(value) => setFormData({ ...formData, sex: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn giới tính" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Women">Nữ</SelectItem>
                                    <SelectItem value="Men">Nam</SelectItem>
                                    <SelectItem value="Unisex">Unisex</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button onClick={handleSubmit}>
                            {product ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductFormDialog;