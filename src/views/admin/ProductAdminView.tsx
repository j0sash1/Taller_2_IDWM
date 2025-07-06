"use client";

import { useEffect } from "react";
import { useProductStore } from "@/stores/ProductStore";
import { ProductCardAdmin } from "@/components/products/ProductCardAdmin";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProductAdminView() {
  const { products, fetchProducts, filters } = useProductStore();
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-24">
      {/* Encabezado con botón */}
      <div className="flex justify-between items-center max-w-4xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Productos del Sistema</h1>
        <Button
          className="bg-purple-600 text-white hover:bg-purple-700"
          onClick={() => router.push("/admin/users")}
        >
          Administrar Usuarios
        </Button>
      </div>

      {/* Lista de productos */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {products.map((product) => (
          <ProductCardAdmin key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
