import type { Metadata } from "next";
import { Inter } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavSide from "../components/NavSide/page";

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
          <div className="row flex-nowrap position-relative">
            <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-light">
              <NavSide />
            </div>
            <div className="col py-3">
              <main>{children}</main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
