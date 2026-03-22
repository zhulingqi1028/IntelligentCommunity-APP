
import React from 'react';
import { ViewState, Message, User, VisitorRecord } from '../types';
import { SERVICE_ICONS } from '../constants';
import * as Icons from 'lucide-react';
import { FileText, Home, Bell } from 'lucide-react';

// Import split components
import { ServiceAccessView } from './services/ServiceAccess';
import { ServiceParkingView } from './services/ServiceParking';
import { ServiceFeesView } from './services/ServiceFees';
import { ServiceRepairView } from './services/ServiceRepair';
import { ServiceVoteView } from './services/ServiceVote';
import { ServiceVisitorView } from './services/ServiceVisitor';
import { ServiceActivityView } from './services/ServiceActivity';
import { ServiceAngelEyeView, AngelEyeTrackView } from './services/ServiceAngelEye';

// --- MAIN SERVICE VIEW ---

interface ServicesProps {
    user: User;
    currentView: ViewState;
    onChangeView: (view: ViewState) => void;
    lastView?: ViewState;
    messages?: Message[];
    visitorRecords?: VisitorRecord[];
    onUpdateVisitorRecords?: (records: VisitorRecord[]) => void;
    selectedActivityId?: string | null;
    onSelectActivity?: (id: string | null) => void;
    selectedVoteId?: string | null;
    onSelectVote?: (id: string | null) => void;
}

export const Services: React.FC<ServicesProps> = ({ user, currentView, onChangeView, messages = [], visitorRecords = [], onUpdateVisitorRecords, selectedActivityId, onSelectActivity, selectedVoteId, onSelectVote }) => {
  const [selectedCaredPerson, setSelectedCaredPerson] = React.useState<any>(null);

  // Routing
  if (currentView === ViewState.SERVICE_ACCESS) return (
    <ServiceAccessView 
      onChangeView={onChangeView} 
      visitorRecords={visitorRecords}
      onUpdateVisitorRecords={onUpdateVisitorRecords}
    />
  );
  if (currentView === ViewState.SERVICE_PARKING) return <ServiceParkingView onChangeView={onChangeView} />;
  if (currentView === ViewState.SERVICE_FEES) return <ServiceFeesView onChangeView={onChangeView} />;
  if (currentView === ViewState.SERVICE_REPAIR) return <ServiceRepairView onChangeView={onChangeView} />;
  if (currentView === ViewState.SERVICE_VOTING || currentView === ViewState.SERVICE_VOTE_DETAIL) return (
    <ServiceVoteView 
      onChangeView={onChangeView} 
      selectedVoteId={selectedVoteId}
      onSelectVote={onSelectVote}
    />
  );
  if (currentView === ViewState.SERVICE_VISITOR) return (
    <ServiceVisitorView 
      onChangeView={onChangeView} 
      visitorRecords={visitorRecords}
      onUpdateVisitorRecords={onUpdateVisitorRecords}
    />
  );
  if (currentView === ViewState.SERVICE_ACTIVITY || currentView === ViewState.SERVICE_ACTIVITY_DETAIL) return (
    <ServiceActivityView 
      user={user}
      onChangeView={onChangeView} 
      selectedActivityId={selectedActivityId}
      onSelectActivity={onSelectActivity}
    />
  );
  if (currentView === ViewState.SERVICE_ANGEL_EYE) return (
    <ServiceAngelEyeView 
      onChangeView={onChangeView} 
      onSelectPerson={(person) => {
        setSelectedCaredPerson(person);
        onChangeView(ViewState.SERVICE_ANGEL_EYE_TRACK);
      }} 
    />
  );
  if (currentView === ViewState.SERVICE_ANGEL_EYE_TRACK) return (
    <AngelEyeTrackView 
      onChangeView={onChangeView} 
      person={selectedCaredPerson} 
    />
  );

  // Default Grid View
  return (
    <div className="min-h-full bg-gray-50 pb-20">
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-800">社区服务</h2>
          <p className="text-xs text-gray-400 mt-1">智慧生活，触手可及</p>
        </div>
        <button 
            onClick={() => onChangeView(ViewState.MESSAGE_CENTER)} 
            className="relative p-2 bg-gray-50 rounded-full active:bg-gray-100 transition-colors"
        >
            <Bell size={20} className="text-gray-600" />
            {messages.some(m => !m.read) && (
                <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></div>
            )}
        </button>
      </div>

      <div className="px-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 text-sm">常用服务</h3>
            <div className="grid grid-cols-4 gap-y-6">
                {SERVICE_ICONS.map((item) => {
                    const iconName = item.icon as keyof typeof Icons;
                    const IconComponent = Icons[iconName] as React.ElementType || FileText;
                    
                    return (
                        <button 
                            key={item.id}
                            onClick={() => onChangeView(item.view as ViewState)}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-active:scale-95 ${item.color}`}>
                                <IconComponent size={24} />
                            </div>
                            <span className="text-xs text-gray-600 font-medium">{item.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>

        <div className="mt-4 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden h-40 flex flex-col justify-center">
             <img 
                src="https://picsum.photos/seed/community/800/400" 
                alt="Community Promo" 
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-black/40"></div>
             <h3 className="font-bold text-lg mb-1 relative z-10">社区寄语</h3>
             <p className="text-sm italic opacity-90 relative z-10">“智享生活，从连接开始。”</p>
        </div>
      </div>
    </div>
  );
};
