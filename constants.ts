
import { Post, Bill, RepairItem, UserRole, HouseMember, CameraItem, WorkOrder, Comment, LightingZone, Message, Feedback, CaredPerson, ParkingSpot, Vehicle, HouseInfo, UrgentEvent, Activity, ActivityStatus, Vote, VoteType, VoteStatus, VisitorRecord } from './types';

// 定义多用户数据用于模拟登录
export const MOCK_USERS = [
  {
    id: 'u_owner',
    phone: '123',
    password: '123',
    role: UserRole.OWNER,
    name: '张业主',
    avatar: 'https://picsum.photos/100/100?random=1',
    communityName: '四季新城北苑',
    unit: '220栋 B单元 1301'
  },
  {
    id: 'u_property',
    phone: '456',
    password: '456',
    role: UserRole.PROPERTY_STAFF,
    name: '李物业',
    avatar: 'https://picsum.photos/100/100?random=2',
    communityName: '四季新城北苑',
    unit: '物业服务中心'
  },
  {
    id: 'u_ops',
    phone: '789',
    password: '789',
    role: UserRole.OPS_STAFF,
    name: '王运维',
    avatar: 'https://picsum.photos/100/100?random=3',
    communityName: '四季新城北苑',
    unit: '工程维护部'
  },
  {
    id: 'u_admin',
    phone: 'ad',
    password: '123',
    role: UserRole.SUPER_ADMIN,
    name: '超级管理员',
    avatar: 'https://picsum.photos/100/100?random=99',
    communityName: '四季新城北苑',
    unit: '管理中心'
  }
];

// 保持 MOCK_USER 导出以兼容旧代码引用 (默认指向业主)
export const MOCK_USER = MOCK_USERS[0];

export const MOCK_HOUSES: HouseInfo[] = [
    {
        id: 'h1',
        communityName: '四季新城北苑',
        building: '220栋',
        unit: 'B单元',
        room: '1301',
        area: 128.5,
        status: 'LIVE_IN',
        role: 'OWNER'
    },
    {
        id: 'h2',
        communityName: '阳光国际',
        building: '8栋',
        unit: 'A单元',
        room: '602',
        area: 89.0,
        status: 'RENTED',
        role: 'OWNER'
    }
];

export const MOCK_HOUSE_MEMBERS: HouseMember[] = [
  { id: 'm1', name: '祁竹玲', role: '户主', phone: '138****9999', status: 'APPROVED', avatar: 'https://picsum.photos/100/100?random=1' },
  { id: 'm2', name: '张伟', role: '家属', phone: '136****8888', status: 'APPROVED', avatar: 'https://picsum.photos/100/100?random=2' },
  { id: 'm3', name: '王小美', role: '租客', phone: '135****7777', status: 'PENDING', avatar: 'https://picsum.photos/100/100?random=3' },
];

export const MOCK_VEHICLES: Vehicle[] = [
    { id: 'v1', plate: '渝A·88888', type: 'FUEL', brand: 'BMW', color: '白色', status: 'INSIDE' },
    { id: 'v2', plate: '渝A·D12345', type: 'NEV', brand: 'Tesla', color: '黑色', status: 'OUTSIDE' },
];

export const MOCK_PARKING_SPOTS: ParkingSpot[] = [
    { id: 'pk1', zone: '地下负一层 A区', number: 'A-088', type: 'OWNED', feeStatus: 'NORMAL', expiryDate: '2025-12-31', boundPlates: ['渝A·88888'], parkedPlate: '渝A·88888' },
    { id: 'pk2', zone: '地下负二层 C区', number: 'C-012', type: 'RENTED', feeStatus: 'EXPIRING_SOON', expiryDate: '2024-02-15', boundPlates: [], parkedPlate: undefined },
];

export const MOCK_CAMERAS: CameraItem[] = [
  { id: 'c1', name: '1号楼大堂', status: 'ONLINE', image: 'https://picsum.photos/400/250?random=20', area: '楼栋大堂' },
  { id: 'c2', name: '消控室', status: 'ONLINE', image: 'https://picsum.photos/400/250?random=21', area: '重要设施' },
  { id: 'c3', name: '配电房', status: 'ONLINE', image: 'https://picsum.photos/400/250?random=22', area: '重要设施' },
  { id: 'c4', name: '地下停车场A区', status: 'OFFLINE', image: 'https://picsum.photos/400/250?random=23', area: '停车场' },
  { id: 'c5', name: '园区主干道', status: 'ONLINE', image: 'https://picsum.photos/400/250?random=24', area: '公共区域' },
  { id: 'c6', name: '北门岗亭', status: 'ONLINE', image: 'https://picsum.photos/400/250?random=25', area: '外围周界' },
];

export const MOCK_CARED_PERSONS: CaredPerson[] = [
  { id: 'cp1', name: '王大爷', idCard: '110101195001011234', age: 76, relation: '父亲', status: 'SAFE', lastLocation: '3栋楼下花园', lastTime: '刚刚', avatar: 'https://picsum.photos/100/100?random=101' },
  { id: 'cp2', name: '李奶奶', idCard: '110101195401011234', age: 72, relation: '母亲', status: 'WARNING', lastLocation: '小区北门外', lastTime: '15分钟前', avatar: 'https://picsum.photos/100/100?random=102' },
  { id: 'cp3', name: '乐乐', idCard: '110101202001011234', age: 6, relation: '儿子', status: 'SAFE', lastLocation: '儿童游乐区', lastTime: '5分钟前', avatar: 'https://picsum.photos/100/100?random=103' },
];

