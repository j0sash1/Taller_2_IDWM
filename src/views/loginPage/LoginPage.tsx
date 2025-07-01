"use client";

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ApiBackend } from "@/clients/axios";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { User } from "@/interfaces/User";
import { Navbar } from "@/components/Navbar";
import { decodeJWT } from "@/helpers/decodeJWT";

const formSchema = z.object({
  email: z
    .string()
    .email("Ingrese un correo electrónico válido.")
    .nonempty("Email es requerido."),
  password: z.string().nonempty("Contraseña es requerida."),
});

export const LoginPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [errors, setErrors] = useState<string | null>(null);
  const [errorBool, setErrorBool] = useState<boolean>(false);
  const { auth } = useContext(AuthContext);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data } = await ApiBackend.post("Auth/login", values);
      if (data.success === false) {
        setErrors(data.message || "Error en la respuesta del servidor");
        setErrorBool(true);
        return;
      }
      setErrors(null);
      setErrorBool(false);

      const data_ = data.data;
      const payload = decodeJWT(data_.token);
      if (!payload) {
        console.error("Error al decodificar el token:", data_.token);
        setErrors('Error al decodificar el token.');
        setErrorBool(true);
        return;
      }
      const user_: User = {
        email: data_.email,
        lastName: data_.lastName,
        firtsName: data_.firtsName,
        token: data_.token,
        role: payload.role,
      };

      localStorage.setItem('token', data_.token);
      auth(user_);
      
      if(payload.role === 'Admin') {
        router.push('/admin');
      } else if(payload.role === 'User') {
        router.push("/client");
      }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorCatch = error.response?.data?.message || "Error desconocido";
      setErrors(errorCatch);
      setErrorBool(true);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-200 flex items-center justify-center px-4 py-8">
        <div className="bg-white w-full max-w-md md:max-w-lg lg:max-w-md p-6 sm:p-8 rounded-lg shadow-md transition-all duration-300">
          <h1 className="text-xl sm:text-2xl font-bold text-center mb-1">
            Ingresar a mi cuenta
          </h1>
          <p className="text-xs sm:text-sm text-center text-gray-500 mb-6">
            Ingresa sesión con tu correo y contraseña
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="correo@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorBool && errors && (
                <p className="text-red-500 text-sm">{errors}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md"
              >
                Iniciar Sesión
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            ¿Nuevo cliente?{" "}
            <span
              className="text-purple-600 hover:underline cursor-pointer"
              onClick={() => router.push("/register")}
            >
              Crea una Cuenta
            </span>
          </div>

          <div className="mt-2 text-center text-sm">
            ¿Olvidaste tu contraseña?{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Haz clic aquí
            </a>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              type="button"
              onClick={() => router.back()}
              className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
