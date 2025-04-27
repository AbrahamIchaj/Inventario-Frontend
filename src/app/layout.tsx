import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
//import "../styles/bootstrap.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavSide from "./components/NavSide/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inventory System",
  description: "Inventory Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">
              <NavSide />
            </div>
            <div className="col-md-10">
              <main className="p-3">{children}</main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
