import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { title, description, slots, roles, icon, admin_password } = req.body

  const { error } = await supabase
    .from('config')
    .update({
      title,
      description,
      slots,
      roles,
      icon,
      admin_password,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 'main')

  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ ok: true })
}
