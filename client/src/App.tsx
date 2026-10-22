import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuthPage } from './components/AuthPage';
import { LandingPage } from './components/LandingPage';
import { AssessmentWizard } from './components/AssessmentWizard';
import { Dashboard } from './components/Dashboard';
import { DomainExplorer } from './components/DomainExplorer';
import { DomainModal } from './components/DomainModal';
import { ProcessingModal } from './components/ProcessingModal';
import {
  StudentProfile,
  RecommendationResponse,
  CareerDomainCatalogItem,
  UserAccount
} from './types';
import {
  fetchDomains,
  getRecommendations,
  saveStudentProfile,
  loadSavedStudentProfile,
  updateRoadmapTaskProgress,
  saveDomainBookmark,
  getAuthMe,
  logoutUser
} from './services/api';

const INITIAL_EMPTY_PROFILE: StudentProfile = {
  branch: 'Computer Science Engineering',
  year: 'Year 2',
  graduationYear: '2027',
  academicPerformance: 'Intermediate',
  academicInterests: ['Applied Engineering Projects'],
  skills: [],
  interests: [],
  workStyles: [],
  aspiration: 'Internship and skill development',
  weeklyHours: 10
};

export const App: React.FC = () => {
  // Authentication & session state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);

  // Navigation view state
  const [currentView, setCurrentView] = useState<string>('auth');

  // Application data states
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_EMPTY_PROFILE);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [domains, setDomains] = useState<CareerDomainCatalogItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDomainModal, setSelectedDomainModal] = useState<CareerDomainCatalogItem | null>(null);
  const [savedDomainNames, setSavedDomainNames] = useState<string[]>([]);

  // Initial load: fetch domain catalog and check for existing authenticated session
  useEffect(() => {
    async function initSession() {
      setIsAuthChecking(true);
      try {
        const [domList, authMe] = await Promise.all([fetchDomains(), getAuthMe()]);
        setDomains(domList);

        if (authMe.success && authMe.user) {
          setCurrentUser(authMe.user);

          // Load student's isolated profile
          const savedData = await loadSavedStudentProfile(authMe.user.id);
          const activeProfile: StudentProfile = savedData.profile
            ? { ...savedData.profile, name: authMe.user.name }
            : { ...INITIAL_EMPTY_PROFILE, name: authMe.user.name };
          setProfile(activeProfile);

          if (activeProfile.savedItems?.domains) {
            setSavedDomainNames(activeProfile.savedItems.domains.map((d) => d.name));
          }

          if (savedData.recommendations) {
            setRecommendations(savedData.recommendations);
            setCurrentView('dashboard');
          } else if (authMe.hasCompletedAssessment && savedData.profile) {
            // Recompute recommendations if needed
            const recs = await getRecommendations(activeProfile);
            setRecommendations(recs);
            setCurrentView('dashboard');
          } else {
            setCurrentView('assessment');
          }
        } else {
          // Unauthenticated: present clean Auth Page as required
          setCurrentUser(null);
          setCurrentView('auth');
        }
      } catch (err) {
        console.warn('Session initialization error:', err);
        setCurrentView('auth');
      } finally {
        setIsAuthChecking(false);
      }
    }

    initSession();
  }, []);

  // Handle successful login or sign-up
  const handleAuthSuccess = async (user: UserAccount, hasCompletedAssessment: boolean) => {
    setCurrentUser(user);

    try {
      const savedData = await loadSavedStudentProfile(user.id);
      const activeProfile: StudentProfile = savedData.profile
        ? { ...savedData.profile, name: user.name }
        : { ...INITIAL_EMPTY_PROFILE, name: user.name };
      setProfile(activeProfile);

      if (activeProfile.savedItems?.domains) {
        setSavedDomainNames(activeProfile.savedItems.domains.map((d) => d.name));
      }

      if (hasCompletedAssessment && savedData.recommendations) {
        setRecommendations(savedData.recommendations);
        setCurrentView('dashboard');
      } else if (hasCompletedAssessment && savedData.profile) {
        const recs = await getRecommendations(activeProfile);
        setRecommendations(recs);
        setCurrentView('dashboard');
      } else {
        // Direct new user to complete student profile and assessment
        setCurrentView('assessment');
      }
    } catch (err) {
      setCurrentView('assessment');
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setProfile(INITIAL_EMPTY_PROFILE);
    setRecommendations(null);
    setSavedDomainNames([]);
    setAuthMode('login');
    setCurrentView('auth');
  };

  // Handle assessment submission and run Random Forest recommendations
  const handleAssessmentSubmit = async (submittedProfile: StudentProfile) => {
    const profileWithUser: StudentProfile = {
      ...submittedProfile,
      name: currentUser?.name || submittedProfile.name
    };
    setProfile(profileWithUser);
    setIsProcessing(true);

    try {
      const recs = await getRecommendations(profileWithUser);
      setRecommendations(recs);
      await saveStudentProfile({ ...profileWithUser, recommendations: recs }, currentUser?.id);
    } catch (err: any) {
      console.error('Error generating career recommendations:', err);
      alert(err.message || 'Could not compute recommendations. Please check ML service.');
      setIsProcessing(false);
    }
  };

  const handleProcessingComplete = () => {
    setIsProcessing(false);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle roadmap task progress update
  const handleUpdateTaskStatus = async (
    phaseIndex: number,
    taskIndex: number,
    status: 'not_started' | 'in_progress' | 'completed'
  ) => {
    const key = `p${phaseIndex}_t${taskIndex}`;
    const updatedProgress = {
      ...(profile.roadmapProgress || {}),
      [key]: status
    };
    const updatedProfile = { ...profile, roadmapProgress: updatedProgress };
    setProfile(updatedProfile);

    // Save to user's isolated profile on backend
    await updateRoadmapTaskProgress(phaseIndex, taskIndex, status);
  };

  // Save / Bookmark Domain
  const handleToggleSaveDomain = async (domainName: string) => {
    let next: string[];
    if (savedDomainNames.includes(domainName)) {
      next = savedDomainNames.filter((d) => d !== domainName);
    } else {
      next = [...savedDomainNames, domainName];
    }
    setSavedDomainNames(next);

    const updatedProfile = {
      ...profile,
      savedItems: {
        domains: next.map((name) => ({ name, savedAt: new Date().toISOString() }))
      }
    };
    setProfile(updatedProfile);
    await saveDomainBookmark(domainName);
  };

  // Safe navigation guard for protected routes
  const handleProtectedNavigation = (destination: string) => {
    if (!currentUser) {
      setAuthMode('login');
      setCurrentView('auth');
      return;
    }
    setCurrentView(destination);
  };

  // Show minimal loading while checking session
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Checking secure session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        isAuthenticated={currentUser !== null}
        currentUser={currentUser}
        currentView={currentView}
        setCurrentView={(view) => {
          if (['dashboard', 'assessment', 'roadmaps'].includes(view) && !currentUser) {
            setAuthMode('login');
            setCurrentView('auth');
          } else {
            setCurrentView(view);
          }
        }}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setCurrentView('auth');
        }}
        onLogout={handleLogout}
        onEditProfile={() => handleProtectedNavigation('assessment')}
      />

      <main className="flex-1">
        {/* ========================================== */}
        {/* 1. AUTHENTICATION VIEW                     */}
        {/* ========================================== */}
        {currentView === 'auth' && (
          <AuthPage
            initialMode={authMode}
            onAuthSuccess={handleAuthSuccess}
            onExplorePublicCatalog={() => setCurrentView('domains')}
          />
        )}

        {/* ========================================== */}
        {/* 2. PUBLIC LANDING VIEW                     */}
        {/* ========================================== */}
        {currentView === 'landing' && (
          <LandingPage
            onStartAssessment={() => handleProtectedNavigation('assessment')}
            onExploreDomains={() => setCurrentView('domains')}
            domains={domains}
            onSelectDomainForModal={(d) => setSelectedDomainModal(d)}
          />
        )}

        {/* ========================================== */}
        {/* 3. PROTECTED STUDENT PROFILE SETUP & ASSESSMENT */}
        {/* ========================================== */}
        {currentView === 'assessment' && (
          currentUser ? (
            <AssessmentWizard
              initialProfile={profile}
              onSubmit={handleAssessmentSubmit}
              onSaveProgress={(p) => {
                setProfile(p);
                saveStudentProfile(p);
              }}
            />
          ) : (
            <AuthPage
              initialMode="signup"
              onAuthSuccess={handleAuthSuccess}
              onExplorePublicCatalog={() => setCurrentView('domains')}
            />
          )
        )}

        {/* ========================================== */}
        {/* 4. PROTECTED PERSONALIZED DASHBOARD        */}
        {/* ========================================== */}
        {currentView === 'dashboard' && (
          currentUser && recommendations ? (
            <Dashboard
              userName={currentUser?.name}
              profile={profile}
              recommendations={recommendations}
              onEditProfile={() => setCurrentView('assessment')}
              onViewDomainDetail={(domainName) => {
                const d = domains.find((item) => item.name.toLowerCase() === domainName.toLowerCase());
                if (d) setSelectedDomainModal(d);
              }}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onToggleSaveDomain={handleToggleSaveDomain}
              savedDomainNames={savedDomainNames}
            />
          ) : currentUser ? (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
              <h3 className="text-xl font-bold text-slate-800">Complete Your Assessment</h3>
              <p className="text-sm text-slate-600">
                You have not completed your skills and interests assessment yet. Complete the assessment to generate your Random Forest recommendations.
              </p>
              <button
                onClick={() => setCurrentView('assessment')}
                className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 cursor-pointer"
              >
                Start Assessment
              </button>
            </div>
          ) : (
            <AuthPage
              initialMode="login"
              onAuthSuccess={handleAuthSuccess}
              onExplorePublicCatalog={() => setCurrentView('domains')}
            />
          )
        )}

        {/* ========================================== */}
        {/* 5. EXPLORE CAREER DOMAINS (Publicly viewable) */}
        {/* ========================================== */}
        {currentView === 'domains' && (
          <DomainExplorer
            domains={domains}
            onSelectDomain={(d) => setSelectedDomainModal(d)}
            onStartAssessment={() => handleProtectedNavigation('assessment')}
          />
        )}

        {/* ========================================== */}
        {/* 6. PROTECTED MY ROADMAP VIEW               */}
        {/* ========================================== */}
        {currentView === 'roadmaps' && (
          currentUser && recommendations ? (
            <Dashboard
              userName={currentUser?.name}
              profile={profile}
              recommendations={recommendations}
              onEditProfile={() => setCurrentView('assessment')}
              onViewDomainDetail={(domainName) => {
                const d = domains.find((item) => item.name.toLowerCase() === domainName.toLowerCase());
                if (d) setSelectedDomainModal(d);
              }}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onToggleSaveDomain={handleToggleSaveDomain}
              savedDomainNames={savedDomainNames}
            />
          ) : currentUser ? (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
              <h3 className="text-2xl font-bold text-slate-800">No Active Roadmap Generated Yet</h3>
              <p className="text-sm text-slate-600">
                Complete your student profile assessment to receive an adaptive phased roadmap.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setCurrentView('assessment')}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs cursor-pointer shadow-md shadow-brand-500/20"
                >
                  Start Assessment
                </button>
              </div>
            </div>
          ) : (
            <AuthPage
              initialMode="login"
              onAuthSuccess={handleAuthSuccess}
              onExplorePublicCatalog={() => setCurrentView('domains')}
            />
          )
        )}
      </main>

      {/* Processing Animation Modal */}
      {isProcessing && <ProcessingModal onComplete={handleProcessingComplete} />}

      {/* Domain Detail Modal */}
      {selectedDomainModal && (
        <DomainModal
          domain={selectedDomainModal}
          onClose={() => setSelectedDomainModal(null)}
          onStartAssessmentWithDomain={(domainName) => {
            setSelectedDomainModal(null);
            handleProtectedNavigation('assessment');
          }}
        />
      )}
    </div>
  );
};

export default App;
