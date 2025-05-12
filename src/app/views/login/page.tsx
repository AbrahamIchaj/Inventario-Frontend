"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../../../styles/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./login.css";
import ParticlesBackground from "@/app/components/Particles/ParticlesBackground";

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const togglePassword = () => {
    setMostrarPassword(!mostrarPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí irá la lógica de autenticación
  };

  return (
    <>
      <ParticlesBackground />
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="card shadow border-0 position-relative">
          <div className="row g-0">
            <div className="col-md-6 p-5">
              <div className="logo-container mb-4">
                <h3 className="text-primary h4">Sistema de Inventario</h3>
                <p className="text-muted">¡Bienvenido de nuevo!</p>
              </div>

              <h2 className="h3 mb-4">Iniciar Sesión</h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="usuario" className="form-label">Usuario</label>
                  <div className="position-relative">
                    <i className="bi bi-person position-absolute top-50 translate-middle-y ps-3"></i>
                    <input
                      type="text"
                      className="form-control form-control-lg ps-5"
                      id="usuario"
                      placeholder="Ingresa tu usuario"
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <div className="position-relative">
                    <i className="bi bi-lock position-absolute top-50 translate-middle-y ps-3"></i>
                    <input
                      type={mostrarPassword ? "text" : "password"}
                      className="form-control form-control-lg ps-5"
                      id="password"
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="btn position-absolute end-0 top-50 translate-middle-y text-muted pe-3"
                      onClick={togglePassword}
                    >
                      <i className={`bi ${mostrarPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="remember" />
                    <label className="form-check-label" htmlFor="remember">Recordarme</label>
                  </div>
                  <a href="#" className="text-primary text-decoration-none">¿Olvidaste tu contraseña?</a>
                </div>

                <button type="submit" className="btn btn-primary w-100 btn-lg mb-4">
                  Iniciar Sesión
                </button>

                <div className="text-center">
                  <div className="d-flex justify-content-center gap-3 mb-4">
                  </div>
                  <p className="text-muted">
                    ¿No tienes una cuenta? <a href="#" className="text-primary text-decoration-none">Regístrate aquí</a>
                  </p>
                </div>
              </form>
            </div>

            <div className="col-md-6 back p-0">
              <div className="position-relative w-100 h-100">
                <Image
                  src="/3.png"
                  alt="Login Illustration"
                  layout="fill"
                  objectFit="Contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
