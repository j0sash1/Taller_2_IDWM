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
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";

// ✅ Esquema de validación
const formSchema = z
  .object({
    firtsName: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
    lastName: z.string().min(3, "El apellido debe tener al menos 3 caracteres."),
    email: z.string().email("Correo inválido"),
    thelephone: z
      .string()
      .nonempty("Teléfono obligatorio")
      .regex(/^\d+$/, "Ingrese un número válido")
      .min(7, "Debe tener al menos 7 dígitos")
      .max(15, "Máximo 15 dígitos"),
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
    mode: "onChange",
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
        birthDate: values.birthDate || null,
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

      toast.success("¡Registro exitoso!");
      router.push("/login");
    } catch (error: any) {
      setServerError(error.response?.data?.message || "Error al registrar.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-200 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="bg-white w-full max-w-4xl p-6 sm:p-10 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-4 sm:mb-6">Regístrate</h1>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-6 md:grid-cols-2"
            >
              {[
                { name: "firtsName", label: "Nombre" },
                { name: "birthDate", label: "Fecha de Nacimiento", type: "date" },
                { name: "lastName", label: "Apellidos" },
                { name: "password", label: "Contraseña", type: "password" },
                { name: "thelephone", label: "Número telefónico" },
                { name: "confirmPassword", label: "Confirmar contraseña", type: "password" },
                { name: "email", label: "Correo electrónico" },
              ].map(({ name, label, type = "text" }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof z.infer<typeof formSchema>}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>{label}</FormLabel>
                        <span className="text-gray-400 text-xs sm:text-sm">obligatorio</span>
                      </div>
                      <FormControl>
                        <Input
                          type={type}
                          {...field}
                          className="rounded-md"
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <div className="col-span-full">
                {serverError && (
                  <p className="text-red-500 text-sm text-center mb-2">{serverError}</p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md disabled:opacity-50"
                  disabled={!form.formState.isValid || form.formState.isSubmitting}
                >
                  Regístrate
                </Button>
              </div>

              <div className="col-span-full text-center text-sm mt-2">
                ¿Ya estás registrado?{" "}
                <span
                  className="text-purple-600 hover:underline cursor-pointer"
                  onClick={() => router.push("/login")}
                >
                  Inicia Sesión
                </span>
              </div>

              <div className="col-span-full flex justify-center mt-4">
                <Button
                  type="button"
                  onClick={() => router.back()}
                  className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};
