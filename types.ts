
export enum UserRole {
  OWNER = 'OWNER',
  TENANT = 'TENANT',
  PROPERTY_STAFF = 'PROPERTY_STAFF',
  OPS_STAFF = 'OPS_STAFF',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum ViewState {
  // Splash
  SPLASH = 'SPLASH',

  // Auth
  LOGIN = 'LOGIN',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  
  // Main Tabs
  HOME = 'HOME',
  COMMUNITY = 'COMMUNITY',
  SERVICES = 'SERVICES',
  PROFILE = 'PROFILE',
  MESSAGE_CENTER = 'MESSAGE_CENTER',

  // Community Sub-pages
  COMMUNITY_CIRCLE_DETAIL = 'COMMUNITY_CIRCLE_DETAIL',
  COMMUNITY_POST_DETAIL = 'COMMUNITY_POST_DETAIL',

  // Service Sub-pages
  SERVICE_ACCESS = 'SERVICE_ACCESS',
  SERVICE_REMOTE_OPEN = 'SERVICE_REMOTE_OPEN', 
  SERVICE_PARKING = 'SERVICE_PARKING',
  SERVICE_PARKING_CARD_ADD = 'SERVICE_PARKING_CARD_ADD', 
  SERVICE_FEES = 'SERVICE_FEES',
  SERVICE_FEE_DETAIL = 'SERVICE_FEE_DETAIL', 
  SERVICE_REPAIR = 'SERVICE_REPAIR',
  SERVICE_REPAIR_FORM = 'SERVICE_REPAIR_FORM',
  SERVICE_REPAIR_DETAIL = 'SERVICE_REPAIR_DETAIL',
  SERVICE_VISITOR = 'SERVICE_VISITOR',
  SERVICE_VISITOR_RECORD = 'SERVICE_VISITOR_RECORD', 
  SERVICE_VOTING = 'SERVICE_VOTING',
  SERVICE_VOTE_DETAIL = 'SERVICE_VOTE_DETAIL',
  SERVICE_ACTIVITY = 'SERVICE_ACTIVITY', 
  SERVICE_ACTIVITY_DETAIL = 'SERVICE_ACTIVITY_DETAIL',
  SERVICE_ANGEL_EYE = 'SERVICE_ANGEL_EYE',
  SERVICE_ANGEL_EYE_TRACK = 'SERVICE_ANGEL_EYE_TRACK',
  SERVICE_ANGEL_EYE_ADD = 'SERVICE_ANGEL_EYE_ADD',
  
  // Profile Sub-pages
  PROFILE_HOUSE = 'PROFILE_HOUSE',
  PROFILE_MY_PARKING = 'PROFILE_MY_PARKING',
  PROFILE_SETTINGS = 'PROFILE_SETTINGS',
  PROFILE_PERSONAL_INFO = 'PROFILE_PERSONAL_INFO',
  PROFILE_SECURITY = 'PROFILE_SECURITY',
  PROFILE_FEEDBACK = 'PROFILE_FEEDBACK',
  PROFILE_FEEDBACK_HISTORY = 'PROFILE_FEEDBACK_HISTORY', 
  PROFILE_ABOUT = 'PROFILE_ABOUT',
  PROFILE_MY_ARTICLES = 'PROFILE_MY_ARTICLES',
  PROFILE_MY_DYNAMICS = 'PROFILE_MY_DYNAMICS', 
  
  // Profile - Staff Workbench Specific
  PROFILE_WORK_ORDERS = 'PROFILE_WORK_ORDERS',
  PROFILE_WORK_ORDER_DETAIL = 'PROFILE_WORK_ORDER_DETAIL',
  PROFILE_KEY_INSPECTION = 'PROFILE_KEY_INSPECTION',
  PROFILE_STAFF_REPORT = 'PROFILE_STAFF_REPORT',      // Internal Reporting
  PROFILE_STAFF_VISITOR = 'PROFILE_STAFF_VISITOR',    // Staff Visitor Registration
  PROFILE_STAFF_OPEN = 'PROFILE_STAFF_OPEN',          // Staff Remote Control
  PROFILE_SMART_LIGHTING = 'PROFILE_SMART_LIGHTING',  // Smart Lighting (Staff Only)
  
  // Content Details
  ARTICLE_DETAIL = 'ARTICLE_DETAIL',
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar: string;
  communityName: string;
  unit: string;
  gender?: string;
  birthday?: string;
}

export interface HouseInfo {
    id: string;
    communityName: string;
    building: string;
    unit: string;
    room: string;
    area: number; // sqm
    status: 'LIVE_IN' | 'EMPTY' | 'RENTED'; // 入住状态
    role: 'OWNER' | 'FAMILY' | 'TENANT'; // My role in this house
}

export interface HouseMember {
  id: string;
  name: string;
  role: '户主' | '家属' | '租客';
  phone: string;
  status: 'APPROVED' | 'PENDING'; // Approval status
  avatar?: string;
}

export interface Vehicle {
    id: string;
    plate: string;
    type: 'FUEL' | 'NEV'; // Fuel or New Energy Vehicle
    brand: string;
    color: string;
    status: 'INSIDE' | 'OUTSIDE';
    boundSpotId?: string; // Linked spot ID if fixed
}

export interface ParkingSpot {
    id: string;
    zone: string;
    number: string;
    type: 'OWNED' | 'RENTED'; // 产权 or 月租
    feeStatus: 'NORMAL' | 'OVERDUE' | 'EXPIRING_SOON';
    expiryDate: string; // Management fee expiry or Rent expiry
    boundPlates?: string[];
    parkedPlate?: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  time: string;
  likes: number;
  isLiked?: boolean;
  image?: string;
  replies?: Comment[];
}

export interface Post {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  images?: string[];
  video?: string; // New: Support for video URL
  likes: number;
  comments: number;
  isLiked: boolean;
  tag?: string;
  circle?: string;
}

export interface VisitorRecord {
  id: string;
  name: string;
  reason: string;
  time: string;
  expiry: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  phone?: string;
  plate?: string;
}

export interface BillItem {
    name: string;
    amount: number;
}

export interface Bill {
  id: string;
  title: string;
  month: string;
  amount: number;
  date: string; // Due date or Paid date
  status: 'UNPAID' | 'PAID';
  type: string;
  items?: BillItem[]; // Detailed breakdown
}

export interface RepairItem {
  id: string;
  title: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED';
  date: string;
  description: string;
  image?: string;
  logs?: { time: string; text: string }[];
  workOrderId?: string; // Linked work order ID
}

export interface CameraItem {
  id: string;
  name: string;
  status: 'ONLINE' | 'OFFLINE';
  image: string;
  area: string;
}

export interface CaredPerson {
  id: string;
  name: string;
  idCard: string;
  age: number;
  relation: string;
  status: 'SAFE' | 'WARNING';
  lastLocation: string;
  lastTime: string;
  avatar: string;
  idCardFront?: string;
  idCardBack?: string;
}

export type WorkOrderStatus = 'WAIT_DISPATCH' | 'WAIT_ACCEPT' | 'PROCESSING' | 'WAIT_VERIFY' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';

export interface WorkOrderLog {
    status: WorkOrderStatus;
    time: string;
    action: string; // e.g., "接单", "上门", "完工"
    operator: string;
    content?: string; // Feedback text
    images?: string[]; // Evidence photos
    location?: string; // For check-in
}

export interface WorkOrder {
    id: string;
    title: string;
    status: WorkOrderStatus;
    address: string;
    description: string;
    reporter: string;
    phone: string;
    time: string;
    images?: string[];
    logs?: WorkOrderLog[]; // History of processing
    urgency: 'NORMAL' | 'URGENT' | 'CRITICAL';
    category: string; // e.g., "门禁故障", "设备维修"
}

export interface LightingZone {
    id: string;
    name: string;
    isOn: boolean;
    brightness: number; // 0-100
    schedule: string;
    status: 'NORMAL' | 'FAULT';
    mode: 'AUTO' | 'MANUAL' | 'SCHEDULE';
}

export interface Message {
    id: string;
    title: string;
    content: string;
    time: string;
    type: 'SYSTEM' | 'INTERACTION' | 'URGENT' | 'NOTIFICATION' | 'WORK_ORDER';
    read: boolean;
}

export interface Feedback {
    id: string;
    title: string;
    content: string;
    time: string;
    status: 'PENDING' | 'PROCESSED';
    reply?: string;
    images?: string[];
}

export type UrgentEventType = 'FIRE' | 'HIGH_THROW' | 'WATER_CUT' | 'SECURITY';

export enum ActivityStatus {
  WARMING_UP = 'WARMING_UP', // 预热中
  REGISTERING = 'REGISTERING', // 报名中
  FULL = 'FULL', // 名额已满
  REGISTRATION_CLOSED = 'REGISTRATION_CLOSED', // 报名截止
  IN_PROGRESS = 'IN_PROGRESS', // 进行中
  ENDED = 'ENDED' // 已结束
}

export interface Activity {
  id: string;
  title: string;
  image: string;
  status: ActivityStatus;
  regStartTime: string;
  regEndTime: string;
  location: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  currentParticipants: number;
  description: string;
}

export interface ActivityParticipant {
  name: string;
  phone: string;
  remark?: string;
}

export enum VoteType {
  SATISFACTION = 'SATISFACTION', // 满意度打分
  SINGLE_CHOICE = 'SINGLE_CHOICE', // 单选投票
}

export enum VoteStatus {
  IN_PROGRESS = 'IN_PROGRESS', // 进行中
  CLOSED = 'CLOSED', // 已截止
}

export interface VoteOption {
  id: string;
  label: string;
  count: number;
}

export interface Vote {
  id: string;
  title: string;
  type: VoteType;
  status: VoteStatus;
  deadline: string;
  description: string;
  participantCount: number;
  options: VoteOption[];
  myVote?: string; // ID of the option user voted for
  myRating?: number; // For satisfaction surveys
  myRatings?: Record<string, number>; // For multi-dimension satisfaction surveys
}

export interface UrgentEvent {
  id: string;
  type: UrgentEventType;
  title: string;
  content: string;
  location?: string;
  time: string;
  level: 'CRITICAL' | 'HIGH' | 'WARNING';
  acknowledged: boolean;
}
