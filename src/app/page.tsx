
'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import Logo from '@/components/logo';
import { ThemeToggle } from "@/components/theme-toggle";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Heart,
  Building2,
  GraduationCap,
  CalendarDays,
  DollarSign,
  ArrowRight,
  Star,
  Globe,
  Clock,
  Check,
  ChefHat,
  Hotel,
  Target,
  Eye,
  MessageSquare
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const DEFAULT_DASHBOARD_ROUTE = '/dashboard';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      router.push(DEFAULT_DASHBOARD_ROUTE);
    } catch (err) {
      setError('Unable to open the dashboard. Please try again.');
      console.error('Login redirect error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: ChefHat,
      title: "Restaurant & Food Service",
      description: "Complete POS system, kitchen management, and food cost optimization"
    },
    {
      icon: Hotel,
      title: "Hospitality Management",
      description: "Hotel operations, room management, and guest services"
    },
    {
      icon: GraduationCap,
      title: "Educational Institutions",
      description: "Academic operations, student management, and fee collection"
    },
    {
      icon: CalendarDays,
      title: "Event Management",
      description: "Event planning, bookings, and venue management systems"
    },
    {
      icon: DollarSign,
      title: "Financial Management",
      description: "Complete accounting, cost control, and financial analytics"
    },
    {
      icon: Users,
      title: "HR & Operations",
      description: "Employee management, payroll, and operational efficiency"
    }
  ];

  const stats = [
    { number: "11+", label: "Integrated Modules" },
    { number: "95%", label: "Process Efficiency" },
    { number: "24/7", label: "AI-Powered Insights" },
    { number: "100%", label: "Cloud-Based Solution" }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Header */}
      <header className="relative z-10 border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Logo />
              <div>
                <h1 className="text-2xl font-bold font-headline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Rahah24 ERP
                </h1>
                <p className="text-xs text-muted-foreground font-medium">24/7 Relief & Automated Hisab</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button 
                onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary hover:bg-primary/90"
              >
                Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="inline-flex items-center space-x-1">
                  <Star className="h-3 w-3" />
                  <span>AI-Powered Cloud ERP Platform</span>
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold font-headline leading-normal">
                  <span className="text-foreground block mb-2">Intelligent</span>
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent block pb-2">
                    Business Management
                  </span>
                  <span className="text-2xl lg:text-3xl font-medium text-muted-foreground/80 block mt-6">Made Simple</span>
                </h1>
                
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20 backdrop-blur-sm">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-1">راحة (Rahah) - Comfort & Relief</h3>
                      <p className="text-sm text-muted-foreground">
                        Experience true peace of mind with automated accounting that works around the clock
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-foreground/90 leading-relaxed">
                    Streamline operations across restaurants, hotels, educational institutions, and more with our 
                    AI-powered platform delivering <span className="font-semibold text-primary">automated relief</span> through 
                    effortless operational and financial control — bringing you comfort 24/7.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Explore Features
                </Button>
                <Button size="lg" variant="outline">
                  <Globe className="mr-2 h-5 w-5" />
                  View Demo
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center space-y-1">
                    <div className="text-2xl lg:text-3xl font-bold text-primary">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Login Card */}
            <div className="lg:pl-8" id="login-section">
              <Card className="w-full max-w-md mx-auto shadow-2xl border-2 border-primary/10 bg-card/80 backdrop-blur-sm">
                <CardHeader className="space-y-3 text-center pb-6">
                  <div className="flex justify-center">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Shield className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold font-headline">
                    Access Your Dashboard
                  </CardTitle>
                  <CardDescription className="text-base">
                    Enter your credentials to access your dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="admin@rahah24.com" 
                        className="h-11"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                        required 
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        className="h-11"
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        required 
                        disabled={isLoading}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                      disabled={isLoading}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {isLoading ? 'Signing In...' : 'Access Dashboard'}
                    </Button>
                  </form>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <p className="text-center text-sm text-muted-foreground">
                      Secure access with role-based permissions
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
                      <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-2">Demo Credentials:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button 
                          type="button"
                          onClick={() => setLoginForm({ email: 'admin@rahah24.com', password: 'Admin123!@#' })}
                          className="text-left p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          disabled={isLoading}
                        >
                          <div className="font-medium text-blue-800 dark:text-blue-200">Admin</div>
                          <div className="text-blue-600 dark:text-blue-400">admin@rahah24.com</div>
                        </button>
                        <button 
                          type="button"
                          onClick={() => setLoginForm({ email: 'manager@rahah24.com', password: 'Manager123!@#' })}
                          className="text-left p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          disabled={isLoading}
                        >
                          <div className="font-medium text-blue-800 dark:text-blue-200">Manager</div>
                          <div className="text-blue-600 dark:text-blue-400">manager@rahah24.com</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="inline-flex items-center space-x-1">
              <Zap className="h-3 w-3" />
              <span>Powerful Features</span>
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold font-headline">
              Everything You Need in One Platform
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Manage all aspects of your business with our comprehensive, 
              AI-powered ERP solution designed for multiple industries
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary/20">
                <CardHeader className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Showcase Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="inline-flex items-center space-x-1">
              <LayoutDashboard className="h-3 w-3" />
              <span>Live Dashboard Preview</span>
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold font-headline">
              See Your Business at a Glance
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience real-time insights with our comprehensive dashboard that puts all your critical business metrics in one beautiful interface
            </p>
          </div>

          {/* Dashboard Mockup */}
          <div className="relative max-w-7xl mx-auto">
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-8 border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Dashboard Header */}
              <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">R</span>
                  </div>
                  <span className="font-semibold text-lg">Rahah24</span>
                  <div className="flex items-center space-x-2 ml-8">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Live Dashboard</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-primary mb-2">Restaurant Operations</h3>
                  <p className="text-muted-foreground">Comprehensive business dashboard</p>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <Card className="p-4 border-l-4 border-l-primary bg-primary/5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Daily Revenue</span>
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-primary">PKR 5,625,000</div>
                      <div className="text-xs text-green-600">+15.2% from yesterday</div>
                    </div>
                  </Card>

                  <Card className="p-4 border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Orders</span>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">342</div>
                      <div className="text-xs text-green-600">+8.5% today</div>
                    </div>
                  </Card>

                  <Card className="p-4 border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-950/20">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Avg Order Value</span>
                        <Users className="h-4 w-4 text-purple-500" />
                      </div>
                      <div className="text-2xl font-bold text-purple-600">PKR 16,440</div>
                      <div className="text-xs text-green-600">+12.1% vs last week</div>
                    </div>
                  </Card>

                  <Card className="p-4 border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Food Cost %</span>
                        <ChefHat className="h-4 w-4 text-orange-500" />
                      </div>
                      <div className="text-2xl font-bold text-orange-600">31.2%</div>
                      <div className="text-xs text-red-600">-1.2% (needs attention)</div>
                    </div>
                  </Card>
                </div>

                {/* Charts Section */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Trend Chart */}
                  <Card className="lg:col-span-2 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Hourly Order Trends</h4>
                      <Badge variant="secondary">Live</Badge>
                    </div>
                    <div className="h-40 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Real-time analytics chart</p>
                      </div>
                    </div>
                  </Card>

                  {/* Donut Chart */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Category Distribution</h4>
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="h-40 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full border-8 border-primary border-t-accent border-r-orange-500 border-b-blue-500 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold">4.7/5.0</div>
                          <div className="text-xs text-muted-foreground">Rating</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Bottom Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">22.8%</div>
                    <div className="text-xs text-muted-foreground">Profit Margin</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">78.5%</div>
                    <div className="text-xs text-muted-foreground">Table Occupancy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600">18.5 min</div>
                    <div className="text-xs text-muted-foreground">Avg Fulfillment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary">4.7/5.0</div>
                    <div className="text-xs text-muted-foreground">Customer Rating</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-accent rounded-full animate-pulse delay-75"></div>
            <div className="absolute top-1/2 -right-8 w-4 h-4 bg-orange-500 rounded-full animate-pulse delay-150"></div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12 space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Ready to Transform Your Business?</h3>
              <p className="text-muted-foreground">Join hundreds of organizations already using Rahah24 to streamline their operations</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline">
                <Globe className="mr-2 h-5 w-5" />
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="inline-flex items-center space-x-1">
              <Target className="h-3 w-3" />
              <span>Our Purpose</span>
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold font-headline">
              Vision & Mission of RAHAH24
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="p-8 border-2 border-primary/20 bg-card/80 backdrop-blur-sm">
              <CardHeader className="space-y-4 pb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Eye className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Vision Statement</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To become the most trusted AI-powered platform delivering peace of mind through effortless operational and financial management — empowering the global food industry and diverse organizations with intelligent control, cost transparency, and organizational discipline 24/7.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 border-2 border-accent/20 bg-card/80 backdrop-blur-sm">
              <CardHeader className="space-y-4 pb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-full bg-accent/10">
                    <Target className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Mission Statement</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our mission at RAHAH24 is to simplify complex food cost structures and financial operations through intelligent automation. We aim to provide real-time visibility, standardization, and accountability across departments — ensuring smarter decisions, reduced waste, optimized pricing, and worry-free management for every user, from the kitchen to the boardroom.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline" className="inline-flex items-center space-x-1">
              <DollarSign className="h-3 w-3" />
              <span>Pricing Information</span>
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold font-headline">
              Flexible Solutions Tailored to Your Needs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every business is unique. Our pricing is customized based on your specific requirements, scale, and modules needed.
            </p>
          </div>

          <Card className="max-w-3xl mx-auto p-12 border-2 border-primary/20 bg-card/80 backdrop-blur-sm shadow-2xl">
            <CardHeader className="space-y-6 pb-8 text-center">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-primary/10">
                  <MessageSquare className="h-12 w-12 text-primary" />
                </div>
              </div>
              <div className="space-y-3">
                <CardTitle className="text-3xl font-bold font-headline">
                  Get a Personalized Quote
                </CardTitle>
                <CardDescription className="text-lg">
                  Contact our sales team to discuss your requirements and receive a custom pricing proposal tailored to your organization.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
                <div className="text-center space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-primary">Contact Sales</h3>
                    <p className="text-base text-muted-foreground mb-6">
                      For pricing information, please contact us at:
                    </p>
                  </div>

                  <div className="space-y-4">
                    <a
                      href="mailto:sales@rahah24.com"
                      className="inline-flex items-center justify-center space-x-3 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold text-lg transition-all hover:shadow-lg"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>sales@rahah24.com</span>
                    </a>

                    <p className="text-sm text-muted-foreground">
                      Our team typically responds within 24 hours
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 pt-6">
                <div className="text-center space-y-2">
                  <div className="p-3 rounded-lg bg-primary/10 w-fit mx-auto">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold">Custom Modules</h4>
                  <p className="text-sm text-muted-foreground">Choose only what you need</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="p-3 rounded-lg bg-primary/10 w-fit mx-auto">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold">Flexible Scaling</h4>
                  <p className="text-sm text-muted-foreground">Grow at your own pace</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="p-3 rounded-lg bg-primary/10 w-fit mx-auto">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold">Transparent Costs</h4>
                  <p className="text-sm text-muted-foreground">No hidden fees</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-12 space-y-4">
            <p className="text-muted-foreground">
              Interested in learning more about our solutions?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="outline" onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}>
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Try Demo Version
              </Button>
              <Button size="lg" variant="outline">
                <Globe className="mr-2 h-5 w-5" />
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge variant="outline" className="inline-flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>Why Choose Rahah24</span>
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold font-headline">
                  Built for Operational Excellence
                </h2>
                <p className="text-lg text-muted-foreground">
                  Our ERP solution is specifically designed to meet the unique needs of 
                  diverse businesses while maintaining the highest standards 
                  of technology and user experience across all industries.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-primary/10 mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold">Industry Compliance</h4>
                    <p className="text-muted-foreground">Built with industry standards and regulatory compliance in mind</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-primary/10 mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold">AI-Powered Insights</h4>
                    <p className="text-muted-foreground">Smart analytics and predictions to optimize operations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-primary/10 mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold">Comprehensive Integration</h4>
                    <p className="text-muted-foreground">All departments connected in one unified system</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center space-y-2">
                <Clock className="h-8 w-8 text-primary mx-auto" />
                <h4 className="font-semibold">50% Faster</h4>
                <p className="text-sm text-muted-foreground">Process efficiency improvement</p>
              </Card>
              <Card className="p-6 text-center space-y-2">
                <Shield className="h-8 w-8 text-primary mx-auto" />
                <h4 className="font-semibold">100% Secure</h4>
                <p className="text-sm text-muted-foreground">Enterprise-grade security</p>
              </Card>
              <Card className="p-6 text-center space-y-2">
                <Users className="h-8 w-8 text-primary mx-auto" />
                <h4 className="font-semibold">Multi-User</h4>
                <p className="text-sm text-muted-foreground">Role-based access control</p>
              </Card>
              <Card className="p-6 text-center space-y-2">
                <Globe className="h-8 w-8 text-primary mx-auto" />
                <h4 className="font-semibold">24/7 Support</h4>
                <p className="text-sm text-muted-foreground">Always available assistance</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <Logo />
              <div>
                <h3 className="font-semibold">Rahah24 ERP</h3>
                <p className="text-sm text-muted-foreground">© 2025 Rahah24. All rights reserved.</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Empowering organizations worldwide with intelligent business solutions
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
