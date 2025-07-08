'use client';
import { useState } from 'react';
import { z } from "zod";

// shadcn/ui components
import { FRAGRANCE_TYPES_OPTIONS, sendRequest, sendRequestFile, SEX_OPTIONS } from '@/app/util/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from "lucide-react"; // icon shadcn

interface IProps {
    product?: IProduct | null;
    isOpen: boolean;
    onClose: () => void;
    brands?: IBrand[];
    tiers?: string[];
}
const ProductFormDialog = ({ product = null, isOpen, onClose, brands, tiers }: IProps) => {

    const { data: session, status } = useSession();
    const [formData, setFormData] = useState({
        name: product?.name || '',
        description: product?.description || '',
        brand: product?.brand?.name || '',
        fragranceType: product?.fragranceTypes?.name || '',
        tier: product?.tier || '',
        sex: product?.sex || '',
    });

    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const [variants, setVariants] = useState<IPerfumeVariant[]>(
        product?.perfumeVariants?.length ? product.perfumeVariants : [
            { id: 0, volume: '', price: 0, stockQuantity: 0 }
        ]
    );
    const [formErrors, setFormErrors] = useState<any>(null);

    // Zod schema cho variant
    const variantSchema = z.object({
        volume: z.string().min(1, "Vui lòng nhập dung tích"),
        price: z.preprocess(
            (v) => {
                const num = Number(v);
                return isNaN(num) ? 0 : num;
            },
            z.number().min(1, "Giá phải lớn hơn 0")
        ),
        stockQuantity: z.preprocess(
            (v) => {
                const num = Number(v);
                return isNaN(num) ? 0 : num;
            },
            z.number().min(1, "Tồn kho lớn hơn 0")
        ),
    });

    // Zod schema cho form
    const productSchema = z.object({
        name: z.string().min(1, "Tên sản phẩm không được để trống"),
        description: z.string().min(1, "Mô tả không được để trống"),
        brand: z.string().min(1, "Chọn thương hiệu"),
        fragranceType: z.string().min(1, "Chọn loại hương"),
        tier: z.string().min(1, "Chọn phân khúc"),
        sex: z.string().min(1, "Chọn giới tính"),
        variants: z.array(variantSchema).min(1, "Cần ít nhất 1 phiên bản"),
    });

    const handleAddVariant = () => {
        setVariants([...variants, { id: Math.floor(Math.random() * 1000000), volume: '', price: 0, stockQuantity: 0 }]);
    };

    const handleRemoveVariant = (idx: number) => {
        setVariants(variants.filter((_, i) => i !== idx));
    };

    const handleVariantChange = (idx: number, field: keyof IPerfumeVariant, value: string) => {
        const updatedVariants = variants.map((v, i) => {
            if (i === idx) {
                // Xử lý riêng cho number fields
                if (field === 'price' || field === 'stockQuantity') {
                    const numValue = parseFloat(value) || 0;
                    return { ...v, [field]: numValue };
                }
                return { ...v, [field]: value };
            }
            return v;
        });
        setVariants(updatedVariants);

        // Clear errors khi user đang nhập
        if (formErrors?.variants) {
            setFormErrors({
                ...formErrors,
                variants: null
            });
        }
    };

    const handleSubmit = () => {
        const data = {
            ...formData,
            variants: variants,
        };
        console.log("Submitted data:", data); // Debug
        const result = productSchema.safeParse(data);
        if (!result.success) {
            const errors = result.error.format();
            console.log('Validation errors:', errors); // Debug
            setFormErrors(errors);
            toast.error("Vui lòng kiểm tra lại thông tin!");
            // return;
        }

        // setFormErrors(null);

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
        // console.log("Product data to save:", newProduct);
    };

    const handleClose = () => {
        setFormData({
            name: product?.name || '',
            description: product?.description || '',
            brand: product?.brand?.name || '',
            fragranceType: product?.fragranceTypes?.name || '',
            tier: product?.tier || '',
            sex: product?.sex || '',
        });
        setFiles([]);
        setPreviews([]);
        setLoading(false);
        onClose();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files ?? []).slice(0, 5);
        setFiles(selectedFiles);
        setPreviews(selectedFiles.map(file => URL.createObjectURL(file)));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setLoading(true);

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("folder", "images");

                const res = await sendRequestFile<IBackendRes<IModelPaginateRestJPA<IBrand>>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files`,
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${session?.accessToken}`
                    },
                    body: formData,
                });

                if (res.error) throw new Error("Upload failed");
                // Xử lý kết quả từng ảnh nếu cần
            }
            toast.success("Tải lên ảnh thành công");
            setFiles([]);
            setPreviews([]);
        } catch (error) {
            console.error(error);
            alert("Lỗi upload ảnh");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
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
                        {formErrors?.name?._errors[0] && (
                            <p className="text-sm text-red-600">{formErrors?.name?._errors[0]}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Nhập mô tả sản phẩm"
                        />
                        {formErrors?.description?._errors[0] && (
                            <p className="text-sm text-red-600">{formErrors?.description?._errors[0]}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="image">Ảnh sản phẩm</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="mb-0 flex-1"
                                disabled={loading}
                            />
                            <Button
                                size="sm"
                                onClick={handleUpload}
                                disabled={loading || files.length === 0}
                                variant="default"
                                className="whitespace-nowrap"
                            >
                                {loading ? "Đang tải lên..." : "Tải lên"}
                            </Button>
                        </div>
                        {previews.length > 0 && (
                            <div className="mb-2 flex gap-2">
                                {previews.map((src, idx) => (
                                    <Image
                                        key={idx}
                                        src={src}
                                        alt={`Preview ${idx + 1}`}
                                        className="rounded-md border border-muted object-cover aspect-video"
                                        width={100}
                                        height={80}
                                    />
                                ))}
                            </div>
                        )}
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
                            {formErrors?.brand._errors[0] && (
                                <p className="text-sm text-red-600">{formErrors?.brand._errors[0]}</p>
                            )}
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
                            {formErrors?.fragranceType._errors[0] && (
                                <p className="text-sm text-red-600">{formErrors?.fragranceType._errors[0]}</p>
                            )}
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
                            {formErrors?.tier._errors[0] && (
                                <p className="text-sm text-red-600">{formErrors?.tier._errors[0]}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sex">Giới tính</Label>
                            <Select value={formData.sex} onValueChange={(value) => setFormData({ ...formData, sex: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn giới tính" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SEX_OPTIONS?.map(sex => (
                                        <SelectItem key={sex} value={sex}>{sex}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formErrors?.sex?._errors[0] && (
                                <p className="text-sm text-red-600">{formErrors?.sex?._errors[0]}</p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Phiên bản sản phẩm</Label>
                            <Button type="button" size="icon" variant="outline" onClick={handleAddVariant}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        {/* Hiển thị lỗi tổng thể cho variants nếu có */}
                        <div className="space-y-2">
                            {variants.map((variant, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <Input
                                                placeholder="Dung tích (ml)"
                                                value={variant.volume}
                                                onChange={e => handleVariantChange(idx, "volume", e.target.value)}
                                            />
                                            {formErrors?.variants[idx]?.volume?._errors[0] && (
                                                <p className="text-sm text-red-600 mt-1">{formErrors?.variants[idx]?.volume?._errors[0]}</p>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <Input
                                                type="number"
                                                placeholder="Giá (₫)"
                                                value={variant.price || ''}
                                                onChange={e => handleVariantChange(idx, "price", e.target.value)}
                                                min={1}
                                            />
                                            {formErrors?.variants?.[idx]?.price?._errors?.[0] && (
                                                <p className="text-sm text-red-600 mt-1">{formErrors?.variants[idx]?.price?._errors[0]}</p>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <Input
                                                type="number"
                                                placeholder="Tồn kho"
                                                value={variant.stockQuantity || ''}
                                                onChange={e => handleVariantChange(idx, "stockQuantity", e.target.value)}
                                                min={0}
                                            />
                                            {formErrors?.variants?.[idx]?.stockQuantity?._errors?.[0] && (
                                                <p className="text-sm text-red-600 mt-1">{formErrors?.variants[idx]?.stockQuantity?._errors[0]}</p>
                                            )}
                                        </div>

                                        {variants.length > 1 && (
                                            <Button type="button" size="icon" variant="ghost" onClick={() => handleRemoveVariant(idx)}>
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={handleClose}>
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