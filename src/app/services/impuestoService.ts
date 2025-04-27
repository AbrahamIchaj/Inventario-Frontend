import { Impuesto } from "../models/Impuesto";
import { API_URL } from "../lib/apiRoute";

const nombreApi = "tax";
const mensajeModulo = "Impuesto";

export const impuestoService = {
  getAllImpuestos: async (): Promise<Impuesto[]> => {
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

  getImpuestoById: async (id: number): Promise<Impuesto> => {
    const response = await fetch(`${API_URL}/${nombreApi}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) throw new Error(`Error al obtener el ${mensajeModulo}`);
    return response.json();
  },

  createImpuesto: async (impuesto: {
    nombre: string;
    porcentaje: number;
    descripcion: string | null;
  }): Promise<any> => {
    const response = await fetch(`${API_URL}/${nombreApi}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(impuesto),
    });
    if (!response.ok) throw new Error(`Error al crear ${mensajeModulo}`);
    return response.json();
  },

  updateImpuesto: async (
    id: number,
    impuesto: { nombre: string; porcentaje: number; descripcion: string | null }
  ): Promise<any> => {
    const response = await fetch(`${API_URL}/${nombreApi}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(impuesto),
    });
    if (!response.ok) throw new Error(`Error al actualizar ${mensajeModulo}`);
    return response.json();
  },

  deleteImpuesto: async (id: number): Promise<any> => {
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