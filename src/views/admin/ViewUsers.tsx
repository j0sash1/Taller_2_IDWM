"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ApiBackend } from "@/clients/axios";

interface UserDto {
  firtsName: string;
  lastName: string;
  email: string;
  thelephone: string;
  street?: string;
  number?: string;
  commune?: string;
  region?: string;
  postalCode?: string;
  birthDate?: string;
  registeredAt: string;
  lastAccess?: string;
  isActive: boolean;
}

export default function ManageUsersView() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params: any = {
        pageNumber: page,
        pageSize: 5,
        searchTerm,
      };
      if (statusFilter) params.isActive = statusFilter === "activo";

      const res = await ApiBackend.get("/user", { params });
      const paginationHeader = res.headers["pagination"]
        ? JSON.parse(res.headers["pagination"])
        : { totalPages: 1 };

      setUsers(res.data.data);
      setTotalPages(paginationHeader.totalPages);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error al cargar usuarios:", error);
      toast.error(
        error.response?.data?.message || "Error al cargar usuarios. Asegúrate de estar autenticado como admin."
      );
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchTerm, statusFilter]);

  const toggleStatus = async (email: string) => {
    const reason = prompt("Escribe el motivo del cambio de estado:");
    if (!reason) return;

    try {
      await ApiBackend.patch("/user/toggle-status", {
        email,
        reason,
      });
      toast.success("Estado actualizado exitosamente");
      fetchUsers();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error al actualizar estado:", error);
      toast.error(
        error.response?.data?.message || "Error al actualizar el estado del usuario."
      );
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 pt-24 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-4">
        <Input
          placeholder="Buscar por nombre o correo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2"
        />

        <select
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/4"
          value={statusFilter}
        >
          <option value="">Todos</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>
      </div>

      {/* Lista de usuarios */}
      <div className="space-y-4">
        {users.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No se encontraron usuarios.</p>
        )}
        {users.map((user) => (
          <div
            key={user.email}
            className="p-4 bg-gray-50 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                {user.firtsName} {user.lastName} - {user.email}
              </p>
              <p className="text-sm text-gray-600">
                Estado:{" "}
                <span className={user.isActive ? "text-green-600" : "text-red-600"}>
                  {user.isActive ? "Activo" : "Inactivo"}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => alert("Ver perfil de " + user.email)}
              >
                Ver perfil
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => toggleStatus(user.email)}
              >
                {user.isActive ? "Deshabilitar" : "Habilitar"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page <= 1}
        >
          Anterior
        </Button>
        <span>
          Página {page} de {totalPages}
        </span>
        <Button
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page >= totalPages}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
