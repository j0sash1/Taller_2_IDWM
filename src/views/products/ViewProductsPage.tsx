'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProductStore } from "@/stores/ProductStore";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { Product } from "@/interfaces/Product";
import { ProductDialog } from "@/components/products/ProductDialog";

export default function ViewProductPage() {
    const { products, fetchProducts, loading, filters, setFilters } = useProductStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Estado local de paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const visibleProducts = products.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const handleSearch = () => {
        setFilters({ search: searchTerm, pageNumber: 1, pageSize: 8 });
    };

    const handleSort = (orderBy: "price" | "priceDesc") => {
        setFilters({ ...filters, orderBy, pageNumber: 1 });
    };

    const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const category = e.target.value;
        setFilters({ ...filters, categories: category, pageNumber: 1 });
    };

    const handleBrandFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const brand = e.target.value;
        setFilters({ ...filters, brands: brand, pageNumber: 1 });
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    return (
        <div className="min-h-screen bg-[#d9d9d9] px-4 py-6 mt-20">
            {/* Filtros */}
            <div className="flex flex-wrap gap-4 mb-6 justify-center">
                <Input
                    type="text"
                    placeholder="Buscar producto"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-1/3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded"
                />
                <Button onClick={handleSearch} className="bg-blue-500 text-white hover:bg-blue-600">
                    Buscar
                </Button>

                <select
                    onChange={handleBrandFilter}
                    className="bg-white text-gray-900 border border-gray-300 p-2 rounded w-full sm:w-auto"
                    defaultValue={""}
                >
                    <option value="">Todas las marcas</option>
                    <option value="HomePlus">HomePlus</option>
                    <option value="Otros">Otro ejemplo X</option>
                </select>

                <select
                    onChange={handleCategoryFilter}
                    className="bg-white text-gray-900 border border-gray-300 p-2 rounded w-full sm:w-auto"
                    defaultValue={""}
                >
                    <option value="">Todas las categorías</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Otros">Otro ejemplo X</option>
                </select>

                <Button
                    onClick={() => handleSort("price")}
                    className="bg-green-500 text-white hover:bg-green-600"
                >
                    Precio Ascendente
                </Button>

                <Button
                    onClick={() => handleSort("priceDesc")}
                    className="bg-green-500 text-white hover:bg-green-600"
                >
                    Precio Descendente
                </Button>
            </div>

            {/* Productos */}
            {loading ? (
                <div className="text-center py-20 text-lg font-semibold">Cargando productos...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                    {visibleProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onClick={() => setSelectedProduct(product)}
                        />
                    ))}
                </div>
            )}

            {/* Paginación */}
            <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50"
                >
                    Anterior
                </Button>
                <span className="font-medium text-gray-700">
                    Página {currentPage} de {totalPages}
                </span>
                <Button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50"
                >
                    Siguiente
                </Button>
            </div>

            {/* Modal de detalles */}
            <ProductDialog
                product={selectedProduct}
                open={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
}
