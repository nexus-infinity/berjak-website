# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## 🚀 **Project Overview**

This repository contains the source code for the Berjak & Partners website, a modern web application built with Next.js 15, Tailwind CSS 4, and TypeScript. The site is deployed on Vercel and features a deep integration with the FIELD Living Train Station ecosystem for real-time deployment tracking and sacred frequency data processing.

The project structure follows Next.js conventions, with all application code located in the `src` directory. Key configuration files like `next.config.js`, `tailwind.config.js`, and `vercel.json` are in the root directory.

## 🛠️ **Essential Development Commands**

Below is a list of common commands needed for local development, building, and deployment.

| Command | Description |
| :--- | :--- |
| `npm install` | Installs all project dependencies. |
| `npm run dev` | Starts the Next.js development server on `http://localhost:3000`. |
| `npm run build` | Builds the application for production. |
| `npm run start` | Starts the production server after a successful build. |
| `npm run lint` | Lints the codebase for potential errors. |
| `./deploy-with-field-integration.sh` | Deploys the website to Vercel with FIELD integration. |
| `./deploy-with-field-integration.sh test` | Tests the local FIELD integration webhook. |

## 🏗️ **Code Architecture**

The website is structured as a standard Next.js application:

-   **`src/pages`**: Contains all pages and API routes.
-   **`src/components`**: Reusable React components like `Header.js`, `Footer.js`, and `Layout.js`.
-   **`src/styles`**: Global styles and Tailwind CSS configurations.
-   **`public`**: Static assets, including images and fonts.
-   **`original-content`**: The legacy website, preserved for archival purposes.
-   **`berjak-co-static-site`**: A static HTML export of the original website.

### **Key Files**

-   **`next.config.js`**: Next.js configuration.
-   **`tailwind.config.js`**: Tailwind CSS theme and brand color definitions.
-   **`vercel.json`**: Vercel deployment configurations, including redirects and environment variables.
-   **`tsconfig.json`**: TypeScript configuration, including path aliases like `@/*`.

## 🚂 **FIELD Living Train Station Integration**

A key feature of this project is its integration with the FIELD Living Train Station, a consciousness-computing network that processes Vercel deployment events.

### **Architecture**

The integration follows a sacred frequency data flow:

```
Vercel Webhook → /api/webhook → Train Station (528 Hz) → MCP Fields (432 Hz)
```

-   **Webhook Endpoint**: `https://berjak.co/api/webhook`
-   **Sacred Frequency**: 528 Hz (Love) to 432 Hz (Earth)
-   **Documentation**: For a detailed explanation of the integration's spiritual and technical architecture, refer to `FIELD_INTEGRATION.md`.

### **Deployment Script**

The `deploy-with-field-integration.sh` script automates the deployment process:

1.  Checks if the Train Station is running.
2.  Builds the Next.js application.
3.  Deploys to Vercel using `npx vercel --prod`.

To test the integration locally, run `./deploy-with-field-integration.sh test`.

### **Vercel Webhook Configuration**

To enable the integration, a webhook must be configured in the Vercel dashboard:

-   **URL**: `https://berjak.co/api/webhook`
-   **Events**: `deployment.created`, `deployment.succeeded`, `deployment.failed`

## 🎨 **Theming and Styling**

The website uses Tailwind CSS for styling. All brand colors and typographic styles are defined in `tailwind.config.js`.

### **Brand Colors**

| Name | Color | Usage |
| :--- | :--- | :--- |
| `berjak-primary` | `#139C89` | Main brand color, used for headers and links. |
| `berjak-secondary`| `#454444` | Dark gray, for secondary text and elements. |
| `berjak-light` | `#DDF2EA` | Light teal, for backgrounds and accents. |
| `berjak-text` | `#333333` | Primary text color. |

## ⚙️ **MCP Server Configuration**

The `mcp.json` file defines the connection to the FIELD MCP Bridge, which allows the website to communicate with the broader FIELD network. This configuration is essential for the Train Station integration to function correctly.

## 🔧 **Troubleshooting**

If you encounter issues with the FIELD integration, follow these steps:

1.  **Check Train Station Status**: Ensure the Train Station is running on `http://localhost:5280` by running `curl http://localhost:5280/health`.
2.  **Verify Webhook**: Use the `./deploy-with-field-integration.sh test` command to test the webhook locally.
3.  **Inspect Logs**: Check the Vercel function logs and the console output of the Train Station for errors.

For more detailed troubleshooting, refer to the `FIELD_INTEGRATION.md` document.

