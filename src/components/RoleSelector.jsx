import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Store, Building2, ArrowRight, Sparkles, TrendingUp, Shield } from 'lucide-react';

const RoleSelector = () => {
  const [hoveredRole, setHoveredRole] = useState(null);
  const navigate = useNavigate();

  const roles = [
    {
      id: 'user',
      title: 'Shopper',
      description: 'Discover and shop from amazing stores',
      icon: Users,
      gradient: 'from-blue-500 via-blue-600 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50',
      iconColor: 'text-blue-600',
      badgeColor: 'bg-blue-100 text-blue-700',
      loginPath: '/user/login',
      registerPath: '/user/register',
      features: ['Browse Products', 'Secure Checkout', 'Track Orders']
    },
    {
      id: 'stall-owner',
      title: 'Stall Owner',
      description: 'Manage your store and grow your business',
      icon: Store,
      gradient: 'from-purple-500 via-purple-600 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      iconColor: 'text-purple-600',
      badgeColor: 'bg-purple-100 text-purple-700',
      loginPath: '/stall-owner/login',
      registerPath: '/stall-owner/register',
      features: ['Inventory Management', 'Sales Analytics', 'Customer Insights']
    },
    {
      id: 'vendor',
      title: 'Mall Owner',
      description: 'Manage your entire mall ecosystem',
      icon: Building2,
      gradient: 'from-indigo-500 via-indigo-600 to-purple-600',
      bgGradient: 'from-indigo-50 to-purple-50',
      iconColor: 'text-indigo-600',
      badgeColor: 'bg-indigo-100 text-indigo-700',
      loginPath: '/vendor/login',
      registerPath: '/vendor/register',
      features: ['Multi-location', 'Enterprise Tools', 'Advanced Reports']
    }
  ];

  const handleNavigation = (path) => {
    navigate(path); // Use navigate instead of console.log
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-1/4 animate-float">
        <Sparkles className="w-6 h-6 text-blue-400 opacity-60" />
      </div>
      <div className="absolute top-1/3 right-1/4 animate-float animation-delay-2000">
        <TrendingUp className="w-8 h-8 text-purple-400 opacity-60" />
      </div>
      <div className="absolute bottom-20 left-1/3 animate-float animation-delay-4000">
        <Shield className="w-7 h-7 text-pink-400 opacity-60" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 py-12">
        <div className="max-w-7xl w-full">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/80 backdrop-blur-xl rounded-3xl mb-6 shadow-lg border border-white/50">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">M</span>
              </div>
            </div>
            
            <h1 className="text-6xl font-bold mb-4">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                MallSphere
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Choose your role and start your journey with the future of mall management
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {roles.map((role) => {
              const IconComponent = role.icon;
              const isHovered = hoveredRole === role.id;
              
              return (
                <div
                  key={role.id}
                  onMouseEnter={() => setHoveredRole(role.id)}
                  onMouseLeave={() => setHoveredRole(null)}
                  className={`bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden transform transition-all duration-500 ${
                    isHovered ? 'scale-105 shadow-2xl' : 'hover:scale-102'
                  }`}
                >
                  {/* Card Header with Gradient */}
                  <div className={`bg-gradient-to-br ${role.gradient} p-8 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                    
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4 border border-white/30">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-2">{role.title}</h3>
                      <p className="text-white/90 text-sm">{role.description}</p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-8">
                    {/* Features */}
                    <div className="mb-6 space-y-3">
                      {role.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-3 text-slate-600"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${role.gradient}`}></div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={() => handleNavigation(role.loginPath)}
                        className={`w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r ${role.gradient} hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 group`}
                      >
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                      
                      <button
                        onClick={() => handleNavigation(role.registerPath)}
                        className={`w-full py-4 rounded-xl font-semibold border-2 transition-all duration-300 hover:scale-105 active:scale-95 ${
                          isHovered
                            ? `border-transparent bg-gradient-to-r ${role.gradient} text-white shadow-lg`
                            : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        Create Account
                      </button>
                    </div>

                    {/* Badge */}
                    <div className="mt-6 text-center">
                      <span className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full ${role.badgeColor}`}>
                        {role.id === 'vendor' ? 'Enterprise Solution' : 'Popular Choice'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats Section */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  10,000+
                </div>
                <div className="text-slate-600">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  500+
                </div>
                <div className="text-slate-600">Registered Businesses</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  50+
                </div>
                <div className="text-slate-600">Mall Locations</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <p className="text-slate-500 text-sm mb-4">
              Trusted by thousands of businesses worldwide
            </p>
            <div className="flex justify-center space-x-6 text-sm text-slate-400">
              <a href="/about" className="hover:text-slate-600 transition-colors">About</a>
              <a href="/features" className="hover:text-slate-600 transition-colors">Features</a>
              <a href="/pricing" className="hover:text-slate-600 transition-colors">Pricing</a>
              <a href="/contact" className="hover:text-slate-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default RoleSelector;