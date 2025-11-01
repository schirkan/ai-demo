declare module 'imgbb-uploader';

declare module '*.md' {
  const content: string;
  export default content;
}

/**
 * CSS / CSS Module typings for Vite + TanStack Start migration
 * - *.module.css for CSS modules
 * - *.css for global CSS imports
 * - *.css?url and *.css?inline for Vite URL imports
 */
/*
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.css?url' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.css?url' {
  const url: string;
  export default url;
}

declare module '*.css?inline' {
  const content: string;
  export default content;
}
*/