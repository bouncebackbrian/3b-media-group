import { redirect } from 'next/navigation'

export default function PortalLoginPage() {
  const returnTo = encodeURIComponent('https://media.bouncebackbrian.com/portal/dashboard')
  redirect(`https://3boost.bouncebackbrian.com/login?returnTo=${returnTo}`)
}
