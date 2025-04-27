"use client";
import React, { useState, useEffect } from 'react';
import { Role, RolePermissions } from '@/app/models/Role';
import { roleService } from '@/app/services/roleService';
import { Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import { AlertMessage } from '@/app/components/Alertas/page';
import { AlertaComponent } from '@/app/components/Alertas/AlertaComponent';

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentRole, setCurrentRole] = useState<Partial<Role>>({});
  const [permissions, setPermissions] = useState<RolePermissions>({
    create: false,
    read: false,
    update: false,
    delete: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const handleCloseAlert = () => setAlert(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    try {
      console.log('Fetching roles...'); // Debug log
      const data = await roleService.getAllRoles();
      console.log('Received roles:', data); // Debug log
      
      if (Array.isArray(data)) {
        setRoles(data);
        setError(null);
      } else {
        console.error('Formato de datos inválido:', data);
        setAlert({
          message: 'Formato de datos inválido recibido del servidor',
          severity: 'error',
          title: 'Error'
        });
      }
    } catch (err) {
      console.error('Error cargando roles:', err);
      setAlert({
        message: 'Error al cargar roles. Por favor, verifica la conexión con el servidor.',
        severity: 'error',
        title: 'Error'
      });
    } finally {
      setLoading(false);
    }
};

  const handlePermissionChange = (permission: keyof RolePermissions) => {
    setPermissions(prev => {
      const newPermissions = { ...prev, [permission]: !prev[permission] };
      setCurrentRole(prev => ({
        ...prev,
        permisos: JSON.stringify(newPermissions)
      }));
      return newPermissions;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const roleData = {
        nombre: currentRole.nombre || '',
        permisos: currentRole.permisos || JSON.stringify(permissions)
      };

      if (isEditing && currentRole.id_rol) {
        await roleService.updateRole(currentRole.id_rol, roleData);
        setAlert({
          message: 'Rol actualizada correctamente',
          severity: 'success',
          title: 'Éxito'
        });
      } else {
        await roleService.createRole(roleData);
        setAlert({
          message: 'Rol creada correctamente',
          severity: 'success',
          title: 'Éxito'
        });
      }
      loadRoles();
      handleCloseModal();
    } catch (err) {
      setAlert({
        message: 'Error al guardar la Rol',
        severity: 'error',
        title: 'Error'
      });
    }
  };

  const handleEdit = (role: Role) => {
    setCurrentRole(role);
    try {
      setPermissions(JSON.parse(role.permisos));
    } catch (err) {
      console.error('Error parsing permissions:', err);
      setPermissions({
        create: false,
        read: false,
        update: false,
        delete: false
      });
    }
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentRole({});
    setPermissions({
      create: false,
      read: false,
      update: false,
      delete: false
    });
    setIsEditing(false);
    setError(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este rol?')) {
      try {
        await roleService.deleteRole(id);
        setAlert({
          message: 'Rol eliminado correctamente',
          severity: 'warning',
          title: 'Advertencia'
        });
        loadRoles();
      } catch (err) {
        setAlert({
          message: 'Error al eliminar la marca',
          severity: 'error',
          title: 'Error'
        });
      }
    } else {
      setAlert({
        message: 'Eliminación cancelada por el usuario',
        severity: 'info',
        title: 'Información'
      });
    }
  };

  return (
    <div className="container mt-4">
      <AlertaComponent alert={alert} onClose={handleCloseAlert} />
      {error && <Alert variant="danger">{error}</Alert>}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Roles</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Nuevo Rol
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Permisos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id_rol}>
                <td>{role.id_rol}</td>
                <td>{role.nombre}</td>
                <td>
                  <pre className="m-0">
                    {JSON.stringify(JSON.parse(role.permisos), null, 2)}
                  </pre>
                </td>
                <td>
                  <Button 
                    variant="info" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleEdit(role)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(role.id_rol)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Rol' : 'Nuevo Rol'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={currentRole.nombre || ''}
                onChange={(e) => setCurrentRole({ ...currentRole, nombre: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Permisos</Form.Label>
              <div className="d-flex flex-column gap-2">
                <Form.Check
                  type="checkbox"
                  label="Crear"
                  checked={permissions.create}
                  onChange={() => handlePermissionChange('create')}
                />
                <Form.Check
                  type="checkbox"
                  label="Leer"
                  checked={permissions.read}
                  onChange={() => handlePermissionChange('read')}
                />
                <Form.Check
                  type="checkbox"
                  label="Actualizar"
                  checked={permissions.update}
                  onChange={() => handlePermissionChange('update')}
                />
                <Form.Check
                  type="checkbox"
                  label="Eliminar"
                  checked={permissions.delete}
                  onChange={() => handlePermissionChange('delete')}
                />
              </div>
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Guardar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}