'use client'

import { MagnifyingGlassIcon, CommandLineIcon, GlobeAltIcon, UserGroupIcon } from '@heroicons/react/24/outline'

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="relative bg-black py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Revolutionizing Tech Hiring</h1>
          <p className="text-xl mb-8 opacity-90">
            Connect with perfect candidates through AI-powered analysis of their skills, experience, and potential
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-opacity-90 transition-all">
              Get Started
            </button>
            <button className="px-8 py-3 border border-white rounded-lg hover:bg-white hover:text-black transition-all">
              How It Works
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-16 -mt-20">
        <div className="bg-gray-900 rounded-xl shadow-xl p-8 border border-gray-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 bg-gray-800 rounded-lg p-4 h-64">
              {/* Placeholder for platform screenshot/mockup */}
              <div className="w-full h-full bg-gray-700 rounded-lg animate-pulse" />
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold">Smart Candidate Matching</h3>
              <p className="text-gray-300">
                Our AI analyzes multiple data sources to find candidates who truly fit your requirements:
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: CommandLineIcon, label: 'Code Repositories' },
                  { icon: UserGroupIcon, label: 'Social Profiles' },
                  { icon: GlobeAltIcon, label: 'Portfolio Sites' },
                  { icon: MagnifyingGlassIcon, label: 'Deep Analysis' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <item.icon className="h-6 w-6 text-blue-400" />
                    <span className="text-gray-100">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-gray-900 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Why Choose Nexus?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Deep Insights',
                description: 'Go beyond resumes with comprehensive analysis of actual skills and experience',
                color: 'bg-blue-900'
              },
              {
                title: 'Time Saver',
                description: 'Reduce screening time by 80% with automated candidate matching',
                color: 'bg-purple-900'
              },
              {
                title: 'Better Matches',
                description: 'Proprietary algorithm identifies candidates most likely to succeed',
                color: 'bg-green-900'
              },
            ].map((feature, index) => (
              <div key={index} className="p-6 rounded-xl text-left border border-gray-800">
                <div className={`${feature.color} w-12 h-12 rounded-lg mb-4 flex items-center justify-center`}>
                  <div className="w-6 h-6 bg-white rounded-full" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Hiring?</h2>
          <p className="text-gray-300 mb-8">Join hundreds of companies already finding their perfect matches</p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all">
              Start Free Trial
            </button>
            <button className="px-8 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}