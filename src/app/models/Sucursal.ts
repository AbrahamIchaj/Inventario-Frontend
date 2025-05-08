export interface Sucursal {
  id_sucursal: number;
  nombre: string;
  direccion: string;
  telefono: string;
  responsable_id: number;
  responsable?: {
    id_usuario: number;
    nombre: string;
    email: string;
  };
}