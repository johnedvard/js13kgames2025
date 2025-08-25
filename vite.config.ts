// vite.config.js
import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  build: {
    minify: "terser",
    cssMinify: true,
    assetsDir: "",
    terserOptions: {
      toplevel: true,
      keep_classnames: false,
      keep_fnames: false,
      compress: {
        drop_console: true,
        drop_debugger: true,
        dead_code: true,
        global_defs: {
          DEBUG: false,
        },
        passes: 3,
        pure_funcs: [
          "console.log",
          "console.debug",
          "console.info",
          "console.warn",
        ],
        unsafe: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
        collapse_vars: true,
        reduce_vars: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        hoist_props: true,
        hoist_vars: true,
        if_return: true,
        join_vars: true,
        side_effects: false,
      },
      mangle: {
        toplevel: true,
        eval: true,
        reserved: [],
        properties: {
          regex: /^_/,
        },
      },
      format: {
        comments: false,
        ascii_only: true,
      },
    },
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        // Define output pattern for entry files (main JavaScript files)
        entryFileNames: "[name].js", // No hash in the filename
        chunkFileNames: "[name].js", // No hash in the filename
        manualChunks: undefined, // Prevent code splitting for smaller builds
      },
      treeshake: {
        preset: "recommended",
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
    },
  },
  plugins: [
    ViteMinifyPlugin({
      removeAttributeQuotes: true,
      minifyJS: true,
      minifyCSS: true,
      removeComments: true,
      sortAttributes: true,
      useShortDoctype: true,
      sortClassName: true,
      removeScriptTypeAttributes: true,
      removeRedundantAttributes: true,
      collapseWhitespace: true,
      removeEmptyAttributes: true,
      removeOptionalTags: true,
      removeStyleLinkTypeAttributes: true,
      minifyURLs: true,
      caseSensitive: true,
      preventAttributesEscaping: true,
    }),
  ],
});
