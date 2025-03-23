'use client'

import { MagnifyingGlassIcon, CommandLineIcon, GlobeAltIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Page() {
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const tl2Ref = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Initialize animations
    tlRef.current = gsap.timeline({
      defaults: {
        duration: 2,
        yoyo: true,
        ease: 'power2.inOut'
      }
    })
    .fromTo('.left, .right', {
      svgOrigin: '640 500',
      skewY: (i) => [-30, 15][i],
      scaleX: (i) => [0.6, 0.85][i],
      x: 200
    }, {
      skewY: (i) => [-15, 30][i],
      scaleX: (i) => [0.85, 0.6][i],
      x: -200
    })
    .play(.5);

    tl2Ref.current = gsap.timeline();
    document.querySelectorAll('.animated-text text').forEach((t, i) => {
      tl2Ref.current?.add(
        gsap.fromTo(t, {
          xPercent: -100,
          x: 700
        }, {
          duration: 1,
          xPercent: 0,
          x: 575,
          ease: 'sine.inOut'
        }),
        i % 3 * 0.2
      );
    });

    // Add mouse move handler
    const handlePointerMove = (e: PointerEvent) => {
      if (tlRef.current) tlRef.current.pause();
      if (tl2Ref.current) tl2Ref.current.pause();
      
      gsap.to([tlRef.current, tl2Ref.current], {
        duration: 2,
        ease: 'power4',
        progress: e.x / window.innerWidth
      });
    };

    window.addEventListener('pointermove', handlePointerMove);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Custom styles for animation */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap');
        
        .animation-container {
          position: relative;
          width: 100%;
          height: 50vh;
          overflow: hidden;
        }
        
        .animation-container svg {
          width: 100%;
          height: 100%;
        }
        
        .animated-text {
          font-family: "Montserrat", sans-serif;
          font-optical-sizing: auto;
          font-weight: 900;
          font-style: normal;
        }
      `}</style>

      {/* Animation Section */}
      <div className="animation-container">
        <svg viewBox="0 0 1280 720">
          <mask id="maskLeft">
            <rect x="-50%" width="100%" height="100%" fill="#fff"/>
          </mask>
          <mask id="maskRight">
            <rect x="50%" width="100%" height="100%" fill="#fff"/>
          </mask>
          <g fontSize="150" className="animated-text">
            <g mask="url(#maskLeft)" fill="#d587fa" className="left">
              <text y="120">BETTER</text>
              <text y="250">TECH</text>
              <text y="380">HIRING</text>
            </g>
            <g mask="url(#maskRight)" fill="#d587fa" className="right">
              <text y="120">BETTER</text>
              <text y="250">TECH</text>
              <text y="380">HIRING</text>
            </g>
          </g>
        </svg>
      </div>

      <header className="relative bg-black py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Revolutionizing Tech Hiring</h1>
          <p className="text-xl mb-8 opacity-90">
            Connect with perfect candidates through AI-powered analysis of their skills, experience, and potential
          </p>
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
    </div>
  )
}