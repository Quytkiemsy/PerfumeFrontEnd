'use client';
import React, { useState } from 'react';
import {
    Plus, Search, Edit, Trash2, Package,
    Users, BarChart3, Settings, Menu, X, Upload, Download,
    Grid, List, MoreHorizontal
} from 'lucide-react';

// shadcn/ui components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const PerfumeAdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState('table');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedTier, setSelectedTier] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Mock data
    const [products, setProducts] = useState([
        {
            id: 1,
            name: "Chanel No. 5",
            images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop"],
            description: "Iconic floral fragrance with aldehydes",
            brand: { name: "Chanel", origin: "France" },
            fragranceTypes: { id: 1, name: "Floral" },
            perfumeVariants: [
                { id: 1, variantType: "EDT", volume: "50ml", price: 150, stockQuantity: 25 },
                { id: 2, variantType: "EDP", volume: "100ml", price: 200, stockQuantity: 15 }
            ],
            tier: "Luxury",
            sex: "Women",
            new: true,
            createdAt: "2024-01-15"
        },
        {
            id: 2,
            name: "Dior Sauvage",
            images: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300&h=300&fit=crop"],
            description: "Fresh and woody fragrance",
            brand: { name: "Dior", origin: "France" },
            fragranceTypes: { id: 2, name: "Woody" },
            perfumeVariants: [
                { id: 3, variantType: "EDT", volume: "100ml", price: 120, stockQuantity: 30 }
            ],
            tier: "Premium",
            sex: "Men",
            new: false,
            createdAt: "2024-01-10"
        },
        {
            id: 3,
            name: "Tom Ford Black Orchid",
            images: ["https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=300&h=300&fit=crop"],
            description: "Luxurious and mysterious fragrance",
            brand: { name: "Tom Ford", origin: "USA" },
            fragranceTypes: { id: 3, name: "Oriental" },
            perfumeVariants: [
                { id: 4, variantType: "EDP", volume: "50ml", price: 180, stockQuantity: 12 }
            ],
            tier: "Luxury",
            sex: "Unisex",
            new: false,
            createdAt: "2024-01-05"
        }
    ]);

    const brands = ["Chanel", "Dior", "Tom Ford", "Gucci", "Versace"];
    const tiers = ["Luxury", "Premium", "Mid-range", "Budget"];
    const fragranceTypes = ["Floral", "Woody", "Oriental", "Fresh", "Gourmand"];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brand?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBrand = !selectedBrand || product.brand?.name === selectedBrand;
        const matchesTier = !selectedTier || product.tier === selectedTier;
        return matchesSearch && matchesBrand && matchesTier;
    });

    const handleDeleteProduct = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowEditModal(true);
    };

    const ProductFormDialog = ({ product = null, isOpen, onClose }) => {
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

            if (product) {
                setProducts(products.map(p => p.id === product.id ? newProduct : p));
            } else {
                setProducts([...products, newProduct]);
            }

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
                                        {brands.map(brand => (
                                            <SelectItem key={brand} value={brand}>{brand}</SelectItem>
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
                                        {fragranceTypes.map(type => (
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
                                        {tiers.map(tier => (
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

    const getTierBadgeVariant = (tier) => {
        switch (tier) {
            case 'Luxury': return 'destructive';
            case 'Premium': return 'default';
            case 'Mid-range': return 'secondary';
            case 'Budget': return 'outline';
            default: return 'default';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0`}>
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
            </div>

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden mr-2"
                            >
                                <Menu size={20} />
                            </Button>
                            <h2 className="text-2xl font-semibold text-gray-900">Quản lý sản phẩm</h2>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Xuất
                            </Button>
                            <Button variant="outline" size="sm">
                                <Upload className="mr-2 h-4 w-4" />
                                Nhập
                            </Button>
                            <Button onClick={() => setShowAddModal(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Thêm sản phẩm
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Filters */}
                <div className="p-6 bg-white border-b">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[300px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <Input
                                    placeholder="Tìm kiếm sản phẩm..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Tất cả thương hiệu" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả thương hiệu</SelectItem>
                                {brands.map(brand => (
                                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedTier} onValueChange={setSelectedTier}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Tất cả phân khúc" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả phân khúc</SelectItem>
                                {tiers.map(tier => (
                                    <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex items-center space-x-1">
                            <Button
                                variant={viewMode === 'table' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('table')}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {viewMode === 'table' ? (
                        <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">
                                            <Checkbox />
                                        </TableHead>
                                        <TableHead>Sản phẩm</TableHead>
                                        <TableHead>Thương hiệu</TableHead>
                                        <TableHead>Phân khúc</TableHead>
                                        <TableHead>Giới tính</TableHead>
                                        <TableHead>Phiên bản</TableHead>
                                        <TableHead className="text-right">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <Checkbox />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-10 h-10 rounded-lg object-cover"
                                                    />
                                                    <div>
                                                        <div className="font-medium flex items-center gap-2">
                                                            {product.name}
                                                            {product.new && (
                                                                <Badge variant="destructive" className="text-xs">
                                                                    MỚI
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-gray-500 line-clamp-1">
                                                            {product.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{product.brand?.name}</TableCell>
                                            <TableCell>
                                                <Badge variant={getTierBadgeVariant(product.tier)}>
                                                    {product.tier}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{product.sex}</TableCell>
                                            <TableCell>{product.perfumeVariants?.length} phiên bản</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Chỉnh sửa
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteProduct(product.id)}
                                                            className="text-red-600"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Xóa
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="relative">
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        {product.new && (
                                            <Badge variant="destructive" className="absolute top-2 left-2">
                                                MỚI
                                            </Badge>
                                        )}
                                    </div>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg">{product.name}</CardTitle>
                                        <CardDescription>{product.brand?.name}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {product.description}
                                        </p>

                                        <div className="flex items-center justify-between mb-4">
                                            <Badge variant={getTierBadgeVariant(product.tier)}>
                                                {product.tier}
                                            </Badge>
                                            <span className="text-sm text-gray-600">{product.sex}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                                {product.perfumeVariants?.length} phiên bản
                                            </span>
                                            <div className="flex space-x-1">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEditProduct(product)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="mt-8 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Hiển thị {filteredProducts.length} sản phẩm
                        </div>
                        <div className="flex space-x-2">
                            <Button variant="outline" size="sm" disabled>
                                Trước
                            </Button>
                            <Button variant="outline" size="sm">
                                1
                            </Button>
                            <Button variant="outline" size="sm">
                                2
                            </Button>
                            <Button variant="outline" size="sm">
                                3
                            </Button>
                            <Button variant="outline" size="sm">
                                Sau
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            <ProductFormDialog
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
            />

            {/* Edit Product Modal */}
            <ProductFormDialog
                product={editingProduct}
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
                }}
            />

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default PerfumeAdminDashboard;