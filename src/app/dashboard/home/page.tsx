'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useTheme } from 'next-themes'
import {
  Code2,
  Users,
  Globe,
  Search,
  BrainCircuit,
  Clock,
  ThumbsUp,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Page() {
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const tl2Ref = useRef<gsap.core.Timeline | null>(null)
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState('features')

  useEffect(() => {
    // Initialize animations
    tlRef.current = gsap
      .timeline({
        defaults: {
          duration: 2,
          yoyo: true,
          ease: 'power2.inOut',
        },
      })
      .fromTo(
        '.left, .right',
        {
          svgOrigin: '640 500',
          skewY: (i) => [-30, 15][i],
          scaleX: (i) => [0.6, 0.85][i],
          x: 200,
        },
        {
          skewY: (i) => [-15, 30][i],
          scaleX: (i) => [0.85, 0.6][i],
          x: -200,
        },
      )
      .play(0.5)

    tl2Ref.current = gsap.timeline()
    document.querySelectorAll('.animated-text text').forEach((t, i) => {
      tl2Ref.current?.add(
        gsap.fromTo(
          t,
          {
            xPercent: -100,
            x: 700,
          },
          {
            duration: 1,
            xPercent: 0,
            x: 575,
            ease: 'sine.inOut',
          },
        ),
        (i % 3) * 0.2,
      )
    })

    // Add mouse move handler
    const handlePointerMove = (e: PointerEvent) => {
      if (tlRef.current) tlRef.current.pause()
      if (tl2Ref.current) tl2Ref.current.pause()

      gsap.to([tlRef.current, tl2Ref.current], {
        duration: 2,
        ease: 'power4',
        progress: e.x / window.innerWidth,
      })
    }

    window.addEventListener('pointermove', handlePointerMove)

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  // Determine text color based on theme - ensure high contrast in both modes
  // const textColor = theme === 'dark' ? '#FFFFFF' : '#000000'
  const textColor = '#FFFFFF'
  const textColorMuted = theme === 'dark' ? '#555555' : '#666666'

  return (
    <div>
      {/* Custom styles for animation */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap');
        .animation-container {
          position: relative;
          width: 100%;
          height: 30vh;
          overflow: hidden;
          background-color: transparent;
        }
        .animation-container svg {
          width: 100%;
          height: 100%;
        }
        .animated-text {
          font-family: 'Montserrat', sans-serif;
          font-optical-sizing: auto;
          font-weight: 900;
          font-style: normal;
        }
        .dark .animated-text text {
          filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.5));
        }
        .feature-card {
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-5px);
        }
        .gradient-bg {
          background: linear-gradient(
            135deg,
            hsl(var(--primary) / 0.2) 0%,
            hsl(var(--primary) / 0.1) 100%
          );
        }
      `}</style>

      {/* Hero Section with Animation */}
      <div className="animation-container">
        <svg viewBox="0 0 1280 720">
          <mask id="maskLeft">
            <rect x="-50%" width="100%" height="100%" fill="#fff" />
          </mask>
          <mask id="maskRight">
            <rect x="50%" width="100%" height="100%" fill="#fff" />
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

      {/* Tagline */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          Connect with perfect candidates through AI-powered analysis
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Find the right tech talent faster with our advanced matching algorithm
        </p>
      </div>

      {/* Main Content with Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          defaultValue="features"
          className="w-full"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <div className="text-center mb-4">
            <TabsList className="inline-flex">
              <TabsTrigger value="features">Why Choose Nexus</TabsTrigger>
              <TabsTrigger value="matching">
                Smart Candidate Matching
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="features" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Deep Insights',
                  description:
                    'Go beyond resumes with comprehensive analysis of actual skills and potential',
                  icon: BrainCircuit,
                  color: 'bg-blue-500/10',
                  textColor: 'text-blue-500',
                },
                {
                  title: 'Time Saver',
                  description:
                    'Reduce screening time by 80% with automated matching and intelligent filtering',
                  icon: Clock,
                  color: 'bg-purple-500/10',
                  textColor: 'text-purple-500',
                },
                {
                  title: 'Better Matches',
                  description:
                    'Proprietary algorithm identifies candidates most likely to succeed in your environment',
                  icon: ThumbsUp,
                  color: 'bg-green-500/10',
                  textColor: 'text-green-500',
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="feature-card border-border overflow-hidden"
                >
                  <div className={`h-2 ${feature.color}`}></div>
                  <CardHeader>
                    <div
                      className={`${feature.color} w-12 h-12 rounded-lg mb-3 flex items-center justify-center`}
                    >
                      <feature.icon
                        className={`w-6 h-6 ${feature.textColor}`}
                      />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      className={`${feature.textColor} p-0`}
                    >
                      Learn more <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="matching">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Smart Candidate Matching
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our AI analyzes multiple data sources to find candidates who
                truly fit your requirements
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: Code2,
                  label: 'Code Repositories',
                  description:
                    'Analyze GitHub, GitLab, and other code repositories to evaluate real coding skills',
                  badge: 'Technical Skills',
                },
                {
                  icon: Users,
                  label: 'Social Profiles',
                  description:
                    'Review LinkedIn, Twitter and professional networks to understand career trajectory',
                  badge: 'Professional Growth',
                },
                {
                  icon: Globe,
                  label: 'Portfolio Sites',
                  description:
                    'Examine personal websites and project portfolios to assess creativity and initiative',
                  badge: 'Project Experience',
                },
                {
                  icon: Search,
                  label: 'Deep Analysis',
                  description:
                    'Comprehensive skills and cultural fit assessment using proprietary algorithms',
                  badge: 'Cultural Fit',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-6 border border-border hover:border-primary/40 transition-colors shadow-sm"
                >
                  <Badge variant="outline" className="mb-4">
                    {item.badge}
                  </Badge>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {item.label}
                      </h3>
                      <p className="text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="testimonials">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                See how companies have transformed their hiring process with
                Nexus
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  company: 'TechGiant Inc.',
                  quote:
                    'Nexus helped us reduce our time-to-hire by 65% while improving the quality of our technical hires.',
                  author: 'Sarah Johnson',
                  role: 'CTO',
                  image: '/placeholder.svg?height=64&width=64',
                },
                {
                  company: 'StartupBoost',
                  quote:
                    'As a growing startup, finding the right technical talent was our biggest challenge until we found Nexus.',
                  author: 'Michael Chen',
                  role: 'Founder & CEO',
                  image: '/placeholder.svg?height=64&width=64',
                },
                {
                  company: 'Enterprise Solutions',
                  quote:
                    "The quality of candidates we've hired through Nexus has dramatically improved our development velocity.",
                  author: 'Jessica Williams',
                  role: 'VP of Engineering',
                  image: '/placeholder.svg?height=64&width=64',
                },
                {
                  company: 'Digital Innovations',
                  quote:
                    "Nexus's AI matching has helped us build diverse teams with complementary skill sets.",
                  author: 'Robert Garcia',
                  role: 'Head of Talent',
                  image: '/placeholder.svg?height=64&width=64',
                },
              ].map((testimonial, index) => (
                <Card key={index} className="border-border">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.image || '/placeholder.svg'}
                        alt={testimonial.author}
                        className="rounded-full w-12 h-12 object-cover"
                      />
                      <div>
                        <CardTitle className="text-lg">
                          {testimonial.author}
                        </CardTitle>
                        <CardDescription>
                          {testimonial.role}, {testimonial.company}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="italic">&quot;{testimonial.quote}&quot;</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
