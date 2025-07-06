"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { ApiBackend } from "@/clients/axios";

interface User {
  firtsName: string;
  lastName: string;
  email: string;
  thelephone: string;
  birthDate: string | null;
  street: string;
  number: string;
  commune: string;
  region: string;
  postalCode: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfileView() {
  const [user, setUser] = useState<User | null>(null);
  const [originalUser, setOriginalUser] = useState<User | null>(null);
  const userRef = useRef<User | null>(null);
  const [editMode, setEditMode] = useState({
    firtsName: false,
    lastName: false,
    email: false,
    thelephone: false,
    birthDate: false,
    street: false,
    number: false,
    commune: false,
    region: false,
    postalCode: false,
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchProfile = useCallback(async () => {
    console.log("fetchProfile: Iniciando request");
    try {
      const res = await ApiBackend.get("/user/profile");
      const userData = res.data.data;
      console.log("fetchProfile: Datos recibidos", userData);
      setUser(userData);
      setOriginalUser(userData);
      userRef.current = userData;
      console.log("fetchProfile: Estados actualizados");
    } catch (err) {
      console.log("fetchProfile: Error", err);
      toast.error("Error al obtener perfil");
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Mantener ref sincronizada con el estado
  useEffect(() => {
    console.log("useEffect: Sincronizando ref con user state", user);
    if (user === null) {
      console.log("ALERTA: user state se volvió null");
      console.trace("Stack trace de cuando user se vuelve null");
    }
    userRef.current = user;
  }, [user]);

  const updateField = useCallback((field: keyof User, value: string) => {
    console.log(`updateField: Actualizando campo ${field} con valor:`, value);
    setUser((current) => {
      if (!current) {
        console.log("updateField: current es null, retornando null");
        return null;
      }
      const updated = { ...current, [field]: value };
      console.log("updateField: Usuario actualizado:", updated);
      console.log(`updateField: Valor específico de ${field}:`, updated[field]);
      userRef.current = updated;
      console.log("updateField: Ref actualizada:", userRef.current);
      return updated;
    });
  }, []);

  const toggleEdit = useCallback((field: keyof typeof editMode) => {
    console.log(`toggleEdit: Toggling field ${field}`);
    setEditMode((prev) => {
      const newEditMode = { ...prev, [field]: !prev[field] };
      console.log("toggleEdit: Nuevo editMode:", newEditMode);
      return newEditMode;
    });
  }, []);

  const handleSaveProfile = useCallback(async () => {
    console.log("handleSaveProfile: Iniciando guardado");
    console.log("handleSaveProfile: user state actual:", user);
    console.log("handleSaveProfile: userRef.current:", userRef.current);

    // Usar ref para obtener el valor más reciente
    const currentUser = userRef.current;
    if (!currentUser) {
      console.log("handleSaveProfile: currentUser es null, abortando");
      console.log("handleSaveProfile: user state:", user);
      console.log("handleSaveProfile: userRef.current:", userRef.current);
      toast.error("Error: No hay datos de usuario disponibles");
      return;
    }

    console.log(
      "handleSaveProfile: currentUser antes de payload:",
      currentUser
    );
    console.log(
      "handleSaveProfile: currentUser.street específicamente:",
      currentUser.street
    );

    // Verificación adicional del campo street
    if (!currentUser.street) {
      console.log("handleSaveProfile: ALERTA - street está vacío o undefined");
    }

    setLoadingProfile(true);
    try {
      const payload = {
        firtsName: currentUser.firtsName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        thelephone: currentUser.thelephone,
        birthDate: currentUser.birthDate,
        street: currentUser.street,
        number: currentUser.number,
        commune: currentUser.commune,
        region: currentUser.region,
        postalCode: currentUser.postalCode,
      };

      console.log("handleSaveProfile: Payload completo a enviar:", payload);
      console.log(
        "handleSaveProfile: payload.street específicamente:",
        payload.street
      );
      console.log(
        "handleSaveProfile: JSON.stringify del payload:",
        JSON.stringify(payload)
      );

      console.log("handleSaveProfile: INICIANDO APIBACKEND.PATCH");
      const response = await ApiBackend.patch("/user/profile", payload);
      console.log("handleSaveProfile: RESPONSE RECIBIDA:", response);
      console.log("handleSaveProfile: Request exitoso");
      toast.success("Perfil actualizado correctamente");

      // Actualizar el estado original con los nuevos datos
      setOriginalUser(currentUser);
      console.log("handleSaveProfile: originalUser actualizado");

      // Resetear modo edición
      setEditMode({
        firtsName: false,
        lastName: false,
        email: false,
        thelephone: false,
        birthDate: false,
        street: false,
        number: false,
        commune: false,
        region: false,
        postalCode: false,
      });
      console.log("handleSaveProfile: editMode reseteado");
    } catch (err) {
      console.log("handleSaveProfile: Error en request:", err);
      toast.error("Error al actualizar perfil");
      // En caso de error, revertir al estado original
      if (originalUser) {
        console.log(
          "handleSaveProfile: Revirtiendo a originalUser:",
          originalUser
        );
        setUser(originalUser);
        userRef.current = originalUser;
      }
    } finally {
      setLoadingProfile(false);
      console.log("handleSaveProfile: Loading terminado");
    }
  }, [originalUser]); // Agregué originalUser como dependencia // Sin dependencias porque usa ref

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Completa todos los campos");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoadingPassword(true);
    try {
      const res = await ApiBackend.patch(
        "/user/profile/password",
        passwordForm
      );
      toast.success(res.data.message || "Contraseña actualizada");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const response = err.response;
      if (response?.data?.errors) {
        response.data.errors.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(response?.data?.message || "Error al cambiar contraseña");
      }
    } finally {
      setLoadingPassword(false);
    }
  };

  if (!user) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow mt-10 overflow-y-auto max-h-screen">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Perfil de Usuario
      </h1>

      <div className="flex justify-center mb-6">
        <div className="bg-gray-200 p-4 rounded-full">
          <span className="text-4xl">👤</span>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-4">Información Personal</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <div className="relative">
            <Input
              type="text"
              value={user.firtsName ?? ""}
              disabled={!editMode.firtsName}
              onChange={(e) => updateField("firtsName", e.target.value)}
            />
            <button
              type="button"
              onClick={() => toggleEdit("firtsName")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            >
              <Pencil size={16} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Apellidos</label>
          <div className="relative">
            <Input
              type="text"
              value={user.lastName ?? ""}
              disabled={!editMode.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
            />
            <button
              type="button"
              onClick={() => toggleEdit("lastName")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            >
              <Pencil size={16} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Número telefónico
          </label>
          <div className="relative">
            <Input
              type="text"
              value={user.thelephone ?? ""}
              disabled={!editMode.thelephone}
              onChange={(e) => updateField("thelephone", e.target.value)}
            />
            <button
              type="button"
              onClick={() => toggleEdit("thelephone")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            >
              <Pencil size={16} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Fecha de Nacimiento
          </label>
          <div className="relative">
            <Input
              type="date"
              value={user.birthDate ?? ""}
              disabled={!editMode.birthDate}
              onChange={(e) => updateField("birthDate", e.target.value)}
            />
            <button
              type="button"
              onClick={() => toggleEdit("birthDate")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            >
              <Pencil size={16} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Correo electrónico
          </label>
          <div className="relative">
            <Input
              type="email"
              value={user.email ?? ""}
              disabled={!editMode.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
            <button
              type="button"
              onClick={() => toggleEdit("email")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            >
              <Pencil size={16} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Calle</label>
          <div className="relative">
            <Input
              type="text"
              value={user.street ?? ""}
              disabled={!editMode.street}
              onChange={(e) => updateField("street", e.target.value)}
            />
            <button
              type="button"
              onClick={() => toggleEdit("street")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            >
              <Pencil size={16} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Número</label>
          <div className="relative">
            <Input
              type="text"
              value={user.number ?? ""}
              disabled={!editMode.number}
              onChange={(e) => updateField("number", e.target.value)}
            />
            <button
              type="button"
              onClick={() => toggleEdit("number")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            >
              <Pencil size={16} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Comuna</label>
          <div className="relative">
            <Input
              type="text"
              value={user.commune ?? ""}
              disabled={!editMode.commune}
              onChange={(e) => updateField("commune", e.target.value)}
            />
            <button
              type="button"
              onClick={() => toggleEdit("commune")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            >
              <Pencil size={16} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Región</label>
          <div className="relative">
            <Input
              type="text"
              value={user.region ?? ""}
              disabled={!editMode.region}
              onChange={(e) => updateField("region", e.target.value)}
            />
            <button
              type="button"
              onClick={() => toggleEdit("region")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            >
              <Pencil size={16} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Código Postal
          </label>
          <div className="relative">
            <Input
              type="text"
              value={user.postalCode ?? ""}
              disabled={!editMode.postalCode}
              onChange={(e) => updateField("postalCode", e.target.value)}
            />
            <button
              type="button"
              onClick={() => toggleEdit("postalCode")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            >
              <Pencil size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Button onClick={handleSaveProfile} disabled={loadingProfile}>
          {loadingProfile ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>

      <hr className="my-10" />
      <h2 className="text-lg font-bold mb-4">Gestionar Contraseña</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">
            Contraseña Actual
          </label>
          <Input
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm((p) => ({
                ...p,
                currentPassword: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Nueva Contraseña
          </label>
          <Input
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Confirmar Nueva Contraseña
          </label>
          <Input
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm((p) => ({
                ...p,
                confirmPassword: e.target.value,
              }))
            }
          />
        </div>

        <div className="sm:row-span-2">
          <Button
            onClick={handleChangePassword}
            disabled={loadingPassword}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {loadingPassword
              ? "Guardando..."
              : "Confirmar Cambio de Contraseña"}
          </Button>
        </div>
      </div>
    </div>
  );
}
