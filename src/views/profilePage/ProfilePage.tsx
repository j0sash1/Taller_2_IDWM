"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { ApiBackend } from "@/clients/axios";

interface UserDto {
  firtsName: string;
  lastName: string;
  email: string;
  thelephone: string;
  birthDate: string | null;
}

interface UpdateProfileDto {
  firtsName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
}

interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfileView() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [editMode, setEditMode] = useState<Record<keyof UpdateProfileDto, boolean>>({
    firtsName: false,
    lastName: false,
    email: false,
    phone: false,
    birthDate: false,
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState<ChangePasswordDto>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchProfile = async () => {
    try {
      const res = await ApiBackend.get("/user/profile");
      setUser(res.data.data);
    } catch (err) {
        console.log("Error al obtener perfil:",err)
      toast.error("Error al obtener perfil:");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileChange = (field: keyof UpdateProfileDto, value: string) => {
    if (!user) return;
    setUser({ ...user, [field]: value });
  };

  const toggleEdit = (field: keyof UpdateProfileDto) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    const payload: UpdateProfileDto = {
      firtsName: user.firtsName,
      lastName: user.lastName,
      email: user.email,
      phone: user.thelephone,
      birthDate: user.birthDate ?? undefined,
    };

    setLoadingProfile(true);
    try {
      const response = await ApiBackend.patch("/user/profile", payload);
      console.log("Editar perfil:",response)
      toast.success("Perfil actualizado correctamente");
      setEditMode({
        firtsName: false,
        lastName: false,
        email: false,
        phone: false,
        birthDate: false,
      });
      await fetchProfile();
    } catch (err) {
        console.log("Error al actualizar perfil:",err)
      toast.error("Error al actualizar perfil");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Completa todos los campos de contraseña");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoadingPassword(true);
    try {
      await ApiBackend.patch("/user/profile/password", passwordForm);
      toast.success("Contraseña actualizada correctamente");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const msg = error.response?.data?.message || "Error al cambiar contraseña";
      toast.error(msg);
    } finally {
      setLoadingPassword(false);
    }
  };

  if (!user) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow mt-10 overflow-y-auto max-h-screen">
      <h1 className="text-2xl font-semibold text-center mb-6">Perfil de Usuario</h1>
      <div className="flex justify-center mb-6">
        <div className="bg-gray-200 p-4 rounded-full">
          <span className="text-4xl">👤</span>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-4">Información Personal</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Nombre", key: "firtsName" },
          { label: "Apellidos", key: "lastName" },
          { label: "Número telefónico", key: "phone" },
          { label: "Fecha de Nacimiento", key: "birthDate", type: "date" },
          { label: "Correo electrónico", key: "email", type: "email" },
        ].map(({ label, key, type }) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div className="relative">
              <Input
                type={type || "text"}
                value={user[key as keyof UserDto] ?? ""}
                disabled={!editMode[key as keyof UpdateProfileDto]}
                onChange={(e) => handleProfileChange(key as keyof UpdateProfileDto, e.target.value)}
              />
              <button
                type="button"
                onClick={() => toggleEdit(key as keyof UpdateProfileDto)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                <Pencil size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button onClick={handleSaveProfile} disabled={loadingProfile}>
          {loadingProfile ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>

      <hr className="my-10" />

      <h2 className="text-lg font-bold mb-4">Gestionar contraseña</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Contraseña Actual</label>
          <Input
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))
            }
          />
        </div>

        <div className="row-span-2 sm:row-span-1">
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handleChangePassword}
            disabled={loadingPassword}
          >
            {loadingPassword ? "Guardando..." : "Confirmar Cambio de Contraseña"}
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nueva Contraseña</label>
          <Input
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button className="bg-purple-600 hover:bg-purple-700 w-full text-white">
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
