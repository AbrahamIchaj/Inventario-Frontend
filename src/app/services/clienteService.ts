import { Cliente } from "../models/Cliente";
import { API_URL } from "../lib/apiRoute";

const nombreApi = "customer";
const mensajeModulo = "Cliente";

export const clienteService = {
  getAllClientes: async (): Promise<Cliente[]> => {
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

  getClienteById: async (id: number): Promise<Cliente> => {
    const response = await fetch(`${API_URL}/${nombreApi}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) throw new Error(`Error al obtener el ${mensajeModulo}`);
    return response.json();
  },

  createCliente: async (cliente: {
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    direccion: string;
    ciudad: string;
    limite_credito: number;
    activo: boolean;
    saldo_pendiente: number;
  }): Promise<any> => {
    const clienteData = {
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      telefono: cliente.telefono,
      email: cliente.email,
      direccion: cliente.direccion,
      ciudad: cliente.ciudad,
      limiteCredito: cliente.limite_credito,
      saldoPendiente: cliente.saldo_pendiente || 0,
      activo: cliente.activo ? 1 : 0,
      fechaRegistro: new Date().toISOString().slice(0, 19).replace("T", " "),
    };

    const response = await fetch(`${API_URL}/${nombreApi}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(clienteData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error al crear ${mensajeModulo}`);
    }
    return response.json();
  },

  updateCliente: async (
    id: number,
    cliente: {
      nombre: string;
      apellido: string;
      telefono: string;
      email: string;
      direccion: string;
      ciudad: string;
      limite_credito: number;
      activo: boolean;
      saldo_pendiente: number;
    }
  ): Promise<any> => {
    const clienteData = {
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      telefono: cliente.telefono || "",
      email: cliente.email || "",
      direccion: cliente.direccion || "",
      ciudad: cliente.ciudad || "",
      limiteCredito: cliente.limite_credito || 0,
      saldoPendiente: cliente.saldo_pendiente || 0,
      activo: cliente.activo ? 1 : 0,
      fechaRegistro: new Date().toISOString().slice(0, 19).replace("T", " "),
    };

    const response = await fetch(`${API_URL}/${nombreApi}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(clienteData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Error al actualizar ${mensajeModulo}`
      );
    }
    return response.json();
  },

  deleteCliente: async (id: number): Promise<any> => {
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
