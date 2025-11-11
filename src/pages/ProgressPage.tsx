import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import * as echarts from 'echarts'
import EChartsReactCore from 'echarts-for-react/lib/core'
import { TrendingUp, Target, Award, Calendar, Plus, X, Save } from 'lucide-react'

export default function ProgressPage() {
  const { user } = useAuth()
  const [wheelData, setWheelData] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([])
  const [moodData, setMoodData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form states
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [showMoodForm, setShowMoodForm] = useState(false)
  const [showWheelForm, setShowWheelForm] = useState(false)
  
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'Health',
    target_date: '',
  })
  
  const [newMood, setNewMood] = useState({
    mood_score: 5,
    notes: '',
  })
  
  const [wheelScores, setWheelScores] = useState({
    career: 5,
    health: 5,
    relationships: 5,
    personal_growth: 5,
    finances: 5,
    fun: 5,
    environment: 5,
    spirituality: 5,
  })

  useEffect(() => {
    if (user) {
      loadProgressData()
    }
  }, [user])

  async function loadProgressData() {
    try {
      // Load Wheel of Life history
      const { data: wheelHistory } = await supabase
        .from('wheel_of_life')
        .select('*')
        .eq('user_id', user!.id)
        .order('assessed_at', { ascending: true })

      setWheelData(wheelHistory || [])

      // Load active goals
      const { data: userGoals } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user!.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      setGoals(userGoals || [])

      // Load mood tracking data
      const { data: moodHistory } = await supabase
        .from('mood_tracking')
        .select('*')
        .eq('user_id', user!.id)
        .order('tracked_at', { ascending: true })
        .limit(30)

      setMoodData(moodHistory || [])
    } catch (error) {
      console.error('Error loading progress data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function createGoal(e: React.FormEvent) {
    e.preventDefault()
    try {
      const { error } = await supabase.from('user_goals').insert([
        {
          user_id: user!.id,
          title: newGoal.title,
          description: newGoal.description,
          category: newGoal.category,
          target_date: newGoal.target_date,
          status: 'active',
          progress_percentage: 0,
        },
      ])
      
      if (error) throw error
      
      setNewGoal({ title: '', description: '', category: 'Health', target_date: '' })
      setShowGoalForm(false)
      loadProgressData()
    } catch (error) {
      console.error('Error creating goal:', error)
      alert('Failed to create goal. Please try again.')
    }
  }

  async function logMood(e: React.FormEvent) {
    e.preventDefault()
    try {
      const { error } = await supabase.from('mood_tracking').insert([
        {
          user_id: user!.id,
          mood_score: newMood.mood_score,
          notes: newMood.notes,
          tracked_at: new Date().toISOString(),
        },
      ])
      
      if (error) throw error
      
      setNewMood({ mood_score: 5, notes: '' })
      setShowMoodForm(false)
      loadProgressData()
    } catch (error) {
      console.error('Error logging mood:', error)
      alert('Failed to log mood. Please try again.')
    }
  }

  async function updateWheelOfLife(e: React.FormEvent) {
    e.preventDefault()
    try {
      const { error } = await supabase.from('wheel_of_life').insert([
        {
          user_id: user!.id,
          career_score: wheelScores.career,
          health_score: wheelScores.health,
          relationships_score: wheelScores.relationships,
          personal_growth_score: wheelScores.personal_growth,
          finances_score: wheelScores.finances,
          fun_score: wheelScores.fun,
          environment_score: wheelScores.environment,
          spirituality_score: wheelScores.spirituality,
          assessed_at: new Date().toISOString(),
        },
      ])
      
      if (error) throw error
      
      setShowWheelForm(false)
      loadProgressData()
    } catch (error) {
      console.error('Error updating wheel of life:', error)
      alert('Failed to update assessment. Please try again.')
    }
  }

  const latestWheel = wheelData[wheelData.length - 1]
  const wheelOption = latestWheel
    ? {
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
        },
        series: [
          {
            name: 'Life Balance',
            type: 'radar',
            data: [
              {
                value: [
                  latestWheel.career_score,
                  latestWheel.health_score,
                  latestWheel.relationships_score,
                  latestWheel.personal_growth_score,
                  latestWheel.finances_score,
                  latestWheel.fun_score,
                  latestWheel.environment_score,
                  latestWheel.spirituality_score,
                ],
                areaStyle: { color: 'rgba(107, 127, 232, 0.3)' },
                lineStyle: { color: '#6B7FE8' },
              },
            ],
          },
        ],
      }
    : null

  const moodChartOption = {
    xAxis: {
      type: 'category',
      data: moodData.map((m) => new Date(m.tracked_at).toLocaleDateString()),
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 10,
    },
    series: [
      {
        data: moodData.map((m) => m.mood_score),
        type: 'line',
        smooth: true,
        lineStyle: { color: '#6B7FE8', width: 3 },
        areaStyle: { color: 'rgba(107, 127, 232, 0.2)' },
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
        <h1 className="text-4xl font-bold text-text-primary mb-8">Your Progress & Insights</h1>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-surface rounded-xl p-6 shadow-glass-card">
            <TrendingUp className="w-8 h-8 text-primary mb-2" />
            <div className="text-3xl font-bold text-primary mb-1">{wheelData.length}</div>
            <div className="text-sm text-text-secondary">Assessments Completed</div>
          </div>
          <div className="glass-surface rounded-xl p-6 shadow-glass-card">
            <Target className="w-8 h-8 text-persona-coach mb-2" />
            <div className="text-3xl font-bold text-persona-coach mb-1">{goals.length}</div>
            <div className="text-sm text-text-secondary">Active Goals</div>
          </div>
          <div className="glass-surface rounded-xl p-6 shadow-glass-card">
            <Award className="w-8 h-8 text-semantic-success mb-2" />
            <div className="text-3xl font-bold text-semantic-success mb-1">0</div>
            <div className="text-sm text-text-secondary">Milestones Achieved</div>
          </div>
          <div className="glass-surface rounded-xl p-6 shadow-glass-card">
            <Calendar className="w-8 h-8 text-persona-spiritual mb-2" />
            <div className="text-3xl font-bold text-persona-spiritual mb-1">{moodData.length}</div>
            <div className="text-sm text-text-secondary">Days Tracked</div>
          </div>
        </div>

        {/* Mood Logging Quick Action */}
        <div className="glass-surface rounded-xl p-6 shadow-glass-card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-text-primary">Log Today's Mood</h2>
            {!showMoodForm && (
              <button
                onClick={() => setShowMoodForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Log Mood
              </button>
            )}
          </div>

          {showMoodForm && (
            <form onSubmit={logMood} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  How are you feeling today? (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newMood.mood_score}
                  onChange={(e) => setNewMood({ ...newMood, mood_score: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-text-secondary mt-1">
                  <span>Very Low</span>
                  <span className="text-2xl font-bold text-primary">{newMood.mood_score}</span>
                  <span>Excellent</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={newMood.notes}
                  onChange={(e) => setNewMood({ ...newMood, notes: e.target.value })}
                  placeholder="What's influencing your mood today?"
                  className="w-full px-4 py-2 rounded-lg glass-surface-subtle text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Mood Entry
                </button>
                <button
                  type="button"
                  onClick={() => setShowMoodForm(false)}
                  className="flex items-center gap-2 px-6 py-2 glass-surface-subtle hover:bg-white/10 text-text-primary rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Wheel of Life */}
        <div className="glass-surface rounded-xl p-8 shadow-glass-card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-text-primary">Wheel of Life Balance</h2>
            <button
              onClick={() => setShowWheelForm(!showWheelForm)}
              className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              {showWheelForm ? 'Cancel' : 'Update Assessment'}
            </button>
          </div>

          {showWheelForm && (
            <form onSubmit={updateWheelOfLife} className="mb-6 p-6 glass-surface-subtle rounded-lg">
              <p className="text-text-secondary mb-4">Rate each area of your life from 1-10</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(wheelScores).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-text-primary mb-2 capitalize">
                      {key.replace('_', ' ')}
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={value}
                        onChange={(e) => setWheelScores({ ...wheelScores, [key]: parseInt(e.target.value) })}
                        className="flex-1"
                      />
                      <span className="text-primary font-bold w-8 text-center">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="mt-6 flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Assessment
              </button>
            </form>
          )}

          {wheelOption && <EChartsReactCore echarts={echarts} option={wheelOption} style={{ height: '400px' }} />}
          {!latestWheel && !showWheelForm && (
            <p className="text-text-secondary text-center py-8">
              Complete your first assessment to see your life balance
            </p>
          )}
        </div>

        {/* Mood Trends */}
        <div className="glass-surface rounded-xl p-8 shadow-glass-card mb-8">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">Mood Trends (Last 30 Days)</h2>
          {moodData.length > 0 ? (
            <EChartsReactCore echarts={echarts} option={moodChartOption} style={{ height: '300px' }} />
          ) : (
            <p className="text-text-secondary text-center py-8">
              Start tracking your mood to see trends over time
            </p>
          )}
        </div>

        {/* Active Goals */}
        <div className="glass-surface rounded-xl p-8 shadow-glass-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-text-primary">Active Goals</h2>
            {!showGoalForm && (
              <button
                onClick={() => setShowGoalForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Goal
              </button>
            )}
          </div>

          {showGoalForm && (
            <form onSubmit={createGoal} className="mb-6 p-6 glass-surface-subtle rounded-lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="e.g., Exercise 3 times per week"
                    className="w-full px-4 py-2 rounded-lg glass-surface text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Description
                  </label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Describe your goal and why it matters to you"
                    className="w-full px-4 py-2 rounded-lg glass-surface text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Category
                    </label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg glass-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option>Health</option>
                      <option>Career</option>
                      <option>Relationships</option>
                      <option>Personal Growth</option>
                      <option>Finances</option>
                      <option>Spirituality</option>
                      <option>Environment</option>
                      <option>Fun & Recreation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={newGoal.target_date}
                      onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg glass-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Create Goal
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowGoalForm(false)}
                    className="flex items-center gap-2 px-6 py-2 glass-surface hover:bg-white/10 text-text-primary rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          {goals.length > 0 ? (
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="p-4 rounded-lg glass-surface-subtle">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{goal.title}</h3>
                      <span className="text-xs text-text-secondary">{goal.category}</span>
                    </div>
                    <span className="text-sm font-bold text-primary">{goal.progress_percentage}%</span>
                  </div>
                  {goal.description && (
                    <p className="text-text-secondary text-sm mb-3">{goal.description}</p>
                  )}
                  {goal.target_date && (
                    <p className="text-text-secondary text-xs mb-2">
                      Target: {new Date(goal.target_date).toLocaleDateString()}
                    </p>
                  )}
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${goal.progress_percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !showGoalForm && (
              <p className="text-text-secondary text-center py-8">
                No active goals yet. Create your first goal to start tracking progress
              </p>
            )
          )}
        </div>
      </div>
    </div>
  )
}
