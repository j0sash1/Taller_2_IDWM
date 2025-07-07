import { useAuth } from "@/hooks/useAuth";
import { Product } from "@/interfaces/Product";
import Image from "next/image";
import { Button } from "../ui/button";
import { LoginDialog } from './LoginDialog';
import { useState } from "react";
import { useCartStore } from "@/stores/CartStore";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { addToCart } = useCartStore()

  const {user} = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setShowDialog(true);
      return;
    }
    addToCart(product.id, 1);
    alert(`Producto ${product.name} agregado al carrito.`);
  }


  return (
    <>
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
        <div className="p-4">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="mt-2 text-blue-700 font-bold text-xl">${product.price}</p>
          <Button className="mt-4 w-full" onClick={handleAddToCart}>Agregar al Carrito</Button>
        </div>
      </div>

      <LoginDialog open={showDialog} onClose={()=>setShowDialog(false)}/>
    </>
  );
};
