import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { User, Mail, Calendar, Settings, Shield, Bell } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [selectedPersona, setSelectedPersona] = useState('counselor')

  useEffect(() => {
    if (user) {
      loadProfileData()
    }
  }, [user])

  async function loadProfileData() {
    try {
      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .maybeSingle()

      setProfile(profileData)
      setSelectedPersona(profileData?.ai_persona_preference || 'counselor')

      // Load personality assessments
      const { data: assessmentData } = await supabase
        .from('personality_assessments')
        .select('*')
        .eq('user_id', user!.id)
        .order('completed_at', { ascending: false })

      setAssessments(assessmentData || [])
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updatePreferences() {
    try {
      await supabase
        .from('profiles')
        .update({
          ai_persona_preference: selectedPersona,
          communication_preferences: { notifications },
        })
        .eq('id', user!.id)

      alert('Preferences updated successfully!')
    } catch (error) {
      console.error('Error updating preferences:', error)
      alert('Failed to update preferences')
    }
  }

  const personas = [
    { id: 'counselor', name: 'Counselor', color: 'bg-persona-counselor' },
    { id: 'therapist', name: 'Therapist', color: 'bg-persona-therapist' },
    { id: 'coach', name: 'Coach', color: 'bg-persona-coach' },
    { id: 'career', name: 'Career Guide', color: 'bg-persona-career' },
    { id: 'spiritual', name: 'Spiritual Guide', color: 'bg-persona-spiritual' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="text-text-primary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-text-primary mb-8">Profile & Settings</h1>

        {/* Profile Info */}
        <div className="glass-surface rounded-xl p-8 shadow-glass-card mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-1">
                {profile?.full_name || user?.user_metadata?.full_name || 'User'}
              </h2>
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <Mail className="w-4 h-4" />
                {user?.email}
              </div>
              <div className="flex items-center gap-2 text-text-secondary text-sm mt-1">
                <Calendar className="w-4 h-4" />
                Member since {new Date(profile?.member_since || user?.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Personality Assessments */}
        <div className="glass-surface rounded-xl p-8 shadow-glass-card mb-8">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">Personality Assessments</h2>
          {assessments.length > 0 ? (
            <div className="space-y-4">
              {assessments.map((assessment) => (
                <div key={assessment.id} className="p-4 rounded-lg glass-surface-subtle">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-text-primary capitalize">
                      {assessment.assessment_type}
                    </h3>
                    <span className="text-sm text-text-secondary">
                      {new Date(assessment.completed_at).toLocaleDateString()}
                    </span>
                  </div>
                  {assessment.interpretation && (
                    <p className="text-text-secondary text-sm">{assessment.interpretation}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-center py-8">
              No personality assessments completed yet
            </p>
          )}
        </div>

        {/* Preferences */}
        <div className="glass-surface rounded-xl p-8 shadow-glass-card mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-text-primary">Preferences</h2>
          </div>

          <div className="space-y-6">
            {/* AI Persona Preference */}
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-3">Preferred AI Counselor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {personas.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => setSelectedPersona(persona.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedPersona === persona.id
                        ? 'border-primary bg-primary/10'
                        : 'border-transparent glass-surface-subtle hover:glass-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${persona.color}`} />
                      <span className="font-medium text-text-primary">{persona.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Communication Preferences */}
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-3">Communication</h3>
              <label className="flex items-center gap-3 p-4 rounded-lg glass-surface-subtle cursor-pointer">
                <Bell className="w-5 h-5 text-text-secondary" />
                <div className="flex-1">
                  <div className="font-medium text-text-primary">Session Reminders</div>
                  <div className="text-sm text-text-secondary">
                    Get notified about upcoming sessions and check-ins
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                />
              </label>
            </div>

            <button
              onClick={updatePreferences}
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg shadow-button hover:scale-[1.02] transition-transform"
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* Privacy & Data */}
        <div className="glass-surface rounded-xl p-8 shadow-glass-card">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-text-primary">Privacy & Data</h2>
          </div>

          <div className="space-y-4">
            <p className="text-text-secondary">
              Your data is encrypted and stored securely. We follow HIPAA compliance standards.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-2 glass-surface-subtle rounded-lg hover:glass-surface transition-all text-text-primary">
                Export My Data
              </button>
              <button className="px-6 py-2 text-semantic-error glass-surface-subtle rounded-lg hover:glass-surface transition-all">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
