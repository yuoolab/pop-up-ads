import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Sparkles, X, Image as ImageIcon, ChevronLeft, 
  Loader2, MousePointerClick, Upload, Send, Layout, Palette, 
  Settings2, Wand2, MonitorSmartphone, CheckCircle2, 
  DownloadCloud, Pencil, ChevronDown, RotateCcw, Undo2, Layers, Zap,
  Megaphone, Package, Crop, Images, Shirt, Tag, Expand, Eraser, CircleX
} from 'lucide-react';

// ==========================================
// 1. AI 智能海报工作台 (子组件: 抽屉)
// ==========================================
const BRIEF_TEMPLATES = [
  {
    label: '双11大促',
    text: '双11大促，全场5折起，限时包邮，需要喜庆热烈的氛围，突出立即抢购。'
  },
  {
    label: '秋季上新',
    text: '秋季女装上新，主打极简高级风，突出新品质感和高冷气质，引导用户浏览新品。'
  },
  {
    label: '新人领券',
    text: '新用户专享福利，注册即可领取100元券，突出新人专享和立即领取。'
  },
  {
    label: '会员专享',
    text: '会员专享权益，老客回访可领取专属优惠，突出会员身份感和限时福利。'
  },
  {
    label: '清仓秒杀',
    text: '库存清仓秒杀，爆款低至99元起，营造紧迫感，引导用户马上下单。'
  },
  {
    label: '私域加粉',
    text: '引导用户添加企业微信，领取专属福利和新品提醒，突出扫码领取好礼。'
  }
];

const MARKETING_TYPES = [
  '活动推广', '新人礼包', '领券促单', 
  '会员权益', '商品推广', '私域引流'
];

const MARKETING_SCENE_PROMPTS = {
  '活动推广': '双11大促，全场5折起，限时包邮，需要喜庆热烈的氛围，突出立即抢购。',
  '新人礼包': '新用户专享福利，注册即可领取100元券，突出新人专享和立即领取。',
  '领券促单': '限时领券促单，领取后下单立减，强调今晚截止和下单紧迫感。',
  '会员权益': '会员专享权益，老客回访可领取专属优惠，突出会员身份感和限时福利。',
  '商品推广': '主推爆款商品，突出核心卖点与优惠力度，引导用户点击立即购买。',
  '私域引流': '引导用户添加企业微信，领取专属福利和新品提醒，突出扫码领取好礼。'
};

const POPUP_STYLES = [
  '极简高级', '喜庆热闹', '清新自然',
  '异形弹窗', '奢华黑金', '国潮复古'
];

const MODEL_OPTIONS = [
  {
    id: 'jimeng-4',
    name: '即梦4.0',
    time: '10s',
    desc: '即梦最新旗舰模型，支持多参考图'
  },
  {
    id: 'jimeng-3',
    name: '即梦3.0',
    time: '10s',
    desc: '即梦3.0图像模型，影视质感，文字更准'
  },
  {
    id: 'nanobanana-2',
    name: 'NanoBanana2',
    time: '30s',
    desc: 'Google最新图像模型，超强指令编辑'
  },
  {
    id: 'gpt-image-2.0',
    name: 'GPT-image-2.0',
    time: '180s',
    desc: 'OpenAI旗舰图像模型，SOTA级别生图'
  }
];

const PROPOSAL_COUNT_OPTIONS = [
  { value: 1, cost: 2 },
  { value: 2, cost: 4 },
  { value: 3, cost: 6 },
  { value: 4, cost: 8 }
];

// 模拟初始生成的 3 个提案数据
const INITIAL_PROPOSALS = [
  {
    id: 'p1',
    name: '利益点强化版',
    title: '双11全球狂欢季',
    subtitle: '全场商品限时特惠',
    discount: '5',
    discountUnit: '折起',
    btnText: '立即抢购',
    fontSize: 20,
    textAlign: 'center',
    bgGradient: 'from-red-600 to-rose-500',
    cardBg: 'bg-white/10 backdrop-blur-sm',
    textColor: 'text-white',
    accentColor: 'text-yellow-300',
    btnBg: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
    btnTextCol: 'text-red-900',
    productImg: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p2',
    name: '商品主视觉版',
    title: '年终盛典 提前抢',
    subtitle: '爆款直降 不容错过',
    discount: '¥99',
    discountUnit: '起',
    btnText: '去主会场',
    fontSize: 20,
    textAlign: 'center',
    bgGradient: 'from-orange-100 to-orange-50',
    cardBg: 'bg-white shadow-xl',
    textColor: 'text-gray-900',
    accentColor: 'text-red-600',
    btnBg: 'bg-red-600',
    btnTextCol: 'text-white',
    productImg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p3',
    name: '高级留白版',
    title: '双十一 · 甄选好物',
    subtitle: '给生活一点仪式感',
    discount: 'Half',
    discountUnit: 'Price',
    btnText: '探索更多',
    fontSize: 20,
    textAlign: 'center',
    bgGradient: 'from-slate-900 to-gray-800',
    cardBg: 'bg-white/5 border border-white/10',
    textColor: 'text-gray-100',
    accentColor: 'text-white',
    btnBg: 'bg-white',
    btnTextCol: 'text-gray-900',
    productImg: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80'
  }
];

const QUICK_EDIT_ACTIONS = [
  '更喜庆',
  '更高级',
  '突出优惠',
  '按钮更醒目',
  '商品更大',
  '换一版文案'
];

const SEMANTIC_PALETTES = [
  {
    id: 'promo-red',
    name: '大促红',
    swatch: 'bg-gradient-to-br from-red-600 to-rose-500',
    bgGradient: 'from-red-600 to-rose-500',
    btnBg: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
    btnTextCol: 'text-red-900',
    textColor: 'text-white',
    accentColor: 'text-yellow-300',
    cardBg: 'bg-white/10 backdrop-blur-sm'
  },
  {
    id: 'black-gold',
    name: '高级黑金',
    swatch: 'bg-gradient-to-br from-slate-950 to-amber-600',
    bgGradient: 'from-slate-950 to-stone-800',
    btnBg: 'bg-amber-400',
    btnTextCol: 'text-slate-950',
    textColor: 'text-white',
    accentColor: 'text-amber-300',
    cardBg: 'bg-white/5 border border-amber-300/20'
  },
  {
    id: 'fresh-bluegreen',
    name: '清新蓝绿',
    swatch: 'bg-gradient-to-br from-cyan-500 to-emerald-400',
    bgGradient: 'from-cyan-500 to-emerald-400',
    btnBg: 'bg-white',
    btnTextCol: 'text-emerald-700',
    textColor: 'text-white',
    accentColor: 'text-white',
    cardBg: 'bg-white/15 backdrop-blur-sm'
  },
  {
    id: 'sweet-pink',
    name: '甜美粉',
    swatch: 'bg-gradient-to-br from-pink-500 to-rose-300',
    bgGradient: 'from-pink-500 to-rose-300',
    btnBg: 'bg-white',
    btnTextCol: 'text-pink-600',
    textColor: 'text-white',
    accentColor: 'text-white',
    cardBg: 'bg-white/20 backdrop-blur-sm'
  }
];

const PRODUCT_AI_SECTIONS = [
  { id: 'adjust', name: '图片调整', icon: Crop },
  { id: 'background', name: 'AI换背景', icon: Images },
  { id: 'selling', name: 'AI加卖点', icon: Tag },
  { id: 'tryon', name: '服饰上身', icon: Shirt }
];

const PRODUCT_AI_TASKS = [
  {
    id: 'crop',
    section: 'adjust',
    name: '裁剪旋转',
    desc: '调整商品图片比例、角度和构图',
    badge: '裁剪',
    icon: Crop
  },
  {
    id: 'matting',
    section: 'adjust',
    name: '一键抠图',
    desc: '快速抠出商品主体，生成透明或干净底图',
    badge: '抠图',
    icon: Sparkles
  },
  {
    id: 'upscale',
    section: 'adjust',
    name: '无损放大',
    desc: '提升商品图片清晰度，适合低清素材',
    badge: '放大',
    icon: Expand
  },
  {
    id: 'clarity',
    section: 'adjust',
    name: '变清晰',
    desc: '优化模糊图片，增强商品细节质感',
    badge: 'HD',
    icon: ImageIcon
  },
  {
    id: 'extend',
    section: 'adjust',
    name: 'AI扩图',
    desc: '智能扩展画布，补齐商品图片边缘',
    badge: '扩图',
    icon: MonitorSmartphone
  },
  {
    id: 'remove',
    section: 'adjust',
    name: 'AI消除',
    desc: '移除图片里的杂物、水印或干扰元素',
    badge: '消除',
    icon: Eraser
  },
  {
    id: 'background',
    section: 'background',
    name: 'AI换背景',
    desc: '为商品生成精美场景图，适合主图和详情图',
    badge: '背景',
    icon: Images
  },
  {
    id: 'selling',
    section: 'selling',
    name: 'AI加卖点',
    desc: '根据商品卖点生成带文案表达的图片',
    badge: '卖点',
    icon: Tag
  },
  {
    id: 'tryon',
    section: 'tryon',
    name: '服饰上身',
    desc: '模拟服饰上身效果，适合服装类商品',
    badge: '上身',
    icon: Shirt
  }
];

const BACKGROUND_STYLE_OPTIONS = [
  { id: 'premium', name: '高级质感', desc: '适合商品主图和品牌展示', tone: 'from-slate-100 to-stone-200' },
  { id: 'solid', name: '纯色背景', desc: '突出商品主体，干净统一', tone: 'from-blue-50 to-white' },
  { id: 'lifestyle', name: '生活场景', desc: '模拟真实使用环境', tone: 'from-emerald-50 to-cyan-50' },
  { id: 'festival', name: '节日促销', desc: '适合活动氛围图', tone: 'from-orange-50 to-rose-50' }
];

const TRYON_MODEL_OPTIONS = [
  { id: 'female-half', name: '女模特', desc: '半身展示 / 常规版型' },
  { id: 'male-half', name: '男模特', desc: '半身展示 / 常规版型' },
  { id: 'child', name: '儿童', desc: '童装商品展示' },
  { id: 'full-body', name: '全身', desc: '完整穿搭效果' }
];

const PRODUCT_AI_IMAGES = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80'
];

const SELLING_TEMPLATE_PREVIEWS = [
  { id: 'template-red', accent: 'from-red-500 to-orange-400', text: '保湿舒缓轻盈服贴' },
  { id: 'template-purple', accent: 'from-violet-400 to-fuchsia-400', text: '保湿舒缓轻盈服贴' },
  { id: 'template-dark', accent: 'from-slate-700 to-slate-900', text: '保湿舒缓轻盈服贴' },
  { id: 'template-blue', accent: 'from-cyan-500 to-blue-500', text: '保湿舒缓轻盈服贴' },
  { id: 'template-beige', accent: 'from-amber-100 to-stone-200', text: '请输入利益点请输入利益点' },
  { id: 'template-gold', accent: 'from-amber-200 to-stone-300', text: '请输入利益点请输入利益点' }
];
const SELLING_DEMO_TEMPLATE_IMAGE = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=480&q=80';
const SELLING_DEMO_RESULT_IMAGE = 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=480&q=80';

