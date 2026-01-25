# MapColonies App Boilerplate

A comprehensive boilerplate template for MapColonies applications built with React, TypeScript and i18n support.

## Features

- ⚛️ **React 18** with TypeScript
- 🌍 **i18n** - Hebrew and English language support
- 🚦 **React Router** - Client-side routing
- 🐳 **Docker** - Containerization support
- ⎈ **Helm** - Kubernetes deployment
- 🔄 **Release Please** - Automated releases and changelogs
- 🛠️ **Runtime Configuration** - Environment variables support via confd

## Getting Started

### Prerequisites

- Node.js 16
- yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/MapColonies/app-boilerplate.git
cd app-boilerplate

# Install dependencies
yarn

# Generate runtime environment variables
yarn confd

# Start development server
yarn start
```

The application will be available at http://localhost:3000

### Development

```bash
yarn global add serve

# Build for production
yarn build

# Preview production build
npx serve -s build

# Lint code
yarn eslint:fix

# Format code
yarn prettier:fix
```

## Docker

### Build and Run

```bash
# Build Docker image
docker build -t app-boilerplate .

# Run container
docker run -p 3000:8080 \
  -e CONFIGURATION_LANGUAGE=en \
  app-boilerplate
```

## Kubernetes Deployment

### Using Helm

```bash
# Install the Helm chart
helm install app-boilerplate ./helm \
  --set image.repository=your-registry/app-boilerplate \
  --set image.tag=latest \
  --set env.language=en

# Upgrade the deployment
helm upgrade app-boilerplate ./helm

# Uninstall
helm uninstall app-boilerplate
```

## Internationalization

The application supports Hebrew (RTL) and English (LTR) languages. Add translations in:

- `src/i18n/locales/en.json`
- `src/i18n/locales/he.json`

Use the `useIntl` hook from react-intl:

```tsx
import { useIntl } from 'react-intl';

const Component = () => {
  const intl = useIntl();
  return <h1>{intl.formatMessage({ id: 'home.title' })}</h1>;
};
```

## Deployment

> [!IMPORTANT] 
> We depend on `Red-Hat Yaml Extension` for validating the values files against the relevant schemas from helm-common.
> That means, you should install the extension from vscode in order to be able to edit values files according to our schemas.

To update helm dependencies
```bash
yarn helm-update
```

In order to create/renew values schemas 
```bash
yarn helm-assets
```

To deploy: helm values **MUST** be combined from global.yaml and values.yaml (use npm script!)
```bash
yarn helm-install
```

See [helm values](https://github.com/MapColonies/helm-common/blob/c352a2453117895ec0f9df0267a66d6f5b9c2da2/README.md)

## Release Management

This project uses [Release Please](https://github.com/googleapis/release-please) for automated releases.

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes using conventional commits
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Support

For support and questions, please open an issue in the GitHub repository.
