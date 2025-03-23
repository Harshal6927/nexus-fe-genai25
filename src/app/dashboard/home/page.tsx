'use client'

import { MagnifyingGlassIcon, CommandLineIcon, GlobeAltIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { BrainCircuit, Clock, ThumbsUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useTheme } from 'next-themes'

export default function Page() {
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const tl2Ref = useRef<gsap.core.Timeline | null>(null);
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState<'matching' | 'features'>('matching');
  const cardSectionRef = useRef<HTMLDivElement>(null);

  // Timer to automatically switch between sections
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSection(prev => prev === 'matching' ? 'features' : 'matching');
    }, 8000); // Switch every 8 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Animation for switching between sections
  useEffect(() => {
    if (cardSectionRef.current) {
      const matchingSection = cardSectionRef.current.querySelector('.matching-section');
      const featuresSection = cardSectionRef.current.querySelector('.features-section');
      
      if (matchingSection && featuresSection) {
        gsap.to(matchingSection, {
          opacity: activeSection === 'matching' ? 1 : 0,
          duration: 0.5,
          display: activeSection === 'matching' ? 'flex' : 'none'
        });
        
        gsap.to(featuresSection, {
          opacity: activeSection === 'features' ? 1 : 0,
          duration: 0.5,
          display: activeSection === 'features' ? 'block' : 'none'
        });
      }
    }
  }, [activeSection]);

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

  // Determine text color based on theme
  const textColor = theme === 'dark' ? '#FFFFFF' : '#000000';
  const textColorMuted = theme === 'dark' ? '#AAAAAA' : '#666666';

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground flex flex-col">
      {/* Custom styles for animation */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap');
        
        .animation-container {
          position: relative;
          width: 100%;
          height: 30vh; /* Reduced height */
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
        
        .section-tabs {
          display: flex;
          justify-content: center;
          margin-bottom: 0.5rem; /* Reduced margin */
        }
        
        .section-tab {
          padding: 0.5rem 1rem;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
        }
        
        .section-tab.active {
          border-bottom-color: hsl(var(--primary));
          color: hsl(var(--primary));
        }
        
        .matching-section, .features-section {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
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
            <g mask="url(#maskLeft)" className="left" fill={textColor}>
              <text y="120">ELEVATING</text>
              <text y="250">TECH</text>
              <text y="380">HIRING</text>
            </g>
            <g mask="url(#maskRight)" className="right" fill={textColorMuted}>
              <text y="120">ELEVATING</text>
              <text y="250">TECH</text>
              <text y="380">HIRING</text>
            </g>
          </g>
        </svg>
      </div>

      {/* Reduced top padding in header */}
      <header className="py-4 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold">
            Connect with perfect candidates through AI-powered analysis of their skills, experience, and potential
          </h3>
        </div>
      </header>

      {/* Section tabs */}
      <div className="section-tabs">
        <div 
          className={`section-tab ${activeSection === 'matching' ? 'active' : ''}`}
          onClick={() => setActiveSection('matching')}
        >
          Smart Candidate Matching
        </div>
        <div 
          className={`section-tab ${activeSection === 'features' ? 'active' : ''}`}
          onClick={() => setActiveSection('features')}
        >
          Why Choose Nexus
        </div>
      </div>

      {/* Combined card section with animation - now using flex-1 to take remaining space */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 relative" ref={cardSectionRef}>
        {/* Smart Candidate Matching Section - Centered and enhanced */}
        <div className="matching-section" style={{display: activeSection === 'matching' ? 'flex' : 'none'}}>
          <div className="bg-card rounded-xl shadow-xl p-8 border border-border w-full flex items-center justify-center">
            <div className="max-w-2xl w-full">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-3">Smart Candidate Matching</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes multiple data sources to find candidates who truly fit your requirements
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: CommandLineIcon, label: 'Code Repositories', description: 'Analyze GitHub, GitLab, and other code repositories' },
                  { icon: UserGroupIcon, label: 'Social Profiles', description: 'Review LinkedIn, Twitter and professional networks' },
                  { icon: GlobeAltIcon, label: 'Portfolio Sites', description: 'Examine personal websites and project portfolios' },
                  { icon: MagnifyingGlassIcon, label: 'Deep Analysis', description: 'Comprehensive skills and cultural fit assessment' },
                ].map((item, index) => (
                  <div key={index} className="flex flex-col p-4 bg-muted rounded-lg border border-border/40 hover:border-primary/40 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Nexus Section */}
        <div className="features-section" style={{display: activeSection === 'features' ? 'block' : 'none', opacity: 0}}>
          <div className="bg-card rounded-xl shadow-xl p-6 border border-border h-full">
            <h2 className="text-xl font-bold mb-5 text-center">Why Choose Nexus?</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  title: 'Deep Insights',
                  description: 'Go beyond resumes with comprehensive analysis of actual skills',
                  color: 'bg-primary/20',
                  icon: BrainCircuit
                },
                {
                  title: 'Time Saver',
                  description: 'Reduce screening time by 80% with automated matching',
                  color: 'bg-secondary/20',
                  icon: Clock
                },
                {
                  title: 'Better Matches',
                  description: 'Proprietary algorithm identifies candidates most likely to succeed',
                  color: 'bg-accent/20',
                  icon: ThumbsUp
                },
              ].map((feature, index) => (
                <div key={index} className="p-4 rounded-xl text-left border border-border">
                  <div className={`${feature.color} w-10 h-10 rounded-lg mb-3 flex items-center justify-center`}>
                    <feature.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}