import { Role } from "../models/Role";
import { API_URL } from "../lib/apiRoute";

const nombreApi = "roles";
const mensajeModulo = "Rol";

export const roleService = {
  getAllRoles: async (): Promise<Role[]> => {
    try {
      const response = await fetch(`${API_URL}/${nombreApi}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: await response.text() };
        }
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("Error loading roles");
    }
  },
  getRoleById: async (id: number): Promise<Role> => {
    const response = await fetch(`${API_URL}/${nombreApi}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) throw new Error(`Error al obtener el ${mensajeModulo}`);
    return response.json();
  },

  createRole: async (role: {
    nombre: string;
    permisos: string;
  }): Promise<any> => {
    const response = await fetch(`${API_URL}/${nombreApi}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(role),
    });
    if (!response.ok) throw new Error(`Error al guardar ${mensajeModulo}`);
    return response.json();
  },

  updateRole: async (
    id: number,
    role: { nombre: string; permisos: string }
  ): Promise<any> => {
    const response = await fetch(`${API_URL}/${nombreApi}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(role),
    });
    if (!response.ok) throw new Error("`Error al actualizar el ${mensajeModulo}`");
    return response.json();
  },

  deleteRole: async (id: number): Promise<any> => {
    const response = await fetch(`${API_URL}/${nombreApi}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) throw new Error("`Error al eliminar el ${mensajeModulo}`");
    return response.json();
  },
};
