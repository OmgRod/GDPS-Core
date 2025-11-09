# Contributing

Thanks for considering contributing! Please follow these guidelines to make the process smooth.

1. Fork the repository and create a feature branch from `main`.
2. Make small, focused changes and include tests where appropriate.
3. Run linters and builds locally before opening a PR:

```powershell
# build backend
cd backend
yarn install
yarn build

# build frontend
cd ../frontend
yarn install
yarn build
```

4. Open a pull request and use the provided template. Link related issues and include testing steps.

Coding style
- Use TypeScript and prefer strict typing.
- Keep changes small and document behavior in README or inline comments.
