import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const AdminBrandsPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
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
                            <h2 className="text-2xl font-semibold text-gray-900">Quản lý lượt xem</h2>
                        </div>

                    </div>
                </header>
            </div>
        </div>
    );
}

export default AdminBrandsPage;
