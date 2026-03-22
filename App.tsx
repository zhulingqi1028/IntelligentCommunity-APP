
import React, { useState, useEffect } from 'react';
import { ViewState, User, UserRole, UrgentEvent, Message, VisitorRecord } from './types';
import { MOCK_USERS, MOCK_URGENT_EVENTS, MOCK_MESSAGES, MOCK_VISITOR_RECORDS } from './constants';
import { Layout } from './components/Layout';
import { Auth } from './components/Auth';
import { Home } from './components/Home';
import { Community } from './components/Community';
import { Services } from './components/Services';
import { Profile } from './components/Profile';
import { UrgentOverlay } from './components/UrgentOverlay';
import { MessageCenter } from './components/MessageCenter';
import { Splash } from './components/Splash';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.SPLASH);
  const [lastView, setLastView] = useState<ViewState>(ViewState.SPLASH);
  const [user, setUser] = useState<User | null>(null);
  
  // Urgent Event State
  const [activeUrgentEvent, setActiveUrgentEvent] = useState<UrgentEvent | null>(null);
  const [hasTriggeredAlarm, setHasTriggeredAlarm] = useState(false);
  
  // Message State (Lifted up to manage history from urgent events)
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  
  // Visitor Records State
  const [visitorRecords, setVisitorRecords] = useState<VisitorRecord[]>(MOCK_VISITOR_RECORDS);
  
  // Onboarding Guide State
  const [showHomeGuide, setShowHomeGuide] = useState(true);

  // Selected Activity for detail view
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [selectedVoteId, setSelectedVoteId] = useState<string | null>(null);

  // Trigger fire alarm 5 seconds after entering home page (Property Staff Only)
  useEffect(() => {
    if (currentView === ViewState.HOME && !hasTriggeredAlarm && user?.role === UserRole.PROPERTY_STAFF) {
      const timer = setTimeout(() => {
        setActiveUrgentEvent(MOCK_URGENT_EVENTS[0]);
        setHasTriggeredAlarm(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentView, hasTriggeredAlarm, user]);

  const handleViewChange = (view: ViewState) => {
    setLastView(currentView);
    setCurrentView(view);
  };

  const handleLogin = (phone?: string, password?: string) => {
    // Validate credentials against MOCK_USERS
    const foundUser = MOCK_USERS.find(u => u.phone === phone && u.password === password);
    
    if (foundUser) {
        setUser(foundUser);
        handleViewChange(ViewState.HOME);
    } else {
        alert('账号或密码错误！\n\n提示：\n业主: 135 / 123\n物业: 136 / 123\n运维: 138 / 456\n超管: ad / 123');
    }
  };

  const handleLogout = () => {
    setUser(null);
    handleViewChange(ViewState.LOGIN);
  };

  const handleUrgentAcknowledge = () => {
      if (activeUrgentEvent) {
          // Convert UrgentEvent to Message and add to history
          const newMessage: Message = {
              id: `urgent_msg_${Date.now()}`,
              title: `[已确认] ${activeUrgentEvent.title}`,
              content: activeUrgentEvent.content,
              time: '刚刚', // In real app, use current time
              type: 'URGENT',
              read: false // New messages should be unread
          };
          
          setMessages(prev => [newMessage, ...prev]);
          setActiveUrgentEvent(null);
      }
  };

  const handleReadMessage = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const handleUpdateVisitorRecords = (records: VisitorRecord[]) => {
    setVisitorRecords(records);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleSplashComplete = () => {
    // In a real app, we would check for a stored token here
    // and route to HOME if authenticated, else LOGIN
    handleViewChange(ViewState.LOGIN);
  };

  // Splash View
  if (currentView === ViewState.SPLASH) {
    return <Splash onComplete={handleSplashComplete} />;
  }

  // Auth Views
  if (currentView === ViewState.LOGIN || currentView === ViewState.FORGOT_PASSWORD) {
    return <Auth onLogin={handleLogin} onChangeView={handleViewChange} currentView={currentView} />;
  }

  // Authenticated Views
  return (
    <>
      {activeUrgentEvent && !activeUrgentEvent.acknowledged && (
         <UrgentOverlay 
            event={activeUrgentEvent} 
            onAcknowledge={handleUrgentAcknowledge} 
         />
      )}
      
      <Layout currentView={currentView} onChangeView={handleViewChange}>
        {currentView === ViewState.HOME && (
            <Home 
                onChangeView={handleViewChange} 
                messages={messages} 
                showGuide={showHomeGuide}
                onCloseGuide={() => setShowHomeGuide(false)}
                onSelectActivity={(id) => {
                  setSelectedActivityId(id);
                  handleViewChange(ViewState.SERVICE_ACTIVITY_DETAIL);
                }}
                onSelectVote={(id) => {
                  setSelectedVoteId(id);
                  handleViewChange(ViewState.SERVICE_VOTE_DETAIL);
                }}
            />
        )}
        
        {currentView === ViewState.COMMUNITY && <Community onChangeView={handleViewChange} messages={messages} />}
        
        {currentView === ViewState.MESSAGE_CENTER && (
            <MessageCenter 
                messages={messages} 
                onReadMessage={handleReadMessage}
                onBack={() => handleViewChange(lastView || ViewState.HOME)} 
            />
        )}
        
        {/* Services and its sub-pages */}
        {(currentView === ViewState.SERVICES || 
          currentView.startsWith('SERVICE_')) && (
          <Services 
            user={user}
            currentView={currentView} 
            onChangeView={handleViewChange} 
            lastView={lastView} 
            messages={messages}
            visitorRecords={visitorRecords}
            onUpdateVisitorRecords={handleUpdateVisitorRecords}
            selectedActivityId={selectedActivityId}
            onSelectActivity={setSelectedActivityId}
            selectedVoteId={selectedVoteId}
            onSelectVote={setSelectedVoteId}
          />
        )}
        
        {/* Profile and its sub-pages */}
        {(currentView === ViewState.PROFILE || currentView.startsWith('PROFILE_')) && user && (
          <Profile 
            user={user} 
            onLogout={handleLogout} 
            onUpdateUser={handleUpdateUser}
            currentView={currentView} 
            onChangeView={handleViewChange} 
            messages={messages}
          />
        )}
      </Layout>
    </>
  );
};

export default App;
