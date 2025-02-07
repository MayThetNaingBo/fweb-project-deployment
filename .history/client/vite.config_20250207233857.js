import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: "0.0.0.0", // Allows external access
        port: 5173, // Optional: specify the port
    },
    build: {
        rollupOptions: {
            external: ['react-calendar'],
        },
});
