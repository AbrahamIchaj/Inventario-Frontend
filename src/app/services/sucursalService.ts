import { Sucursal } from "../models/Sucursal";
import { API_URL } from "../lib/apiRoute";

const nombreApi = "branch";
const mensajeModulo = "Sucursal";

export const sucursalService = {
  getAllSucursales: async (): Promise<Sucursal[]> => {
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
      throw new Error(`Error cargando ${mensajeModulo}`);
    }
  },

  getSucursalById: async (id: number): Promise<Sucursal> => {
    const response = await fetch(`${API_URL}/${nombreApi}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) throw new Error(`Error al obtener el ${mensajeModulo}`);
    return response.json();
  },

  createSucursal: async (sucursal: {
    nombre: string;
    direccion: string;
    telefono: string;
    responsable_id: number;
  }): Promise<any> => {
    const response = await fetch(`${API_URL}/${nombreApi}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(sucursal),
    });
    if (!response.ok) throw new Error(`Error al crear ${mensajeModulo}`);
    return response.json();
  },

  updateSucursal: async (
    id: number,
    sucursal: {
      nombre: string;
      direccion: string;
      telefono: string;
      responsable_id: number;
    }
  ): Promise<any> => {
    const response = await fetch(`${API_URL}/${nombreApi}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(sucursal),
    });
    if (!response.ok) throw new Error(`Error al actualizar ${mensajeModulo}`);
    return response.json();
  },

  deleteSucursal: async (id: number): Promise<any> => {
    const response = await fetch(`${API_URL}/${nombreApi}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) throw new Error(`Error al eliminar el ${mensajeModulo}`);
    return response.json();
  },
};