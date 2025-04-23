import { Role } from "../models/Role";

const API_URL = "http://localhost:3001/api";

export const roleService = {
  getAllRoles: async (): Promise<Role[]> => {
    try {
      const response = await fetch(`${API_URL}/roles`, {
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
    const response = await fetch(`${API_URL}/roles/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch role");
    return response.json();
  },

  createRole: async (role: {
    nombre: string;
    permisos: string;
  }): Promise<any> => {
    const response = await fetch(`${API_URL}/roles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(role),
    });
    if (!response.ok) throw new Error("Failed to create role");
    return response.json();
  },

  updateRole: async (
    id: number,
    role: { nombre: string; permisos: string }
  ): Promise<any> => {
    const response = await fetch(`${API_URL}/roles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(role),
    });
    if (!response.ok) throw new Error("Failed to update role");
    return response.json();
  },

  deleteRole: async (id: number): Promise<any> => {
    const response = await fetch(`${API_URL}/roles/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to delete role");
    return response.json();
  },
};
