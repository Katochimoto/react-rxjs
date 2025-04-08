const isProd = process.argv[2] === "--prod"

require("esbuild")
  .build({
    entryPoints: ["src/index.tsx"],
    bundle: true,
    outfile: isProd
      ? "./dist/core.cjs.production.min.js"
      : "./dist/core.cjs.development.js",
    target: "es2015",
    minify: isProd,
    external: ["react", "rxjs", "@rx-state/core"],
    format: "cjs",
    sourcemap: true,
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
