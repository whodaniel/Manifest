import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Video, VideoOff, Mic, MicOff, PhoneOff, MessageSquare, X } from 'lucide-react'

export default function SessionPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [sessionStarted, setSessionStarted] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [selectedPersona, setSelectedPersona] = useState('counselor')

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (sessionStarted) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [sessionStarted])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  async function startSession() {
    try {
      const { data, error } = await supabase
        .from('ai_sessions')
        .insert([
          {
            user_id: user!.id,
            persona_type: selectedPersona,
            status: 'in_progress',
            started_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error
      setSessionId(data.id)
      setSessionStarted(true)
    } catch (error) {
      console.error('Error starting session:', error)
    }
  }

  async function endSession() {
    if (!sessionId) return

    try {
      const { error } = await supabase
        .from('ai_sessions')
        .update({
          status: 'completed',
          duration_seconds: duration,
          ended_at: new Date().toISOString(),
        })
        .eq('id', sessionId)

      if (error) throw error
      navigate('/dashboard')
    } catch (error) {
      console.error('Error ending session:', error)
    }
  }

  const personas = [
    { id: 'counselor', name: 'Counselor', color: 'bg-persona-counselor' },
    { id: 'therapist', name: 'Therapist', color: 'bg-persona-therapist' },
    { id: 'coach', name: 'Coach', color: 'bg-persona-coach' },
    { id: 'career', name: 'Career Guide', color: 'bg-persona-career' },
    { id: 'spiritual', name: 'Spiritual Guide', color: 'bg-persona-spiritual' },
  ]

  if (!sessionStarted) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="glass-surface rounded-xl p-8 shadow-glass-card">
            <h1 className="text-3xl font-bold text-text-primary mb-6">Choose Your AI Counselor</h1>
            <p className="text-text-secondary mb-8">
              Select the persona that best fits your needs for this session
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {personas.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona.id)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    selectedPersona === persona.id
                      ? 'border-primary bg-primary/10'
                      : 'border-transparent glass-surface-subtle hover:glass-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${persona.color}`} />
                    <span className="text-lg font-semibold text-text-primary">{persona.name}</span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={startSession}
              className="w-full py-4 bg-primary text-white font-semibold rounded-lg shadow-button hover:scale-[1.02] transition-transform"
            >
              <Video className="w-5 h-5 inline-block mr-2" />
              Start Session
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black">
      {/* Video Area */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* AI Video (placeholder) */}
        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-white text-center">
            <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl opacity-75">AI Counselor Video Stream</p>
            <p className="text-sm opacity-50 mt-2">Video integration in development</p>
          </div>
        </div>

        {/* User Self-View */}
        <div className="absolute bottom-24 right-8 w-48 h-36 glass-surface-emphasized rounded-lg overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
            {videoEnabled ? (
              <Video className="w-8 h-8 text-white opacity-50" />
            ) : (
              <VideoOff className="w-8 h-8 text-white opacity-50" />
            )}
          </div>
        </div>

        {/* Session Info */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 glass-surface-emphasized rounded-full px-6 py-3 flex items-center gap-4">
          <span className="text-white font-medium capitalize">{selectedPersona}</span>
          <span className="text-white font-mono">{formatDuration(duration)}</span>
        </div>

        {/* Control Bar */}
        <div className="absolute bottom-0 left-0 right-0 glass-surface-emphasized border-t border-white/20 py-6">
          <div className="max-w-2xl mx-auto flex items-center justify-center gap-4">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-4 rounded-full ${
                audioEnabled ? 'glass-surface' : 'bg-semantic-error'
              } hover:scale-110 transition-transform`}
            >
              {audioEnabled ? (
                <Mic className="w-6 h-6 text-white" />
              ) : (
                <MicOff className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              onClick={() => setVideoEnabled(!videoEnabled)}
              className={`p-4 rounded-full ${
                videoEnabled ? 'glass-surface' : 'bg-semantic-error'
              } hover:scale-110 transition-transform`}
            >
              {videoEnabled ? (
                <Video className="w-6 h-6 text-white" />
              ) : (
                <VideoOff className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              onClick={endSession}
              className="p-4 rounded-full bg-semantic-error hover:scale-110 transition-transform"
            >
              <PhoneOff className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="p-4 rounded-full glass-surface hover:scale-110 transition-transform"
            >
              <MessageSquare className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Chat Sidebar */}
        {chatOpen && (
          <div className="absolute right-0 top-0 bottom-0 w-96 glass-surface-emphasized border-l border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Session Notes</h3>
              <button onClick={() => setChatOpen(false)}>
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <textarea
              className="w-full h-full bg-white/10 rounded-lg p-4 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Take notes during your session..."
            />
          </div>
        )}
      </div>
    </div>
  )
}
