'use client';

import { Product } from "@/interfaces/Product";
import { useProductStore } from "@/stores/ProductStore"
import { useEffect, useState } from "react";
import { ProductCard } from '../../components/products/ProductCard';
import { ProductDialog } from "@/components/products/ProductDialog";
import { Navbar } from '../../components/Navbar';


export default function ViewProductPage() {
    const {products, loading, fetchProducts, filters} = useProductStore();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        fetchProducts();
    }, [filters]);
    
    if (loading) {
        return <div className="text-center py-20 text-lg font-semibold">Cargando Productos</div>
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <Navbar/>
            {/* Banner */}
            <div className="relative h-64 md:h-96">
                <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('/tienda.jpg"}}/>
                <div className="absolute inset-0 bg-black opacity-60"/>
                <div className="relative z-10 flex flex-col justify-center items-center h-full text-white text-center">
                    <h1 className="text-4xl md:text-6xl font-bold">Bienvenido a nuestra Tienda</h1>
                    <p className="mt-4 text-lg md:text-xl">Explora nuestros productos y ofertas especiales</p>
                </div>
            </div>
            <div className="max-w-7xl mx-auto py-12 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onClick={() => setSelectedProduct(product)}
                    />
                ))}          
            </div>

            {/* ProductDialog con Producto Seleccionado */}
            <ProductDialog
                product ={selectedProduct}
                open={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    )
}