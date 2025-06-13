import { Product } from "@/interfaces/Product";
import Image from "next/image";
import { Button } from "../ui/button";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition"
      onClick={onClick}
    >
      <div className="relative w-full h-48 bg-gray-200 flex items-center justiy-center">
        <Image
          src="/Producto.jpg"
          alt={product.name}
          width={200}
          height={200}
          className="object-contain"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="mt-2 text-blue-700 font-bold text-xl">${product.price}</p>
        <Button className="mt-4 w-full">Agregar al Carrito</Button>
      </div>
    </div>
  );
};
