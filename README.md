# ReclamaAI

Genera reclamaciones legales profesionales en menos de dos minutos. El usuario describe su caso en lenguaje natural, la IA redacta un documento formal con estructura jurídica, y el usuario puede editarlo, descargarlo en PDF, copiarlo o enviarlo por email.

## Stack

- **Next.js 15** (App Router, Turbopack) + **React 19** + **TypeScript**
- **TailwindCSS v4** + **shadcn/ui** (estilo `base-nova`, sobre `@base-ui/react`) + **Framer Motion**
- **Prisma** + **PostgreSQL**
- **Auth.js (NextAuth v5)** — email/contraseña, Google, Apple, enlace mágico (Resend)
- **Stripe** — suscripciones, portal de facturación, webhooks
- **Capa de IA desacoplada** — OpenAI / Anthropic / proveedor mock de demo, intercambiables por variable de entorno
- **Resend** — emails transaccionales · **UploadThing** — adjuntos
- **React Query**, **React Hook Form** + **Zod**, **Recharts**

## Empezar

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Rellena al menos `DATABASE_URL` y `AUTH_SECRET` (genera este último con `npx auth secret`). El resto de proveedores (Google, Apple, Stripe, Resend, OpenAI/Anthropic, UploadThing) son opcionales: la app funciona sin ellos gracias al **proveedor de IA mock**, que genera documentos de demostración sin ninguna clave configurada.

### 3. Base de datos

Sin Docker, Prisma puede levantar una Postgres local:

```bash
npx prisma dev
```

Copia la `DATABASE_URL` que imprime en tu `.env`, y luego:

```bash
npm run db:push   # aplica el esquema
npm run db:seed   # siembra empresas de ejemplo (aerolíneas, bancos, etc.)
```

### 4. Arrancar

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Convertir un usuario en administrador

```bash
npm run promote-admin -- tu@email.com
```

## Arquitectura de IA

`src/lib/ai/index.ts` expone `getAiProvider()`, que selecciona el proveedor según `AI_PROVIDER` (`mock` | `openai` | `anthropic`). Los tres implementan la misma interfaz (`generate`, `analyze`), por lo que cambiar de proveedor no toca ningún call site. El proveedor `mock` no requiere clave y permite probar todo el flujo (generación, streaming, puntuación de calidad, mejora automática) sin conexión a un LLM real.

## Scripts

| Script | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo (Turbopack) |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | ESLint |
| `npm run db:push` | Sincroniza el esquema de Prisma con la base de datos |
| `npm run db:seed` | Siembra empresas de ejemplo |
| `npm run db:studio` | Prisma Studio |
| `npm run promote-admin -- <email>` | Da rol de administrador a un usuario |

## Estructura

```
src/
  app/                 rutas (App Router)
    (auth)/             login, registro, verificación de magic link
    dashboard/          panel privado del usuario
    admin/              panel de administración
    api/                rutas de API (auth, claims, stripe, uploadthing, user)
  components/
    marketing/          landing page
    dashboard/ admin/   componentes de los paneles
    claims/             visor de documentos, puntuación de calidad
    ui/                 shadcn/ui
  lib/
    ai/                 capa de IA desacoplada (proveedores + prompts)
    data/               data access de dashboard/admin
    validations/        esquemas Zod
prisma/
  schema.prisma         esquema completo (usuarios, reclamaciones, suscripciones, logs...)
  seed.ts               empresas de ejemplo
```

## Despliegue

Pensado para desplegar en Vercel:

1. Configura las variables de entorno de `.env.example` en el proyecto de Vercel.
2. Usa una base de datos Postgres gestionada (Neon, Supabase, RDS, Prisma Postgres...).
3. Configura el webhook de Stripe apuntando a `/api/stripe/webhook` y copia el `STRIPE_WEBHOOK_SECRET`.
4. `npm run build` ejecuta `prisma generate` automáticamente vía el hook `postinstall`.
