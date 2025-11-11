import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Video, Target, TrendingUp, Clock, Sparkles } from 'lucide-react'
import * as echarts from 'echarts'
import EChartsReactCore from 'echarts-for-react/lib/core'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalSessions: 0,
    currentStreak: 0,
    goalsCompleted: 0,
    avgMood: 0,
  })
  const [recentSessions, setRecentSessions] = useState<any[]>([])
  const [wheelData, setWheelData] = useState<number[]>([5, 5, 5, 5, 5, 5, 5, 5])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  async function loadDashboardData() {
    try {
      // Get session count
      const { count: sessionCount } = await supabase
        .from('ai_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user!.id)

      // Get recent sessions
      const { data: sessions } = await supabase
        .from('ai_sessions')
        .select('*')
        .eq('user_id', user!.id)
        .order('started_at', { ascending: false })
        .limit(5)

      // Get completed goals count
      const { count: goalsCount } = await supabase
        .from('user_goals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user!.id)
        .eq('status', 'completed')

      // Get latest Wheel of Life data
      const { data: wheelLatest } = await supabase
        .from('wheel_of_life')
        .select('*')
        .eq('user_id', user!.id)
        .order('assessed_at', { ascending: false })
        .maybeSingle()

      if (wheelLatest) {
        setWheelData([
          wheelLatest.career_score,
          wheelLatest.health_score,
          wheelLatest.relationships_score,
          wheelLatest.personal_growth_score,
          wheelLatest.finances_score,
          wheelLatest.fun_score,
          wheelLatest.environment_score,
          wheelLatest.spirituality_score,
        ])
      }

      setStats({
        totalSessions: sessionCount || 0,
        currentStreak: 0, // TODO: Calculate streak
        goalsCompleted: goalsCount || 0,
        avgMood: 7, // TODO: Calculate from mood_tracking
      })

      setRecentSessions(sessions || [])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const wheelOption = {
    radar: {
      indicator: [
        { name: 'Career', max: 10 },
        { name: 'Health', max: 10 },
        { name: 'Relationships', max: 10 },
        { name: 'Growth', max: 10 },
        { name: 'Finances', max: 10 },
        { name: 'Fun', max: 10 },
        { name: 'Environment', max: 10 },
        { name: 'Spirituality', max: 10 },
      ],
      splitArea: {
        areaStyle: {
          color: ['rgba(107, 127, 232, 0.05)', 'rgba(107, 127, 232, 0.1)'],
        },
      },
    },
    series: [
      {
        name: 'Life Balance',
        type: 'radar',
        data: [
          {
            value: wheelData,
            name: 'Current State',
            areaStyle: {
              color: 'rgba(107, 127, 232, 0.3)',
            },
            lineStyle: {
              color: '#6B7FE8',
              width: 2,
            },
          },
        ],
      },
    ],
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="text-text-primary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="glass-surface rounded-xl p-8 mb-8 shadow-glass-card">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Welcome back, {user?.user_metadata?.full_name || 'Friend'}
          </h1>
          <p className="text-text-secondary">
            Let's continue your personal development journey
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-surface rounded-xl p-6 shadow-glass-card">
            <Video className="w-8 h-8 text-primary mb-2" />
            <div className="text-3xl font-bold text-primary mb-1">{stats.totalSessions}</div>
            <div className="text-sm text-text-secondary">Total Sessions</div>
          </div>
          <div className="glass-surface rounded-xl p-6 shadow-glass-card">
            <TrendingUp className="w-8 h-8 text-semantic-success mb-2" />
            <div className="text-3xl font-bold text-semantic-success mb-1">{stats.currentStreak}</div>
            <div className="text-sm text-text-secondary">Day Streak</div>
          </div>
          <div className="glass-surface rounded-xl p-6 shadow-glass-card">
            <Target className="w-8 h-8 text-persona-coach mb-2" />
            <div className="text-3xl font-bold text-persona-coach mb-1">{stats.goalsCompleted}</div>
            <div className="text-sm text-text-secondary">Goals Completed</div>
          </div>
          <div className="glass-surface rounded-xl p-6 shadow-glass-card">
            <Sparkles className="w-8 h-8 text-persona-spiritual mb-2" />
            <div className="text-3xl font-bold text-persona-spiritual mb-1">{stats.avgMood}/10</div>
            <div className="text-sm text-text-secondary">Average Mood</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wheel of Life */}
          <div className="lg:col-span-2 glass-surface rounded-xl p-8 shadow-glass-card">
            <h2 className="text-2xl font-semibold text-text-primary mb-6">Wheel of Life Balance</h2>
            <EChartsReactCore echarts={echarts} option={wheelOption} style={{ height: '400px' }} />
            <Link
              to="/progress"
              className="mt-4 inline-flex items-center text-primary hover:underline"
            >
              Update your assessment
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="glass-surface rounded-xl p-6 shadow-glass-card">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/session"
                  className="flex items-center gap-3 p-3 rounded-lg bg-primary text-white hover:scale-[1.02] transition-transform"
                >
                  <Video className="w-5 h-5" />
                  <span className="font-medium">Start New Session</span>
                </Link>
                <Link
                  to="/progress"
                  className="flex items-center gap-3 p-3 rounded-lg glass-surface-subtle hover:glass-surface transition-all"
                >
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-text-primary">View Progress</span>
                </Link>
                <Link
                  to="/resources"
                  className="flex items-center gap-3 p-3 rounded-lg glass-surface-subtle hover:glass-surface transition-all"
                >
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-text-primary">Explore Resources</span>
                </Link>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="glass-surface rounded-xl p-6 shadow-glass-card">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Sessions</h3>
              {recentSessions.length > 0 ? (
                <div className="space-y-3">
                  {recentSessions.slice(0, 3).map((session) => (
                    <div key={session.id} className="p-3 rounded-lg glass-surface-subtle">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-text-primary capitalize">
                          {session.persona_type}
                        </span>
                        <Clock className="w-4 h-4 text-text-secondary" />
                      </div>
                      <div className="text-xs text-text-secondary">
                        {new Date(session.started_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  <Link
                    to="/history"
                    className="text-sm text-primary hover:underline inline-block mt-2"
                  >
                    View all sessions
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-text-secondary">No sessions yet. Start your first one!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
