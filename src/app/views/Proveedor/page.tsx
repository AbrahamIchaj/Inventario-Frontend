"use client";
import React, { useState, useEffect } from "react";
import { Proveedor } from "@/app/models/Proveedor";
import { proveedorService } from "@/app/services/proveedorService";
import { Button, Table, Modal, Form, Alert } from "react-bootstrap";
import { AlertMessage } from "@/app/components/Alertas/page";
import { AlertaComponent } from "@/app/components/Alertas/AlertaComponent";
import { TablaProveedor } from "@/app/components/Proveedor/TablaProveedor";

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProveedor, setCurrentProveedor] = useState<Partial<Proveedor>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const handleCloseAlert = () => setAlert(null);

  useEffect(() => {
    loadProveedores();
  }, []);

  const loadProveedores = async () => {
    setLoading(true);
    try {
      const data = await proveedorService.getAllProveedores();
      if (Array.isArray(data)) {
        setProveedores(data);
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
          "Error al cargar los Proveedores. Por favor, verifica la conexión con el servidor.",
        severity: "error",
        title: "Error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Validaciones
  const validateProveedor = (
    proveedor: Partial<Proveedor>
  ): { isValid: boolean; message: string } => {
    if (!proveedor.nombre?.trim())
      return { isValid: false, message: "El nombre es requerido" };
    if (!proveedor.telefono?.trim())
      return { isValid: false, message: "El telefono es requerido" };
    if (!proveedor.email?.trim())
      return { isValid: false, message: "El email es requerido" };
    if (!proveedor.direccion?.trim())
      return { isValid: false, message: "El direccion es requerido" };
    if (!proveedor.ciudad?.trim())
      return { isValid: false, message: "La ciudad  es requerida" };
    if (!proveedor.contacto_referencia?.trim())
      return { isValid: false, message: "La contacto_referencia es requerida" };
    if (!proveedor.rfc)
      return { isValid: false, message: "El rfc es requerido" };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(proveedor.email)) {
      return { isValid: false, message: "El formato del email no es válido" };
    }

    return { isValid: true, message: "" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateProveedor(currentProveedor);
    if (!validation.isValid) {
      setAlert({
        message: validation.message,
        severity: "error",
        title: "Error de Validación",
      });
      return;
    }

    try {
      const proveedorData = {
        nombre: currentProveedor.nombre!,
        telefono: currentProveedor.telefono!,
        email: currentProveedor.email!,
        direccion: currentProveedor.direccion!,
        ciudad: currentProveedor.ciudad!,
        contacto_referencia: currentProveedor.contacto_referencia!,
        rfc: currentProveedor.rfc!
      };

      if (isEditing && currentProveedor.id_proveedor) {
        await proveedorService.updateProveedor(
          currentProveedor.id_proveedor,
          proveedorData
        );
        setAlert({
          message: "Proveedor actualizado correctamente",
          severity: "success",
          title: "Éxito",
        });
      } else {
        await proveedorService.createProveedor(proveedorData);
        setAlert({
          message: "Proveedor creado correctamente",
          severity: "success",
          title: "Éxito",
        });
      }
      loadProveedores();
      handleCloseModal();
    } catch (err) {
      setAlert({
        message: "Error al guardar Proveedor",
        severity: "error",
        title: "Error",
      });
    }
  };

  const handleEdit = (proveedor: Proveedor) => {
    setCurrentProveedor(proveedor);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentProveedor({});
    setIsEditing(false);
    setError(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Está seguro de eliminar este Proveedor?")) {
      try {
        await proveedorService.deleteProveedor(id);
        setAlert({
          message: "Proveedor eliminado correctamente",
          severity: "warning",
          title: "Advertencia",
        });
        loadProveedores();
      } catch (err) {
        setAlert({
          message: "Error al eliminar el Proveedor",
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
        <h2>Proveedores</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Nuevo Proveedores
        </Button>
      </div>

      <TablaProveedor
        proveedor={proveedores}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Editar Proveedor" : "Nuevo Proveedor"}
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
                    value={currentProveedor.nombre || ""}
                    onChange={(e) =>
                      setCurrentProveedor({
                        ...currentProveedor,
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
                    value={currentProveedor.telefono || ""}
                    onChange={(e) =>
                      setCurrentProveedor({
                        ...currentProveedor,
                        telefono: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </div>
              </div>

              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                    value={currentProveedor.email || ""}
                    onChange={(e) =>
                      setCurrentProveedor({
                        ...currentProveedor,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </div>

            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={currentProveedor.direccion || ""}
                onChange={(e) =>
                  setCurrentProveedor({
                    ...currentProveedor,
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
                    value={currentProveedor.ciudad || ""}
                    onChange={(e) =>
                      setCurrentProveedor({
                        ...currentProveedor,
                        ciudad: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                </div>
            </div>

              <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Contacto_referencia</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentProveedor.contacto_referencia || ""}
                    onChange={(e) =>
                      setCurrentProveedor({
                        ...currentProveedor,
                        contacto_referencia: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                </div>
                </div>

                <div className="row">
                <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>RFC</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentProveedor.rfc || ""}
                    onChange={(e) =>
                      setCurrentProveedor({
                        ...currentProveedor,
                        rfc: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>


            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Guardar
              </Button>
            </div>
            </div>

          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
