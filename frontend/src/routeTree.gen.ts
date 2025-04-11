/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LayoutImport } from './routes/_layout'
import { Route as LayoutIndexImport } from './routes/_layout/index'
import { Route as LayoutUserInfoImport } from './routes/_layout/user-info'
import { Route as LayoutUserImport } from './routes/_layout/user'
import { Route as LayoutLoginImport } from './routes/_layout/login'
import { Route as LayoutDashboardPrettyImport } from './routes/_layout/dashboard-pretty'
import { Route as LayoutDashboardImport } from './routes/_layout/dashboard'
import { Route as LayoutAdminImport } from './routes/_layout/admin'
import { Route as LayoutAboutImport } from './routes/_layout/about'

// Create/Update Routes

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const LayoutIndexRoute = LayoutIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutUserInfoRoute = LayoutUserInfoImport.update({
  id: '/user-info',
  path: '/user-info',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutUserRoute = LayoutUserImport.update({
  id: '/user',
  path: '/user',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutLoginRoute = LayoutLoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutDashboardPrettyRoute = LayoutDashboardPrettyImport.update({
  id: '/dashboard-pretty',
  path: '/dashboard-pretty',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutDashboardRoute = LayoutDashboardImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutAdminRoute = LayoutAdminImport.update({
  id: '/admin',
  path: '/admin',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutAboutRoute = LayoutAboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => LayoutRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_layout': {
      id: '/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/_layout/about': {
      id: '/_layout/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof LayoutAboutImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/admin': {
      id: '/_layout/admin'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof LayoutAdminImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/dashboard': {
      id: '/_layout/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof LayoutDashboardImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/dashboard-pretty': {
      id: '/_layout/dashboard-pretty'
      path: '/dashboard-pretty'
      fullPath: '/dashboard-pretty'
      preLoaderRoute: typeof LayoutDashboardPrettyImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/login': {
      id: '/_layout/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LayoutLoginImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/user': {
      id: '/_layout/user'
      path: '/user'
      fullPath: '/user'
      preLoaderRoute: typeof LayoutUserImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/user-info': {
      id: '/_layout/user-info'
      path: '/user-info'
      fullPath: '/user-info'
      preLoaderRoute: typeof LayoutUserInfoImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/': {
      id: '/_layout/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof LayoutIndexImport
      parentRoute: typeof LayoutImport
    }
  }
}

// Create and export the route tree

interface LayoutRouteChildren {
  LayoutAboutRoute: typeof LayoutAboutRoute
  LayoutAdminRoute: typeof LayoutAdminRoute
  LayoutDashboardRoute: typeof LayoutDashboardRoute
  LayoutDashboardPrettyRoute: typeof LayoutDashboardPrettyRoute
  LayoutLoginRoute: typeof LayoutLoginRoute
  LayoutUserRoute: typeof LayoutUserRoute
  LayoutUserInfoRoute: typeof LayoutUserInfoRoute
  LayoutIndexRoute: typeof LayoutIndexRoute
}

const LayoutRouteChildren: LayoutRouteChildren = {
  LayoutAboutRoute: LayoutAboutRoute,
  LayoutAdminRoute: LayoutAdminRoute,
  LayoutDashboardRoute: LayoutDashboardRoute,
  LayoutDashboardPrettyRoute: LayoutDashboardPrettyRoute,
  LayoutLoginRoute: LayoutLoginRoute,
  LayoutUserRoute: LayoutUserRoute,
  LayoutUserInfoRoute: LayoutUserInfoRoute,
  LayoutIndexRoute: LayoutIndexRoute,
}

const LayoutRouteWithChildren =
  LayoutRoute._addFileChildren(LayoutRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof LayoutRouteWithChildren
  '/about': typeof LayoutAboutRoute
  '/admin': typeof LayoutAdminRoute
  '/dashboard': typeof LayoutDashboardRoute
  '/dashboard-pretty': typeof LayoutDashboardPrettyRoute
  '/login': typeof LayoutLoginRoute
  '/user': typeof LayoutUserRoute
  '/user-info': typeof LayoutUserInfoRoute
  '/': typeof LayoutIndexRoute
}

export interface FileRoutesByTo {
  '/about': typeof LayoutAboutRoute
  '/admin': typeof LayoutAdminRoute
  '/dashboard': typeof LayoutDashboardRoute
  '/dashboard-pretty': typeof LayoutDashboardPrettyRoute
  '/login': typeof LayoutLoginRoute
  '/user': typeof LayoutUserRoute
  '/user-info': typeof LayoutUserInfoRoute
  '/': typeof LayoutIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_layout': typeof LayoutRouteWithChildren
  '/_layout/about': typeof LayoutAboutRoute
  '/_layout/admin': typeof LayoutAdminRoute
  '/_layout/dashboard': typeof LayoutDashboardRoute
  '/_layout/dashboard-pretty': typeof LayoutDashboardPrettyRoute
  '/_layout/login': typeof LayoutLoginRoute
  '/_layout/user': typeof LayoutUserRoute
  '/_layout/user-info': typeof LayoutUserInfoRoute
  '/_layout/': typeof LayoutIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/about'
    | '/admin'
    | '/dashboard'
    | '/dashboard-pretty'
    | '/login'
    | '/user'
    | '/user-info'
    | '/'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/about'
    | '/admin'
    | '/dashboard'
    | '/dashboard-pretty'
    | '/login'
    | '/user'
    | '/user-info'
    | '/'
  id:
    | '__root__'
    | '/_layout'
    | '/_layout/about'
    | '/_layout/admin'
    | '/_layout/dashboard'
    | '/_layout/dashboard-pretty'
    | '/_layout/login'
    | '/_layout/user'
    | '/_layout/user-info'
    | '/_layout/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  LayoutRoute: typeof LayoutRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  LayoutRoute: LayoutRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_layout"
      ]
    },
    "/_layout": {
      "filePath": "_layout.tsx",
      "children": [
        "/_layout/about",
        "/_layout/admin",
        "/_layout/dashboard",
        "/_layout/dashboard-pretty",
        "/_layout/login",
        "/_layout/user",
        "/_layout/user-info",
        "/_layout/"
      ]
    },
    "/_layout/about": {
      "filePath": "_layout/about.tsx",
      "parent": "/_layout"
    },
    "/_layout/admin": {
      "filePath": "_layout/admin.tsx",
      "parent": "/_layout"
    },
    "/_layout/dashboard": {
      "filePath": "_layout/dashboard.tsx",
      "parent": "/_layout"
    },
    "/_layout/dashboard-pretty": {
      "filePath": "_layout/dashboard-pretty.tsx",
      "parent": "/_layout"
    },
    "/_layout/login": {
      "filePath": "_layout/login.tsx",
      "parent": "/_layout"
    },
    "/_layout/user": {
      "filePath": "_layout/user.tsx",
      "parent": "/_layout"
    },
    "/_layout/user-info": {
      "filePath": "_layout/user-info.tsx",
      "parent": "/_layout"
    },
    "/_layout/": {
      "filePath": "_layout/index.tsx",
      "parent": "/_layout"
    }
  }
}
ROUTE_MANIFEST_END */
