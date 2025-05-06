"use client";
import React, { useState, useEffect } from "react";
import { Cliente } from "@/app/models/Cliente";
import { clienteService } from "@/app/services/clienteService";
import { Button, Table, Modal, Form, Alert } from "react-bootstrap";
import { AlertMessage } from "@/app/components/Alertas/page";
import { AlertaComponent } from "@/app/components/Alertas/AlertaComponent";
import { TablaCliente } from "@/app/components/Cliente/TablaCliente";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentCliente, setCurrentCliente] = useState<Partial<Cliente>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const handleCloseAlert = () => setAlert(null);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    setLoading(true);
    try {
      const data = await clienteService.getAllClientes();
      if (Array.isArray(data)) {
        setClientes(data);
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
          "Error al cargar los Clientes. Por favor, verifica la conexión con el servidor.",
        severity: "error",
        title: "Error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Validaciones
  const validateCliente = (
    cliente: Partial<Cliente>
  ): { isValid: boolean; message: string } => {
    if (!cliente.nombre?.trim())
      return { isValid: false, message: "El nombre es requerido" };
    if (!cliente.apellido?.trim())
      return { isValid: false, message: "El apellido es requerido" };
    if (!cliente.telefono?.trim())
      return { isValid: false, message: "El teléfono es requerido" };
    if (!cliente.email?.trim())
      return { isValid: false, message: "El email es requerido" };
    if (!cliente.direccion?.trim())
      return { isValid: false, message: "La dirección es requerida" };
    if (!cliente.ciudad?.trim())
      return { isValid: false, message: "La ciudad es requerida" };
    if (!cliente.limite_credito)
      return { isValid: false, message: "El límite de crédito es requerido" };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cliente.email)) {
      return { isValid: false, message: "El formato del email no es válido" };
    }

    return { isValid: true, message: "" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateCliente(currentCliente);
    if (!validation.isValid) {
      setAlert({
        message: validation.message,
        severity: "error",
        title: "Error de Validación",
      });
      return;
    }

    try {
      const clienteData = {
        nombre: currentCliente.nombre!,
        apellido: currentCliente.apellido!,
        telefono: currentCliente.telefono!,
        email: currentCliente.email!,
        direccion: currentCliente.direccion!,
        ciudad: currentCliente.ciudad!,
        limite_credito: currentCliente.limite_credito!,
        activo: currentCliente.activo ?? true,
        saldo_pendiente: currentCliente.saldo_pendiente || 0,
      };

      if (isEditing && currentCliente.id_cliente) {
        await clienteService.updateCliente(
          currentCliente.id_cliente,
          clienteData
        );
        setAlert({
          message: "Cliente actualizado correctamente",
          severity: "success",
          title: "Éxito",
        });
      } else {
        await clienteService.createCliente(clienteData);
        setAlert({
          message: "Cliente creado correctamente",
          severity: "success",
          title: "Éxito",
        });
      }
      loadClientes();
      handleCloseModal();
    } catch (err) {
      setAlert({
        message: "Error al guardar Cliente",
        severity: "error",
        title: "Error",
      });
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setCurrentCliente(cliente);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCliente({});
    setIsEditing(false);
    setError(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Está seguro de eliminar este cliente?")) {
      try {
        await clienteService.deleteCliente(id);
        setAlert({
          message: "Cliente eliminado correctamente",
          severity: "warning",
          title: "Advertencia",
        });
        loadClientes();
      } catch (err) {
        setAlert({
          message: "Error al eliminar el Cliente",
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
        <h2>Clientes</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Nuevo Cliente
        </Button>
      </div>

      <TablaCliente
        clientes={clientes}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Editar Cliente" : "Nuevo Cliente"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentCliente.nombre || ""}
                    onChange={(e) =>
                      setCurrentCliente({
                        ...currentCliente,
                        nombre: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentCliente.apellido || ""}
                    onChange={(e) =>
                      setCurrentCliente({
                        ...currentCliente,
                        apellido: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    value={currentCliente.telefono || ""}
                    onChange={(e) =>
                      setCurrentCliente({
                        ...currentCliente,
                        telefono: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                    value={currentCliente.email || ""}
                    onChange={(e) =>
                      setCurrentCliente({
                        ...currentCliente,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={currentCliente.direccion || ""}
                onChange={(e) =>
                  setCurrentCliente({
                    ...currentCliente,
                    direccion: e.target.value,
                  })
                }
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentCliente.ciudad || ""}
                    onChange={(e) =>
                      setCurrentCliente({
                        ...currentCliente,
                        ciudad: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Límite de Crédito</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentCliente.limite_credito || 0}
                    onChange={(e) =>
                      setCurrentCliente({
                        ...currentCliente,
                        limite_credito: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Cliente Activo"
                checked={currentCliente.activo ?? true}
                onChange={(e) =>
                  setCurrentCliente({
                    ...currentCliente,
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
