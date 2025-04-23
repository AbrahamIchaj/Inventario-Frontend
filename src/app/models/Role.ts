export interface Role {
  id_rol: number;
  nombre: string;
  permisos: string;
}

export interface RolePermissions {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}