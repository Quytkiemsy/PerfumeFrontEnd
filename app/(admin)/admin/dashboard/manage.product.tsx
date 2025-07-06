'use client';
import {
    Download,
    Edit,
    Grid, List,
    Menu,
    MoreHorizontal,
    Plus, Search,
    Trash2,
    Upload
} from 'lucide-react';
import { useState } from 'react';

// shadcn/ui components
import { TIERS_OPTIONS } from '@/app/util/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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
import Image from 'next/image';
import ProductFormDialog from './modal.product';

const PerfumeAdminDashboard = ({ products, brands }: { products: IProduct[], brands: IBrand[] }) => {

    const [viewMode, setViewMode] = useState('table');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedTier, setSelectedTier] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // Mock data

    const tiers = TIERS_OPTIONS;

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brand?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBrand = !selectedBrand || product.brand?.name === selectedBrand;
        const matchesTier = !selectedTier || product.tier === selectedTier;
        return matchesSearch && matchesBrand && matchesTier;
    });

    const handleDeleteProduct = (id: number) => {
        if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            // setProducts(products.filter(p => p.id !== id));
        }
    };

    const handleEditProduct = (product: IProduct) => {
        setShowEditModal(true);
    };


    const getTierBadgeVariant = (tier: string) => {
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
            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                // onClick={() => setSidebarOpen(true)}
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
                                    <SelectItem key={brand.name} value={brand.name}>{brand.name}</SelectItem>
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
                                                    <Image
                                                        src={`/api/image?filename=${product?.images?.[0]}`}
                                                        alt={product.name}
                                                        width={40}
                                                        height={40}
                                                        className="w-10 h-10 rounded-lg object-cover" />
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
                                                <Badge variant={getTierBadgeVariant(product?.tier)}>
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
                                        <Image
                                            src={`/api/image?filename=${product?.images?.[0]}`}
                                            alt={product.name}
                                            width={200}
                                            height={200}
                                            className="w-full h-48 object-cover" />
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
                brands={brands}
                tiers={tiers}
            />

            {/* Edit Product Modal */}
            <ProductFormDialog
                product={editingProduct}
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
                }}
                brands={brands}
                tiers={tiers}
            />

            {/* Mobile Sidebar Overlay */}
            {/* {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )} */}
        </div>
    );
};

export default PerfumeAdminDashboard;