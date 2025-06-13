"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiBackend } from "@/clients/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";

// Esquema de validación basado en el RegisterDto del backend
const formSchema = z
  .object({
    firtsName: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
    lastName: z.string().min(3, "El apellido debe tener al menos 3 caracteres."),
    email: z.string().email("Correo inválido"),
    thelephone: z.string().nonempty("Teléfono obligatorio"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`]).+$/,
        "Debe contener mayúsculas, minúsculas, número y símbolo"
      ),
    confirmPassword: z.string(),
    birthDate: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export const RegisterPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firtsName: "",
      lastName: "",
      email: "",
      thelephone: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
    },
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        ...values,
        birthDate: values.birthDate ? values.birthDate : null,
        street: null,
        number: null,
        commune: null,
        region: null,
        postalCode: null,
      };

      const { data } = await ApiBackend.post("Auth/register", payload);

      if (data.success === false) {
        setServerError(data.message || "Error al registrar.");
        return;
      }

      // Registro exitoso → redirigir
      router.push("/login");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setServerError(error.response?.data?.message || "Error al registrar.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="md:w-1/2 w-full bg-blue-700 text-white flex flex-col justify-center items-center p-10">
        <h1 className="text-3xl font-bold mb-4 text-center">¡Regístrate!</h1>
        <p className="text-base text-center max-w-md">
          Únete a la comunidad de WebMóvil. Es gratis y rápido.
        </p>
        <Button
          variant="outline"
          className="mt-6 text-blue-700 bg-white"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon /> Volver
        </Button>
      </div>

      <div className="md:w-1/2 w-full flex items-center justify-center bg-white px-6 py-10">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Crear cuenta</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {[
                { name: "firtsName", label: "Nombre" },
                { name: "lastName", label: "Apellido" },
                { name: "email", label: "Correo electrónico" },
                { name: "thelephone", label: "Teléfono" },
                { name: "birthDate", label: "Fecha de nacimiento (opcional)", type: "date" },
                { name: "password", label: "Contraseña", type: "password" },
                { name: "confirmPassword", label: "Confirmar contraseña", type: "password" },
              ].map(({ name, label, type = "text" }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof z.infer<typeof formSchema>}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input type={type} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              {serverError && (
                <p className="text-red-500 text-sm text-center">{serverError}</p>
              )}

              <Button type="submit" className="w-full">
                Registrarse
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