export const MOCK_URGENT_EVENTS: UrgentEvent[] = [
  {
    id: 'ue1',
    type: 'FIRE',
    title: '火警警报',
    content: '检测到220栋公共区域烟雾报警，请立即沿安全通道疏散！切勿乘坐电梯！',
    location: '220栋 4层 公共区域',
    time: '刚刚',
    level: 'CRITICAL',
    acknowledged: false
  }
];

// Updated Banner Data Structure
export const HOME_BANNER_DATA = [
  { 
    id: 1, 
    image: 'https://picsum.photos/800/400?random=1', 
    title: '绿色生活 低碳同行 —— 社区公益活动', 
    type: 'ACTIVITY', 
    targetId: 'act1' 
  },
  { 
    id: 2, 
    image: 'https://picsum.photos/800/400?random=2', 
    title: '关于小区增设电动车充电桩的意见征集', 
    type: 'VOTE', 
    targetId: 'v1' 
  },
  { 
    id: 3, 
    image: 'https://picsum.photos/800/400?random=10', 
    title: '关于停车场维护的紧急通知', 
    type: 'NOTICE', 
    targetId: 1 // Matches MOCK_NEWS id
  },
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act1',
    title: '绿色生活 低碳同行 —— 社区公益活动',
    image: 'https://picsum.photos/800/400?random=1',
    status: ActivityStatus.REGISTERING,
    regStartTime: '2026-02-20 09:00',
    regEndTime: '2026-03-05 18:00',
    location: '社区中心广场',
    startTime: '2026-03-10 14:00',
    endTime: '2026-03-10 17:00',
    maxParticipants: 50,
    currentParticipants: 32,
    description: '本次活动旨在提高居民的环保意识，通过垃圾分类知识讲座、旧物置换等环节，倡导绿色低碳的生活方式。'
  },
  {
    id: 'act2',
    title: '招募周末清洁志愿者',
    image: 'https://picsum.photos/800/400?random=11',
    status: ActivityStatus.WARMING_UP,
    regStartTime: '2026-03-01 09:00',
    regEndTime: '2026-03-05 18:00',
    location: '全社区公共区域',
    startTime: '2026-03-07 09:00',
    endTime: '2026-03-07 12:00',
    maxParticipants: 20,
    currentParticipants: 0,
    description: '为了保持社区环境整洁，我们招募志愿者在周末进行公共区域的清洁活动。欢迎大家踊跃报名！'
  },
  {
    id: 'act3',
    title: '社区亲子运动会',
    image: 'https://picsum.photos/800/400?random=15',
    status: ActivityStatus.FULL,
    regStartTime: '2026-02-10 09:00',
    regEndTime: '2026-02-20 18:00',
    location: '社区篮球场',
    startTime: '2026-02-28 10:00',
    endTime: '2026-02-28 16:00',
    maxParticipants: 30,
    currentParticipants: 30,
    description: '增进亲子感情，增强社区凝聚力。丰富的运动项目等你来挑战！'
  },
  {
    id: 'act4',
    title: '反诈骗安全讲座',
    image: 'https://picsum.photos/800/400?random=16',
    status: ActivityStatus.ENDED,
    regStartTime: '2026-01-01 09:00',
    regEndTime: '2026-01-10 18:00',
    location: '社区会议室',
    startTime: '2026-01-15 15:00',
    endTime: '2026-01-15 17:00',
    maxParticipants: 100,
    currentParticipants: 85,
    description: '邀请派出所民警为大家讲解最新的诈骗手段及防范技巧，守护大家的钱袋子。'
  },
  {
    id: 'act5',
    title: '社区摄影大赛报名截止',
    image: 'https://picsum.photos/800/400?random=17',
    status: ActivityStatus.REGISTRATION_CLOSED,
    regStartTime: '2026-02-01 09:00',
    regEndTime: '2026-02-15 18:00',
    location: '线上提交',
    startTime: '2026-02-20 09:00',
    endTime: '2026-02-28 18:00',
    maxParticipants: 200,
    currentParticipants: 145,
    description: '记录社区美好瞬间，摄影大赛报名已截止，正在评审中。'
  },
  {
    id: 'act6',
    title: '春季花卉养护交流会',
    image: 'https://picsum.photos/800/400?random=18',
    status: ActivityStatus.IN_PROGRESS,
    regStartTime: '2026-02-15 09:00',
    regEndTime: '2026-02-25 18:00',
    location: '社区小花园',
    startTime: '2026-02-26 14:00',
    endTime: '2026-02-26 17:00',
    maxParticipants: 40,
    currentParticipants: 38,
    description: '春季是花卉生长的关键时期，专家现场指导养护技巧，活动正在进行中。'
  }
];

