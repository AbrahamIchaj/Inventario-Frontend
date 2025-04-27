import { Categoria } from "../models/Categoria";
import { API_URL } from "../lib/apiRoute";

const nombreApi = "category";
const mensajeModulo = "Categoria";

export const categoriaService = {
  getAllCategorias: async (): Promise<Categoria[]> => {
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

  getCategoriaById: async (id: number): Promise<Categoria> => {
    const response = await fetch(`${API_URL}/${nombreApi}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) throw new Error(`Error al obtener el ${mensajeModulo}`);
    return response.json();
  },

  createCategoria: async (categoria: {
    nombre: string;
    descripcion: string | null;
  }): Promise<any> => {
    const response = await fetch(`${API_URL}/${nombreApi}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(categoria),
    });
    if (!response.ok) throw new Error(`Error al guardar ${mensajeModulo}`);
    return response.json();
  },

  updateCategoria: async (
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

  deleteCategoria: async (id: number): Promise<any> => {
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