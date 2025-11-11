import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Search, Clock, Video, Heart } from 'lucide-react'

export default function HistoryPage() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<any[]>([])
  const [filteredSessions, setFilteredSessions] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPersona, setFilterPersona] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadSessions()
    }
  }, [user])

  useEffect(() => {
    filterSessions()
  }, [sessions, searchTerm, filterPersona])

  async function loadSessions() {
    try {
      const { data, error } = await supabase
        .from('ai_sessions')
        .select('*')
        .eq('user_id', user!.id)
        .order('started_at', { ascending: false })

      if (error) throw error
      setSessions(data || [])
    } catch (error) {
      console.error('Error loading sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  function filterSessions() {
    let filtered = sessions

    if (filterPersona !== 'all') {
      filtered = filtered.filter((s) => s.persona_type === filterPersona)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.session_notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.topics?.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredSessions(filtered)
  }

  const personas = ['all', 'counselor', 'therapist', 'coach', 'career', 'spiritual']

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
        <h1 className="text-4xl font-bold text-text-primary mb-8">Session History</h1>

        {/* Search and Filters */}
        <div className="glass-surface rounded-xl p-6 shadow-glass-card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search sessions..."
                className="w-full pl-12 pr-4 py-3 glass-surface-subtle rounded-lg text-text-primary placeholder-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {personas.map((persona) => (
                <button
                  key={persona}
                  onClick={() => setFilterPersona(persona)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                    filterPersona === persona
                      ? 'bg-primary text-white'
                      : 'glass-surface-subtle text-text-secondary hover:glass-surface'
                  }`}
                >
                  {persona}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sessions Timeline */}
        <div className="space-y-4">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session, index) => (
              <div
                key={session.id}
                className="glass-surface rounded-xl p-6 shadow-glass-card hover:-translate-y-1 transition-transform"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      {session.persona_type === 'therapist' && <Heart className="w-6 h-6 text-persona-therapist" />}
                      {session.persona_type === 'counselor' && <Video className="w-6 h-6 text-persona-counselor" />}
                      {session.persona_type !== 'therapist' && session.persona_type !== 'counselor' && (
                        <Video className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary capitalize">
                        {session.persona_type} Session
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(session.started_at).toLocaleString()}</span>
                        {session.duration_seconds && (
                          <span className="ml-2">
                            {Math.floor(session.duration_seconds / 60)} minutes
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      session.status === 'completed'
                        ? 'bg-semantic-success/20 text-semantic-success'
                        : 'bg-primary/20 text-primary'
                    }`}
                  >
                    {session.status}
                  </span>
                </div>

                {session.topics && session.topics.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-2">
                      {session.topics.map((topic: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-md glass-surface-subtle text-xs text-text-secondary"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {session.session_notes && (
                  <p className="text-text-secondary text-sm mb-3">{session.session_notes}</p>
                )}

                {session.key_insights && session.key_insights.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-2">Key Insights:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {session.key_insights.map((insight: string, idx: number) => (
                        <li key={idx} className="text-text-secondary text-sm">
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {session.mood_before && session.mood_after && (
                  <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-4 text-sm">
                    <span className="text-text-secondary">
                      Mood Before: <span className="text-text-primary font-medium">{session.mood_before}/10</span>
                    </span>
                    <span className="text-text-secondary">
                      Mood After: <span className="text-text-primary font-medium">{session.mood_after}/10</span>
                    </span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="glass-surface rounded-xl p-12 text-center shadow-glass-card">
              <Video className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">No sessions found</h3>
              <p className="text-text-secondary mb-6">
                {sessions.length === 0
                  ? "You haven't had any sessions yet. Start your first one to begin your journey!"
                  : 'Try adjusting your search or filters'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
