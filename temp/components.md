#  **ShadCN UI Configuration Documentation**
 This document provides a detailed explanation of the configuration used for setting up ShadCN UI with your project.

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "client/src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```
---
##  $schema
Type: `string`

#### Description: URI to the ShadCN UI schema definition. It enables IDE auto-completion and validation.

Value: `https://ui.shadcn.com/schema.json`

---
##  style
Type: `string`

#### Description: The design style preset used for components.

Value: `"new-york"`

Usage: Selects the "New York" UI design aesthetic from ShadCN styles.

--- 

##  rsc
Type: `boolean`

Description: Indicates whether the project uses React Server Components (RSC).

Value: `false`

Usage: Set to false as this project uses only client-side components.

--- 

##  tsx
Type: `boolean`

Description: Determines whether the components are written in TypeScript + JSX (.tsx).

Value: `true`

Usage: Set to true for full TypeScript support in React components.

---

##  Tailwind Configuration
This section configures how Tailwind CSS integrates with the project.

> config
Type: `string`

Description: Path to the Tailwind configuration file.

Value: `"tailwind.config.ts"`

> css
Type: `string`

Description: Path to the main CSS file where Tailwind directives are imported.

Value: `"client/src/index.css"`

> baseColor
Type: `string`

Description: Sets the default base color theme for UI components.

Value: `"neutral"`

> cssVariables
Type: `boolean`

Description: Enables the use of CSS variables for theming and utility customization.

Value: `true`

> prefix
Type: `string`

Description: A custom prefix for Tailwind utility classes. Useful to avoid class name conflicts.

Value: `""` (empty string indicates no prefix used)

---

##  Aliases
This section defines module import aliases for cleaner import paths in the project.

|Alias |	Path	| Description|
|------|------------|------------|
|components	|`@/components`	|General React component directory|
|utils	|`@/lib/utils`	| Utility functions|
|ui	|`@/components/ui`	| UI-specific component library|
|lib	|`@/lib` |	Shared logic, services, helpers, etc.|
|hooks	|`@/hooks` |	Custom React hooks|

#### These aliases help avoid long relative paths like `../../../components/Button`.
---
## Summary  

#### This configuration sets up a TSX-based, client-side React project using Tailwind CSS and ShadCN UI with the “New York” style. It includes clear path aliases and CSS variable support, making the project modular and themeable.
---
#### For more on ShadCN setup, visit: https://ui.shadcn.com
---

## Happy Coding 