export const MOCK_VOTES: Vote[] = [
  {
    id: 'vote1',
    title: '社区元宵节活动方案投票',
    type: VoteType.SINGLE_CHOICE,
    status: VoteStatus.CLOSED,
    deadline: '2026-02-12',
    description: '为了让大家度过一个难忘的元宵节，我们准备了三个活动方案，请大家选出最心仪的一个。',
    participantCount: 156,
    options: [
      { id: 'opt1', label: '方案一：传统猜灯谜+元宵品鉴', count: 89 },
      { id: 'opt2', label: '方案二：亲子手工灯笼制作', count: 42 },
      { id: 'opt3', label: '方案三：社区文艺汇演', count: 25 },
    ],
    myVote: 'opt1'
  },
  {
    id: 'vote2',
    title: '2026年第一季度物业服务满意度调查',
    type: VoteType.SATISFACTION,
    status: VoteStatus.IN_PROGRESS,
    deadline: '2026-03-15',
    description: '为了进一步提升物业服务质量，现开展第一季度满意度调查，请您根据实际感受进行打分。',
    participantCount: 84,
    options: [
      { id: 'dim1', label: '保洁卫生', count: 0 },
      { id: 'dim2', label: '安保巡逻', count: 0 },
      { id: 'dim3', label: '绿化维护', count: 0 },
      { id: 'dim4', label: '维修效率', count: 0 },
    ]
  },
  {
    id: 'vote3',
    title: '小区垃圾分类实施方案意见征集',
    type: VoteType.SINGLE_CHOICE,
    status: VoteStatus.IN_PROGRESS,
    deadline: '2026-03-10',
    description: '根据市政府要求，小区即将全面推行垃圾分类。现就垃圾投放点位设置方案征求业主意见。',
    participantCount: 230,
    options: [
      { id: 'v3_1', label: '方案A：每栋楼下设置小型投放点', count: 145 },
      { id: 'v3_2', label: '方案B：社区集中设置大型投放站', count: 85 },
    ],
    myVote: 'v3_1'
  },
  {
    id: 'vote4',
    title: '社区图书馆增购书籍类别调研',
    type: VoteType.SINGLE_CHOICE,
    status: VoteStatus.IN_PROGRESS,
    deadline: '2026-03-20',
    description: '社区图书馆计划增购一批新书，请大家投出您最感兴趣的类别，我们将根据投票结果进行采购。',
    participantCount: 45,
    options: [
      { id: 'v4_1', label: '文学名著', count: 12 },
      { id: 'v4_2', label: '少儿绘本', count: 18 },
      { id: 'v4_3', label: '科普百科', count: 8 },
      { id: 'v4_4', label: '生活技能', count: 7 },
    ]
  },
  {
    id: 'vote5',
    title: '望山云居APP新功能体验反馈',
    type: VoteType.SATISFACTION,
    status: VoteStatus.IN_PROGRESS,
    deadline: '2026-04-01',
    description: '我们最近更新了多项智慧服务功能，诚邀您分享使用体验，帮助我们持续优化。',
    participantCount: 12,
    options: [
      { id: 'v5_1', label: '界面美观度', count: 0 },
      { id: 'v5_2', label: '操作流畅性', count: 0 },
      { id: 'v5_3', label: '功能实用性', count: 0 },
    ],
    myRatings: { 'v5_1': 5, 'v5_2': 4, 'v5_3': 5 }
  }
];

export const MOCK_NEWS = [
  { id: 1, title: '关于停车场维护的通知', tag: '公告', author: '物业处', views: 5692, image: 'https://picsum.photos/100/80?random=10' },
  { id: 2, title: '招募周末清洁志愿者', tag: '活动', author: '居委会', views: 1000, image: 'https://picsum.photos/100/80?random=11', targetId: 'act2' },
  { id: 3, title: '反诈骗安全讲座总结', tag: '新闻', author: '派出所', views: 342, image: 'https://picsum.photos/100/80?random=20' },
  { id: 4, title: '最新物业管理条例解读', tag: '政策', author: '房管局', views: 882, image: 'https://picsum.photos/100/80?random=21' },
  { id: 5, title: '小区绿化升级改造方案公示', tag: '公告', author: '业委会', views: 2100, image: 'https://picsum.photos/100/80?random=12' },
  { id: 6, title: '社区元宵节活动方案投票', tag: '投票问卷', author: '业委会', views: 3200, image: null, targetId: 'vote1' },
  { id: 7, title: '2026年第一季度物业服务满意度调查', tag: '投票问卷', author: '居委会', views: 1500, image: null, targetId: 'vote2' },
  { id: 8, title: '小区垃圾分类实施方案意见征集', tag: '投票问卷', author: '业委会', views: 2800, image: null, targetId: 'vote3' },
  { id: 10, title: '社区图书馆增购书籍类别调研', tag: '投票问卷', author: '文化站', views: 950, image: null, targetId: 'vote4' },
  { id: 11, title: '望山云居APP新功能体验反馈', tag: '投票问卷', author: '技术部', views: 420, image: null, targetId: 'vote5' },
  { id: 9, title: '绿色生活 低碳同行 —— 社区公益活动', tag: '活动', author: '居委会', views: 1200, image: 'https://picsum.photos/100/80?random=1', targetId: 'act1' },
  { id: 12, title: '社区摄影大赛报名截止', tag: '活动', author: '宣传部', views: 850, image: 'https://picsum.photos/100/80?random=17', targetId: 'act5' },
  { id: 13, title: '春季花卉养护交流会', tag: '活动', author: '园林组', views: 620, image: 'https://picsum.photos/100/80?random=18', targetId: 'act6' },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    author: '钓鱼达人',
    avatar: 'https://picsum.photos/50/50?random=3',
    time: '1小时前',
    content: '这周末的钓鱼比赛太棒了！看这收获，真是大丰收啊。',
    images: ['https://picsum.photos/400/300?random=4'],
    likes: 12,
    comments: 2,
    isLiked: false,
    tag: '#钓鱼生活',
    circle: '钓鱼'
  },
  {
    id: 'p2',
    author: '社区管家',
    avatar: 'https://picsum.photos/50/50?random=5',
    time: '3小时前',
    content: '请各位居民记得垃圾分类。北门的新投放站点已经正式开放使用了。',
    likes: 45,
    comments: 0,
    isLiked: true,
    tag: '#社区公告',
    circle: '失物招领'
  },
  {
      id: 'p3',
      author: '运动狂人',
      avatar: 'https://picsum.photos/50/50?random=6',
      time: '5小时前',
      content: '晨跑打卡！今天天气真好，公园里的花都开了。',
      likes: 88,
      comments: 0,
      isLiked: false,
      tag: '#运动',
      circle: '运动',
      video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
  },
  {
      id: 'p4',
      author: '生活小能手',
      avatar: 'https://picsum.photos/50/50?random=7',
      time: '10分钟前',
      content: '分享一下今天的晚餐，还有制作过程的视频哦！',
      likes: 5,
      comments: 1,
      isLiked: false,
      tag: '#美食分享',
      circle: '美食',
      images: ['https://picsum.photos/400/300?random=8', 'https://picsum.photos/400/300?random=9'],
      video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
  }
];

