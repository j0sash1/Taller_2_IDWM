"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ApiBackend } from "@/clients/axios";
import { useCartStore } from "@/stores/CartStore";

interface ShippingAddressDto {
  street: string;
  number: string;
  commune: string;
  region: string;
  postalCode: string;
}

export function CheckoutView() {
  const router = useRouter();
  const { createOrder } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<ShippingAddressDto>({
    street: "",
    number: "",
    commune: "",
    region: "",
    postalCode: "",
  });

  const isFormValid = () => {
    const { street, number, commune, region, postalCode } = address;
    return (
      street.trim() !== "" &&
      number.trim() !== "" &&
      commune.trim() !== "" &&
      region.trim() !== "" &&
      /^\d{7}$/.test(postalCode)
    );
  };

  const handleConfirmOrder = async () => {
    setLoading(true);

    try {
      await ApiBackend.put("/user/address", address);
      await createOrder();
      toast.success("Pedido creado exitosamente 🎉");
      router.push("/success");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error al crear el pedido:", error);
      const msg =
        error.response?.data?.message ??
        "Hubo un error al procesar el pedido. Intenta nuevamente.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 p-8 bg-white rounded-lg shadow mt-10">
      {/* Sección del proceso de compra */}
      <div className="flex-shrink-0 flex flex-col items-center md:items-start">
        <h2 className="text-lg font-bold mb-6 text-center md:text-left">
          Proceso de compra
        </h2>
        <div className="flex items-center space-x-4">
          {/* Paso 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-400 text-gray-700">
              1
            </div>
            <span className="text-xs mt-1">Revisión del Carrito</span>
          </div>

          <div className="w-4 h-0.5 bg-gray-300" />

          {/* Paso 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-purple-600 text-purple-600">
              2
            </div>
            <span className="text-xs mt-1">Confirmar dirección</span>
          </div>

          <div className="w-4 h-0.5 bg-gray-300" />

          {/* Paso 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-400 text-gray-700">
              3
            </div>
            <span className="text-xs mt-1">Confirmar compra</span>
          </div>
        </div>
      </div>

      {/* Sección del formulario */}
      <div className="flex-grow">
        <h1 className="text-2xl font-bold text-center mb-6">
          Dirección de Envío
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Calle</label>
            <Input
              value={address.street}
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, street: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Número</label>
            <Input
              value={address.number}
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, number: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Comuna</label>
            <Input
              value={address.commune}
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, commune: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Región</label>
            <Input
              value={address.region}
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, region: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Código Postal
            </label>
            <Input
              placeholder="7 dígitos (ej: 0000000)"
              value={address.postalCode}
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, postalCode: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white w-full"
            onClick={handleConfirmOrder}
            disabled={loading || !isFormValid()}
          >
            {loading ? "Procesando pedido..." : "Confirmar Pedido"}
          </Button>
        </div>
      </div>
    </div>
  );
}
