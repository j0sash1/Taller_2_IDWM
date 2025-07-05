"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export function SuccessView() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow max-w-md w-full text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">¡Muchas gracias por tu compra!</h1>
        <p className="text-gray-600 mb-6">
          Tu pedido ha sido procesado correctamente. Recibirás un correo con los detalles de tu compra.
        </p>
        <Button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => router.push("/client")}
        >
          Volver al Catálogo
        </Button>
      </div>
    </div>
  );
}