export const MOCK_COMMENTS: Comment[] = [
    {
        id: 'c1',
        author: 'JoeBiden',
        content: '车位去哪租啊？',
        time: '5分钟前',
        likes: 2,
        replies: [
            { id: 'cr1', author: '曹操', content: '同问', time: '1分钟前', likes: 0 }
        ]
    },
    {
        id: 'c2',
        author: '陈sir',
        content: '好的，知道了！',
        time: '10分钟前',
        likes: 12
    }
];

export const MOCK_BILLS: Bill[] = [
  { 
      id: 'b1', 
      title: '2025年1月物业相关费用', 
      month: '2025-01',
      amount: 328.50, 
      date: '2025-02-01', 
      status: 'UNPAID', 
      type: '物业综合',
      items: [
          { name: '物业管理费 (128.5㎡)', amount: 257.00 },
          { name: '公摊水电费', amount: 45.50 },
          { name: '生活垃圾处理费', amount: 16.00 },
          { name: '电梯维护费', amount: 10.00 }
      ]
  },
  { 
      id: 'b2', 
      title: '2024年12月物业相关费用', 
      month: '2024-12',
      amount: 328.50, 
      date: '2025-01-01', 
      status: 'UNPAID', 
      type: '物业综合',
      items: [
          { name: '物业管理费 (128.5㎡)', amount: 257.00 },
          { name: '公摊水电费', amount: 45.50 },
          { name: '生活垃圾处理费', amount: 16.00 },
          { name: '电梯维护费', amount: 10.00 }
      ]
  },
  { 
      id: 'b3', 
      title: '2024年11月物业相关费用', 
      month: '2024-11',
      amount: 310.00, 
      date: '2024-12-01', 
      status: 'PAID', 
      type: '物业综合',
      items: [
          { name: '物业管理费', amount: 257.00 },
          { name: '公摊水电费', amount: 30.00 },
          { name: '其他', amount: 23.00 }
      ]
  },
];

export const MOCK_REPAIRS: RepairItem[] = [
  { 
      id: 'r1', 
      title: '水电维修', 
      status: 'PROCESSING', 
      date: '2023-11-02', 
      description: '卫生间水管漏水，水一直在滴，请尽快处理。', 
      image: 'https://picsum.photos/200/200?random=30',
      workOrderId: 'wo1_2', // Link to water leak work order
      logs: [
          { time: '2023-11-02 10:00', text: '用户提交报修' }
      ]
  },
  { 
      id: 'r2', 
      title: '门窗家具', 
      status: 'COMPLETED', 
      date: '2023-10-28', 
      description: '公共走廊灯坏了，3楼的灯不亮了。', 
      image: undefined,
      workOrderId: 'wo5_3', // Link to completed window/door work order
      logs: [
          { time: '2023-10-28 15:00', text: '用户提交报修' },
          { time: '2023-10-28 15:30', text: '物业已接单，安排李师傅上门' },
          { time: '2023-10-28 17:00', text: '维修完成' }
      ]
  },
];

