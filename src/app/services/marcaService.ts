import { Marca } from "../models/Marca";
import { API_URL } from "../lib/apiRoute";

const nombreApi = "brand";
const mensajeModulo = "Marca";

export const marcaService = {
  getAllMarca: async (): Promise<Marca[]> => {
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
      throw new Error("Error cargando categorías");
    }
  },

  getMarcaById: async (id: number): Promise<Marca> => {
    const response = await fetch(`${API_URL}/${nombreApi}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) throw new Error(`Error al obtener el ${mensajeModulo}`);
    return response.json();
  },

  createMarca: async (Marca: {
    nombre: string;
    descripcion: string | null;
  }): Promise<any> => {
    const response = await fetch(`${API_URL}/${nombreApi}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(Marca),
    });
    if (!response.ok) throw new Error(`Error al guardar ${mensajeModulo}`);
    return response.json();
  },

  updateMarca: async (
    id: number,
    categoria: { nombre: string; descripcion: string | null }
  ): Promise<any> => {
    const response = await fetch(`${API_URL}/${nombreApi}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(categoria),
    });
    if (!response.ok) throw new Error(`Error al actualizar ${mensajeModulo}`);
    return response.json();
  },

  deleteMarca: async (id: number): Promise<any> => {
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