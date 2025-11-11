import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Menu, X, User, Home, Video, BarChart3, Clock, Award, BookOpen } from 'lucide-react'
import { useState } from 'react'

export default function Navigation() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/session', label: 'Begin Session', icon: Video },
    { to: '/progress', label: 'Progress', icon: BarChart3 },
    { to: '/history', label: 'History', icon: Clock },
    { to: '/resources', label: 'Resources', icon: BookOpen },
    { to: '/profile', label: 'Profile', icon: User },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-surface-emphasized h-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-4">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Award className="w-8 h-8 text-primary" />
            <span className="text-xl font-semibold text-text-primary">Manifest</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(link.to)
                      ? 'text-primary font-medium'
                      : 'text-text-secondary hover:text-primary hover:-translate-y-0.5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{link.label}</span>
                </Link>
              )
            })}
            <button
              onClick={() => signOut()}
              className="ml-4 px-4 py-2 text-sm text-text-secondary hover:text-primary transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg glass-surface"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-surface-emphasized border-t border-white/20">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(link.to)
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-secondary hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
            <button
              onClick={() => {
                signOut()
                setMobileMenuOpen(false)
              }}
              className="w-full text-left px-4 py-3 text-text-secondary hover:bg-white/10 rounded-lg"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