export const MOCK_WORK_ORDERS: WorkOrder[] = [
    // PROCESSING (3 items)
    {
        id: 'wo1',
        title: '业主在线报修',
        status: 'PROCESSING',
        address: '220栋乙单元1301室',
        description: '燃气灶点不着火，闻到有异味，请尽快上门查看。',
        reporter: '王思维',
        phone: '13899999999',
        time: '2023-11-02 10:00',
        images: ['https://picsum.photos/200/200?random=50'],
        urgency: 'URGENT',
        category: '设备维修',
        logs: [
            { status: 'WAIT_DISPATCH', time: '2023-11-02 10:00', action: '提交报修', operator: '王思维 (业主)', content: '燃气灶点不着火，闻到有异味。' },
            { status: 'WAIT_ACCEPT', time: '2023-11-02 10:15', action: '工单指派', operator: '李物业 (调度)', content: '已核实报修，指派王运维负责处理。' },
            { status: 'PROCESSING', time: '2023-11-02 10:30', action: '接单处理', operator: '王运维 (运维员)', content: '已接单，正在前往现场。' }
        ]
    },
    {
        id: 'wo1_2',
        title: '水管漏水报修',
        status: 'PROCESSING',
        address: '15栋甲单元402室',
        description: '厨房水管爆裂，正在漏水。',
        reporter: '李业主',
        phone: '13788888888',
        time: '2023-11-02 11:00',
        urgency: 'CRITICAL',
        category: '水电维修',
        logs: [{ status: 'PROCESSING', time: '2023-11-02 11:15', action: '接单处理', operator: '张运维', content: '紧急处理中。' }]
    },
    {
        id: 'wo1_3',
        title: '电梯故障报修',
        status: 'PROCESSING',
        address: '8栋2单元电梯',
        description: '电梯运行有异响。',
        reporter: '物业巡检',
        phone: '13677777777',
        time: '2023-11-02 09:30',
        urgency: 'NORMAL',
        category: '设备维护',
        logs: [{ status: 'PROCESSING', time: '2023-11-02 09:45', action: '接单处理', operator: '王运维', content: '正在排查故障。' }]
    },

    // WAIT_ACCEPT (3 items)
    {
        id: 'wo2',
        title: '公共区域报修',
        status: 'WAIT_ACCEPT',
        address: '中心花园篮球场',
        description: '篮球场围网破损，存在安全隐患。',
        reporter: '张巡逻',
        phone: '13988888888',
        time: '2023-11-02 09:00',
        urgency: 'NORMAL',
        category: '工程维修',
        logs: [{ status: 'WAIT_ACCEPT', time: '2023-11-02 09:30', action: '工单指派', operator: '李物业 (调度)', content: '指派王运维负责处理。' }]
    },
    {
        id: 'wo2_2',
        title: '路灯不亮报修',
        status: 'WAIT_ACCEPT',
        address: '西门主干道',
        description: '连续三盏路灯不亮。',
        reporter: '业主反馈',
        phone: '13566666666',
        time: '2023-11-02 10:00',
        urgency: 'NORMAL',
        category: '照明维修',
        logs: [{ status: 'WAIT_ACCEPT', time: '2023-11-02 10:15', action: '工单指派', operator: '李物业', content: '待接单。' }]
    },
    {
        id: 'wo2_3',
        title: '门禁损坏报修',
        status: 'WAIT_ACCEPT',
        address: '北门入口',
        description: '人脸识别失效。',
        reporter: '保安队长',
        phone: '13455555555',
        time: '2023-11-02 08:45',
        urgency: 'URGENT',
        category: '安防维修',
        logs: [{ status: 'WAIT_ACCEPT', time: '2023-11-02 09:00', action: '工单指派', operator: '李物业', content: '待接单。' }]
    },

    // WAIT_VERIFY (3 items)
    {
        id: 'wo3',
        title: '设备故障告警',
        status: 'WAIT_VERIFY',
        address: '3栋电梯厅',
        description: '门禁系统离线，无法刷卡进入。',
        reporter: '系统自动告警',
        phone: '023-12345678',
        time: '2023-11-01 22:00',
        urgency: 'CRITICAL',
        category: '门禁故障',
        logs: [
            { status: 'PROCESSING', time: '2023-11-02 08:00', action: '接单处理', operator: '王运维 (运维员)', content: '已接单。' },
            { status: 'WAIT_VERIFY', time: '2023-11-02 09:00', action: '提交验收', operator: '王运维 (运维员)', content: '已重启网关，系统恢复正常。', images: ['https://picsum.photos/200/200?random=60'] }
        ]
    },
    {
        id: 'wo3_2',
        title: '楼道灯维修',
        status: 'WAIT_VERIFY',
        address: '12栋3单元5楼',
        description: '声控灯不亮。',
        reporter: '陈业主',
        phone: '13344444444',
        time: '2023-11-01 18:00',
        urgency: 'NORMAL',
        category: '照明维修',
        logs: [{ status: 'WAIT_VERIFY', time: '2023-11-02 10:00', action: '提交验收', operator: '张运维', content: '已更换灯泡。' }]
    },
    {
        id: 'wo3_3',
        title: '对讲机报修',
        status: 'WAIT_VERIFY',
        address: '5栋1单元201',
        description: '室内机无声音。',
        reporter: '孙业主',
        phone: '13233333333',
        time: '2023-11-01 14:00',
        urgency: 'NORMAL',
        category: '安防维修',
        logs: [{ status: 'WAIT_VERIFY', time: '2023-11-02 11:00', action: '提交验收', operator: '王运维', content: '已修复线路。' }]
    },

    // REJECTED (3 items)
    {
        id: 'wo4',
        title: '业主报修',
        status: 'REJECTED',
        address: '15栋1单元502',
        description: '空调漏水。',
        reporter: '赵业主',
        phone: '13777777777',
        time: '2023-11-01 15:00',
        urgency: 'NORMAL',
        category: '家电维修',
        logs: [
            { status: 'WAIT_ACCEPT', time: '2023-11-01 15:30', action: '工单指派', operator: '李物业 (调度)', content: '指派王运维。' },
            { status: 'PROCESSING', time: '2023-11-01 16:00', action: '接单处理', operator: '王运维 (运维员)', content: '已接单。' },
            { status: 'WAIT_VERIFY', time: '2023-11-01 17:00', action: '提交验收', operator: '王运维 (运维员)', content: '已清理排水管。', images: ['https://picsum.photos/200/200?random=61'] },
            { status: 'REJECTED', time: '2023-11-01 17:30', action: '验收驳回', operator: '运维管理员 (Web端)', content: '排水管仍有渗漏，请重新检查。' }
        ]
    },
    {
        id: 'wo4_2',
        title: '地库积水报修',
        status: 'REJECTED',
        address: 'B1层停车场',
        description: '排水口堵塞导致积水。',
        reporter: '保安巡检',
        phone: '13122222222',
        time: '2023-11-01 10:00',
        urgency: 'URGENT',
        category: '工程维修',
        logs: [{ status: 'REJECTED', time: '2023-11-01 14:00', action: '验收驳回', operator: '管理员', content: '积水未完全清理。' }]
    },
    {
        id: 'wo4_3',
        title: '墙面开裂报修',
        status: 'REJECTED',
        address: '20栋外墙',
        description: '外墙瓷砖脱落。',
        reporter: '物业经理',
        phone: '13011111111',
        time: '2023-11-01 08:00',
        urgency: 'CRITICAL',
        category: '工程维修',
        logs: [{ status: 'REJECTED', time: '2023-11-01 16:00', action: '验收驳回', operator: '管理员', content: '修补痕迹太明显，需重新处理。' }]
    },

    // COMPLETED (3 items)
    {
        id: 'wo5',
        title: '更换水龙头',
        status: 'COMPLETED',
        address: '10栋2单元301',
        description: '厨房水龙头坏了。',
        reporter: '周业主',
        phone: '13911111111',
        time: '2023-10-30 10:00',
        urgency: 'NORMAL',
        category: '水电维修',
        logs: [{ status: 'COMPLETED', time: '2023-10-30 14:00', action: '验收通过', operator: '业主', content: '维修得很好。' }]
    },
    {
        id: 'wo5_2',
        title: '疏通下水道',
        status: 'COMPLETED',
        address: '3栋1单元102',
        description: '卫生间地漏堵塞。',
        reporter: '吴业主',
        phone: '13822222222',
        time: '2023-10-29 09:00',
        urgency: 'NORMAL',
        category: '水电维修',
        logs: [{ status: 'COMPLETED', time: '2023-10-29 11:00', action: '验收通过', operator: '业主', content: '速度很快。' }]
    },
    {
        id: 'wo5_3',
        title: '门窗加固',
        status: 'COMPLETED',
        address: '18栋3单元801',
        description: '阳台推拉门轨道不顺。',
        reporter: '郑业主',
        phone: '13733333333',
        time: '2023-10-28 15:00',
        urgency: 'NORMAL',
        category: '工程维修',
        logs: [{ status: 'COMPLETED', time: '2023-10-28 17:00', action: '验收通过', operator: '业主', content: '已修复。' }]
    },

    // CANCELLED (3 items)
    {
        id: 'wo6',
        title: '误报维修',
        status: 'CANCELLED',
        address: '7栋1单元401',
        description: '以为灯坏了，其实是没插好。',
        reporter: '冯业主',
        phone: '13644444444',
        time: '2023-10-25 10:00',
        urgency: 'NORMAL',
        category: '其他',
        logs: [{ status: 'CANCELLED', time: '2023-10-25 10:15', action: '用户取消', operator: '业主', content: '已自行解决。' }]
    },
    {
        id: 'wo6_2',
        title: '重复报修',
        status: 'CANCELLED',
        address: '5栋公共走廊',
        description: '走廊灯不亮。',
        reporter: '业主A',
        phone: '13555555555',
        time: '2023-10-24 09:00',
        urgency: 'NORMAL',
        category: '照明维修',
        logs: [{ status: 'CANCELLED', time: '2023-10-24 09:30', action: '工单取消', operator: '管理员', content: '已有相同报修。' }]
    },
    {
        id: 'wo6_3',
        title: '信息错误',
        status: 'CANCELLED',
        address: '未知',
        description: '测试报修。',
        reporter: '测试用户',
        phone: '13466666666',
        time: '2023-10-23 15:00',
        urgency: 'NORMAL',
        category: '测试',
        logs: [{ status: 'CANCELLED', time: '2023-10-23 15:10', action: '工单取消', operator: '管理员', content: '测试数据。' }]
    },

    // WAIT_DISPATCH (3 items)
    {
        id: 'wo7',
        title: '新提交报修',
        status: 'WAIT_DISPATCH',
        address: '2栋2单元101',
        description: '客厅墙皮脱落。',
        reporter: '蒋业主',
        phone: '13377777777',
        time: '2023-11-02 12:00',
        urgency: 'NORMAL',
        category: '工程维修',
        logs: [{ status: 'WAIT_DISPATCH', time: '2023-11-02 12:00', action: '提交报修', operator: '业主' }]
    },
    {
        id: 'wo7_2',
        title: '对讲系统报修',
        status: 'WAIT_DISPATCH',
        address: '14栋大门',
        description: '无法呼叫室内机。',
        reporter: '访客反馈',
        phone: '13288888888',
        time: '2023-11-02 13:00',
        urgency: 'URGENT',
        category: '安防维修',
        logs: [{ status: 'WAIT_DISPATCH', time: '2023-11-02 13:00', action: '提交报修', operator: '系统' }]
    },
    {
        id: 'wo7_3',
        title: '绿化带损坏',
        status: 'WAIT_DISPATCH',
        address: '中心喷泉旁',
        description: '草坪被踩踏严重。',
        reporter: '保洁人员',
        phone: '13199999999',
        time: '2023-11-02 14:00',
        urgency: 'NORMAL',
        category: '绿化维护',
        logs: [{ status: 'WAIT_DISPATCH', time: '2023-11-02 14:00', action: '提交报修', operator: '员工' }]
    }
];
export const MOCK_LIGHTING_ZONES: LightingZone[] = [
    { id: 'z1', name: '中心花园区', isOn: true, brightness: 80, schedule: '18:00 - 06:00', status: 'NORMAL', mode: 'AUTO' },
    { id: 'z2', name: '地下车库A区', isOn: true, brightness: 100, schedule: '感应常亮', status: 'NORMAL', mode: 'AUTO' },
    { id: 'z3', name: '篮球场高杆灯', isOn: false, brightness: 0, schedule: '手动控制', status: 'NORMAL', mode: 'MANUAL' },
    { id: 'z4', name: '南门入口景观', isOn: true, brightness: 60, schedule: '19:00 - 23:00', status: 'NORMAL', mode: 'SCHEDULE' },
];

