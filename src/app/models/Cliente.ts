export interface Cliente {
  id_cliente: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
  fecha_registro: string;
  saldo_pendiente: number;
  limite_credito: number;
  activo: boolean;
}
