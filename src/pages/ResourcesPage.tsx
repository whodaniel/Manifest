import { useState } from 'react'
import { BookOpen, Brain, Heart, Sparkles, TrendingUp } from 'lucide-react'

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('personality')

  const tabs = [
    { id: 'personality', name: 'Personality Frameworks', icon: Brain },
    { id: 'life', name: 'Life Domains', icon: Heart },
    { id: 'therapeutic', name: 'Therapeutic Approaches', icon: Sparkles },
    { id: 'wellness', name: 'Wellness Tips', icon: TrendingUp },
  ]

  const personalityFrameworks = [
    {
      name: 'Big Five (OCEAN)',
      description:
        'Five broad dimensions of personality: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism',
      image: '/imgs/big_five_0.png',
    },
    {
      name: 'MBTI',
      description: '16 personality types based on four dichotomies: E/I, S/N, T/F, J/P',
      image: '/imgs/mbti_2.png',
    },
    {
      name: 'Enneagram',
      description: 'Nine interconnected personality types with growth paths and stress patterns',
      image: '/imgs/enneagram_3.jpg',
    },
    {
      name: 'DISC',
      description:
        'Four behavioral styles: Dominance, Influence, Steadiness, Conscientiousness',
      image: '/imgs/disc_1.png',
    },
    {
      name: 'Emotional Intelligence',
      description: 'Four core competencies: Self-awareness, self-management, social awareness, relationship management',
      image: '/imgs/emotional_intelligence_2.png',
    },
    {
      name: 'Attachment Styles',
      description: 'Four patterns of relating: Secure, Anxious, Avoidant, Fearful-Avoidant',
      image: '/imgs/attachment_6.JPG',
    },
  ]

  const lifeDomains = [
    {
      name: 'Wheel of Life',
      description: '8 key life areas: Career, Health, Relationships, Personal Growth, Finances, Fun, Environment, Spirituality',
      image: '/imgs/wheel_of_life_3.jpg',
    },
    {
      name: 'Maslow\'s Hierarchy',
      description: 'Five-level pyramid of human needs from physiological to self-actualization',
      image: '/imgs/maslow_pyramid_3.png',
    },
    {
      name: 'Holistic Wellness',
      description: 'Integrated approach to physical, mental, emotional, and spiritual wellbeing',
      image: '/imgs/holistic_wellness_infographic_1.png',
    },
    {
      name: 'Career Development',
      description: 'Super\'s Career Rainbow - life stages and roles across the lifespan',
      image: '/imgs/career_rainbow_0.jpg',
    },
  ]

  const therapeuticApproaches = [
    {
      name: 'Cognitive Behavioral Therapy (CBT)',
      description: 'Focus on identifying and changing negative thought patterns and behaviors',
    },
    {
      name: 'Motivational Interviewing',
      description: 'Collaborative, person-centered approach to strengthening motivation for change',
    },
    {
      name: 'Solution-Focused Brief Therapy',
      description: 'Goal-oriented therapy focusing on solutions rather than problems',
    },
    {
      name: 'GROW Coaching Model',
      description: 'Goal, Reality, Options, Will - structured approach to goal achievement',
    },
    {
      name: 'Person-Centered Therapy',
      description: 'Empathetic, non-judgmental approach emphasizing self-actualization',
    },
    {
      name: 'Acceptance and Commitment Therapy (ACT)',
      description: 'Mindfulness and acceptance strategies with commitment to valued action',
    },
  ]

  const wellnessTips = [
    {
      name: 'Mood Tracking Benefits',
      description: 'Regular mood tracking helps identify patterns, triggers, and progress over time',
    },
    {
      name: 'SMART Goals',
      description: 'Set Specific, Measurable, Achievable, Relevant, Time-bound goals for better success',
    },
    {
      name: 'Habit Formation',
      description: 'Start small, be consistent, track progress, and celebrate wins to build lasting habits',
    },
    {
      name: 'Self-Compassion',
      description: 'Treat yourself with the same kindness you would offer a good friend',
    },
  ]

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">Resources & Learning</h1>
          <p className="text-text-secondary">
            Explore frameworks, approaches, and insights to support your personal growth
          </p>
        </div>

        {/* Tabs */}
        <div className="glass-surface rounded-xl p-2 mb-8 shadow-glass-card">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:glass-surface-subtle'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium hidden sm:inline">{tab.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {activeTab === 'personality' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalityFrameworks.map((framework) => (
                <div
                  key={framework.name}
                  className="glass-surface rounded-xl overflow-hidden shadow-glass-card hover:-translate-y-1 transition-transform"
                >
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-persona-spiritual/20 overflow-hidden">
                    <img 
                      src={framework.image} 
                      alt={framework.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-16 h-16 text-primary opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></div>'
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      {framework.name}
                    </h3>
                    <p className="text-text-secondary text-sm">{framework.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'life' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lifeDomains.map((domain) => (
                <div
                  key={domain.name}
                  className="glass-surface rounded-xl overflow-hidden shadow-glass-card hover:-translate-y-1 transition-transform"
                >
                  <div className="h-56 bg-gradient-to-br from-persona-therapist/20 to-persona-coach/20 overflow-hidden">
                    <img 
                      src={domain.image} 
                      alt={domain.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-16 h-16 text-persona-therapist opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></div>'
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-text-primary mb-2">{domain.name}</h3>
                    <p className="text-text-secondary text-sm">{domain.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'therapeutic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {therapeuticApproaches.map((approach) => (
                <div
                  key={approach.name}
                  className="glass-surface rounded-xl p-6 shadow-glass-card hover:-translate-y-1 transition-transform"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <h3 className="text-lg font-semibold text-text-primary">{approach.name}</h3>
                  </div>
                  <p className="text-text-secondary text-sm">{approach.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'wellness' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {wellnessTips.map((tip) => (
                <div
                  key={tip.name}
                  className="glass-surface rounded-xl p-6 shadow-glass-card hover:-translate-y-1 transition-transform"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <TrendingUp className="w-6 h-6 text-semantic-success flex-shrink-0 mt-1" />
                    <h3 className="text-lg font-semibold text-text-primary">{tip.name}</h3>
                  </div>
                  <p className="text-text-secondary">{tip.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
