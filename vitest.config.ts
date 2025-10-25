import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: 'node',  // ✅ evita o SSR no Windows
        watch: false      
    }
})