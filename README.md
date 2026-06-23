Build Now - Control Plane
Aplicación Control Plane del Proyecto IAW 2026. Esta plataforma provee un panel administrativo centralizado que permite la gestión unificada de todas las apps, la activación y desactivación de usuarios, y la resolución de disputas.

🚀 Deploy
🔗 [Link al Deploy](https://etapa-3-control-plane-buildnow.vercel.app/)

🔐 Accesos y Credenciales
Para acceder a la aplicación puedes usar las siguientes cuentas de prueba:

1. Administrador (Admin)
Email: admin+clerktest@iaw.com
Contraseña: iawuser#

⚙️ Configuración Local (.env)
Para correr el proyecto localmente, configura las siguientes variables en tu archivo .env:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/sign-in

NEXT_PUBLIC_API_SELLER_URL=https://proyecto-b-seller-buildnow.vercel.app
PAYMENTS_APP_URL=https://proyecto-b-payments-buildnow.vercel.app
DELIVERY_API_URL=https://proyecto-b-delivery-buildnow.vercel.app
BUYER_APP_URL=https://proyecto-b-buyer-buildnow.vercel.app

