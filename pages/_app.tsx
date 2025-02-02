import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import client from "@/lib/apollo-client";
import "@/styles/globals.css";
import "@/styles/toast.css";
import { ApolloProvider } from "@apollo/client";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </UserProvider>
  );
}
