'use client';

import { Product } from "@/interfaces/Product";
import { useProductStore } from "@/stores/ProductStore";
import { useEffect, useState } from "react";
import { ProductCard } from '../../components/products/ProductCard';
import { ProductDialog } from "@/components/products/ProductDialog";
import { Navbar } from '../../components/Navbar';

export default function ViewProductPage() {
    const { products, loading, fetchProducts, filters } = useProductStore();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Estado local de paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // puedes ajustar según prefieras

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const visibleProducts = products.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    if (loading) {
        return <div className="text-center py-20 text-lg font-semibold">Cargando Productos</div>;
    }

    return (
        <div className="min-h-screen bg-[#d9d9d9] flex flex-col">
            {/* Navbar */}
            <Navbar />

            {/* Barra de filtros */}
            <div className="w-full px-6 py-4 bg-white shadow">
                <div className="flex flex-wrap gap-6 justify-around text-sm text-gray-800 font-medium">
                    <div className="space-y-1">
                        <div className="text-gray-500">Categorías ▼</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-gray-500">Rango de Precios ▼</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-gray-500">Marca ▼</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-gray-500">Estado del Producto ▼</div>
                    </div>
                    <div className="space-y-1 flex items-center gap-4">
                        <label className="text-gray-600">Precio</label>
                        <input type="checkbox" className="mr-1" /> Ascendente
                        <input type="checkbox" className="ml-4 mr-1" /> Descendente
                    </div>
                    <div className="space-y-1 flex items-center gap-4">
                        <label className="text-gray-600">Orden Alfabético</label>
                        <input type="checkbox" className="mr-1" /> A-Z
                        <input type="checkbox" className="ml-4 mr-1" /> Z-A
                    </div>
                </div>
            </div>

            {/* Productos */}
            <div className="max-w-7xl mx-auto py-12 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {visibleProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onClick={() => setSelectedProduct(product)}
                    />
                ))}
            </div>

            {/* Paginación */}
            <div className="flex justify-center items-center gap-2 pb-10">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="px-3 py-1 rounded-md bg-gray-400 text-white disabled:opacity-50"
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-md ${
                            page === currentPage
                                ? "bg-purple-600 text-white"
                                : "bg-gray-400 text-white"
                        }`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="px-3 py-1 rounded-md bg-purple-600 text-white disabled:opacity-50"
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>

            {/* ProductDialog */}
            <ProductDialog
                product={selectedProduct}
                open={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
}
