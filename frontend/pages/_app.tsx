import React from "react";
import App, { Container } from "next/app";
import Head from "next/head";
import { APIClient, APIClientProvider } from "../components/API/APIClient";
import Layout from "../components/Layout/Layout";
import { AuthProvider } from "../components/Auth/Auth";
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
*,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body,
  html {
    margin: 0;
    padding: 0;
    font-family: "Poppins", sans-serif;
  }
`;

const apiClient = new APIClient({
  baseUrl: process.env.API_ROOT || "/api"
});

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Head>
          <title>Task Management by Nikita Kurpas</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />

          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Poppins:400,700&display=swap"
            rel="stylesheet"
          />
        </Head>

        <GlobalStyles />

        <APIClientProvider client={apiClient}>
          <AuthProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </AuthProvider>
        </APIClientProvider>
      </Container>
    );
  }
}

export default MyApp;
