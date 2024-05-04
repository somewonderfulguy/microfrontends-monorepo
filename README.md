```sh
# pnpm --filter <package-name> <command>

pnpm --filter cyberpunk dev
pnpm --filter cyberpunk build
pnpm --filter cyberpunk preview
pnpm add shared --filter cyberpunk --workspace
pnpm add vite-plugin-dts --filter player -D

# npx nx <target> <project>

npx nx build shared
```
