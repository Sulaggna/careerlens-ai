import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Save, Mail, MapPin, Briefcase, AlertTriangle } from 'lucide-react'
import Card, { CardHeader } from '../components/ui/Card'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import { useAuth, ApiError } from '../contexts/AuthContext'

export default function Profile() {
  const { user, updateProfile, deleteAccount } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [title, setTitle] = useState(user?.title || '')
  const [location, setLocation] = useState(user?.location || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await updateProfile({ name, email, title, location, bio })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      // Error handling can be expanded with toast notifications
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteAccount()
      navigate('/login', {
        replace: true,
        state: { message: 'Your account has been permanently deleted.' },
      })
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setDeleteError('Your session has expired. Please sign in again.')
        } else if (err.status === 403) {
          setDeleteError('You do not have permission to delete this account.')
        } else {
          setDeleteError(err.message)
        }
      } else {
        setDeleteError('Unable to delete account. Please try again later.')
      }
      setShowDeleteConfirm(false)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Profile Settings</h2>
        <p className="mt-1 text-muted">Manage your CareerLens AI account and preferences.</p>
      </div>

      <Card>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative">
            <Avatar name={name} size="xl" />
            <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white shadow-md hover:bg-primary-600">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-semibold text-foreground">{name}</h3>
            <p className="text-muted">{title || 'Add your job title'}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-4 text-sm text-muted sm:justify-start">
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {email}
              </span>
              {location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {location}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Personal Information" description="Update your profile details" />
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Job Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Software Engineer"
              hint="Displayed on your dashboard"
            />
            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA"
            />
          </div>

          <Textarea
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a bit about yourself..."
            rows={4}
          />

          <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
            {saved && (
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Profile saved successfully!
              </span>
            )}
            <Button type="submit" loading={saving} leftIcon={<Save className="h-4 w-4" />}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader title="Account Statistics" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Resumes Uploaded', value: '4', icon: Briefcase },
            { label: 'Avg. ATS Score', value: '75%', icon: Briefcase },
            { label: 'Interviews Done', value: '5', icon: Briefcase },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg bg-muted-bg p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Danger Zone" description="Irreversible account actions" />
        {deleteError && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {deleteError}
          </div>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Delete Account</p>
            <p className="text-sm text-muted">
              Permanently delete your CareerLens AI account and all associated data.
            </p>
          </div>
          <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
            Delete Account
          </Button>
        </div>
      </Card>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Delete Account</h3>
            <p className="mt-2 text-sm text-muted">
              Are you sure you want to permanently delete your account?
            </p>
            <p className="mt-2 text-sm text-muted">
              This action cannot be undone. All your data will be permanently removed.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button variant="danger" loading={deleting} onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
