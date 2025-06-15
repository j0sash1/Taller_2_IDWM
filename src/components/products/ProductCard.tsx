import { Product } from "@/interfaces/Product";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  return (
    <div
      className="bg-white shadow rounded-xl p-4 cursor-pointer hover:scale-105 transition"
      onClick={onClick}
    >
      <div className="w-full h-40 flex items-center justify-center bg-white">
        <Image
          src="/Producto.jpg"
          alt={product.name}
          width={140}
          height={140}
          className="object-contain"
        />
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600"><strong>{product.brand}</strong> {product.description}</p>
        <p className="mt-2 text-black font-bold text-lg">${product.price.toLocaleString()}</p>
      </div>
    </div>
  );
};