const AIPosterDrawer = ({ isOpen, onClose, onApply }) => {
  const [marketingType, setMarketingType] = useState(MARKETING_TYPES[0]);
  const [popupStyle, setPopupStyle] = useState(POPUP_STYLES[0]);
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0]);
  const [proposalCount, setProposalCount] = useState(1);
  const [openBriefMenu, setOpenBriefMenu] = useState(null);
  
  const [productImage, setProductImage] = useState(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const productImgInputRef = useRef(null);
  const briefInputRef = useRef(null);
  
  const [inputText, setInputText] = useState('');
  const [workflowState, setWorkflowState] = useState('idle'); // idle, generating, generated, applying, success
  const [proposals, setProposals] = useState([]);
  const [activeProposalId, setActiveProposalId] = useState(null);
  const [currentDesign, setCurrentDesign] = useState(null);
  const [designHistory, setDesignHistory] = useState([]);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  const [aiEditPrompt, setAiEditPrompt] = useState('');
  const [isAiEditing, setIsAiEditing] = useState(false);

  const handleSelectMarketingType = (type) => {
    setMarketingType(type);
    const nextPrompt = MARKETING_SCENE_PROMPTS[type] || '';
    setInputText(nextPrompt);
  };

  // 抽屉打开时重置状态
  useEffect(() => {
    if (isOpen) {
      setWorkflowState('idle');
      setMarketingType(MARKETING_TYPES[0]);
      setPopupStyle(POPUP_STYLES[0]);
      setSelectedModel(MODEL_OPTIONS[0]);
      setProposalCount(1);
      setOpenBriefMenu(null);
      setProductImage(null);
      setIsRemovingBg(false);
      setInputText(MARKETING_SCENE_PROMPTS[MARKETING_TYPES[0]] || '');
      setProposals([]);
      setCurrentDesign(null);
      setDesignHistory([]);
      setIsAdvancedOpen(false);
      setAiEditPrompt('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!openBriefMenu) return;

    const handleOutsidePointerDown = (event) => {
      if (briefInputRef.current && !briefInputRef.current.contains(event.target)) {
        setOpenBriefMenu(null);
      }
    };

    document.addEventListener('pointerdown', handleOutsidePointerDown, true);
    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown, true);
  }, [openBriefMenu]);

  // 处理商品图本地预览与抠图模拟
  const handleProductImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setProductImage(imageUrl);
    setIsRemovingBg(true);

    setTimeout(() => {
      setIsRemovingBg(false);
    }, 2000);

    e.target.value = '';
  };

  const buildProposals = () => Array.from({ length: proposalCount }, (_, index) => {
    const source = INITIAL_PROPOSALS[index % INITIAL_PROPOSALS.length];
    return {
      ...source,
      name: proposalCount > INITIAL_PROPOSALS.length ? `${source.name} ${index + 1}` : source.name,
      productImg: productImage || source.productImg
    };
  });

  const applyGeneratedProposals = (nextProposals) => {
    setProposals(nextProposals);
    setActiveProposalId(nextProposals[0].id);
    setCurrentDesign({...nextProposals[0]});
    setDesignHistory([]);
    setIsAdvancedOpen(false);
    setWorkflowState('generated');
  };

  const updateDesign = (updater) => {
    if (!currentDesign) return;
    setDesignHistory(prev => [...prev, currentDesign].slice(-12));
    setCurrentDesign(prev => (typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }));
  };

  const handleUndo = () => {
    if (!designHistory.length) return;
    const previousDesign = designHistory[designHistory.length - 1];
    setCurrentDesign(previousDesign);
    setDesignHistory(prev => prev.slice(0, -1));
  };

  // 模拟生成海报
  const handleGenerate = (options = {}) => {
    if (!inputText && !options.force) return;
    setWorkflowState('generating');
    if (!options.keepCurrent) {
      setProposals([]);
      setCurrentDesign(null);
    }

    setTimeout(() => {
      const updatedProposals = buildProposals().map((p, index) => ({
        ...p,
        id: `${p.id}-${Date.now()}-${index}`
      }));
      applyGeneratedProposals(options.shuffle ? [...updatedProposals].reverse() : updatedProposals);
    }, 2000);
  };

  const handleRegenerate = () => {
    handleGenerate({ force: true, keepCurrent: true, shuffle: true });
  };

  // 切换方案
  const handleSelectProposal = (id) => {
    const selected = proposals.find(p => p.id === id);
    setActiveProposalId(id);
    setCurrentDesign({...selected});
    setDesignHistory([]);
  };

  // 模拟 AI 改图逻辑
  const handleAiEdit = (overrideText) => {
    const userMsg = typeof overrideText === 'string' ? overrideText : aiEditPrompt;
    if (!userMsg || isAiEditing || !currentDesign) return;
    
    setAiEditPrompt('');
    setIsAiEditing(true);
    setDesignHistory(prev => [...prev, currentDesign].slice(-12));

    setTimeout(() => {
      let updatedDesign = { ...currentDesign };
      if (userMsg.includes('红') || userMsg.includes('喜庆') || userMsg.includes('配色')) {
        updatedDesign.bgGradient = 'from-red-600 to-red-800';
        updatedDesign.btnBg = 'bg-yellow-400';
        updatedDesign.btnTextCol = 'text-red-900';
        updatedDesign.textColor = 'text-white';
        updatedDesign.accentColor = 'text-yellow-300';
        updatedDesign.customBg = null;
      } else if (userMsg.includes('高级')) {
        updatedDesign.bgGradient = 'from-slate-950 to-stone-800';
        updatedDesign.btnBg = 'bg-amber-400';
        updatedDesign.btnTextCol = 'text-slate-950';
        updatedDesign.textColor = 'text-white';
        updatedDesign.accentColor = 'text-amber-300';
        updatedDesign.cardBg = 'bg-white/5 border border-amber-300/20';
        updatedDesign.customBg = null;
      } else if (userMsg.includes('优惠') || userMsg.includes('利益')) {
        updatedDesign.discount = updatedDesign.discount === '5' ? '5' : '¥99';
        updatedDesign.discountUnit = updatedDesign.discount === '5' ? '折起' : '券';
        updatedDesign.title = '限时福利 立即领取';
        updatedDesign.subtitle = '错过今天再等一年';
        updatedDesign.fontSize = Math.min((updatedDesign.fontSize || 20) + 2, 36);
      } else if (userMsg.includes('按钮')) {
        updatedDesign.btnBg = 'bg-gradient-to-r from-yellow-300 to-orange-400';
        updatedDesign.btnTextCol = 'text-red-900';
        updatedDesign.btnText = '马上领取';
      } else if (userMsg.includes('商品')) {
        updatedDesign.productHeight = Math.min((updatedDesign.productHeight || 128) + 24, 184);
      } else if (userMsg.includes('文案')) {
        updatedDesign.title = '限时惊喜 为你精选';
        updatedDesign.subtitle = '热门好物 今日专享';
        updatedDesign.btnText = '立即查看';
      } else if (userMsg.includes('大') || userMsg.includes('字号')) {
        updatedDesign.fontSize = Math.min((updatedDesign.fontSize || 20) + 4, 36);
      } else {
        updatedDesign.bgGradient = 'from-indigo-600 to-purple-700';
        updatedDesign.customBg = null;
      }
      setCurrentDesign(updatedDesign);
      setIsAiEditing(false);
    }, 1500);
  };

  // 确认应用
  const handleApplyClick = () => {
    setWorkflowState('applying');
    setTimeout(() => {
      setWorkflowState('success');
      setTimeout(() => {
        onApply(currentDesign.productImg); 
      }, 1500);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* 遮罩层，去除了点击关闭事件以防误触 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      <div className="relative w-[1100px] max-w-full h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right">
        
        {/* Header */}
        <header className="h-14 border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gradient-to-tr from-purple-600 to-blue-600 rounded flex items-center justify-center shadow-inner">
              <Wand2 className="text-white" size={14} />
            </div>
            <span className="font-bold text-gray-800 tracking-wide">AI 弹窗广告生成工作台</span>
          </div>
          
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </header>

        {/* 抽屉主体区 */}
        <div className="flex-1 flex overflow-hidden bg-[#f3f4f6]">
          
          {/* 左栏：输入配置 */}
          <div className="w-[320px] bg-white border-r border-gray-200 flex flex-col shadow-sm z-10 overflow-y-auto">
            <div className="p-5">
              
              <div className="mb-6">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-800">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[11px] text-white">1</span>
                  选择目标
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500">
                      <Layout size={14} className="text-blue-500" /> 弹窗营销场景
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {MARKETING_TYPES.map(type => (
                        <button
                          key={type}
                          onClick={() => handleSelectMarketingType(type)}
                          className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                            marketingType === type
                              ? 'border-blue-600 bg-blue-50 text-blue-600 font-medium'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500">
                      <Palette size={14} className="text-blue-500" />弹窗风格
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPUP_STYLES.map(style => (
                        <button
                          key={style}
                          onClick={() => setPopupStyle(style)}
                          className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                            popupStyle === style
                              ? 'border-blue-600 bg-blue-50 text-blue-600 font-medium'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[11px] text-white">2</span>
                  <span><span className="text-red-500 mr-1">*</span>描述你想生成的弹窗内容</span>
                </h3>
                <div className="rounded-lg border border-blue-100 bg-blue-50/30 p-4">
                <div
                  ref={briefInputRef}
                  className="rounded-xl bg-white shadow-sm"
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setOpenBriefMenu(null);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      setOpenBriefMenu(null);
                    }
                  }}
                >
                  <textarea
                    className="w-full h-40 bg-transparent p-4 text-sm leading-6 outline-none resize-none placeholder-gray-400"
                    placeholder="例如：新用户注册领20元券，今晚8点开抢，希望弹窗突出限时福利和立即领取。"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2 border-t border-gray-100 p-3">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenBriefMenu(openBriefMenu === 'model' ? null : 'model')}
                        className="flex w-full items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                      >
                        <span className="flex min-w-0 items-center gap-1.5">
                          <Sparkles size={13} className="shrink-0" />
                          <span className="min-w-0 truncate whitespace-nowrap text-[11px]">{selectedModel.name}</span>
                        </span>
                        <ChevronDown size={12} className={`transition-transform ${openBriefMenu === 'model' ? 'rotate-180' : ''}`} />
                      </button>
                      {openBriefMenu === 'model' && (
                        <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-[292px] rounded-lg bg-white p-2 shadow-xl ring-1 ring-black/5">
                          <div className="px-2 pb-2 text-xs text-gray-400">选择模型</div>
                          <div className="space-y-1">
                            {MODEL_OPTIONS.map((model) => (
                              <button
                                key={model.id}
                                type="button"
                                onClick={() => {
                                  setSelectedModel(model);
                                  setOpenBriefMenu(null);
                                }}
                                className={`flex w-full items-start gap-2 rounded-md px-2 py-2 text-left transition-colors ${selectedModel.id === model.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                              >
                                <Sparkles size={14} className="mt-0.5 shrink-0 text-gray-800" />
                                <span className="min-w-0 flex-1">
                                  <span className="flex items-center gap-2 text-xs font-bold text-gray-800">
                                    {model.name}
                                    <span className="font-normal text-gray-400">{model.time}</span>
                                  </span>
                                  <span className="mt-0.5 block text-[11px] leading-snug text-gray-400">{model.desc}</span>
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenBriefMenu(openBriefMenu === 'count' ? null : 'count')}
                        className="flex w-full items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                      >
                        <span className="flex items-center gap-1.5">
                          <Layers size={13} className="shrink-0" />
                          <span className="whitespace-nowrap text-[11px]">{proposalCount}张</span>
                          <Zap size={12} className="shrink-0 text-amber-400" />
                          <span className="whitespace-nowrap text-[11px]">{PROPOSAL_COUNT_OPTIONS.find(item => item.value === proposalCount)?.cost}</span>
                        </span>
                        <ChevronDown size={12} className={`transition-transform ${openBriefMenu === 'count' ? 'rotate-180' : ''}`} />
                      </button>
                      {openBriefMenu === 'count' && (
                        <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-[150px] rounded-lg bg-white p-2 shadow-xl ring-1 ring-black/5">
                          <div className="px-2 pb-2 text-xs text-gray-400">选择生图数量</div>
                          <div className="space-y-1">
                            {PROPOSAL_COUNT_OPTIONS.map((item) => (
                              <button
                                key={item.value}
                                type="button"
                                onClick={() => {
                                  setProposalCount(item.value);
                                  setOpenBriefMenu(null);
                                }}
                                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${proposalCount === item.value ? 'bg-blue-50 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                              >
                                <span>{item.value}张</span>
                                <span className="flex items-center gap-1 text-xs text-gray-500"><Zap size={12} className="text-amber-400" />{item.cost}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[11px] text-white">3</span>
                  商品图（可选）
                </h3>
                <p className="mb-3 text-xs text-gray-400">上传后 AI 会优先围绕商品做主视觉</p>
                <input 
                  type="file" 
                  ref={productImgInputRef} 
                  onChange={handleProductImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                {productImage ? (
                  <div 
                    className="relative w-20 h-20 rounded-lg border border-gray-200 overflow-hidden group shadow-sm bg-gray-50"
                    style={{
                      backgroundImage: 'conic-gradient(#eee 25%, white 25%, white 50%, #eee 50%, #eee 75%, white 75%, white 100%)',
                      backgroundSize: '12px 12px'
                    }}
                  >
                     <img src={productImage} alt="product" className="relative w-full h-full object-cover mix-blend-multiply z-10" />
                     
                     {isRemovingBg && (
                       <div className="absolute inset-0 bg-black/40 backdrop-blur-[1.5px] flex flex-col items-center justify-center z-20 transition-opacity">
                          <Loader2 className="animate-spin text-blue-400 mb-1" size={18} />
                          <span className="text-[10px] text-blue-400 font-medium tracking-wider">抠图中...</span>
                       </div>
                     )}

                     {!isRemovingBg && (
                       <div className="absolute inset-0 bg-black/60 hidden group-hover:flex flex-col items-center justify-center cursor-pointer transition-colors z-30" onClick={() => setProductImage(null)}>
                          <X className="text-white mb-1" size={16} />
                          <span className="text-[10px] text-white">移除</span>
                       </div>
                     )}
                  </div>
                ) : (
                  <button 
                    onClick={() => productImgInputRef.current?.click()} 
                    className="w-full h-20 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors bg-gray-50"
                  >
                    <Upload size={18} className="mb-1" />
                    <span className="text-xs">点击上传图片 (PNG/JPG)</span>
                  </button>
                )}
              </div>

              <button
                onClick={handleGenerate}
                disabled={!inputText || workflowState === 'generating' || isRemovingBg}
                className="w-full mt-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium text-sm rounded-lg shadow disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {workflowState === 'generating' ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                {workflowState === 'generated' ? `重新生成 ${proposalCount} 个方案` : '生成弹窗图片'}
              </button>
              {!inputText && (
                <p className="mt-2 text-center text-xs text-gray-400">请先填写活动卖点</p>
              )}
            </div>
          </div>

          {/* 中栏：画布预览区 */}
          <div className="flex-1 bg-[#ebecef] flex flex-col items-center justify-center relative overflow-hidden py-10">
            {!currentDesign && workflowState !== 'generating' ? (
              <div className="box-content w-[295px] h-[680px] border-[10px] border-gray-200 rounded-[2rem] bg-gray-50 flex flex-col items-center justify-center text-gray-400 shadow-lg">
                <MonitorSmartphone size={40} className="mb-4 opacity-50" />
                <p className="text-sm">预览区域</p>
              </div>
            ) : (
              <div className="relative box-content w-[291px] h-[676px] border-[12px] border-gray-800 rounded-[2.5rem] bg-gray-100 shadow-2xl overflow-hidden shrink-0 flex flex-col">
                <div className="absolute top-0 inset-x-0 h-5 flex justify-center z-50"><div className="w-28 h-4 bg-gray-800 rounded-b-lg"></div></div>
                <div className="flex-1 bg-gray-100 p-4 pt-8 opacity-30 grayscale pointer-events-none">
                  <div className="h-6 bg-gray-300 rounded-full mb-4 w-3/4"></div>
                  <div className="grid grid-cols-2 gap-3"><div className="h-24 bg-gray-300 rounded"></div><div className="h-24 bg-gray-300 rounded"></div></div>
                </div>
                
                <div className="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center p-5">
                  {workflowState === 'generating' ? (
                    <div className="flex flex-col items-center text-white">
                      <Loader2 size={32} className="animate-spin mb-3 text-blue-400" />
                      <p className="text-xs">AI 作画中...</p>
                    </div>
                  ) : (
                    <div className="relative w-full animate-in zoom-in duration-300">
                      <div className="absolute -top-10 right-0 w-7 h-7 rounded-full border-2 border-white/80 flex items-center justify-center text-white/80"><X size={14} /></div>
                      <div 
                        className={`w-full rounded-xl overflow-hidden relative ${currentDesign.customBg ? '' : `bg-gradient-to-br ${currentDesign.bgGradient}`}`}
                        style={currentDesign.customBg ? { background: `linear-gradient(135deg, ${currentDesign.customBg}, ${currentDesign.customBg}B3)` } : {}}
                      >
                        <div className={`p-5 flex flex-col ${currentDesign.textAlign === 'left' ? 'items-start text-left' : currentDesign.textAlign === 'right' ? 'items-end text-right' : 'items-center text-center'} relative z-10`}>
                          <h2 className={`font-bold ${currentDesign.textColor} mb-1`} style={{ fontSize: `${currentDesign.fontSize || 20}px`, lineHeight: 1.2 }}>{currentDesign.title}</h2>
                          <p className={`text-[11px] ${currentDesign.textColor} opacity-80 mb-3`}>{currentDesign.subtitle}</p>
                          <div className={`p-3 rounded-lg ${currentDesign.cardBg} w-full mb-4 border border-white/10 flex justify-center`}>
                            <div className={`text-4xl font-black italic ${currentDesign.accentColor}`}>{currentDesign.discount}<span className="text-sm not-italic ml-1">{currentDesign.discountUnit}</span></div>
                          </div>
                          <div className="w-full bg-black/5 rounded-lg mb-4 border border-white/10 overflow-hidden relative transition-all" style={{ height: `${currentDesign.productHeight || 128}px` }}>
                            <img src={currentDesign.productImg} className="w-full h-full object-cover mix-blend-overlay" alt="" />
                          </div>
                          <button 
                            className={`w-full py-2.5 rounded-full font-bold text-sm ${currentDesign.customBg ? '' : currentDesign.btnBg} ${currentDesign.btnTextCol}`}
                            style={currentDesign.customBg ? { backgroundColor: currentDesign.customBg } : {}}
                          >
                            {currentDesign.btnText}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {workflowState === 'success' && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm animate-in fade-in">
                 <div className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center">
                    <CheckCircle2 size={40} className="text-green-500 mb-3" />
                    <h3 className="text-lg font-bold">应用成功</h3>
                    <p className="text-gray-500 text-xs mt-1">即将返回主配置台...</p>
                 </div>
              </div>
            )}
          </div>

          {/* 右栏：编辑工具瀑布流 */}
          <div className="w-[340px] bg-white border-l border-gray-200 flex flex-col shadow-sm z-10">
            <div className="flex-1 overflow-y-auto bg-white p-5 space-y-5">
               {!currentDesign ? (
                 <div className="text-center text-gray-400 mt-20 text-sm">请先生成弹窗广告方案</div>
               ) : (
                 <>
                   {/* 1. 方案选择 */}
                   <div className="animate-in fade-in">
                     <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                       <Layout size={16} className="text-blue-500" /> 推荐方案
                     </h3>
                     <div className="grid grid-cols-2 gap-2">
                       {proposals.map(p => (
                         <button key={p.id} onClick={() => handleSelectProposal(p.id)} className={`group relative overflow-hidden rounded-lg border-2 bg-white text-left transition-all ${activeProposalId === p.id ? 'border-blue-500 shadow-sm' : 'border-gray-200 hover:border-blue-300'}`}>
                           <div className={`h-12 bg-gradient-to-br ${p.bgGradient} flex items-center justify-center`}>
                             <span className="rounded bg-black/20 px-2 py-0.5 text-xs font-bold text-white">{p.discount}{p.discountUnit}</span>
                           </div>
                           <div className="p-2">
                             <div className="flex items-center justify-between gap-1">
                               <span className="truncate text-xs font-medium text-gray-800">{p.name}</span>
                               {activeProposalId === p.id && <CheckCircle2 size={14} className="shrink-0 text-blue-500" />}
                             </div>
                             <p className="mt-1 truncate text-[11px] text-gray-400">{p.subtitle}</p>
                           </div>
                         </button>
                       ))}
                     </div>
                   </div>

                   {/* 2. AI 改图 */}
                   <div className="animate-in fade-in">
                     <h3 className="text-[15px] font-bold text-[#1f2937] mb-3 flex items-center gap-2">
                       <Pencil size={16} className="text-[#1f2937]" /> 快速修改
                     </h3>
                     <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                       <div className="p-3 bg-white">
                         <div className="relative flex items-center rounded-lg border border-gray-200 p-1 transition-all focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                           <input 
                             type="text" 
                             value={aiEditPrompt} 
                             onChange={(e) => setAiEditPrompt(e.target.value)} 
                             onKeyDown={(e) => e.key === 'Enter' && handleAiEdit()} 
                             placeholder="输入修改指令，如：突出优惠、换文案..." 
                             className="flex-1 bg-transparent border-none px-2 py-1 text-sm outline-none text-gray-700 placeholder-gray-400" 
                           />
                           <button 
                             onClick={() => handleAiEdit()} 
                             disabled={!aiEditPrompt || isAiEditing}
                             className="w-8 h-8 shrink-0 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                           >
                             <Send size={14} />
                           </button>
                          </div>
                         {isAiEditing && <div className="mt-2 text-xs text-gray-400">AI思考中...</div>}
                         <div className="mt-3 grid grid-cols-2 gap-2">
                           {QUICK_EDIT_ACTIONS.map((tag) => (
                             <button
                               key={tag}
                               onClick={() => handleAiEdit(tag)}
                               disabled={isAiEditing}
                               className="rounded-md bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                             >
                               {tag}
                             </button>
                           ))}
                         </div>
                       </div>
                     </div>
                   </div>

                   {/* 3. 手动微调 */}
                   <div className="animate-in fade-in rounded-lg border border-gray-200">
                     <button
                       type="button"
                       onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                       className="flex w-full items-center justify-between px-3 py-3 text-left"
                     >
                       <span className="flex items-center gap-2 text-sm font-bold text-gray-800">
                         <Settings2 size={16} className="text-blue-500" /> 高级微调
                       </span>
                       <ChevronDown size={16} className={`text-gray-400 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
                     </button>
                     {isAdvancedOpen && (
                       <div className="space-y-5 border-t border-gray-100 p-3 text-sm">
                         <section>
                           <h4 className="mb-3 text-xs font-bold text-gray-500">文案</h4>
                           <div className="space-y-3">
                             <div>
                               <label className="block text-xs text-gray-500 mb-1.5">标题</label>
                               <input type="text" value={currentDesign.title} onChange={(e) => updateDesign({ title: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                             </div>
                             <div>
                               <label className="block text-xs text-gray-500 mb-1.5">副标题</label>
                               <input type="text" value={currentDesign.subtitle} onChange={(e) => updateDesign({ subtitle: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                             </div>
                             <div>
                               <label className="block text-xs text-gray-500 mb-1.5">按钮文案</label>
                               <input type="text" value={currentDesign.btnText} onChange={(e) => updateDesign({ btnText: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                             </div>
                           </div>
                         </section>

                         <section>
                           <h4 className="mb-3 text-xs font-bold text-gray-500">样式</h4>
                           <div className="grid grid-cols-2 gap-2">
                             {SEMANTIC_PALETTES.map(color => (
                               <button 
                                 key={color.id} 
                                 onClick={() => updateDesign({
                                   bgGradient: color.bgGradient,
                                   btnBg: color.btnBg,
                                   btnTextCol: color.btnTextCol,
                                   textColor: color.textColor,
                                   accentColor: color.accentColor,
                                   cardBg: color.cardBg,
                                   customBg: null
                                 })} 
                                 className={`flex items-center gap-2 rounded-lg border px-2 py-2 text-left text-xs transition-colors ${!currentDesign.customBg && currentDesign.bgGradient === color.bgGradient ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'}`}
                               >
                                 <span className={`h-5 w-5 shrink-0 rounded-full ${color.swatch}`}></span>
                                 <span className="truncate font-medium">{color.name}</span>
                               </button>
                             ))}
                           </div>
                           <div className="mt-3 flex items-center gap-2">
                             <div 
                               className={`relative w-8 h-8 shrink-0 rounded-full flex items-center justify-center overflow-hidden transition-all ${currentDesign.customBg ? 'ring-2 ring-offset-2 ring-gray-800' : 'ring-1 ring-black/10 hover:ring-black/30'}`}
                               style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}
                               title="自定义颜色"
                             >
                               <div className="absolute inset-[3px] bg-white rounded-full flex items-center justify-center pointer-events-none shadow-inner">
                                 <Palette size={12} className={currentDesign.customBg ? "text-gray-800" : "text-gray-400"} />
                               </div>
                               <input 
                                 type="color" 
                                 value={currentDesign.customBg || '#ffffff'}
                                 onChange={(e) => updateDesign({ bgGradient: '', btnBg: '', customBg: e.target.value })}
                                 className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 opacity-0 cursor-pointer"
                               />
                             </div>
                             <span className="text-xs text-gray-500">自定义颜色</span>
                           </div>
                         </section>

                         <section>
                           <h4 className="mb-3 text-xs font-bold text-gray-500">布局</h4>
                           <div className="space-y-4">
                             <div>
                               <label className="block text-xs text-gray-500 mb-2">字号: {currentDesign.fontSize || 20}px</label>
                               <input type="range" min="12" max="36" value={currentDesign.fontSize || 20} onChange={(e) => updateDesign({ fontSize: Number(e.target.value) })} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                             </div>
                             <div>
                               <label className="block text-xs text-gray-500 mb-2">文字对齐方式</label>
                               <div className="flex gap-2">
                                 {[
                                   { id: 'left', label: '左对齐' },
                                   { id: 'center', label: '居中' },
                                   { id: 'right', label: '右对齐' }
                                 ].map(align => (
                                   <button 
                                     key={align.id} 
                                     onClick={() => updateDesign({ textAlign: align.id })} 
                                     className={`flex-1 py-1.5 text-xs rounded-lg transition-colors border ${currentDesign.textAlign === align.id ? 'border-blue-500 bg-blue-50 text-blue-600 font-medium' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
                                   >
                                     {align.label}
                                   </button>
                                 ))}
                               </div>
                             </div>
                           </div>
                         </section>
                       </div>
                     )}
                   </div>
                 </>
               )}
            </div>

            {/* 右下角：常驻操作栏 */}
            <div className="space-y-3 p-4 bg-white border-t border-gray-100 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] z-10">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={!designHistory.length || isAiEditing || workflowState === 'applying'}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Undo2 size={14} /> 撤销上一步
                </button>
                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={workflowState === 'generating' || workflowState === 'applying' || isAiEditing}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RotateCcw size={14} /> 再生成 {proposalCount} 个
                </button>
              </div>
              <button 
                onClick={handleApplyClick}
                disabled={workflowState !== 'generated' && workflowState !== 'editing' && workflowState !== 'success'}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                {workflowState === 'applying' ? <Loader2 size={16} className="animate-spin" /> : <DownloadCloud size={16} />}
                应用到弹窗
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. AI 商品图片工作台 (子组件: 抽屉)
// ==========================================
const AIProductImageDrawer = ({ isOpen, onClose, onApply }) => {
  const [activeSectionId, setActiveSectionId] = useState(PRODUCT_AI_SECTIONS[0].id);
  const [activeTaskId, setActiveTaskId] = useState(PRODUCT_AI_TASKS[0].id);
  const [productName, setProductName] = useState('轻便多功能运动鞋');
  const [productCategory, setProductCategory] = useState('服饰鞋包 / 运动鞋');
  const [productSellingPoint, setProductSellingPoint] = useState('轻便透气，日常通勤和运动都适合');
  const [sourceImage, setSourceImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState([]);
  const [uploadRequiredToast, setUploadRequiredToast] = useState(false);
  const [sellingTemplateId, setSellingTemplateId] = useState(SELLING_TEMPLATE_PREVIEWS[0].id);
  const [backgroundStyleId, setBackgroundStyleId] = useState(BACKGROUND_STYLE_OPTIONS[0].id);
  const [tryonModelId, setTryonModelId] = useState(TRYON_MODEL_OPTIONS[0].id);
  const sourceInputRef = useRef(null);

  const activeSection = PRODUCT_AI_SECTIONS.find(section => section.id === activeSectionId) || PRODUCT_AI_SECTIONS[0];
  const visibleTasks = PRODUCT_AI_TASKS.filter(task => task.section === activeSectionId);
  const activeTask = PRODUCT_AI_TASKS.find(task => task.id === activeTaskId) || visibleTasks[0] || PRODUCT_AI_TASKS[0];
  const activeBackgroundStyle = BACKGROUND_STYLE_OPTIONS.find(style => style.id === backgroundStyleId) || BACKGROUND_STYLE_OPTIONS[0];
  const activeTryonModel = TRYON_MODEL_OPTIONS.find(model => model.id === tryonModelId) || TRYON_MODEL_OPTIONS[0];

  useEffect(() => {
    if (isOpen) {
      setActiveSectionId(PRODUCT_AI_SECTIONS[0].id);
      setActiveTaskId(PRODUCT_AI_TASKS[0].id);
      setResults([]);
      setIsGenerating(false);
      setSourceImage(null);
      setUploadRequiredToast(false);
      setSellingTemplateId(SELLING_TEMPLATE_PREVIEWS[0].id);
      setBackgroundStyleId(BACKGROUND_STYLE_OPTIONS[0].id);
      setTryonModelId(TRYON_MODEL_OPTIONS[0].id);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!uploadRequiredToast) return;
    const timer = window.setTimeout(() => setUploadRequiredToast(false), 1800);
    return () => window.clearTimeout(timer);
  }, [uploadRequiredToast]);

  const handleSourceUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSourceImage(URL.createObjectURL(file));
    setUploadRequiredToast(false);
    event.target.value = '';
  };

  const showUploadRequiredToast = () => {
    setUploadRequiredToast(false);
    window.setTimeout(() => setUploadRequiredToast(true), 10);
  };

  const handleGenerate = () => {
    if (!sourceImage) {
      showUploadRequiredToast();
      return;
    }
    setIsGenerating(true);
    setResults([]);

    setTimeout(() => {
      const taskIndex = Math.max(PRODUCT_AI_TASKS.findIndex(task => task.id === activeTaskId), 0);
      const nextResults = Array.from({ length: 4 }, (_, index) => {
        const image = sourceImage || PRODUCT_AI_IMAGES[(taskIndex + index) % PRODUCT_AI_IMAGES.length];
        return {
          id: `${activeTaskId}-${Date.now()}-${index}`,
          image,
          variant: index,
          title: `${activeTask.name}方案 ${index + 1}`,
          desc: activeTask.desc,
          section: activeSectionId
        };
      });
      setResults(nextResults);
      setIsGenerating(false);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative flex h-full w-[1100px] max-w-full flex-col bg-white shadow-2xl transform transition-transform duration-300 animate-in slide-in-from-right">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-8">
          <span className="text-xl font-bold tracking-wide text-gray-900">AI素材工具</span>
          <button onClick={onClose} className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
            <X size={20} />
          </button>
        </header>

        <div className="flex min-h-0 flex-1 bg-[#f6f7f9]">
          <aside className="w-[150px] shrink-0 border-r border-gray-200 bg-white">
            <div className="px-5 py-7 text-lg font-bold text-gray-900">AI图片</div>
            <div className="space-y-1">
              {PRODUCT_AI_SECTIONS.map(section => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSectionId(section.id);
                      setResults([]);
                      setIsGenerating(false);
                      const firstTask = PRODUCT_AI_TASKS.find(task => task.section === section.id);
                      if (firstTask) setActiveTaskId(firstTask.id);
                    }}
                    className={`flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-bold transition-colors ${activeSectionId === section.id ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
                  >
                    <Icon size={18} />
                    {section.name}
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="w-[330px] shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-6">
            <section className="mb-6">
              <h3 className="mb-4 text-base font-bold text-gray-900"><span className="text-red-500 mr-1">*</span>上传图片</h3>
              <input ref={sourceInputRef} type="file" accept="image/*" onChange={handleSourceUpload} className="hidden" />
              {sourceImage ? (
                <div className="group relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200">
                  <img src={sourceImage} alt="source" className="h-full w-full object-cover" />
                  <button onClick={() => {
                    setSourceImage(null);
                    setResults([]);
                  }} className="absolute inset-0 hidden items-center justify-center bg-black/50 text-white group-hover:flex">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <button onClick={() => sourceInputRef.current?.click()} className="rounded border border-blue-600 px-8 py-3 text-base font-medium text-blue-600 hover:bg-blue-50">
                  上传图片
                </button>
              )}
            </section>

            <div className="mb-6 border-t border-gray-200"></div>

            {activeSectionId === 'selling' ? (
              <>
                <section>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-black text-gray-900"><span className="text-red-500 mr-1 align-top text-xs">*</span>卖点图模板</h3>
                    <button type="button" className="text-sm font-medium text-gray-400 hover:text-gray-600">
                      全部模板 <ChevronDown className="inline h-4 w-4 -rotate-90" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSellingTemplateId('smart')}
                    className={`relative mb-4 w-full overflow-hidden rounded-xl border-2 p-4 text-left transition-colors ${sellingTemplateId === 'smart' ? 'border-blue-600 bg-blue-50/40' : 'border-gray-200 bg-gray-50 hover:border-blue-300'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-16 items-center justify-center rounded bg-gradient-to-br from-blue-200 to-violet-200 text-white">
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <div className="text-base font-black text-gray-800">智能生成模板</div>
                        <div className="text-xs text-gray-500">根据商品信息自动生成模板</div>
                      </div>
                    </div>
                    {sellingTemplateId === 'smart' && (
                      <span className="absolute right-0 top-0 flex h-9 w-9 items-start justify-end rounded-bl-xl bg-blue-600 pr-1 pt-1 text-white">
                        <CheckCircle2 size={15} />
                      </span>
                    )}
                  </button>

                  <div className="grid grid-cols-3 gap-3">
                    {SELLING_TEMPLATE_PREVIEWS.map((template) => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => setSellingTemplateId(template.id)}
                        className={`relative h-24 overflow-hidden rounded-lg border-2 text-left transition-colors ${sellingTemplateId === template.id ? 'border-blue-500' : 'border-gray-200 hover:border-blue-300'}`}
                      >
                        <div className={`h-full w-full bg-gradient-to-br ${template.accent}`}></div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/35 px-1.5 py-1 text-[9px] font-semibold text-white">
                          {template.text}
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              </>
            ) : activeSectionId === 'background' ? (
              <section>
                <h3 className="mb-4 text-base font-bold text-gray-900"><span className="text-red-500 mr-1">*</span>背景风格</h3>
                <div className="space-y-3">
                  {BACKGROUND_STYLE_OPTIONS.map(style => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setBackgroundStyleId(style.id)}
                      className={`w-full rounded-lg border p-4 text-left transition-colors ${backgroundStyleId === style.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-300'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-10 w-10 rounded-lg bg-gradient-to-br ${style.tone} ring-1 ring-black/5`}></span>
                        <span>
                          <span className="block text-sm font-bold text-gray-900">{style.name}</span>
                          <span className="mt-1 block text-xs text-gray-500">{style.desc}</span>
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ) : activeSectionId === 'tryon' ? (
              <section>
                <h3 className="mb-4 text-base font-bold text-gray-900"><span className="text-red-500 mr-1">*</span>模特类型</h3>
                <div className="grid grid-cols-2 gap-3">
                  {TRYON_MODEL_OPTIONS.map(model => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => setTryonModelId(model.id)}
                      className={`rounded-lg border p-3 text-left transition-colors ${tryonModelId === model.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-300'}`}
                    >
                      <span className="block text-sm font-bold text-gray-900">{model.name}</span>
                      <span className="mt-1 block text-xs leading-5 text-gray-500">{model.desc}</span>
                    </button>
                  ))}
                </div>
              </section>
            ) : (
              <section className="space-y-4">
                {visibleTasks.map(task => {
                  const Icon = task.icon;
                  return (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => {
                        if (!sourceImage) {
                          showUploadRequiredToast();
                          return;
                        }
                        setActiveTaskId(task.id);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-5 py-5 text-left transition-colors ${activeTaskId === task.id ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'}`}
                    >
                      <span className="flex items-center gap-4">
                        <Icon size={22} />
                        <span className="text-base font-bold">{task.name}</span>
                        {['matting', 'upscale', 'clarity', 'remove'].includes(task.id) && (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 text-[10px] text-gray-400">?</span>
                        )}
                      </span>
                      <ChevronDown size={18} />
                    </button>
                  );
                })}
              </section>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
            >
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
              {results.length > 0 ? '再次生成' : activeSectionId === 'selling' ? '生成卖点图' : '生成素材'}
            </button>
          </div>

          <div className="relative flex flex-1 flex-col justify-center overflow-hidden p-8">
            {uploadRequiredToast && (
              <div className="absolute left-1/2 top-6 z-20 flex min-w-[220px] -translate-x-1/2 items-center gap-2.5 rounded-xl border border-gray-100 bg-white px-5 py-4 text-[14px] font-semibold text-gray-800 shadow-[0_12px_28px_rgba(15,23,42,0.12)]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff4d5e] text-white">
                  <CircleX size={14} strokeWidth={2.5} />
                </span>
                请先上传图片
              </div>
            )}
            {isGenerating || results.length > 0 ? (
              <div className="h-full w-full overflow-y-auto pr-2">
                {isGenerating ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="flex items-center rounded-xl bg-white px-6 py-4 text-sm font-medium text-gray-500 shadow-sm">
                      <Loader2 size={22} className="mr-2 animate-spin text-blue-500" />
                      商品素材生成中...
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    {results.map(result => (
                      <div key={result.id} className="overflow-hidden rounded-lg bg-white shadow-sm">
                        <div className={`relative aspect-square overflow-hidden ${result.section === 'background' ? `bg-gradient-to-br ${activeBackgroundStyle.tone}` : result.section === 'tryon' ? 'bg-[#f4efe8]' : result.variant === 0 ? 'bg-[#d9ead3]' : result.variant === 1 ? 'bg-white' : result.variant === 2 ? 'bg-[#fbf6ef]' : 'bg-[#edf5ff]'}`}>
                          <img
                            src={result.image}
                            alt={result.title}
                            className={`h-full w-full ${result.section === 'background' || result.section === 'tryon' || result.variant === 2 ? 'object-contain p-10' : 'object-cover'} ${result.variant === 3 ? 'opacity-70 blur-[1px]' : ''}`}
                          />
                          {result.section === 'background' && (
                            <div className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-gray-800 shadow-sm">
                              {activeBackgroundStyle.name}
                            </div>
                          )}
                          {result.section === 'tryon' && (
                            <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-gray-800 shadow-sm">
                              {activeTryonModel.name} · 试穿效果
                            </div>
                          )}
                          {result.section === 'adjust' && result.variant === 0 && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-[#f8edd2] to-[#e7d29d] px-5 py-3">
                              <div className="flex items-center gap-4">
                                <span className="text-2xl font-black text-emerald-800">火爆</span>
                                <div>
                                  <div className="mb-1 rounded-full bg-emerald-500 px-3 py-0.5 text-center text-xs font-bold text-white">棉制防臭透气好</div>
                                  <div className="text-lg font-black text-emerald-900">秋季短筒运动袜</div>
                                </div>
                              </div>
                            </div>
                          )}
                          {result.section === 'adjust' && result.variant === 1 && (
                            <div className="absolute left-0 right-0 top-0 bg-white/95 px-4 py-3 text-center text-lg font-black text-gray-900">
                              秋季短筒运动袜
                            </div>
                          )}
                          {result.section === 'adjust' && result.variant === 2 && (
                            <div className="absolute left-8 top-8 text-2xl font-black leading-tight text-gray-900">
                              售后无忧<br />热卖中
                              <div className="mt-4 inline-flex rounded-full bg-amber-400 px-4 py-1 text-sm text-white">用户推荐</div>
                            </div>
                          )}
                        </div>
                        <div className="border-t border-gray-100 p-3">
                          <button
                            type="button"
                            onClick={() => onApply(result.image)}
                            className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                          >
                            应用
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : activeSectionId === 'selling' ? (
              <div className="mx-auto w-full max-w-[860px] rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
                <h3 className="mb-7 text-center text-3xl font-black text-gray-800">最多两步，即可获得卖点图</h3>
                <div className="rounded-2xl bg-[#f8f9fc] p-5">
                  <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-5">
                    <div className="rounded-xl border border-blue-100 bg-white p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-700">
                        <ImageIcon className="h-4 w-4 text-blue-500" />
                        选择商品及图片
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3">
                        <div className="mb-2 h-10 rounded bg-gray-200"></div>
                        <div className="h-10 rounded bg-gray-100"></div>
                      </div>
                    </div>
                    <ChevronDown className="h-8 w-8 -rotate-90 text-blue-300" />
                    <div className="rounded-xl border-2 border-orange-300 bg-[#fff8ef] p-3 shadow-[0_8px_24px_rgba(251,146,60,0.16)]">
                      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
                        <Layout className="h-4 w-4 text-blue-500" />
                        选择卖点图模板
                      </div>
                      <div className="relative mx-auto aspect-[3/4] w-28 overflow-hidden rounded-lg border-2 border-orange-400 bg-[#f9d6a8] shadow-[0_8px_16px_rgba(234,88,12,0.18)]">
                        <div className="absolute -left-8 -top-10 h-24 w-24 rounded-full bg-white/30"></div>
                        <div className="absolute right-1.5 top-8 h-10 w-16 rounded-full bg-[#f4b06a]/45"></div>
                        <img src={SELLING_DEMO_TEMPLATE_IMAGE} alt="template preview" className="h-full w-full object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-[#ff8a00] to-[#ff6d00] px-1.5 py-1 text-[8px] font-bold leading-tight text-white">
                          <span className="mr-1 inline-block rounded bg-[#ffe94e] px-1 py-0.5 text-[8px] font-black text-[#1f2937]">以油养肤</span>
                          天然植物精油
                        </div>
                      </div>
                    </div>
                    <ChevronDown className="h-8 w-8 -rotate-90 text-blue-300" />
                    <div className="rounded-xl border-2 border-orange-300 bg-[#fff8ef] p-3 shadow-[0_8px_24px_rgba(251,146,60,0.16)]">
                      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
                        <Sparkles className="h-4 w-4 text-blue-500" />
                        生成卖点图
                      </div>
                      <div className="relative mx-auto aspect-[3/4] w-28 overflow-hidden rounded-lg border-2 border-orange-400 bg-[#f7c85f] shadow-[0_8px_16px_rgba(234,88,12,0.18)]">
                        <div className="absolute right-0 top-0 h-16 w-20 rounded-bl-[24px] bg-[#f4a91c]/30"></div>
                        <img src={SELLING_DEMO_RESULT_IMAGE} alt="selling result preview" className="h-full w-full object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-[#ff8a00] to-[#ff6d00] px-1.5 py-1 text-[8px] font-bold leading-tight text-white">
                          <span className="mr-1 inline-block rounded bg-[#ffe94e] px-1 py-0.5 text-[8px] font-black text-[#1f2937]">甄选原料</span>
                          香脆大果0添加
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeSectionId === 'background' ? (
              <div className={`mx-auto w-full max-w-[560px] overflow-hidden rounded-lg bg-gradient-to-r ${activeBackgroundStyle.tone} p-8`}>
                <div className="flex items-center justify-between gap-8">
                  <div>
                    <div className="mb-6 inline-flex rounded bg-white px-3 py-1 text-lg font-bold text-gray-800 shadow-sm">AI换背景</div>
                    <h3 className="text-2xl font-black text-gray-900">{activeBackgroundStyle.name}</h3>
                    <p className="mt-4 text-lg text-gray-700">{activeBackgroundStyle.desc}</p>
                  </div>
                  <div className="relative h-48 w-64 shrink-0">
                    <div className="absolute bottom-5 left-0 z-10 overflow-hidden rounded border-4 border-white bg-white shadow-xl">
                      <span className="absolute left-0 top-0 bg-gray-500 px-2 py-1 text-xs text-white">原图</span>
                      <img src={sourceImage || PRODUCT_AI_IMAGES[0]} alt="original" className="h-28 w-28 object-cover" />
                    </div>
                    <div className="absolute right-0 top-0 overflow-hidden rounded border-4 border-white bg-white shadow-xl">
                      <span className="absolute left-0 top-0 bg-black/70 px-2 py-1 text-xs text-white">效果图</span>
                      <div className={`flex h-40 w-40 items-center justify-center bg-gradient-to-br ${activeBackgroundStyle.tone}`}>
                        <img src={PRODUCT_AI_IMAGES[1]} alt="background result" className="h-28 w-28 object-contain" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeSectionId === 'tryon' ? (
              <div className="mx-auto w-full max-w-[560px] overflow-hidden rounded-lg bg-gradient-to-r from-stone-100 to-orange-50 p-8">
                <div className="flex items-center justify-between gap-8">
                  <div>
                    <div className="mb-6 inline-flex rounded bg-white px-3 py-1 text-lg font-bold text-gray-800 shadow-sm">服饰上身</div>
                    <h3 className="text-2xl font-black text-gray-900">{activeTryonModel.name}</h3>
                    <p className="mt-4 text-lg text-gray-700">{activeTryonModel.desc}</p>
                  </div>
                  <div className="relative h-48 w-64 shrink-0">
                    <div className="absolute bottom-5 left-0 z-10 overflow-hidden rounded border-4 border-white bg-white shadow-xl">
                      <span className="absolute left-0 top-0 bg-gray-500 px-2 py-1 text-xs text-white">商品图</span>
                      <img src={sourceImage || PRODUCT_AI_IMAGES[0]} alt="tryon source" className="h-28 w-28 object-cover" />
                    </div>
                    <div className="absolute right-0 top-0 flex h-40 w-40 items-center justify-center overflow-hidden rounded border-4 border-white bg-[#f4efe8] shadow-xl">
                      <span className="absolute left-0 top-0 bg-black/70 px-2 py-1 text-xs text-white">上身图</span>
                      <Shirt size={64} className="text-stone-500" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mx-auto w-full max-w-[560px] overflow-hidden rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 p-8">
                <div className="flex items-center justify-between gap-8">
                  <div>
                    <div className="mb-6 inline-flex rounded bg-white px-3 py-1 text-lg font-bold text-indigo-900 shadow-sm">{activeTask.name}</div>
                    <h3 className="text-2xl font-black text-indigo-950">{activeSection.name === 'AI换背景' ? '精美商品场景图' : activeTask.desc}</h3>
                    <p className="mt-4 text-lg text-indigo-900">{activeSection.name === 'AI换背景' ? '30秒批量生成' : '智能处理商品素材'}</p>
                  </div>
                  <div className="relative h-48 w-64 shrink-0">
                    <div className="absolute bottom-5 left-0 z-10 overflow-hidden rounded border-4 border-white bg-white shadow-xl">
                      <span className="absolute left-0 top-0 bg-gray-500 px-2 py-1 text-xs text-white">原图</span>
                      <img src={sourceImage || PRODUCT_AI_IMAGES[0]} alt="original" className="h-28 w-28 object-cover" />
                    </div>
                    <div className="absolute right-0 top-0 overflow-hidden rounded border-4 border-white bg-white shadow-xl">
                      <span className="absolute left-0 top-0 bg-black/70 px-2 py-1 text-xs text-white">效果图</span>
                      <img src={PRODUCT_AI_IMAGES[(PRODUCT_AI_TASKS.findIndex(task => task.id === activeTaskId) + 1) % PRODUCT_AI_IMAGES.length]} alt="result" className="h-40 w-40 object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 2. 弹窗广告后台配置主页面 (父组件)
// ==========================================
const App = () => {
  const [activeMenu, setActiveMenu] = useState('popupAd');
  const [adStyle, setAdStyle] = useState('single'); 
  const [showAIDrawer, setShowAIDrawer] = useState(false);
  const [showAIProductDrawer, setShowAIProductDrawer] = useState(false);
  const fileInputRef = useRef(null);
  const productFileInputRef = useRef(null);
  
  const [audienceType, setAudienceType] = useState('all');
  const [specificConditions, setSpecificConditions] = useState({
    level: false,
    newOld: false,
    tag: false
  });

  const [uploadedImages, setUploadedImages] = useState([
    'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ]);
  const [adJumpLinks, setAdJumpLinks] = useState(['']);
  const [productImages, setProductImages] = useState([]);
  const [draggingAdImageIndex, setDraggingAdImageIndex] = useState(null);
  const [activeAdUploadIndex, setActiveAdUploadIndex] = useState(null);
  const [carouselPreviewIndex, setCarouselPreviewIndex] = useState(0);
  const [isFeatureNoteOpen, setIsFeatureNoteOpen] = useState(false);
  const [featureNotePosition, setFeatureNotePosition] = useState({ left: 24, top: 96 });
  const [featureNotePositionInitialized, setFeatureNotePositionInitialized] = useState(false);
  const featureNoteRef = useRef(null);
  const dragStateRef = useRef({
    dragging: false,
    moved: false,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0
  });

  const handleAdStyleChange = (style) => {
    setAdStyle(style);
    if (style === 'single' && uploadedImages.length > 1) {
      setUploadedImages([uploadedImages[0]]);
      setAdJumpLinks([adJumpLinks[0] || '']);
    }
    if (style !== 'single' && uploadedImages.length === 0) {
      setUploadedImages([
        'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ]);
      setAdJumpLinks(['']);
    }
  };

  const handleAIApply = (newImageUrl) => {
    if (adStyle === 'single') {
      setUploadedImages([newImageUrl]);
      setAdJumpLinks([adJumpLinks[0] || '']);
    } else {
      const zipped = uploadedImages.map((img, index) => ({ img, link: adJumpLinks[index] || '' }));
      const filtered = zipped.filter((item) => item.img !== newImageUrl);
      const nextPairs = [{ img: newImageUrl, link: '' }, ...filtered].slice(0, 5);
      const nextImages = nextPairs.map((item) => item.img);
      const nextLinks = nextPairs.map((item) => item.link);
      setUploadedImages(nextImages);
      setAdJumpLinks(nextLinks);
    }
    setShowAIDrawer(false);
  };

  const handleProductAIApply = (newImageUrl) => {
    setProductImages((prev) => [newImageUrl, ...prev.filter((img) => img !== newImageUrl)].slice(0, 9));
    setShowAIProductDrawer(false);
  };

  const handleLocalFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    if (adStyle === 'single') {
      setUploadedImages([imageUrl]);
      setAdJumpLinks([adJumpLinks[0] || '']);
    } else {
      if (activeAdUploadIndex !== null && activeAdUploadIndex >= 0 && activeAdUploadIndex < 5) {
        setUploadedImages((prev) => {
          const next = [...prev];
          if (activeAdUploadIndex < next.length) {
            next[activeAdUploadIndex] = imageUrl;
          } else if (activeAdUploadIndex === next.length) {
            next.push(imageUrl);
          } else {
            next.push(imageUrl);
          }
          return next.slice(0, 5);
        });
        setAdJumpLinks((prev) => {
          const next = [...prev];
          while (next.length < Math.min(uploadedImages.length + 1, 5)) next.push('');
          return next.slice(0, 5);
        });
      } else {
        setUploadedImages([...uploadedImages, imageUrl].slice(0, 5));
        setAdJumpLinks([...adJumpLinks, ''].slice(0, 5));
      }
    }
    setActiveAdUploadIndex(null);
    e.target.value = '';
  };

  const handleProductFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setProductImages((prev) => [...prev, imageUrl].slice(0, 9));
    e.target.value = '';
  };

  const canSortAdImages = adStyle !== 'single' && uploadedImages.length > 1;

  const handleSelectAdJumpPage = (index) => {
    setAdJumpLinks((prev) => {
      const next = [...prev];
      next[index] = `page-${index + 1}`;
      return next;
    });
  };

  const handleAdImageDragStart = (index) => {
    if (!canSortAdImages) return;
    setDraggingAdImageIndex(index);
  };

  const handleAdImageDrop = (targetIndex) => {
    if (!canSortAdImages || draggingAdImageIndex === null || draggingAdImageIndex === targetIndex) {
      setDraggingAdImageIndex(null);
      return;
    }
    setUploadedImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(draggingAdImageIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    setAdJumpLinks((prev) => {
      const next = [...prev];
      const [moved] = next.splice(draggingAdImageIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    setDraggingAdImageIndex(null);
  };

  useEffect(() => {
    setCarouselPreviewIndex(0);
  }, [adStyle, uploadedImages.length]);

  useEffect(() => {
    if (adStyle !== 'carousel' || uploadedImages.length <= 1) return;
    const timer = window.setInterval(() => {
      setCarouselPreviewIndex((prev) => (prev + 1) % uploadedImages.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [adStyle, uploadedImages]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!dragStateRef.current.dragging || !featureNoteRef.current) return;
      const dx = event.clientX - dragStateRef.current.startX;
      const dy = event.clientY - dragStateRef.current.startY;
      if (Math.abs(dx) + Math.abs(dy) > 4) {
        dragStateRef.current.moved = true;
      }
      const widget = featureNoteRef.current;
      const maxLeft = Math.max(0, window.innerWidth - widget.offsetWidth - 8);
      const maxTop = Math.max(0, window.innerHeight - widget.offsetHeight - 8);
      setFeatureNotePosition({
        left: Math.max(8, Math.min(dragStateRef.current.startLeft + dx, maxLeft)),
        top: Math.max(8, Math.min(dragStateRef.current.startTop + dy, maxTop))
      });
    };

    const stopDrag = () => {
      dragStateRef.current.dragging = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopDrag);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopDrag);
    };
  }, []);

  useEffect(() => {
    if (featureNotePositionInitialized || !featureNoteRef.current) return;
    const widgetWidth = featureNoteRef.current.offsetWidth || 260;
    setFeatureNotePosition({
      left: Math.max(16, window.innerWidth - widgetWidth - 24),
      top: 20
    });
    setFeatureNotePositionInitialized(true);
  }, [featureNotePositionInitialized]);

  const handleFeatureNoteDragStart = (event) => {
    if (event.target.closest('button[data-note-close="true"]')) return;
    dragStateRef.current.dragging = true;
    dragStateRef.current.moved = false;
    dragStateRef.current.startX = event.clientX;
    dragStateRef.current.startY = event.clientY;
    dragStateRef.current.startLeft = featureNotePosition.left;
    dragStateRef.current.startTop = featureNotePosition.top;
    event.preventDefault();
  };

  const handleFeatureNoteFabClick = () => {
    if (dragStateRef.current.moved) {
      dragStateRef.current.moved = false;
      return;
    }
    setIsFeatureNoteOpen((prev) => !prev);
  };

  const ProductPage = () => (
    <div className="w-full max-w-6xl flex flex-col">
      <div className="mb-5">
        <h1 className="text-[18px] font-bold text-gray-900">发布商品</h1>
      </div>

      <div className="bg-white p-8 shadow-sm rounded-lg border border-gray-100">
        <div className="mb-12 flex items-center justify-center gap-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white">1</span>
            <span className="text-base font-bold text-gray-900">编辑基本信息</span>
          </div>
          <div className="h-px w-52 bg-gray-200"></div>
          <div className="flex items-center gap-3 text-gray-400">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-lg">2</span>
            <span className="text-base font-bold">编辑商品详情</span>
          </div>
        </div>

        <section className="mb-10">
          <h2 className="border-b pb-5 text-sm font-bold text-gray-900">商品类型</h2>
          <div className="mt-7 flex gap-5 pl-8">
            <button className="relative h-20 w-36 rounded border-2 border-blue-500 bg-blue-50 text-blue-600">
              <div className="text-lg font-bold">实物商品</div>
              <div className="mt-1 text-sm font-medium">物流发货</div>
              <span className="absolute bottom-0 right-0 h-7 w-7 bg-blue-500 text-white [clip-path:polygon(100%_0,0_100%,100%_100%)]">
                <CheckCircle2 size={14} className="absolute bottom-1 right-1" />
              </span>
            </button>
            <button className="h-20 w-36 rounded border border-gray-300 bg-white text-gray-400">
              <div className="text-lg font-bold">虚拟商品</div>
              <div className="mt-1 text-sm font-medium">无需发货</div>
            </button>
          </div>
        </section>

        <section>
          <h2 className="border-b pb-5 text-sm font-bold text-gray-900">基础信息</h2>
          <div className="mt-8 space-y-7">
            <div className="flex items-start">
              <div className="w-36 shrink-0 pt-2 text-right pr-8 text-sm text-gray-700"><span className="text-red-500 mr-1">*</span>商品名称：</div>
              <input className="w-[620px] rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="请填写商品名称，不超过60个字符" />
            </div>

            <div className="flex items-center">
              <div className="w-36 shrink-0 text-right pr-8 text-sm text-gray-700">商品后台类目：</div>
              <div className="flex items-center gap-5">
                <button className="flex h-10 w-[360px] items-center justify-between rounded border border-gray-300 px-3 text-sm text-gray-400">
                  请选择 <ChevronDown size={18} />
                </button>
                <a className="text-sm font-medium text-blue-600" href="#">管理分类</a>
                <span className="h-4 w-px bg-gray-200"></span>
                <a className="text-sm font-medium text-blue-600" href="#">刷新</a>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-36 shrink-0 pt-2 text-right pr-8 text-sm text-gray-700">商品卖点：</div>
              <div>
                <input className="w-[620px] rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="请填写商品卖点" />
                <p className="mt-2 text-xs text-gray-400">在商品详情页标题下面展示卖点信息，建议50字以内</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-36 shrink-0 pt-2 text-right pr-8 text-sm text-gray-700"><span className="text-red-500 mr-1">*</span>商品图片：</div>
              <div>
                <div className="flex flex-wrap gap-4">
                  {productImages.map((img, idx) => (
                    <div key={idx} className="group relative h-24 w-24 rounded border border-gray-200 shadow-sm">
                      <img src={img} alt="product" className="h-full w-full rounded object-cover" />
                      <div className="absolute inset-0 hidden items-center justify-center rounded bg-black/50 group-hover:flex">
                        <X size={16} className="cursor-pointer text-white" onClick={() => setProductImages(productImages.filter((_, imageIndex) => imageIndex !== idx))} />
                      </div>
                    </div>
                  ))}

                  {productImages.length < 9 && (
                    <div className="group relative">
                      <input type="file" ref={productFileInputRef} onChange={handleProductFileUpload} accept="image/*" className="hidden" />
                      <div className="pointer-events-none absolute bottom-[110%] left-1/2 z-50 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-gray-100 bg-white p-1 shadow-[0_4px_20px_rgba(0,0,0,0.12)] group-hover:flex group-hover:pointer-events-auto before:absolute before:left-0 before:right-0 before:top-full before:h-4 before:content-[''] after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-t-white">
                        <button onClick={() => productFileInputRef.current?.click()} className="flex h-16 w-20 flex-col items-center justify-center gap-1 rounded text-gray-600 transition-colors hover:bg-gray-50">
                          <Upload size={18} /><span className="text-xs">自定义上传</span>
                        </button>
                        <div className="my-2 w-px bg-gray-100"></div>
                        <button className="flex h-16 w-20 flex-col items-center justify-center gap-1 rounded text-gray-600 transition-colors hover:bg-gray-50">
                          <ImageIcon size={18} /><span className="text-xs">在线制作</span>
                        </button>
                        <div className="my-2 w-px bg-gray-100"></div>
                        <button onClick={() => setShowAIProductDrawer(true)} className="flex h-16 w-20 flex-col items-center justify-center gap-1 rounded text-blue-600 transition-colors hover:bg-blue-50">
                          <span className="text-[16px] font-bold leading-none">AI</span><span className="text-xs">智能做图</span>
                        </button>
                      </div>
                      <button className="flex h-24 w-24 flex-col items-center justify-center rounded border border-dashed border-gray-300 bg-white text-gray-400 transition-colors hover:border-blue-500 hover:text-blue-500 group-hover:border-blue-500 group-hover:bg-blue-50/30 group-hover:text-blue-500">
                        <Plus size={22} className="mb-1" />
                        <span className="text-xs">上传图片</span>
                      </button>
                    </div>
                  )}
                </div>
                <p className="mt-3 text-xs text-gray-400">建议图片尺寸为800*800，大小不能超过2M，可拖动排序，最多上传9张</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-36 shrink-0 pt-2 text-right pr-8 text-sm text-gray-700">主图视频：</div>
              <button className="flex h-24 w-24 flex-col items-center justify-center rounded border border-dashed border-gray-300 bg-white text-gray-400 hover:border-blue-500 hover:text-blue-500">
                <Plus size={22} className="mb-1" />
                <span className="text-xs">上传视频</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  const MobilePreview = () => (
    <div className="w-[320px] h-[650px] border-[12px] border-gray-800 rounded-[2.5rem] relative bg-gray-50 shadow-2xl overflow-hidden flex-shrink-0">
      <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50"><div className="w-32 h-5 bg-gray-800 rounded-b-xl"></div></div>
      <div className="absolute inset-0 z-0 opacity-40 grayscale pointer-events-none p-4 mt-8">
          <div className="h-10 bg-gray-200 rounded-full mb-4"></div>
          <div className="grid grid-cols-2 gap-4"><div className="h-40 bg-gray-200 rounded-lg"></div><div className="h-40 bg-gray-200 rounded-lg"></div><div className="h-40 bg-gray-200 rounded-lg"></div><div className="h-40 bg-gray-200 rounded-lg"></div></div>
      </div>
      <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center p-6">
        <div className="relative w-full">
          <button className="absolute -top-10 right-0 text-white opacity-80 hover:opacity-100"><X size={28} className="border-2 border-white rounded-full p-1" /></button>
          
          {adStyle === 'single' && (
            <div className="bg-transparent rounded-xl overflow-hidden shadow-2xl">
              {uploadedImages[0] ? <img src={uploadedImages[0]} alt="Ad" className="w-full h-auto object-cover rounded-xl" /> : <div className="w-full aspect-[3/4] bg-gray-200 flex items-center justify-center rounded-xl text-gray-400">暂无图片</div>}
            </div>
          )}
          
          {adStyle === 'carousel' && (
            <div className="bg-transparent rounded-xl overflow-hidden relative group">
              {uploadedImages.length > 0 ? (
                <>
                  <img src={uploadedImages[carouselPreviewIndex] || uploadedImages[0]} alt="Ad" className="w-full h-auto object-cover rounded-xl transition-all duration-300" />
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    {uploadedImages.map((_, idx) => (
                      <span key={`preview-dot-${idx}`} className={`h-1.5 rounded-full transition-all ${idx === carouselPreviewIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}></span>
                    ))}
                  </div>
                </>
              ) : <div className="w-full aspect-[3/4] bg-gray-200 flex items-center justify-center rounded-xl text-gray-400">暂无图片</div>}
            </div>
          )}

          {adStyle === 'horizontal' && (
              <div className="w-full relative">
                <div className="overflow-x-auto overflow-y-hidden pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex w-max snap-x snap-mandatory gap-3">
                    {uploadedImages.length > 0 ? uploadedImages.map((img, idx) => (
                      <div key={`h-preview-${idx}`} className="w-[228px] shrink-0 snap-start relative shadow-lg">
                        <img src={img} alt={`Ad ${idx + 1}`} className="w-full aspect-square object-cover rounded-xl" />
                      </div>
                    )) : (
                      <div className="w-[228px] shrink-0 snap-start">
                        <div className="w-full aspect-square bg-gray-200 flex items-center justify-center rounded-xl text-gray-400">暂无图片</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  <span className="text-white text-xs opacity-70 flex items-center"><MousePointerClick size={12} className="mr-1"/> 左滑查看更多</span>
                </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-48 shrink-0 border-r border-gray-200 bg-white p-4">
        <div className="mb-6 px-2 text-sm font-bold text-gray-900">功能菜单</div>
        <div className="space-y-2">
          <button
            onClick={() => setActiveMenu('popupAd')}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeMenu === 'popupAd' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Megaphone size={16} /> 弹窗广告
          </button>
          <button
            onClick={() => setActiveMenu('product')}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeMenu === 'product' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Package size={16} /> 商品列表
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 flex justify-center">
      {activeMenu === 'popupAd' ? (
      <div className="w-full max-w-6xl flex flex-col">
        
        {/* ================= 页面顶部标题 ================= */}
        <div className="flex items-center gap-2 mb-5 text-gray-800 cursor-pointer hover:text-blue-600 w-fit group transition-colors">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <h1 className="text-[16px] font-bold">新增弹窗广告</h1>
        </div>

        {/* ================= 内容区 ================= */}
        <div className="flex gap-10">
          
          {/* 左侧：主表单区域 */}
          <div className="flex-1 bg-white p-8 shadow-sm rounded-lg border border-gray-100 overflow-y-auto">
            
            {/* ---- 基础信息 ---- */}
            <div className="mb-10">
              <h2 className="text-sm font-bold text-gray-800 mb-6 border-b pb-2">基础信息</h2>
              
              <div className="space-y-6">
                
                {/* 广告名称 */}
                <div className="flex items-start">
                  <div className="w-28 shrink-0 whitespace-nowrap pt-2 text-right pr-4 text-sm text-gray-600"><span className="text-red-500 mr-1">*</span>广告名称：</div>
                  <div className="flex-1">
                    <div className="relative">
                      <input type="text" placeholder="请填写广告名称" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                      <span className="absolute right-3 top-2.5 text-xs text-gray-400">0/15</span>
                    </div>
                  </div>
                </div>

                {/* 广告时间 */}
                <div className="flex items-start">
                  <div className="w-28 shrink-0 whitespace-nowrap pt-2 text-right pr-4 text-sm text-gray-600"><span className="text-red-500 mr-1">*</span>广告时间：</div>
                  <div className="flex-1 flex items-center gap-2">
                    <input type="text" placeholder="开始日期" className="w-40 border border-gray-300 rounded px-3 py-2 text-sm text-center focus:outline-none" readOnly />
                    <span className="text-gray-400">~</span>
                    <input type="text" placeholder="结束日期" className="w-40 border border-gray-300 rounded px-3 py-2 text-sm text-center focus:outline-none" readOnly />
                  </div>
                </div>

                {/* 图片样式 */}
                <div className="flex items-start">
                  <div className="w-28 shrink-0 whitespace-nowrap pt-2 text-right pr-4 text-sm text-gray-600"><span className="text-red-500 mr-1">*</span>图片样式：</div>
                    <div className="flex-1 flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={adStyle === 'single'} onChange={() => handleAdStyleChange('single')} className="text-blue-600" /><span className="text-sm text-gray-700">单张图片</span></label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={adStyle === 'carousel'} onChange={() => handleAdStyleChange('carousel')} className="text-blue-600" /><span className="text-sm text-gray-700">轮播海报</span><span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-500 ring-1 ring-red-200">新增</span></label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={adStyle === 'horizontal'} onChange={() => handleAdStyleChange('horizontal')} className="text-blue-600" /><span className="text-sm text-gray-700">横向滑动</span><span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-500 ring-1 ring-red-200">新增</span></label>
                    </div>
                  </div>

                {/* 广告图片 */}
                <div className="flex items-start">
                  <div className="w-28 shrink-0 whitespace-nowrap pt-2 text-right pr-4 text-sm text-gray-600"><span className="text-red-500 mr-1">*</span>广告图片：</div>
                  <div className="flex-1">
                    <input type="file" ref={fileInputRef} onChange={handleLocalFileUpload} accept="image/*" className="hidden" />
                    {adStyle === 'single' ? (
                      <div className="flex items-start gap-4 flex-wrap">
                        {uploadedImages.map((img, idx) => (
                          <div key={idx} className="w-24 h-24 border border-gray-200 rounded relative group shadow-sm">
                            <img src={img} alt="uploaded" className="w-full h-full object-cover rounded" />
                            <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center rounded cursor-pointer">
                              <X className="text-white" size={16} onClick={() => {
                                const newImgs = [...uploadedImages];
                                const newLinks = [...adJumpLinks];
                                newImgs.splice(idx, 1);
                                newLinks.splice(idx, 1);
                                setUploadedImages(newImgs);
                                setAdJumpLinks(newLinks.length ? newLinks : ['']);
                              }}/>
                            </div>
                          </div>
                        ))}
                        {uploadedImages.length === 0 && (
                          <div className="group relative">
                            <div className="pointer-events-none absolute bottom-[110%] left-1/2 z-50 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-gray-100 bg-white p-1 shadow-[0_4px_20px_rgba(0,0,0,0.12)] group-hover:flex group-hover:pointer-events-auto before:absolute before:left-0 before:right-0 before:top-full before:h-4 before:content-[''] after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-t-white">
                              <button onClick={() => { setActiveAdUploadIndex(0); fileInputRef.current?.click(); }} className="flex h-16 w-20 flex-col items-center justify-center gap-1 rounded text-gray-600 transition-colors hover:bg-gray-50">
                                <Upload size={18} /><span className="text-xs">自定义上传</span>
                              </button>
                              <div className="my-2 w-px bg-gray-100"></div>
                              <button className="flex h-16 w-20 flex-col items-center justify-center gap-1 rounded text-gray-600 transition-colors hover:bg-gray-50"><ImageIcon size={18} /><span className="text-xs">在线制作</span></button>
                              <div className="my-2 w-px bg-gray-100"></div>
                              <button onClick={() => setShowAIDrawer(true)} className="flex h-16 w-20 flex-col items-center justify-center gap-1 rounded text-blue-600 transition-colors hover:bg-blue-50">
                                <span className="text-[16px] font-bold leading-none mt-0.5 mb-0.5">AI</span><span className="text-xs">智能做图</span>
                              </button>
                            </div>
                            <button className="relative z-0 flex h-24 w-24 flex-col items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50 text-gray-400 transition-colors hover:border-blue-500 hover:text-blue-500 group-hover:border-blue-500 group-hover:bg-blue-50/30 group-hover:text-blue-500">
                              <Plus size={20} className="mb-1" />
                              <span className="text-xs">上传广告图</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {uploadedImages.map((groupImage, groupIndex) => (
                          <div
                            key={`group-${groupIndex}`}
                            className="relative grid grid-cols-[56px_64px_auto_auto_1fr] items-center gap-3 rounded border border-gray-200 bg-gray-50 p-3 pr-10"
                            draggable={canSortAdImages}
                            onDragStart={() => handleAdImageDragStart(groupIndex)}
                            onDragOver={(e) => {
                              if (!canSortAdImages) return;
                              e.preventDefault();
                            }}
                            onDrop={() => handleAdImageDrop(groupIndex)}
                            onDragEnd={() => setDraggingAdImageIndex(null)}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                if (uploadedImages.length <= 1) return;
                                const newImgs = [...uploadedImages];
                                const newLinks = [...adJumpLinks];
                                newImgs.splice(groupIndex, 1);
                                newLinks.splice(groupIndex, 1);
                                setUploadedImages(newImgs);
                                setAdJumpLinks(newLinks);
                              }}
                              disabled={uploadedImages.length <= 1}
                              className={`absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-white ${
                                uploadedImages.length <= 1
                                  ? 'cursor-not-allowed bg-black/25'
                                  : 'bg-black/60 hover:bg-black/75'
                              }`}
                              title="删除分组"
                            >
                              <X size={12} />
                            </button>
                            <span className="text-xs font-medium text-gray-500">图片{groupIndex + 1}</span>
                            <div className="group relative h-16 w-16 overflow-hidden rounded border border-gray-200 bg-white">
                              <img src={groupImage} alt={`ad-group-${groupIndex + 1}`} className="h-full w-full object-cover" />
                            </div>
                            <div className="group relative">
                              <div className="pointer-events-none absolute bottom-[115%] left-1/2 z-50 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-gray-100 bg-white p-1 shadow-[0_4px_20px_rgba(0,0,0,0.12)] group-hover:flex group-hover:pointer-events-auto before:absolute before:left-0 before:right-0 before:top-full before:h-4 before:content-[''] after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-t-white">
                                <button
                                  onClick={() => {
                                    setActiveAdUploadIndex(groupIndex);
                                    fileInputRef.current?.click();
                                  }}
                                  className="flex h-16 w-20 flex-col items-center justify-center gap-1 rounded text-gray-600 transition-colors hover:bg-gray-50"
                                >
                                  <Upload size={18} />
                                  <span className="text-xs">自定义上传</span>
                                </button>
                                <div className="my-2 w-px bg-gray-100"></div>
                                <button className="flex h-16 w-20 flex-col items-center justify-center gap-1 rounded text-gray-600 transition-colors hover:bg-gray-50">
                                  <ImageIcon size={18} />
                                  <span className="text-xs">在线制作</span>
                                </button>
                                <div className="my-2 w-px bg-gray-100"></div>
                                <button onClick={() => setShowAIDrawer(true)} className="flex h-16 w-20 flex-col items-center justify-center gap-1 rounded text-blue-600 transition-colors hover:bg-blue-50">
                                  <span className="text-[16px] font-bold leading-none mt-0.5 mb-0.5">AI</span>
                                  <span className="text-xs">智能做图</span>
                                </button>
                              </div>
                              <button
                                type="button"
                                className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 hover:border-blue-500 hover:text-blue-600"
                              >
                                更换图片
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleSelectAdJumpPage(groupIndex)}
                              className="justify-self-end text-sm text-blue-600 hover:underline"
                            >
                              {adJumpLinks[groupIndex] ? '已选页面，重新选择' : '选择要跳转的页面'}
                            </button>
                          </div>
                        ))}
                        {uploadedImages.length < 5 && (
                          <div className="flex items-center gap-3">
                            <div className="group relative">
                              <div className="pointer-events-none absolute bottom-[115%] left-1/2 z-50 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-gray-100 bg-white p-1 shadow-[0_4px_20px_rgba(0,0,0,0.12)] group-hover:flex group-hover:pointer-events-auto before:absolute before:left-0 before:right-0 before:top-full before:h-4 before:content-[''] after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-t-white">
                                <button
                                  onClick={() => {
                                    setActiveAdUploadIndex(uploadedImages.length);
                                    fileInputRef.current?.click();
                                  }}
                                  className="flex h-16 w-20 flex-col items-center justify-center gap-1 rounded text-gray-600 transition-colors hover:bg-gray-50"
                                >
                                  <Upload size={18} />
                                  <span className="text-xs">自定义上传</span>
                                </button>
                                <div className="my-2 w-px bg-gray-100"></div>
                                <button className="flex h-16 w-20 flex-col items-center justify-center gap-1 rounded text-gray-600 transition-colors hover:bg-gray-50">
                                  <ImageIcon size={18} />
                                  <span className="text-xs">在线制作</span>
                                </button>
                                <div className="my-2 w-px bg-gray-100"></div>
                                <button onClick={() => setShowAIDrawer(true)} className="flex h-16 w-20 flex-col items-center justify-center gap-1 rounded text-blue-600 transition-colors hover:bg-blue-50">
                                  <span className="text-[16px] font-bold leading-none mt-0.5 mb-0.5">AI</span>
                                  <span className="text-xs">智能做图</span>
                                </button>
                              </div>
                              <button
                                type="button"
                                className="inline-flex h-10 items-center justify-center gap-2 rounded border border-dashed border-blue-300 bg-blue-50/40 px-4 text-sm font-medium text-blue-600 hover:bg-blue-50"
                              >
                                <span className="text-base leading-none">+</span>
                                {`添加广告图片（${uploadedImages.length}/5）`}
                              </button>
                            </div>
                            {canSortAdImages && (
                              <span className="text-xs text-gray-400">拖动卡片可调整顺序</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                      图片小于3M，建议尺寸为宽度600像素，高度800像素；若为氛围型广告，建议使用png图片。
                    </p>
                  </div>
                </div>

                {/* 跳转路径 */}
                {adStyle === 'single' && (
                <div className="flex items-center">
                  <div className="w-28 shrink-0 whitespace-nowrap text-right pr-4 text-sm text-gray-600">跳转路径：</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <a href="#" className="text-sm text-blue-600 hover:underline">选择要跳转的页面</a>
                    </div>
                  </div>
                </div>
                )}

              </div>
            </div>

            {/* ---- 推广设置 ---- */}
            <div>
              <h2 className="text-sm font-bold text-gray-800 mb-6 border-b pb-2">推广设置</h2>
              
              <div className="space-y-6">
                
                {/* 应用页面 */}
                <div className="flex items-start">
                  <div className="w-28 shrink-0 whitespace-nowrap pt-1 text-right pr-4 text-sm text-gray-600"><span className="text-red-500 mr-1">*</span>应用页面：</div>
                  <div className="flex-1 flex gap-6 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="rounded text-blue-600" /><span className="text-sm text-gray-700">首页</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded text-blue-600" /><span className="text-sm text-gray-700">微页面</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded text-blue-600" /><span className="text-sm text-gray-700">支付成功页</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded text-blue-600" /><span className="text-sm text-gray-700">订单转换页</span></label>
                  </div>
                </div>

                {/* 显示频率 */}
                <div className="flex items-start">
                  <div className="w-28 shrink-0 whitespace-nowrap pt-1 text-right pr-4 text-sm text-gray-600"><span className="text-red-500 mr-1">*</span>显示频率：</div>
                  <div className="flex-1 flex gap-6 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="freq" defaultChecked className="text-blue-600" /><span className="text-sm text-gray-700">每天推荐一次</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="freq" className="text-blue-600" /><span className="text-sm text-gray-700">仅推荐一次</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="freq" className="text-blue-600" /><span className="text-sm text-gray-700">每次启动都推荐</span></label>
                  </div>
                </div>

                {/* 推广人群 */}
                <div className="flex items-start">
                  <div className="w-28 shrink-0 whitespace-nowrap pt-1 text-right pr-4 text-sm text-gray-600"><span className="text-red-500 mr-1">*</span>推广人群：</div>
                  <div className="flex-1 pt-1">
                    <div className="flex gap-6 mb-2 items-center flex-wrap">
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={audienceType === 'all'} onChange={() => setAudienceType('all')} className="text-blue-600" /><span className="text-sm text-gray-700">全部人群</span></label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={audienceType === 'specific'} onChange={() => setAudienceType('specific')} className="text-blue-600" /><span className="text-sm text-gray-700">指定人群</span><span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-500 ring-1 ring-red-200">新增</span></label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={audienceType === 'unregistered'} onChange={() => setAudienceType('unregistered')} className="text-blue-600" /><span className="text-sm text-gray-700">未注册用户</span><span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-500 ring-1 ring-red-200">新增</span></label>
                      <span className="relative inline-flex group">
                        <span className="text-gray-500 border border-gray-300 rounded-full w-5 h-5 inline-flex items-center justify-center text-xs cursor-help">?</span>
                        <span className="pointer-events-none absolute right-0 top-[-10px] z-20 hidden w-max max-w-[240px] -translate-y-full rounded bg-gray-800 px-2 py-1 text-xs leading-snug text-white shadow-lg group-hover:block">
                          仅针对还未注册小程序会员的用户弹窗广告，适用于通过社交渠道吸引新用户的推广场景
                        </span>
                      </span>
                    </div>

                    {audienceType === 'specific' && (
                      <div className="mt-3">
                        {(!specificConditions.level && !specificConditions.newOld && !specificConditions.tag) && (
                          <p className="text-red-500 text-sm mb-3">开启限制用户购买时，至少选择一项限制条件</p>
                        )}
                        <div className="bg-[#f8f8f8] p-5 rounded-sm relative flex">
                          <div className="w-10 relative shrink-0 flex items-center justify-center">
                            <div className="absolute top-8 bottom-8 left-1/2 w-px bg-gray-300"></div>
                            <div className="relative z-10 bg-[#eef3ff] text-blue-500 text-xs px-2 py-2 font-medium">且</div>
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="bg-white p-4 flex items-center gap-4 rounded-sm border border-transparent shadow-sm">
                              <label className="flex items-center gap-2 cursor-pointer w-[120px] shrink-0">
                                <input type="checkbox" checked={specificConditions.level} onChange={(e) => setSpecificConditions({...specificConditions, level: e.target.checked})} className="rounded text-blue-600" />
                                <span className="text-sm text-gray-700">指定会员等级</span>
                              </label>
                              <select disabled={!specificConditions.level} className="flex-1 max-w-[200px] border border-gray-200 rounded px-3 py-1.5 text-sm disabled:bg-gray-50"><option>请选择</option><option>VIP 1</option><option>VIP 2</option></select>
                            </div>
                            <div className="bg-white p-4 flex items-center gap-4 rounded-sm border border-transparent shadow-sm">
                              <label className="flex items-center gap-2 cursor-pointer w-[120px] shrink-0">
                                <input type="checkbox" checked={specificConditions.newOld} onChange={(e) => setSpecificConditions({...specificConditions, newOld: e.target.checked})} className="rounded text-blue-600" />
                                <span className="text-sm text-gray-700 flex items-center gap-1 whitespace-nowrap">指定新老会员 <span className="text-gray-400 border border-gray-300 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center text-[10px] cursor-help" title="用来区分是否在店铺产生过交易行为">?</span></span>
                              </label>
                              <div className="flex gap-6 pl-2">
                                <label className={`flex items-center gap-2 ${!specificConditions.newOld ? 'opacity-50' : ''}`}><input type="radio" disabled={!specificConditions.newOld} defaultChecked className="text-blue-600" name="newOld" /><span className="text-sm text-gray-600">从未成交会员</span></label>
                                <label className={`flex items-center gap-2 ${!specificConditions.newOld ? 'opacity-50' : ''}`}><input type="radio" disabled={!specificConditions.newOld} className="text-blue-600" name="newOld" /><span className="text-sm text-gray-600">已成交会员</span></label>
                              </div>
                            </div>
                            <div className="bg-white p-4 flex items-center gap-4 rounded-sm border border-transparent shadow-sm">
                              <label className="flex items-center gap-2 cursor-pointer w-[120px] shrink-0">
                                <input type="checkbox" checked={specificConditions.tag} onChange={(e) => setSpecificConditions({...specificConditions, tag: e.target.checked})} className="rounded text-blue-600" />
                                <span className="text-sm text-gray-700">指定用户标签</span>
                              </label>
                              <select disabled={!specificConditions.tag} className="w-[140px] border border-gray-200 rounded px-3 py-1.5 text-sm disabled:bg-gray-50"><option>满足任一标签</option><option>同时满足</option></select>
                              <select disabled={!specificConditions.tag} className="flex-1 max-w-[200px] border border-gray-200 rounded px-3 py-1.5 text-sm disabled:bg-gray-50"><option>请选择</option><option>高净值人群</option></select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 优先级 */}
                <div className="flex items-center">
                  <div className="w-28 shrink-0 whitespace-nowrap text-right pr-4 text-sm text-gray-600"><span className="text-red-500 mr-1">*</span>优先级：</div>
                  <div className="flex-1 flex items-center gap-3">
                    <input type="number" defaultValue="1" className="w-24 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500" />
                    <span className="text-xs text-gray-400">数字越大优先级越高</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-12 flex gap-3 pt-6 border-t border-gray-100">
              <button className="px-6 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">取消</button>
              <button className="px-6 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">确定</button>
            </div>
          </div>

          {/* 右侧：手机预览区域 */}
          <div className="w-auto flex items-start justify-center pt-8">
            <MobilePreview />
          </div>
          
        </div>
      </div>
      ) : (
        <ProductPage />
      )}

      {activeMenu === 'popupAd' && (
        <div
          ref={featureNoteRef}
          className="group fixed z-[80] flex flex-col gap-2"
          style={{ left: featureNotePosition.left, top: featureNotePosition.top }}
        >
          <div className="pointer-events-none self-end rounded bg-black/65 px-2 py-1 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">
            可拖动调整位置
          </div>
          <button
            type="button"
            aria-expanded={isFeatureNoteOpen}
            onMouseDown={handleFeatureNoteDragStart}
            onClick={handleFeatureNoteFabClick}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-orange-500 px-4 text-xs font-semibold text-white shadow-[0_8px_24px_rgba(249,115,22,0.35)]"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px]">注</span>
            <span>弹窗广告新增功能</span>
          </button>
          {isFeatureNoteOpen && (
            <div className="w-[340px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_10px_28px_rgba(0,0,0,0.16)]">
              <div
                className="flex cursor-move items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3"
                onMouseDown={handleFeatureNoteDragStart}
              >
                <span className="text-sm font-semibold text-gray-800">弹窗广告页面注释</span>
                <button
                  type="button"
                  data-note-close="true"
                  onClick={() => setIsFeatureNoteOpen(false)}
                  className="inline-flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="max-h-[62vh] overflow-y-auto px-4 py-3 text-xs leading-6 text-gray-700">
                <h4 className="mb-1 text-[11px] font-bold tracking-wide text-gray-500">交互说明</h4>
                <ul className="mb-3 list-disc pl-4">
                  <li>切换<em className="mx-1 rounded bg-yellow-100 px-1 py-0.5 not-italic font-semibold text-amber-700">轮播海报/横向滑动</em>后，广告图改为分组配置模式。</li>
                  <li>点击<em className="mx-1 rounded bg-yellow-100 px-1 py-0.5 not-italic font-semibold text-amber-700">+添加广告图片</em>可按组新增，最多5组并支持手动删改。</li>
                  <li>拖动分组卡片会同步调整<em className="mx-1 rounded bg-yellow-100 px-1 py-0.5 not-italic font-semibold text-amber-700">图片顺序与跳转页面</em>映射关系。</li>
                  <li>每组“更换图片/添加图片”均支持<em className="mx-1 rounded bg-yellow-100 px-1 py-0.5 not-italic font-semibold text-amber-700">上传/在线制作/AI智能做图</em>三入口。</li>
                  <li>推广人群新增<em className="mx-1 rounded bg-yellow-100 px-1 py-0.5 not-italic font-semibold text-amber-700">指定人群、未注册用户</em>选项。原有的新老客选项需默认选中现有的新老会员</li>
                </ul>
                <h4 className="mb-1 text-[11px] font-bold tracking-wide text-gray-500">逻辑说明</h4>
                <ul className="list-disc pl-4">
                  <li>非单图模式使用<em className="mx-1 rounded bg-blue-100 px-1 py-0.5 not-italic font-semibold text-blue-700">组级跳转配置</em>，不再使用统一跳转输入框。</li>
                  <li>AI应用到广告图时，新图默认插入首位并限制<em className="mx-1 rounded bg-blue-100 px-1 py-0.5 not-italic font-semibold text-blue-700">最多5组</em>。</li>
                  <li>预览端中，轮播模式自动切换并显示指示点；横滑模式支持<em className="mx-1 rounded bg-blue-100 px-1 py-0.5 not-italic font-semibold text-blue-700">左右滑动查看</em>。</li>
                  <li>“未注册用户”说明通过问号悬浮提示常驻展示，文案不随选项切换。</li>
                  <li>分组删除后自动收敛数量，新增按钮中的计数会实时同步当前组数。</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= AI 工作台抽屉 ================= */}
      <AIPosterDrawer 
        isOpen={showAIDrawer} 
        onClose={() => setShowAIDrawer(false)} 
        onApply={handleAIApply}
      />
      <AIProductImageDrawer
        isOpen={showAIProductDrawer}
        onClose={() => setShowAIProductDrawer(false)}
        onApply={handleProductAIApply}
      />

      </main>
    </div>
  );
};

export default App;
