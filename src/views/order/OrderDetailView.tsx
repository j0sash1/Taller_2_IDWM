"use client";

import { useEffect, useState } from "react";
import { ApiBackend } from "@/clients/axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface OrderItemDto {
  productId: number;
  name: string;
  imageUrl: string;
  quantity: number;
  price: number;
}

interface AddressDto {
  street: string;
  number: string;
  commune: string;
  region: string;
  postalCode: string;
}

interface OrderDto {
  id: number;
  createdAt: string;
  total: number;
  address: AddressDto;
  items: OrderItemDto[];
}

export function OrderDetailView() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await ApiBackend.get(`/order/${id}`);
        setOrder(res.data.data);
      } catch (err) {
        console.error("Error al cargar pedido:", err);
        toast.error("No se pudo cargar el pedido.");
        router.push("/orders"); // Redirige al historial si falla
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id, router]);

  if (loading) {
    return <p className="text-center mt-10">Cargando detalles del pedido...</p>;
  }

  if (!order) {
    return <p className="text-center mt-10">Pedido no encontrado.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Detalle del Pedido #{order.id}</h1>

      <div className="mb-6 space-y-1 text-sm text-gray-700">
        <p><span className="font-semibold">Fecha:</span> {new Date(order.createdAt).toLocaleString()}</p>
        <p><span className="font-semibold">Total:</span> ${order.total.toLocaleString()}</p>
        <p><span className="font-semibold">Dirección:</span> {order.address.street} {order.address.number}, {order.address.commune}, {order.address.region}, Código Postal: {order.address.postalCode}</p>
      </div>

      <h2 className="text-xl font-bold mb-4">Productos del Pedido</h2>
      <div className="space-y-4">
        {order.items.map((item) => (
          <div key={item.productId} className="flex gap-4 items-center border p-4 rounded">
            <Image
              src={item.imageUrl || "/Producto.jpg"}
              alt={item.name}
              width={80}
              height={80}
              className="object-contain rounded border"
            />
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm">Cantidad: {item.quantity}</p>
              <p className="text-sm">Precio unitario: ${item.price.toLocaleString()}</p>
              <p className="text-sm font-bold">Subtotal: ${(item.quantity * item.price).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Button onClick={() => router.push("/orders")} className="bg-purple-600 hover:bg-purple-700 text-white">
          Volver al Historial
        </Button>
      </div>
    </div>
  );
}
