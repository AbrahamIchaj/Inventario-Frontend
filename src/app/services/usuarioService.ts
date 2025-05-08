import { Usuario } from "../models/Usuario";
import { API_URL } from "../lib/apiRoute";

const nombreApi = "user";
const mensajeModulo = "Usuario";

export const usuarioService = {
  getAllUsuarios: async (): Promise<Usuario[]> => {
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

  getUsuarioById: async (id: number): Promise<Usuario> => {
    const response = await fetch(`${API_URL}/${nombreApi}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) throw new Error(`Error al obtener el ${mensajeModulo}`);
    return response.json();
  },

  createUsuario: async (usuario: {
    nombre: string;
    email: string;
    password_hash: string;
    rol_id: number;
    activo: boolean;
    ultimo_acceso?: Date | null;
  }): Promise<any> => {
    const usuarioData = {
      nombre: usuario.nombre,
      email: usuario.email,
      password: usuario.password_hash,
      rol_id: usuario.rol_id,
      activo: usuario.activo,
      ultimo_acceso: usuario.ultimo_acceso ?? null,
    };

    const response = await fetch(`${API_URL}/${nombreApi}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(usuarioData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error al crear ${mensajeModulo}`);
    }
    return response.json();
  },

  updateUsuario: async (
    id: number,
    usuario: {
      nombre: string;
      email: string;
      password_hash?: string;
      rol_id: number;
      activo: boolean;
      ultimo_acceso?: Date | null;
    }
  ): Promise<any> => {
    try {
      const usuarioData = {
        nombre: usuario.nombre,
        email: usuario.email,
        password: usuario.password_hash,
        rol_id: usuario.rol_id,
        activo: usuario.activo,
        ultimo_acceso: usuario.ultimo_acceso ?? null,
      };

      const response = await fetch(`${API_URL}/${nombreApi}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(usuarioData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Error al actualizar ${mensajeModulo}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating usuario:", error);
      throw error;
    }
  },

  deleteUsuario: async (id: number): Promise<any> => {
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
