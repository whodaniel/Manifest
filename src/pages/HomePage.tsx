import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Shield, Video, Heart, Users, TrendingUp, Sparkles } from 'lucide-react'

export default function HomePage() {
  const { user } = useAuth()

  const personas = [
    {
      name: 'Counselor',
      description: 'General support and guidance for life challenges',
      color: 'persona-counselor',
      icon: Heart,
    },
    {
      name: 'Therapist',
      description: 'Emotional support and mental health guidance',
      color: 'persona-therapist',
      icon: Users,
    },
    {
      name: 'Coach',
      description: 'Goal-oriented motivation and action planning',
      color: 'persona-coach',
      icon: TrendingUp,
    },
    {
      name: 'Career Counselor',
      description: 'Professional development and career guidance',
      color: 'persona-career',
      icon: TrendingUp,
    },
    {
      name: 'Spiritual Guide',
      description: 'Meaning-making and spiritual exploration',
      color: 'persona-spiritual',
      icon: Sparkles,
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-surface rounded-xl p-12 shadow-glass-card animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6">
              Your Digital Sanctuary for Personal Growth
            </h1>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Receive compassionate AI counseling through video chat, with multiple personas serving as your
              counselor, therapist, coach, career advisor, and spiritual guide.
            </p>
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary rounded-xl shadow-button hover:scale-105 transition-transform duration-200"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex gap-4 justify-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary rounded-xl shadow-button hover:scale-105 transition-transform duration-200"
                >
                  Start Your Free Session
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-text-primary glass-surface rounded-xl hover:glass-surface-emphasized transition-all duration-200"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-surface rounded-xl p-8 text-center shadow-glass-card">
              <div className="text-4xl font-bold text-primary mb-2">93.5%</div>
              <div className="text-text-secondary">Crisis Detection Accuracy</div>
            </div>
            <div className="glass-surface rounded-xl p-8 text-center shadow-glass-card">
              <div className="text-4xl font-bold text-primary mb-2">3-5 Days</div>
              <div className="text-text-secondary">Average Therapeutic Bond Formation</div>
            </div>
            <div className="glass-surface rounded-xl p-8 text-center shadow-glass-card">
              <div className="text-4xl font-bold text-primary mb-2">0.64</div>
              <div className="text-text-secondary">Clinical Effect Size</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Personas */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-text-primary text-center mb-12">
            Meet Your AI Support Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personas.map((persona) => {
              const Icon = persona.icon
              return (
                <div
                  key={persona.name}
                  className="glass-surface rounded-xl p-6 shadow-glass-card hover:-translate-y-1 transition-transform duration-300"
                >
                  <Icon className={`w-12 h-12 text-${persona.color} mb-4`} />
                  <h3 className="text-xl font-semibold text-text-primary mb-2">{persona.name}</h3>
                  <p className="text-text-secondary">{persona.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-text-primary text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="glass-surface rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Choose Your Path</h3>
              <p className="text-text-secondary">
                Select the life domain you want to focus on and the AI persona that fits your needs
              </p>
            </div>
            <div className="text-center">
              <div className="glass-surface rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Begin Your Session</h3>
              <p className="text-text-secondary">
                Connect through video chat and have a meaningful conversation with your AI counselor
              </p>
            </div>
            <div className="text-center">
              <div className="glass-surface rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Track Your Growth</h3>
              <p className="text-text-secondary">
                Review insights, set goals, and visualize your progress across all life domains
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Privacy */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass-surface rounded-xl p-12 shadow-glass-card">
            <div className="flex items-start gap-4 mb-6">
              <Shield className="w-12 h-12 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-3xl font-bold text-text-primary mb-4">Your Privacy & Safety Matter</h2>
                <div className="space-y-3 text-text-secondary">
                  <p>Your data is encrypted end-to-end and stored securely</p>
                  <p>We follow HIPAA compliance standards for mental health data</p>
                  <p>You have full control over your data - export or delete anytime</p>
                  <p>Crisis detection systems ensure immediate access to emergency resources</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-text-primary mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-text-secondary mb-8">
            Join thousands who have found support, guidance, and growth with Manifest
          </p>
          {!user && (
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary rounded-xl shadow-button hover:scale-105 transition-transform duration-200"
            >
              Start Your Free Session
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
