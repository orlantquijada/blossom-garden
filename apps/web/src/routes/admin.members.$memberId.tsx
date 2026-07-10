import {
  Link,
  createFileRoute,
  useNavigate,
} from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { ArrowLeft, Pencil, Save, ScanLine, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  AdminShell,
  MemberStatusBadge,
  formatDateTime,
} from '@/lib/admin-ui'
import { qrUrl } from '@/lib/utils'

import { api } from '../../convex/_generated/api'
import type { Doc, Id } from '../../convex/_generated/dataModel'

function MemberDetailPage() {
  const { memberId } = Route.useParams()
  const id = memberId as Id<'members'>
  const member = useQuery(api.members.get, { id })
  const scanLogs = useQuery(api.scanLogs.list, { memberId: id }) ?? []
  const updateMember = useMutation(api.members.update)
  const deleteMember = useMutation(api.members.remove)
  const checkIn = useMutation(api.scanLogs.checkIn)
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSave(
    event: FormEvent<HTMLFormElement>,
    current: Doc<'members'>,
  ) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()

    if (!name || !email) {
      return
    }

    await updateMember({
      email,
      id: current._id,
      name,
      notes: String(form.get('notes') ?? '').trim() || undefined,
      phone: String(form.get('phone') ?? '').trim() || undefined,
      status: current.status,
    })
    setEditing(false)
    setMessage('Member updated.')
  }

  async function toggleStatus(current: Doc<'members'>) {
    await updateMember({
      email: current.email,
      id: current._id,
      name: current.name,
      notes: current.notes,
      phone: current.phone,
      status: current.status === 'vip' ? 'regular' : 'vip',
    })
    setMessage('Status updated.')
  }

  async function handleDelete(current: Doc<'members'>) {
    if (!window.confirm(`Delete ${current.name}?`)) {
      return
    }

    await deleteMember({ id: current._id })
    await navigate({ to: '/admin/members' })
  }

  async function handleManualScan(current: Doc<'members'>) {
    await checkIn({ memberCode: current.memberCode, note: 'Manual admin scan' })
    setMessage('Check-in logged.')
  }

  return (
    <AdminShell title="Member detail">
      <div className="mb-4">
        <Button asChild variant="outline">
          <Link to="/admin/members">
            <ArrowLeft />
            Members
          </Link>
        </Button>
      </div>

      {!member ? (
        <Card>
          <CardHeader>
            <CardTitle>Member not found</CardTitle>
            <CardDescription>
              This member may have been deleted.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.email}</CardDescription>
                </div>
                <MemberStatusBadge status={member.status} />
              </div>
            </CardHeader>
            <CardContent>
              <form
                className="grid gap-4"
                key={member._id}
                onSubmit={(event) => handleSave(event, member)}
              >
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      defaultValue={member.name}
                      disabled={!editing}
                      id="name"
                      name="name"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      defaultValue={member.email}
                      disabled={!editing}
                      id="email"
                      name="email"
                      required
                      type="email"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    defaultValue={member.phone}
                    disabled={!editing}
                    id="phone"
                    name="phone"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    defaultValue={member.notes}
                    disabled={!editing}
                    id="notes"
                    name="notes"
                    rows={4}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {editing ? (
                    <>
                      <Button type="submit">
                        <Save />
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditing(false)}
                        type="button"
                        variant="outline"
                      >
                        <X />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setEditing(true)}
                      type="button"
                      variant="outline"
                    >
                      <Pencil />
                      Edit
                    </Button>
                  )}
                  <Button
                    onClick={() => toggleStatus(member)}
                    type="button"
                    variant="outline"
                  >
                    Mark {member.status === 'vip' ? 'regular' : 'VIP'}
                  </Button>
                  <Button
                    onClick={() => handleManualScan(member)}
                    type="button"
                    variant="outline"
                  >
                    <ScanLine />
                    Log scan
                  </Button>
                  <Button
                    onClick={() => handleDelete(member)}
                    type="button"
                    variant="destructive"
                  >
                    <Trash2 />
                    Delete
                  </Button>
                </div>
                {message ? (
                  <p className="text-emerald-700 text-sm">{message}</p>
                ) : null}
              </form>
            </CardContent>
          </Card>

          <div className="grid gap-6 content-start">
            <Card>
              <CardHeader>
                <CardTitle>Member code</CardTitle>
                <CardDescription>Use this for manual check-ins.</CardDescription>
              </CardHeader>
              <CardContent className="grid justify-items-start gap-4">
                <Badge className="font-mono text-base" variant="secondary">
                  {member.memberCode}
                </Badge>
                <img
                  alt={`QR code for ${member.memberCode}`}
                  className="size-44 rounded-md border bg-white p-3"
                  src={qrUrl(member.memberCode, 176)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scan history</CardTitle>
                <CardDescription>
                  Last {scanLogs.length} check-ins for this member.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                {scanLogs.map((scan) => (
                  <div className="border-b pb-3 last:border-0" key={scan._id}>
                    <p className="font-mono text-sm">{scan.memberCode}</p>
                    <p className="text-muted-foreground text-sm">
                      {formatDateTime(scan.scannedAt)}
                    </p>
                    {scan.note ? <p className="text-sm">{scan.note}</p> : null}
                  </div>
                ))}
                {scanLogs.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No scans logged.
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </AdminShell>
  )
}

export const Route = createFileRoute('/admin/members/$memberId')({
  component: MemberDetailPage,
})
