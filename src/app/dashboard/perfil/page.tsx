import { auth } from "@/auth"
import { ProfileForm } from "@/components/dashboard/profile-form"
import { PasswordForm } from "@/components/dashboard/password-form"
import { DeleteAccount } from "@/components/dashboard/delete-account"

export default async function PerfilPage() {
  const session = await auth()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Perfil</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gestiona tu información personal y seguridad.</p>
      </div>
      <ProfileForm name={session!.user.name} email={session!.user.email} />
      <PasswordForm />
      <DeleteAccount />
    </div>
  )
}
