import { MetodoPago } from "../models/MetodoPago";
import { API_URL } from "../lib/apiRoute";

const nombreApi = "paymentmethod";
const mensajeModulo = "Metodo de Pago";

export const metodoPagoService = {
  getAllMetodoPago: async (): Promise<MetodoPago[]> => {
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
      throw new Error(`Error cargando el ${mensajeModulo}`);
    }
  },

  getMetodoPagoById: async (id: number): Promise<MetodoPago> => {
    const response = await fetch(`${API_URL}/${nombreApi}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) throw new Error(`Error al obtener el ${mensajeModulo}`);
    return response.json();
  },

  createMetodoPago: async (MetodoPago: {
    nombre: string;
    activo: number;
  }): Promise<any> => {
    const response = await fetch(`${API_URL}/${nombreApi}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(MetodoPago),
    });
    if (!response.ok) throw new Error(`Error al guardar ${mensajeModulo}`);
    return response.json();
  },

  updateMetodoPago: async (
    id: number,
    metodoPago: { nombre: string; activo: number }
  ): Promise<any> => {
    const response = await fetch(`${API_URL}/${nombreApi}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(metodoPago),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(errorData.message || `Error al actualizar ${mensajeModulo}: ${response.status}`);
    }
    
    return response.json();
  },

  deleteMetodoPago: async (id: number): Promise<any> => {
    const response = await fetch(`${API_URL}/${nombreApi}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) throw new Error(`Error al eliminar ${mensajeModulo}`);
    return response.json();
  },
};