import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { Cliente } from '@/app/models/Cliente';

interface TablaClienteProps {
  clientes: Cliente[];
  loading: boolean;
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: number) => void;
}

export const TablaCliente: React.FC<TablaClienteProps> = ({
  clientes,
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
          <th>Apellido</th>
          <th>Teléfono</th>
          <th>Email</th>
          <th>Ciudad</th>
          <th>Límite de Crédito</th>
          <th>Saldo Pendiente</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {clientes.map((cliente) => (
          <tr key={cliente.id_cliente}>
            <td>{cliente.id_cliente}</td>
            <td>{cliente.nombre}</td>
            <td>{cliente.apellido}</td>
            <td>{cliente.telefono}</td>
            <td>{cliente.email}</td>
            <td>{cliente.ciudad}</td>
            <td>${Number(cliente.limite_credito).toFixed(2)}</td>
            <td>${Number(cliente.saldo_pendiente).toFixed(2)}</td>
            <td>{cliente.activo ? "Activo" : "Inactivo"}</td>
            <td>
              <Button
                variant="info"
                size="sm"
                className="me-2"
                onClick={() => onEdit(cliente)}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(cliente.id_cliente)}
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