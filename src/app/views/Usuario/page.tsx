"use client";
import React, { useState, useEffect } from "react";
import { Usuario } from "@/app/models/Usuario";
import { Role } from "@/app/models/Role";
import { usuarioService } from "@/app/services/usuarioService";
import { roleService } from "@/app/services/roleService";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { AlertMessage } from "@/app/components/Alertas/page";
import { AlertaComponent } from "@/app/components/Alertas/AlertaComponent";
import { TablaUsuario } from "@/app/components/Usuario/TablaUsuario";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState<Partial<Usuario>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const handleCloseAlert = () => setAlert(null);

  useEffect(() => {
    loadUsuarios();
    loadRoles();
  }, []);

  const loadUsuarios = async () => {
    setLoading(true);
    try {
      const data = await usuarioService.getAllUsuarios();
      if (Array.isArray(data)) {
        setUsuarios(data);
        setError(null);
      } else {
        setAlert({
          message: "Formato de datos inválido recibido del servidor",
          severity: "error",
          title: "Error",
        });
      }
    } catch (err) {
      setAlert({
        message:
          "Error al cargar los usuarios. Por favor, verifica la conexión con el servidor.",
        severity: "error",
        title: "Error",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await roleService.getAllRoles();
      if (Array.isArray(data)) {
        setRoles(data);
      }
    } catch (err) {
      console.error("Error cargando roles:", err);
    }
  };

  const validateUsuario = (
    usuario: Partial<Usuario>
  ): { isValid: boolean; message: string } => {
    if (!usuario.nombre?.trim())
      return { isValid: false, message: "El nombre es requerido" };
    if (!usuario.email?.trim())
      return { isValid: false, message: "El email es requerido" };
    if (!isEditing && !usuario.password_hash?.trim())
      return { isValid: false, message: "La contraseña es requerida" };
    if (!usuario.rol_id)
      return { isValid: false, message: "El rol es requerido" };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(usuario.email)) {
      return { isValid: false, message: "El formato del email no es válido" };
    }

    return { isValid: true, message: "" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateUsuario(currentUsuario);
    if (!validation.isValid) {
      setAlert({
        message: validation.message,
        severity: "error",
        title: "Error de Validación",
      });
      return;
    }

    try {
      const usuarioData = {
        nombre: currentUsuario.nombre!,
        email: currentUsuario.email!,
        password_hash: currentUsuario.password_hash!,
        rol_id: currentUsuario.rol_id!,
        activo: currentUsuario.activo ?? true,
        ultimo_acceso: currentUsuario.ultimo_acceso || null,
      };

      if (isEditing && currentUsuario.id_usuario) {
        await usuarioService.updateUsuario(
          currentUsuario.id_usuario,
          usuarioData
        );
        setAlert({
          message: "Usuario actualizado correctamente",
          severity: "success",
          title: "Éxito",
        });
      } else {
        await usuarioService.createUsuario(usuarioData);
        setAlert({
          message: "Usuario creado correctamente",
          severity: "success",
          title: "Éxito",
        });
      }
      loadUsuarios();
      handleCloseModal();
    } catch (err) {
      setAlert({
        message: "Error al guardar usuario",
        severity: "error",
        title: "Error",
      });
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setCurrentUsuario({
      ...usuario,
      password_hash: "", // Clear password when editing
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentUsuario({});
    setIsEditing(false);
    setError(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      try {
        await usuarioService.deleteUsuario(id);
        setAlert({
          message: "Usuario eliminado correctamente",
          severity: "warning",
          title: "Advertencia",
        });
        loadUsuarios();
      } catch (err) {
        setAlert({
          message: "Error al eliminar el usuario",
          severity: "error",
          title: "Error",
        });
      }
    }
  };

  return (
    <div className="container mt-4">
      <AlertaComponent alert={alert} onClose={handleCloseAlert} />
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Usuarios</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Nuevo Usuario
        </Button>
      </div>

      <TablaUsuario
        usuarios={usuarios}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        roles={roles}
      />

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={currentUsuario.nombre || ""}
                onChange={(e) =>
                  setCurrentUsuario({
                    ...currentUsuario,
                    nombre: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={currentUsuario.email || ""}
                onChange={(e) =>
                  setCurrentUsuario({
                    ...currentUsuario,
                    email: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                {isEditing
                  ? "Nueva Contraseña (dejar en blanco para mantener)"
                  : "Contraseña"}
              </Form.Label>
              <Form.Control
                type="password"
                value={currentUsuario.password_hash || ""}
                onChange={(e) =>
                  setCurrentUsuario({
                    ...currentUsuario,
                    password_hash: e.target.value,
                  })
                }
                required={!isEditing}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={currentUsuario.rol_id || ""}
                onChange={(e) =>
                  setCurrentUsuario({
                    ...currentUsuario,
                    rol_id: Number(e.target.value),
                  })
                }
                required
              >
                <option value="">Seleccionar Rol</option>
                {roles.map((rol) => (
                  <option key={rol.id_rol} value={rol.id_rol}>
                    {rol.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Usuario Activo"
                checked={currentUsuario.activo ?? true}
                onChange={(e) =>
                  setCurrentUsuario({
                    ...currentUsuario,
                    activo: e.target.checked,
                  })
                }
              />
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
