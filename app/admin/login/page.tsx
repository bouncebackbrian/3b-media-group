import { redirect } from 'next/navigation'

export default function AdminLoginPage() {
  const returnTo = encodeURIComponent('https://media.bouncebackbrian.com/admin/dashboard')
  redirect(`https://3boost.bouncebackbrian.com/login?returnTo=${returnTo}`)
}
