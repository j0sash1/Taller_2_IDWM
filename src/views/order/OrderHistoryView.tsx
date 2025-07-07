"use client";

import { useEffect, useState } from "react";
import { ApiBackend } from "@/clients/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface OrderSummaryDto {
  id: number;
  createdAt: string;
  total: number;
}

export function OrderHistoryView() {
  const [orders, setOrders] = useState<OrderSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await ApiBackend.get("/order");
        setOrders(res.data.data);
      } catch (err) {
        console.error("Error al obtener pedidos:", err);
        toast.error("No se pudo cargar el historial de pedidos");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Cargando historial de pedidos...</p>;
  }

  if (orders.length === 0) {
    return <p className="text-center mt-10">No tienes pedidos registrados aún.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Historial de Pedidos</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border p-4 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
          >
            <div>
              <p className="font-semibold">Pedido #{order.id}</p>
              <p className="text-gray-600 text-sm">
                Fecha: {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="text-sm font-bold mt-1">Total: ${order.total.toLocaleString()}</p>
            </div>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => router.push(`/orders/${order.id}`)}
            >
              Ver Detalles
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
