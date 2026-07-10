import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { Clock, QrCode, UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AdminShell,
  MemberStatusBadge,
  formatDateTime,
} from '@/lib/admin-ui'

import { api } from '../../convex/_generated/api'

function AdminDashboard() {
  const members = useQuery(api.members.list)
  const scanLogs = useQuery(api.scanLogs.list, {})
  const memberRows = members ?? []
  const scanRows = scanLogs ?? []
  const vipCount = memberRows.filter((member) => member.status === 'vip').length

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total members</CardDescription>
            <CardTitle className="text-3xl">{memberRows.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>VIP members</CardDescription>
            <CardTitle className="text-3xl">{vipCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Recent check-ins</CardDescription>
            <CardTitle className="text-3xl">{scanRows.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <Card>
          <CardHeader>
            <CardTitle>Latest members</CardTitle>
            <CardDescription>
              Manual member creation and edits live in the members section.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Code</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memberRows.slice(0, 8).map((member) => (
                  <TableRow key={member._id}>
                    <TableCell>
                      <Button asChild variant="link">
                        <Link
                          params={{ memberId: member._id }}
                          to="/admin/members/$memberId"
                        >
                          {member.name}
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <MemberStatusBadge status={member.status} />
                    </TableCell>
                    <TableCell className="font-mono">
                      {member.memberCode}
                    </TableCell>
                  </TableRow>
                ))}
                {memberRows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      className="py-8 text-center text-muted-foreground"
                      colSpan={3}
                    >
                      No members yet.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-4 content-start">
          <Button asChild size="lg">
            <Link to="/admin/members">
              <UserPlus />
              Add member
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/admin/check-in">
              <QrCode />
              Manual check-in
            </Link>
          </Button>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-5" />
                Recent scans
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {scanRows.slice(0, 6).map((scan) => (
                <div className="border-b pb-3 last:border-0" key={scan._id}>
                  <p className="font-mono text-sm">{scan.memberCode}</p>
                  <p className="text-muted-foreground text-sm">
                    {formatDateTime(scan.scannedAt)}
                  </p>
                </div>
              ))}
              {scanRows.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No check-ins logged.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  )
}

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})