export const MOCK_VISITOR_RECORDS: VisitorRecord[] = [
  { id: 'vr1', name: '李明', reason: '亲友聚会', time: '2026-02-25 14:00', expiry: '2026-02-26 23:59', status: 'ACTIVE', phone: '13800138000', plate: '粤B12345' },
  { id: 'vr2', name: '顺丰快递', reason: '快递配送', time: '2026-02-24 10:30', expiry: '2026-02-24 12:00', status: 'EXPIRED', phone: '13911112222' },
  { id: 'vr3', name: '张华', reason: '家政服务', time: '2026-02-23 09:00', expiry: '2026-02-23 18:00', status: 'REVOKED', plate: '粤B66666' },
  { id: 'vr4', name: '王强', reason: '装修维修', time: '2026-02-22 15:00', expiry: '2026-02-22 20:00', status: 'EXPIRED', phone: '13722223333', plate: '粤B99999' },
  { id: 'vr5', name: '美团外卖', reason: '外卖送餐', time: '2026-02-26 12:00', expiry: '2026-02-26 13:00', status: 'ACTIVE', phone: '13544445555' },
  { id: 'vr6', name: '赵敏', reason: '亲友聚会', time: '2026-02-26 18:00', expiry: '2026-02-27 02:00', status: 'ACTIVE', phone: '18866667777', plate: '粤B88888' },
  { id: 'vr7', name: '搬家公司', reason: '搬家服务', time: '2026-02-21 08:00', expiry: '2026-02-21 18:00', status: 'EXPIRED', plate: '粤B11111' },
  { id: 'vr8', name: '孙悟空', reason: '参观访问', time: '2026-02-26 10:00', expiry: '2026-02-26 18:00', status: 'ACTIVE', phone: '13388889999' },
  { id: 'vr9', name: '周杰伦', reason: '商业洽谈', time: '2026-02-20 14:00', expiry: '2026-02-20 16:00', status: 'REVOKED', phone: '15500001111' },
  { id: 'vr10', name: '叮咚买菜', reason: '快递配送', time: '2026-02-26 09:30', expiry: '2026-02-26 10:30', status: 'ACTIVE', phone: '13122224444' },
];

