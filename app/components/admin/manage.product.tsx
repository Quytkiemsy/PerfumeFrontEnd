'use client';
import {
    Download,
    Edit,
    FileDown,
    FileUp,
    Grid, List,
    Menu,
    MoreHorizontal,
    Plus, Search,
    Trash2,
    Upload
} from 'lucide-react';
import { useRef, useState } from 'react';

// shadcn/ui components
import { sendRequest, TIERS_OPTIONS } from '@/app/util/api';
import { productApi } from '@/app/util/productApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import ProductFormDialog from './modal.product';

const PerfumeAdminDashboard = ({ products, brands }: { products: IProduct[], brands: IBrand[] }) => {

    const [viewMode, setViewMode] = useState('table');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedTier, setSelectedTier] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [updatedProduct, setUpdatedProduct] = useState<IProduct>();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
    const [showImportDialog, setShowImportDialog] = useState(false);
    const [importMessages, setImportMessages] = useState<string[]>([]);
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data: session, status } = useSession();
    const router = useRouter();

    const tiers = TIERS_OPTIONS;

    // CSV Export function
    const handleExportCSV = async () => {
        if (!session?.accessToken) {
            toast.error('Vui lòng đăng nhập để xuất CSV');
            return;
        }

        setIsExporting(true);
        try {
            const blob = await productApi.exportProductsCSV(session.accessToken);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('Xuất CSV thành công!');
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Lỗi khi xuất CSV');
        } finally {
            setIsExporting(false);
        }
    };

    // Download CSV Template
    const handleDownloadTemplate = async () => {
        if (!session?.accessToken) {
            toast.error('Vui lòng đăng nhập để tải template');
            return;
        }

        try {
            const blob = await productApi.downloadCSVTemplate(session.accessToken);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'products_template.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('Tải template thành công!');
        } catch (error) {
            console.error('Download template error:', error);
            toast.error('Lỗi khi tải template');
        }
    };

    // CSV Import function
    const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!session?.accessToken) {
            toast.error('Vui lòng đăng nhập để nhập CSV');
            return;
        }

        // Validate file type
        if (!file.name.endsWith('.csv')) {
            toast.error('Vui lòng chọn file CSV');
            return;
        }

        setIsImporting(true);
        try {
            const result = await productApi.importProductsCSV(file, session.accessToken);
            
            if (result.error) {
                toast.error(result.message || 'Lỗi khi nhập CSV');
                return;
            }

            // Show import results
            setImportMessages(result.data?.messages || []);
            setShowImportDialog(true);
            
            // Refresh products list
            router.refresh();
            
            const successCount = result.data?.messages?.filter(m => m.includes('successfully')).length || 0;
            const errorCount = result.data?.messages?.filter(m => m.includes('ERROR')).length || 0;
            
            if (errorCount === 0) {
                toast.success(`Import thành công ${successCount} sản phẩm!`);
            } else {
                toast.success(`Import xong: ${successCount} thành công, ${errorCount} lỗi`);
            }
        } catch (error) {
            console.error('Import error:', error);
            toast.error('Lỗi khi nhập CSV');
        } finally {
            setIsImporting(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brand?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBrand = !selectedBrand || product.brand?.id === selectedBrand || selectedBrand === '0';
        const matchesTier = !selectedTier || product.tier === selectedTier || selectedTier === 'all';
        return matchesSearch && matchesBrand && matchesTier;
    });

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // Số sản phẩm mỗi trang
    const totalPages = Math.ceil(filteredProducts.length / pageSize);

    const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleDeleteProduct = (id: number) => {
        setDeleteProductId(id);
        setShowDeleteDialog(true);
    };

    const confirmDeleteProduct = async () => {
        if (deleteProductId != null) {

            // call api to save the product
            const res = await sendRequest<IBackendRes<IProduct>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/products/${deleteProductId}`,
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`
                },
            });
            setShowDeleteDialog(false);
            setDeleteProductId(null);
            if (res.error) {
                toast.error("Lỗi khi xóa sản phẩm");
                return;
            } else {
                toast.success("Xóa sản phẩm thành công");
                // refresh list data
                router.refresh()
            }
        }
    };

    const cancelDeleteProduct = () => {
        setShowDeleteDialog(false);
        setDeleteProductId(null);
    };

    const handleEditProduct = (product: IProduct) => {
        setUpdatedProduct(product);
        setShowEditModal(true);
    };

    // Tạo danh sách các row với từng variant
    const getExpandedRows = (productsList = filteredProducts) => {
        const expandedRows: Array<{
            product: IProduct;
            variant: IPerfumeVariant;
            isFirstRow: boolean;
            rowSpan: number;
        }> = [];

        productsList.forEach(product => {
            const variants = product.perfumeVariants || [];

            if (variants.length === 0) {
                // Nếu không có variant nào, vẫn hiển thị product
                expandedRows.push({
                    product,
                    variant: {} as IPerfumeVariant,
                    isFirstRow: true,
                    rowSpan: 1
                });
            } else {
                // Nếu có variants, tạo một row cho mỗi variant
                variants.forEach((variant, index) => {
                    expandedRows.push({
                        product,
                        variant,
                        isFirstRow: index === 0,
                        rowSpan: variants.length
                    });
                });
            }
        });

        return expandedRows;
    };


    const getTierBadgeVariant = (tier: string) => {
        switch (tier.toUpperCase()) {
            case 'LUXURY': return 'destructive';
            case 'PREMIUM': return 'default';
            case 'MID-RANGE': return 'secondary';
            case 'BUDGET': return 'outline';
            default: return 'default';
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const expandedRows = getExpandedRows(paginatedProducts);

    return (
        <div className="min-h-screen">
            {/* Main Content */}
            <div>
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
                            {/* Hidden file input for CSV import */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImportCSV}
                                accept=".csv"
                                className="hidden"
                            />
                            
                            {/* Export/Import Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" disabled={isExporting || isImporting}>
                                        <Download className="mr-2 h-4 w-4" />
                                        {isExporting ? 'Đang xuất...' : 'Xuất/Nhập'}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={handleExportCSV} disabled={isExporting}>
                                        <FileDown className="mr-2 h-4 w-4" />
                                        Xuất CSV (Export)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleDownloadTemplate}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Tải Template CSV
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={triggerFileInput} disabled={isImporting}>
                                        <FileUp className="mr-2 h-4 w-4" />
                                        {isImporting ? 'Đang nhập...' : 'Nhập CSV (Import)'}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

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
                                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Select value={selectedBrand} onValueChange={(e) => { setSelectedBrand(e); setCurrentPage(1); }}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Tất cả thương hiệu" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Tất cả thương hiệu</SelectItem>
                                {brands.map(brand => (
                                    <SelectItem key={brand.name} value={brand.id}>{brand.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedTier} onValueChange={(e) => { setSelectedTier(e); setCurrentPage(1); }}>
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
                                        <TableHead>Loại</TableHead>
                                        <TableHead>Dung tích</TableHead>
                                        <TableHead>Giá</TableHead>
                                        <TableHead>Tồn kho</TableHead>
                                        <TableHead className="text-right">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {expandedRows.map((row, index) => (
                                        <TableRow key={`${row.product.id}-${row.variant.id || index}`}>
                                            {row.isFirstRow && (
                                                <>
                                                    <TableCell rowSpan={row.rowSpan} className="w-[50px]">
                                                        <Checkbox />
                                                    </TableCell>
                                                    <TableCell rowSpan={row.rowSpan}>
                                                        <div className="flex items-center space-x-3">
                                                            <Image
                                                                src={`/api/image?filename=${row.product?.images?.[0]}`}
                                                                alt={row.product.name}
                                                                width={40}
                                                                height={40}
                                                                className="w-10 h-10 rounded-lg object-cover" />
                                                            <div>
                                                                <div className="font-medium flex items-center gap-2">
                                                                    {row.product.name}
                                                                    {row.product.new && (
                                                                        <Badge variant="destructive" className="text-xs">
                                                                            MỚI
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <div className="text-sm text-gray-500 line-clamp-1">
                                                                    {row.product.description
                                                                        ? row.product.description.length > 20
                                                                            ? row.product.description.slice(0, 20) + "..."
                                                                            : row.product.description
                                                                        : ""}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell rowSpan={row.rowSpan}>{row.product.brand?.name}</TableCell>
                                                    <TableCell rowSpan={row.rowSpan}>
                                                        <Badge variant={getTierBadgeVariant(row.product?.tier as string)}>
                                                            {row.product.tier?.toUpperCase()}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell rowSpan={row.rowSpan}>{row.product.sex?.toUpperCase()}</TableCell>
                                                    <TableCell rowSpan={row.rowSpan}>{row.product.fragranceTypes?.name}</TableCell>
                                                </>
                                            )}


                                            <TableCell>{row.variant.volume || '-'} ml</TableCell>
                                            <TableCell>{row.variant.price ? formatPrice(row.variant.price) : '-'}</TableCell>
                                            <TableCell>{row.variant.stockQuantity || '-'} items</TableCell>
                                            {row.isFirstRow && (
                                                <TableCell className="text-right" rowSpan={row.rowSpan}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEditProduct(row.product)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Chỉnh sửa
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeleteProduct(row.product.id)}
                                                                className="text-red-600"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Xóa
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            )}

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {paginatedProducts.map((product) => (
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
                                            <Badge variant={getTierBadgeVariant(product.tier as string)}>
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
                            Hiển thị {paginatedProducts.length} / {filteredProducts.length} sản phẩm
                        </div>
                        <div className="flex space-x-2">
                            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                                Trước
                            </Button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <Button
                                    key={i + 1}
                                    variant={currentPage === i + 1 ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                            <Button variant="outline" size="sm" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(currentPage + 1)}>
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
            {
                updatedProduct && (
                    <ProductFormDialog
                        product={updatedProduct}
                        isOpen={showEditModal}
                        onClose={() => {
                            setShowEditModal(false);
                            setUpdatedProduct(undefined);
                        }}
                        brands={brands}
                        tiers={tiers}
                    />
                )
            }

            {/* Delete Confirm Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={cancelDeleteProduct}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={cancelDeleteProduct}>Hủy</Button>
                        <Button variant="destructive" onClick={confirmDeleteProduct}>Xóa</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Import Results Dialog */}
            <Dialog open={showImportDialog} onOpenChange={() => setShowImportDialog(false)}>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>Kết quả Import CSV</DialogTitle>
                        <DialogDescription>
                            Tổng số dòng đã xử lý: {importMessages.length}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="overflow-y-auto max-h-[50vh] space-y-2 p-2">
                        {importMessages.map((message, index) => (
                            <div
                                key={index}
                                className={`p-2 rounded text-sm ${
                                    message.includes('ERROR')
                                        ? 'bg-red-50 text-red-700 border border-red-200'
                                        : 'bg-green-50 text-green-700 border border-green-200'
                                }`}
                            >
                                {message}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button onClick={() => setShowImportDialog(false)}>Đóng</Button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default PerfumeAdminDashboard;