import { Proveedor } from "../models/Proveedor";
import { API_URL } from "../lib/apiRoute";

const nombreApi = "supplier";
const mensajeModulo = "Proveedor";

export const proveedorService = {
  getAllProveedores: async (): Promise<Proveedor[]> => {
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

  getProveedorById: async (id: number): Promise<Proveedor> => {
    const response = await fetch(`${API_URL}/${nombreApi}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) throw new Error(`Error al obtener el ${mensajeModulo}`);
    return response.json();
  },

  createProveedor: async (proveedor: {
    nombre: string;
    telefono: string;
    email: string;
    direccion: string;
    ciudad: string;
    contacto_referencia: string;
    rfc: string;
  }): Promise<any> => {
    const proveedorData = {
      nombre: proveedor.nombre,
      telefono: proveedor.telefono,
      email: proveedor.email,
      direccion: proveedor.direccion,
      ciudad: proveedor.ciudad,
      contacto_referencia: proveedor.contacto_referencia,
      rfc: proveedor.rfc,
    };

    const response = await fetch(`${API_URL}/${nombreApi}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(proveedorData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error al crear ${mensajeModulo}`);
    }
    return response.json();
  },

  updateProveedor: async (
    id: number,
    proveedor: {
      nombre: string;
      telefono: string;
      email: string;
      direccion: string;
      ciudad: string;
      contacto_referencia: string;
      rfc: string;
    }
  ): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/${nombreApi}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(proveedor), // Send proveedor directly without reassigning
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Error al actualizar ${mensajeModulo}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating proveedor:", error);
      throw error;
    }
  },

  deleteProveedor: async (id: number): Promise<any> => {
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