export const MOCK_MESSAGES: Message[] = [
    // --- 1. 告警类 (URGENT) ---
    { 
        id: 'u2', 
        title: '[高空抛物]紧急提醒', 
        content: '【8栋南面监控】监测到【高空抛物行为】，请【注意避让】，物业已前往处理！', 
        time: '10分钟前', 
        type: 'URGENT', 
        read: false 
    },
    { 
        id: 'u3', 
        title: '[门禁]紧急提醒', 
        content: '【220栋大堂门禁】检测到【暴力破坏行为】，系统已自动报警，请【安防人员立即前往查看】！', 
        time: '30分钟前', 
        type: 'URGENT', 
        read: true 
    },

    // --- 2. 互动类 (INTERACTION) ---
    { 
        id: 'i1', 
        title: '新评论提醒', 
        content: '【李女士】已【评论】您的邻里圈帖子：【这个活动太棒了！】', 
        time: '5分钟前', 
        type: 'INTERACTION', 
        read: false 
    },
    { 
        id: 'i2', 
        title: '新点赞提醒', 
        content: '您的邻里圈帖子已被【张先生】点赞。', 
        time: '1小时前', 
        type: 'INTERACTION', 
        read: true 
    },
    { 
        id: 'i3', 
        title: '新回复提醒', 
        content: '【王先生】已【回复】您的评论：【确实如此，我也这么觉得。】', 
        time: '2小时前', 
        type: 'INTERACTION', 
        read: true 
    },

    // --- 3. 通知类 (NOTIFICATION) ---
    // 公共通知
    { 
        id: 'n1', 
        title: '社区公告', 
        content: '因小区供水管道维修，将于3月10日9:00-12:00对15-20栋停水，请提前储水。', 
        time: '昨天', 
        type: 'NOTIFICATION', 
        read: true 
    },
    { 
        id: 'n2', 
        title: '社区活动通知', 
        content: '“爱心义诊”进社区活动将于本周六上午9点在中心广场举行，欢迎各位居民参加。', 
        time: '2天前', 
        type: 'NOTIFICATION', 
        read: true 
    },
    // 账单通知
    { 
        id: 'n3', 
        title: '物业费缴纳提醒', 
        content: '您有一笔2026年第一季度物业费待缴纳：860元，请于3月31日前完成缴费。', 
        time: '3小时前', 
        type: 'NOTIFICATION', 
        read: false 
    },
    { 
        id: 'n4', 
        title: '车位续费提醒', 
        content: '您的车位（A区058号）将于3月15日到期，请及时续费，避免影响使用。', 
        time: '昨天', 
        type: 'NOTIFICATION', 
        read: true 
    },
    { 
        id: 'n5', 
        title: '临停费用提醒', 
        content: '您的车辆（苏D·88888）产生临停费用12元，请离开小区前完成缴费。', 
        time: '昨天', 
        type: 'NOTIFICATION', 
        read: true 
    },
    { 
        id: 'n6', 
        title: '逾期缴费提醒', 
        content: '您的2025年第四季度物业费已逾期15天，请尽快缴纳，以免产生滞纳金。', 
        time: '3天前', 
        type: 'NOTIFICATION', 
        read: true 
    },

    // --- 4. 工单类 (WORK_ORDER) ---
    // 业主视角
    { 
        id: 'w1', 
        title: '工单已接单提醒', 
        content: '您的“客厅灯具维修”工单已由李师傅接单，将尽快上门服务。', 
        time: '15分钟前', 
        type: 'WORK_ORDER', 
        read: false 
    },
    { 
        id: 'w2', 
        title: '工单处理中提醒', 
        content: '您的“卫生间漏水”报修工单（房号：5栋2单元602）已由维修人员接单，正在处理中。', 
        time: '1小时前', 
        type: 'WORK_ORDER', 
        read: true 
    },
    { 
        id: 'w3', 
        title: '工单待验收提醒', 
        content: '您的报修工单已完成维修，请前往现场验收并评价。', 
        time: '4小时前', 
        type: 'WORK_ORDER', 
        read: true 
    },
    { 
        id: 'w4', 
        title: '工单已结单提醒', 
        content: '您的“门锁更换”工单已验收通过并结单，感谢您的评价。', 
        time: '昨天', 
        type: 'WORK_ORDER', 
        read: true 
    },
    // 物业/运维视角 (Mocking mixed roles visibility for demo)
    { 
        id: 'w5', 
        title: '新工单待处理提醒', 
        content: '新报修工单“楼道灯损坏”（房号：8栋1单元10楼）待处理，请及时接单。', 
        time: '20分钟前', 
        type: 'WORK_ORDER', 
        read: false 
    },
    { 
        id: 'w6', 
        title: '工单待验收提醒', 
        content: '维修工单（房号：3栋101）业主已提交验收申请，请确认。', 
        time: '2小时前', 
        type: 'WORK_ORDER', 
        read: true 
    },
    { 
        id: 'w7', 
        title: '工单驳回提醒', 
        content: '您的“公共区域清洁”工单验收不通过，请重新处理。', 
        time: '昨天', 
        type: 'WORK_ORDER', 
        read: true 
    },
    { 
        id: 'w8', 
        title: '工单完成提醒', 
        content: '“排水管疏通”工单已验收通过，流程结束。', 
        time: '3天前', 
        type: 'WORK_ORDER', 
        read: true 
    },

    // --- 5. 系统类 (SYSTEM) ---
    { 
        id: 's1', 
        title: '新功能上线通知', 
        content: '望山云居APP已新增“车位共享”功能，支持业主闲置车位临时出租，快来体验吧！', 
        time: '昨天', 
        type: 'SYSTEM', 
        read: true 
    },
    { 
        id: 's2', 
        title: '系统维护通知', 
        content: '为优化服务体验，APP将于3月9日23:00-次日02:00进行系统维护，期间门禁开锁、缴费功能可能暂停使用，敬请谅解。', 
        time: '2天前', 
        type: 'SYSTEM', 
        read: true 
    },
    { 
        id: 's3', 
        title: '服务恢复通知', 
        content: '系统维护已完成，各项服务已恢复正常使用，感谢您的耐心等待。', 
        time: '3天前', 
        type: 'SYSTEM', 
        read: true 
    },
    { 
        id: 's5', 
        title: '反馈回执通知', 
        content: '您提交的“APP缴费页面卡顿”意见已收到，我们将尽快优化修复。', 
        time: '1周前', 
        type: 'SYSTEM', 
        read: true 
    }
];

