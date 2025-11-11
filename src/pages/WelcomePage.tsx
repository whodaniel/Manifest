import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { ArrowRight, Heart, Users, TrendingUp, Briefcase, Sparkles, Check } from 'lucide-react'

export default function WelcomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedFocus, setSelectedFocus] = useState<string[]>([])
  const [selectedPersona, setSelectedPersona] = useState('')

  const focusAreas = [
    { id: 'career', name: 'Career & Work', icon: Briefcase },
    { id: 'health', name: 'Health & Wellness', icon: Heart },
    { id: 'relationships', name: 'Relationships', icon: Users },
    { id: 'growth', name: 'Personal Growth', icon: TrendingUp },
    { id: 'spirituality', name: 'Spirituality', icon: Sparkles },
  ]

  const personas = [
    { id: 'counselor', name: 'Counselor', description: 'General life guidance', icon: Heart },
    { id: 'therapist', name: 'Therapist', description: 'Emotional support', icon: Users },
    { id: 'coach', name: 'Coach', description: 'Goal achievement', icon: TrendingUp },
    { id: 'career', name: 'Career Guide', description: 'Professional development', icon: Briefcase },
    { id: 'spiritual', name: 'Spiritual Guide', description: 'Meaning & purpose', icon: Sparkles },
  ]

  const toggleFocus = (id: string) => {
    setSelectedFocus((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  async function completeOnboarding() {
    try {
      // Update user preferences
      await supabase
        .from('profiles')
        .update({
          ai_persona_preference: selectedPersona,
          last_active: new Date().toISOString(),
        })
        .eq('id', user!.id)

      // Create initial Wheel of Life assessment
      await supabase.from('wheel_of_life').insert([
        {
          user_id: user!.id,
          career_score: 5,
          health_score: 5,
          relationships_score: 5,
          personal_growth_score: 5,
          finances_score: 5,
          fun_score: 5,
          environment_score: 5,
          spirituality_score: 5,
        },
      ])

      navigate('/dashboard')
    } catch (error) {
      console.error('Error completing onboarding:', error)
    }
  }

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-3xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-12 h-1 rounded-full transition-all ${
                  s <= step ? 'bg-primary' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-text-secondary mt-2">Step {step} of 3</p>
        </div>

        <div className="glass-surface rounded-xl p-8 shadow-glass-card">
          {step === 1 && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold text-text-primary mb-4">Welcome to Manifest</h1>
              <p className="text-text-secondary mb-8">
                Let's personalize your experience. This will only take a minute, and you can skip any
                step.
              </p>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Which life areas would you like to focus on?
              </h2>
              <p className="text-text-secondary mb-6">Select all that apply</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {focusAreas.map((area) => {
                  const Icon = area.icon
                  const isSelected = selectedFocus.includes(area.id)
                  return (
                    <button
                      key={area.id}
                      onClick={() => toggleFocus(area.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-transparent glass-surface-subtle hover:glass-surface'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-text-secondary'}`} />
                          <span className="font-medium text-text-primary">{area.name}</span>
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-primary" />}
                      </div>
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-primary text-white font-semibold rounded-lg shadow-button hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Choose Your AI Counselor</h2>
              <p className="text-text-secondary mb-8">
                Select the persona that resonates with you. You can always change this later.
              </p>

              <div className="space-y-4 mb-8">
                {personas.map((persona) => {
                  const Icon = persona.icon
                  return (
                    <button
                      key={persona.id}
                      onClick={() => setSelectedPersona(persona.id)}
                      className={`w-full p-6 rounded-xl border-2 transition-all ${
                        selectedPersona === persona.id
                          ? 'border-primary bg-primary/10'
                          : 'border-transparent glass-surface-subtle hover:glass-surface'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Icon className={`w-8 h-8 ${selectedPersona === persona.id ? 'text-primary' : 'text-text-secondary'}`} />
                        <div className="text-left flex-1">
                          <div className="font-semibold text-text-primary">{persona.name}</div>
                          <div className="text-sm text-text-secondary">{persona.description}</div>
                        </div>
                        {selectedPersona === persona.id && <Check className="w-6 h-6 text-primary" />}
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 glass-surface rounded-lg hover:glass-surface-emphasized transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedPersona}
                  className="flex-1 py-3 bg-primary text-white font-semibold rounded-lg shadow-button hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in text-center">
              <Sparkles className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-text-primary mb-4">You're All Set!</h2>
              <p className="text-text-secondary mb-8 max-w-lg mx-auto">
                Your personalized sanctuary is ready. Begin your journey towards growth, balance, and
                fulfillment.
              </p>

              <button
                onClick={completeOnboarding}
                className="px-8 py-4 bg-primary text-white font-semibold rounded-lg shadow-button hover:scale-[1.02] transition-transform"
              >
                Enter My Sanctuary
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
