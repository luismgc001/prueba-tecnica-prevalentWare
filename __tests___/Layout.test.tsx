// __tests__/Layout.test.tsx
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Layout from "@/components/Layout";

// Mock de useUser de Auth0
jest.mock("@auth0/nextjs-auth0/client", () => ({
  useUser: () => ({
    user: {
      name: "Test User",
      nickname: "testuser",
      picture: "test-picture.jpg",
    },
  }),
}));

// Mock de usePathname de Next.js
jest.mock("next/navigation", () => ({
  usePathname: () => "/movements",
}));

// Mock de Image de Next.js con filtrado de props
jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage({ src, alt, width, height, className }: any) {
    // Solo pasamos las props que son válidas para un elemento img
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        data-testid="next-image"
      />
    );
  },
}));

describe("Layout", () => {
  it("renderiza el layout con un usuario autenticado", () => {
    render(
      <Layout>
        <div>Contenido de prueba</div>
      </Layout>
    );

    expect(screen.getByText("Contenido de prueba")).toBeInTheDocument();
    expect(screen.getByTestId("next-image")).toBeInTheDocument();
    expect(screen.getByText("Ingresos y egresos")).toBeInTheDocument();
    expect(screen.getByText("Cerrar Sesión")).toBeInTheDocument();
  });

  it("muestra opciones de admin cuando el rol es Admin", () => {
    render(
      <Layout role="Admin">
        <div>Contenido de prueba</div>
      </Layout>
    );

    expect(screen.getByText("Usuarios")).toBeInTheDocument();
    expect(screen.getByText("Reportes")).toBeInTheDocument();
  });

  it("no muestra opciones de admin con rol User", () => {
    render(
      <Layout role="User">
        <div>Contenido de prueba</div>
      </Layout>
    );

    expect(screen.queryByText("Usuarios")).not.toBeInTheDocument();
    expect(screen.queryByText("Reportes")).not.toBeInTheDocument();
  });

  it("muestra el nombre del usuario", () => {
    render(
      <Layout>
        <div>Contenido</div>
      </Layout>
    );

    expect(screen.getByText("testuser")).toBeInTheDocument();
  });
});