export const MOCK_FEEDBACKS: Feedback[] = [
    { id: 'f1', title: '物业费缴纳页面提示失败', content: '今天尝试在APP缴纳物业费，选择微信支付后一直提示失败。', time: '2023-12-18 18:45:41', status: 'PENDING' },
    { id: 'f2', title: '南门门禁识别慢', content: '人脸识别经常失败，建议检修。', time: '2023-11-10 09:00:00', status: 'PROCESSED', reply: '已安排技术人员检修，目前已恢复正常。' }
];

export const SERVICE_ICONS = [
  { id: 'door', name: '门禁', icon: 'Key', view: 'SERVICE_ACCESS', color: 'bg-blue-100 text-blue-600' },
  { id: 'parking', name: '临停缴费', icon: 'Car', view: 'SERVICE_PARKING', color: 'bg-green-100 text-green-600' },
  { id: 'fees', name: '物业缴费', icon: 'Wallet', view: 'SERVICE_FEES', color: 'bg-orange-100 text-orange-600' },
  { id: 'repair', name: '报修', icon: 'Wrench', view: 'SERVICE_REPAIR', color: 'bg-purple-100 text-purple-600' },
  { id: 'vote', name: '投票问卷', icon: 'Vote', view: 'SERVICE_VOTING', color: 'bg-pink-100 text-pink-600' },
  { id: 'activity', name: '社区活动', icon: 'Calendar', view: 'SERVICE_ACTIVITY', color: 'bg-yellow-100 text-yellow-600' },
  { id: 'camera', name: '天使之眼', icon: 'Eye', view: 'SERVICE_ANGEL_EYE', color: 'bg-red-100 text-red-600' }, 
];
