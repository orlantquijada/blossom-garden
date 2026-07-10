import { Link, createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { Search, UserPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import {
  AdminShell,
  MemberStatusBadge,
  formatDateTime,
} from '@/lib/admin-ui'
import type { MemberStatus } from '@/lib/admin-ui'

import { api } from '../../convex/_generated/api'

function MembersPage() {
  const members = useQuery(api.members.list)
  const createMember = useMutation(api.members.create)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<MemberStatus>('regular')
  const [message, setMessage] = useState('')
  const rows = members ?? []
  const filteredRows = useMemo(() => {
    const needle = search.trim().toLowerCase()

    if (!needle) {
      return rows
    }

    return rows.filter((member) =>
      [
        member.name,
        member.email,
        member.memberCode,
        member.phone ?? '',
        member.status,
      ]
        .join(' ')
        .toLowerCase()
        .includes(needle),
    )
  }, [rows, search])

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')

    const formElement = event.currentTarget
    const form = new FormData(formElement)
    const name = String(form.get('name') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()

    if (!name || !email) {
      return
    }

    const result = await createMember({
      email,
      name,
      notes: String(form.get('notes') ?? '').trim() || undefined,
      phone: String(form.get('phone') ?? '').trim() || undefined,
      status,
    })

    formElement.reset()
    setStatus('regular')
    setMessage(`Created ${result.memberCode}.`)
  }

  return (
    <AdminShell title="Members">
      <div className="grid gap-6 lg:grid-cols-[23rem_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="size-5" />
              Add member
            </CardTitle>
            <CardDescription>
              Manual admin entry for the prototype.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleCreate}>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" required type="email" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <select
                  className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  id="status"
                  onChange={(event) =>
                    setStatus(event.target.value as MemberStatus)
                  }
                  value={status}
                >
                  <option value="regular">Regular</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" rows={3} />
              </div>
              <Button type="submit">
                <UserPlus />
                Create member
              </Button>
              {message ? (
                <p className="text-emerald-700 text-sm">{message}</p>
              ) : null}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle>All members</CardTitle>
                <CardDescription>
                  {filteredRows.length} of {rows.length} shown
                </CardDescription>
              </div>
              <label className="relative w-full md:w-80">
                <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, email, code"
                  value={search}
                />
              </label>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell>
                      <Button asChild className="px-0" variant="link">
                        <Link
                          params={{ memberId: member._id }}
                          to="/admin/members/$memberId"
                        >
                          {member.name}
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div>{member.email}</div>
                      {member.phone ? (
                        <div className="text-muted-foreground text-sm">
                          {member.phone}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <MemberStatusBadge status={member.status} />
                    </TableCell>
                    <TableCell>
                      <Badge className="font-mono" variant="secondary">
                        {member.memberCode}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDateTime(member.createdAt)}</TableCell>
                  </TableRow>
                ))}
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      className="py-10 text-center text-muted-foreground"
                      colSpan={5}
                    >
                      No members found.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  )
}

export const Route = createFileRoute('/admin/members/')({
  component: MembersPage,
})
