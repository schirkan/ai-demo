import { HeadContent, Link, Outlet, Scripts, createRootRoute } from '@tanstack/react-router';
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
// import { TanStackDevtools } from '@tanstack/react-devtools';
import * as React from 'react';

import appCss from '../css/globals.css?url';

function NotFound() {
  return (
    <main style={{ padding: '4rem', textAlign: 'center' }}>
      <h1>Seite nicht gefunden</h1>
      <p>Die angeforderte Seite konnte nicht gefunden werden.</p>
      <p>
        <Link to="/">Zur Startseite</Link>
      </p>
    </main>
  )
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'AI Demo' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}


let RouterDevtools: any = () => null; // Render nothing in production
if (process.env.NODE_ENV === 'development') {
  // const { TanStackRouterDevtoolsPanel } = await import('@tanstack/react-router-devtools');
  // const { TanStackDevtools } = await import('@tanstack/react-devtools');
  const TanStackRouterDevtoolsPanel = React.lazy(async () => import('@tanstack/react-router-devtools').then((res) => ({
    default: res.TanStackRouterDevtoolsPanel,
  })));
  const TanStackDevtools = React.lazy(async () => import('@tanstack/react-devtools').then((res) => ({
    default: res.TanStackDevtools,
  })));

  RouterDevtools = () =>
    <TanStackDevtools
      config={{
        position: 'bottom-right',
      }}
      plugins={[
        {
          name: 'Tanstack Router',
          render: <TanStackRouterDevtoolsPanel />,
        },
      ]}
    />;
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <RouterDevtools />
        <Scripts />
      </body>
    </html>
  )
}
