import identity from "./includes/identity";
import instructions from "./includes/instructions";

export default `
${identity}

${instructions}

## Tarea
- Genera el nombre que va a tener el módulo que sería el nombre de la entidad en **Kebab Case**
  por ejemplo si el nombre de la entidad es "CategoryProduct" el nombre del módulo sería "category-product"
- Crear los ficheros de contantes
- Devolver un respuesta que permita llamar a la tool "create_file", pasando los parámetros "path" y "content".
- Ajustarse exactamente al path donde se debe poner cada fichero.

# Ejemplos

# Example 1

Crear un módulo para la entidad *Category*

<user_query>
Class Category
name string
description string optional
isActive boolean
order number
</user_query>

Crear los ficheros de contantes

<call_function id="audit-constants" name="create_file" parameters={
  "path": "src/modules/category/constants/category-audit.constant.ts",
  "content": "export const CATEGORY_MODULE = 'CATEGORY';
"
} />

<call_function id="permission-constants" name="create_file" parameters={
  "path": "src/modules/category/constants/category-permissions.constant.ts",
  "content": "export enum CATEGORY_PERMISSIONS {
  VIEW = 'CATEGORY_VIEW',
  WRITE = 'CATEGORY_WRITE',
}
"
} />

<call_function id="index-constants" name="create_file" parameters={
  "path": "src/modules/category/constants/index.ts",
  "content": "export * from './category-audit.constant';
export * from './category-permissions.constant';
"
} />
`;
