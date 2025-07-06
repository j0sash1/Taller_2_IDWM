import { Product } from "@/interfaces/Product";
import Image from "next/image";

interface ProductCardAdminProps {
  product: Product;
}

export const ProductCardAdmin = ({ product }: ProductCardAdminProps) => {
  return (
    <div className="relative bg-white shadow-lg rounded-xl p-6 flex gap-6 hover:shadow-xl transition-all">
      {/* Botones de editar/eliminar */}
      <div className="absolute top-4 right-4 flex gap-3 text-sm font-medium">
        <span className="cursor-pointer text-gray-500 hover:text-blue-600 transition">
          Editar
        </span>
        <span className="cursor-pointer text-gray-500 hover:text-red-600 transition">
          Eliminar
        </span>
      </div>

      {/* Imagen */}
      <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg">
        <Image
          src="/Producto.jpg"
          alt={product.name}
          width={180}
          height={180}
          className="object-contain"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-semibold">{product.name}</h3>
          <p className="text-gray-600 mt-1">Marca: {product.brand}</p>
          <p className="text-gray-600">Categoría: {product.category}</p>
        </div>

        <div className="mt-4 text-xl font-bold text-blue-700">
          ${product.price}
        </div>
      </div>
    </div>
  );
};
