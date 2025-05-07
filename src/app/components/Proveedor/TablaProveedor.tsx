import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { Proveedor } from '@/app/models/Proveedor';

interface TablaProveedorProps {
  proveedor: Proveedor[];
  loading: boolean;
  onEdit: (proveedor: Proveedor) => void;
  onDelete: (id: number) => void;
}

export const TablaProveedor: React.FC<TablaProveedorProps> = ({
  proveedor,
  loading,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <Table responsive striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Telefono</th>
          <th>Email</th>
          <th>Direccion</th>
          <th>Ciudad</th>
          <th>Contacto Referencia</th>
          <th>RFC</th>
        </tr>
      </thead>
      <tbody>
        {proveedor.map((proveedor) => (
          <tr key={proveedor.id_proveedor}>
            <td>{proveedor.id_proveedor}</td>
            <td>{proveedor.nombre}</td>
            <td>{proveedor.telefono}</td>
            <td>{proveedor.email}</td>
            <td>{proveedor.direccion}</td>
            <td>{proveedor.ciudad}</td>
            <td>{proveedor.contacto_referencia}</td>
            <td>{proveedor.rfc}</td>
            <td>
              <Button
                variant="info"
                size="sm"
                className="me-2"
                onClick={() => onEdit(proveedor)}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(proveedor.id_proveedor)}
              >
                Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};