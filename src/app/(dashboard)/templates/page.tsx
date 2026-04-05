'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Copy, 
  Save, 
  Send, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  Mail,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Home,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

// Force dark mode
const FORCE_DARK = true;

// Design Tokens
const t = {
  bgPrimary: 'bg-gray-950',
  bgSecondary: 'bg-gray-900',
  bgTertiary: 'bg-gray-800',
  bgCard: 'bg-gray-900',
  borderDefault: 'border-gray-800',
  borderHover: 'border-gray-700',
  borderActive: 'border-blue-500',
  textPrimary: 'text-white',
  textSecondary: 'text-gray-200',
  textMuted: 'text-gray-400',
  textDisabled: 'text-gray-500',
  accent: 'text-blue-400',
  accentBg: 'bg-blue-600',
  accentHover: 'hover:bg-blue-700',
  success: 'text-green-400',
  successBg: 'bg-green-500',
  warning: 'text-yellow-400',
  warningBg: 'bg-yellow-500',
  error: 'text-red-400',
  errorBg: 'bg-red-500',
  hover: 'hover:bg-gray-800',
};

// Sector options
const SECTOR_OPTIONS = [
  { value: 'fashion', label: 'أزياء وجمال' },
  { value: 'beauty', label: 'أزياء وجمال' },
  { value: 'food', label: 'مطاعم وأغذية' },
  { value: 'restaurant', label: 'مطاعم وأغذية' },
  { value: 'medical', label: 'طبي وصحي' },
  { value: 'health', label: 'طبي وصحي' },
  { value: 'real estate', label: 'عقارات' },
  { value: 'ecommerce', label: 'تجارة إلكترونية' },
  { value: 'retail', label: 'تجارة إلكترونية' },
  { value: 'default', label: 'عام' },
];

// Angle options
const ANGLE_OPTIONS = [
  { value: 'timing', label: 'التوقيت' },
  { value: 'opportunity', label: 'الفرصة' },
  { value: 'gap', label: 'الفجوة' },
  { value: 'result', label: 'النتيجة' },
  { value: 'credibility', label: 'المصداقية' },
];

// Proof Bank
const PROOF_BANK: Record<string, string> = {
  'fashion': 'متجر أزياء سعودي حقق 3x في التفاعل خلال أسبوع من فيديو منتج واحد مدته 45 ثانية',
  'beauty': 'متجر أزياء سعودي حقق 3x في التفاعل خلال أسبوع من فيديو منتج واحد مدته 45 ثانية',
  'food': 'سلسلة مطاعم في الخليج زادت طلبات التوصيل 40% بعد فيديو منتج واحد لأكلة رئيسية',
  'restaurant': 'سلسلة مطاعم في الخليج زادت طلبات التوصيل 40% بعد فيديو منتج واحد لأكلة رئيسية',
  'medical': 'عيادة خليجية ضاعفت حجوزاتها بفيديو تعريفي واحد بنى ثقة المرضى قبل الزيارة الأولى',
  'health': 'عيادة خليجية ضاعفت حجوزاتها بفيديو تعريفي واحد بنى ثقة المرضى قبل الزيارة الأولى',
  'real estate': 'شركة عقارية في الرياض باعت وحدات قبل الافتتاح بفيديو 60 ثانية أظهر الرؤية لا الطوب',
  'ecommerce': 'متجر إلكتروني سعودي خفض تكلفة الإعلان 35% بعد استبدال الصور بفيديو منتج ذكي',
  'retail': 'متجر إلكتروني سعودي خفض تكلفة الإعلان 35% بعد استبدال الصور بفيديو منتج ذكي',
  'default': 'خبرة تسويقية تتجاوز 10 سنوات مع عشرات المتاجر والشركات في السعودية والخليج تعني فيديو مصمم ليبيع لا ليُشاهد فقط'
};

// Word limits
const WORD_LIMITS: Record<string, number> = {
  initial: 130,
  followup: 80,
  value: 100,
  final: 60
};

// Banned phrases
const BANNED_PHRASES = [
  'أتمنى أن تجدك رسالتي بخير',
  'تعرفت على شركتكم',
  'نقدم خدمات في مجال',
  'يسعدنا التواصل معكم',
  'لا تترددوا في التواصل',
  'نتطلع لسماع ردكم'
];

// Template subjects
const SUBJECTS: Record<string, string> = {
  initial: 'فكرة لنمو متجركم',
  followup: 'سؤال واحد عن',
  value: 'ما لاحظته في',
  final: 'آخر رسالة مني'
};

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState('initial');
  const [formData, setFormData] = useState({
    company: '',
    sector: 'default',
    observation: '',
    pain: '',
    angle: 'opportunity',
    cta: 'هل أجرب أقترح فكرة وحدة؟'
  });
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  // Get proof based on sector
  const getProof = (sector: string): string => {
    const sectorLower = sector?.toLowerCase() || '';
    for (const key of Object.keys(PROOF_BANK)) {
      if (sectorLower.includes(key)) {
        return PROOF_BANK[key];
      }
    }
    return PROOF_BANK.default;
  };

  // Format sector for display
  const formatSector = (sector: string): string => {
    const sectorLabels: Record<string, string> = {
      'fashion': 'الأزياء',
      'beauty': 'الأزياء',
      'food': 'الطعام',
      'restaurant': 'الطعام',
      'medical': 'الطب',
      'health': 'الطب',
      'real estate': 'العقارات',
      'ecommerce': 'التجارة الإلكترونية',
      'retail': 'التجارة الإلكترونية',
      'default': 'قطاعكم'
    };
    return sectorLabels[sector] || sector;
  };

  // Generate email content
  const generateEmail = useCallback(() => {
    const { company, sector, observation, pain, angle, cta } = formData;
    const proof = getProof(sector);
    const sectorDisplay = formatSector(sector);

    if (activeTab === 'initial') {
      const obs = observation || `أاحظ أن ${company} في طور التوسع في ${sectorDisplay} بالسوق السعودي`;
      return `Subject: ${SUBJECTS.initial}

${obs}

خلال أكثر من 10 سنوات في التسويق الرقمي وإدارة حملات لعشرات المتاجر والشركات في السعودية والخليج، تعلمت شيئاً واحداً: الفيديو الذي يُباع ليس الأجمل، بل الأذكى تسويقياً.

${proof}

${cta}

نزار كامل
NK-AI Video
nezarkamel.com
Instagram & TikTok: @nezarkamelai
YouTube: @nezarkamel-AI | X: @nezarkamel_AI`;
    } else if (activeTab === 'followup') {
      const obs = observation || `هل تجد أن محتوى الفيديو الحالي يعكس فعلاً مستوى منتجاتكم في ${sectorDisplay}؟`;
      const insight = `في ${sectorDisplay} الآن، الفيديو الأقصر (15-30 ثانية) يحقق تفاعلاً أعلى ب70%`;
      return `Subject: ${SUBJECTS.followup} ${company}

${obs}

${insight}

${cta}

—
نزار كامل | NK-AI Video | nezarkamel.com`;
    } else if (activeTab === 'value') {
      const obs = observation || `في قطاع ${sectorDisplay} هذا الشهر، لاحظت تحولاً نحو المحتوى البصري`;
      return `Subject: ${SUBJECTS.value} ${sectorDisplay} هذا الشهر

${obs}

فيديو واحد ذكي يمكن أن يُحدث فرقاً في كيفية رؤية عملائكم لمنتجاتكم.

${proof}

هل هذا يلاحظه فريقكم أيضاً؟

—
نزار كامل | nezarkamel.com | NK-AI Video`;
    } else {
      return `Subject: ${SUBJECTS.final}

أفهم أن التوقيت قد لا يكون مناسباً الآن.

إذا قررت يوماً أن تحوّل أفكارك إلى فيديو يحكي قصة منتجك ويحقق نتائج حقيقية، أنا هنا.

التواصل متاح دائماً على nezarkamel.com

—
نزار كامل
NK-AI Video`;
    }
  }, [formData, activeTab]);

  // Calculate word count
  const wordCount = generateEmail().split(/\s+/).filter(w => w.length > 0).length;
  const wordLimit = WORD_LIMITS[activeTab];
  const wordCountColor = wordCount <= wordLimit * 0.9 ? 'text-green-400' : wordCount <= wordLimit ? 'text-yellow-400' : 'text-red-400';

  // Quality checklist
  const checklist = {
    wordLimit: wordCount <= wordLimit,
    notStartWithMe: !generateEmail().toLowerCase().startsWith('أنا') && !generateEmail().toLowerCase().startsWith('نحن'),
    hasObservation: formData.observation.length > 10 || formData.company.length > 0,
    noPricing: !generateEmail().toLowerCase().includes('سعر') && !generateEmail().toLowerCase().includes('ريال') && !generateEmail().toLowerCase().includes('خصم'),
    oneCTA: (generateEmail().match(/هل/g) || []).length <= 2,
    signatureComplete: generateEmail().includes('نزار كامل') && generateEmail().includes('nezarkamel.com'),
    noBannedPhrases: !BANNED_PHRASES.some(phrase => generateEmail().includes(phrase))
  };

  const checklistPass = Object.values(checklist).filter(Boolean).length;
  const checklistTotal = Object.keys(checklist).length;

  // Copy to clipboard
  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateEmail());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Save as draft
  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      // Save to Google Sheets via API
      const res = await fetch('/api/leads/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save-template-draft',
          templateType: activeTab,
          content: generateEmail(),
          formData
        })
      });
      if (res.ok) {
        alert('تم حفظ المسودة بنجاح!');
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      setSaving(false);
    }
  };

  // Send to Hala
  const handleSendToHala = async () => {
    setSending(true);
    try {
      const res = await fetch('/api/leads/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit-to-hala',
          templateType: activeTab,
          content: generateEmail(),
          formData,
          checklist
        })
      });
      if (res.ok) {
        alert('تم إرسال الرسالة لـ Hala للمراجعة!');
      }
    } catch (error) {
      console.error('Failed to send to Hala:', error);
    } finally {
      setSending(false);
    }
  };

  const tabs = [
    { id: 'initial', label: 'الرسالة الأولى', sublabel: 'Day 1', limit: 130 },
    { id: 'followup', label: 'المتابعة الأولى', sublabel: 'Day 3', limit: 80 },
    { id: 'value', label: 'رسالة القيمة', sublabel: 'Day 7', limit: 100 },
    { id: 'final', label: 'الإغلاق', sublabel: 'Day 12', limit: 60 },
  ];

  return (
    <div className={t.bgPrimary}>
      {/* Header */}
      <header className={`border-b sticky top-0 z-50 ${t.bgSecondary} ${t.borderDefault}`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => window.location.href = '/'} className="flex items-center gap-2 group cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className={`text-lg font-bold ${t.textPrimary}`}>NK-AI Video</span>
                  <span className={`text-xs -mt-1 ${t.textMuted}`}>AI Video Production</span>
                </div>
              </button>
            </div>
            
            <nav className="flex items-center gap-1">
              {[
                { name: 'لوحة التحكم', href: '/', active: false },
                { name: 'العملاء المحتملين', href: '/pipeline', active: false },
                { name: 'الرسائل', href: '/templates', active: true },
                { name: 'التقارير', href: '/reports', active: false },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    item.active
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Section 1 - Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${t.textPrimary}`}>قوالب الرسائل | NK-AI Video</h1>
          <p className={`mt-1 ${t.textMuted}`}>نظام الرسائل الديناميكي المخصص لكل عميل</p>
        </div>

        {/* Section 2 - Email Type Selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl border transition-all ${
                activeTab === tab.id
                  ? `${t.accentBg} text-white border-blue-500`
                  : `${t.bgCard} ${t.textSecondary} ${t.borderDefault} hover:${t.borderHover}`
              }`}
            >
              <div className="text-right">
                <p className="font-medium">{tab.label}</p>
                <p className="text-xs opacity-70">{tab.sublabel} - under {tab.limit} words</p>
              </div>
            </button>
          ))}
        </div>

        {/* Section 3 & 4 - Input & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Panel - Input */}
          <div className={`${t.bgCard} rounded-xl border ${t.borderDefault} p-6`}>
            <h3 className={`text-lg font-semibold ${t.textPrimary} mb-4`}>بيانات الرسالة</h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm mb-1 ${t.textSecondary}`}>اسم الشركة *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg bg-transparent border ${t.borderDefault} ${t.textPrimary} focus:outline-none focus:border-blue-500`}
                  placeholder="أدخل اسم الشركة"
                />
              </div>

              <div>
                <label className={`block text-sm mb-1 ${t.textSecondary}`}>القطاع</label>
                <select
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg bg-transparent border ${t.borderDefault} ${t.textPrimary} focus:outline-none focus:border-blue-500`}
                >
                  {SECTOR_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm mb-1 ${t.textSecondary}`}>الملاحظة (من ليان)</label>
                <textarea
                  value={formData.observation}
                  onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                  rows={2}
                  className={`w-full px-3 py-2 rounded-lg bg-transparent border ${t.borderDefault} ${t.textPrimary} focus:outline-none focus:border-blue-500`}
                  placeholder="ملاحظة محددة عن العميل"
                />
              </div>

              <div>
                <label className={`block text mb-1 ${t.textSecondary}`}>نقطة الألم (من ليان)</label>
                <textarea
                  value={formData.pain}
                  onChange={(e) => setFormData({ ...formData, pain: e.target.value })}
                  rows={2}
                  className={`w-full px-3 py-2 rounded-lg bg-transparent border ${t.borderDefault} ${t.textPrimary} focus:outline-none focus:border-blue-500`}
                  placeholder="نقطة الألم الرئيسية"
                />
              </div>

              <div>
                <label className={`block text-sm mb-1 ${t.textSecondary}`}>الزاوية</label>
                <select
                  value={formData.angle}
                  onChange={(e) => setFormData({ ...formData, angle: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg bg-transparent border ${t.borderDefault} ${t.textPrimary} focus:outline-none focus:border-blue-500`}
                >
                  {ANGLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm mb-1 ${t.textSecondary}`}>CTA (دعوة للإجراء)</label>
                <input
                  type="text"
                  value={formData.cta}
                  onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg bg-transparent border ${t.borderDefault} ${t.textPrimary} focus:outline-none focus:border-blue-500`}
                  placeholder="هل أجرب أقترح فكرة وحدة؟"
                />
              </div>

              <div className={`p-3 rounded-lg ${t.bgTertiary}`}>
                <label className={`block text-sm mb-1 ${t.textMuted}`}>الدليل (يتحدد تلقائياً)</label>
                <p className={`text-sm ${t.textSecondary}`}>{getProof(formData.sector)}</p>
              </div>
            </div>
          </div>

          {/* Right Panel - Live Preview */}
          <div className={`${t.bgCard} rounded-xl border ${t.borderDefault} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${t.textPrimary}`}>معاينة مباشرة</h3>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${wordCountColor}`}>
                  {wordCount} / {wordLimit} كلمة
                </span>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${t.bgTertiary} h-[400px] overflow-y-auto`}>
              <pre className={`whitespace-pre-wrap text-sm ${t.textSecondary} font-sans leading-relaxed`}>
                {generateEmail()}
              </pre>
            </div>

            {/* Signature Block */}
            <div className={`mt-4 pt-4 border-t ${t.borderDefault}`}>
              <p className={`text-xs ${t.textMuted}`}>التوقيع الثابت:</p>
              <pre className={`text-xs ${t.textMuted} mt-1`}>
{'نزار كامل\nNK-AI Video - صناعة فيديوهات الذكاء الاصطناعي\nnezarkamel.com\nInstagram & TikTok: @nezarkamelai\nYouTube: @nezarkamel-AI | X: @nezarkamel_AI'}
              </pre>
            </div>
          </div>
        </div>

        {/* Section 5 - Quality Checklist */}
        <div className={`${t.bgCard} rounded-xl border ${t.borderDefault} p-6 mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${t.textPrimary}`}>قائمة الجودة</h3>
            <span className={`text-sm ${checklistPass === checklistTotal ? 'text-green-400' : 'text-yellow-400'}`}>
              {checklistPass} / {checklistTotal} ✓
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(checklist).map(([key, passed]) => (
              <div 
                key={key}
                className={`flex items-center gap-2 p-2 rounded-lg ${
                  passed ? 'bg-green-500/10' : 'bg-red-500/10'
                }`}
              >
                {passed ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-xs ${passed ? 'text-green-400' : 'text-red-400'}`}>
                  {key === 'wordLimit' && 'تحت حد الكلمات'}
                  {key === 'notStartWithMe' && 'لا تبدأ بـ أنا/نحن'}
                  {key === 'hasObservation' && 'ملاحظة خاصة'}
                  {key === 'noPricing' && 'لا أسعار'}
                  {key === 'oneCTA' && 'CTA واحد'}
                  {key === 'signatureComplete' && 'التوقيع مكتمل'}
                  {key === 'noBannedPhrases' && 'لا عبارات ممنوعة'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6 - Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${t.borderDefault} ${t.textSecondary} ${t.hover}`}
          >
            <Copy className="w-4 h-4" />
            {copied ? 'تم النسخ!' : 'نسخ الرسالة'}
          </button>
          
          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${t.borderDefault} ${t.textSecondary} ${t.hover}`}
          >
            <Save className="w-4 h-4" />
            {saving ? 'جاري الحفظ...' : 'حفظ كمسودة'}
          </button>
          
          <button
            onClick={handleSendToHala}
            disabled={sending || checklistPass < checklistTotal}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${t.accentBg} text-white ${t.accentHover} disabled:opacity-50`}
          >
            <Send className="w-4 h-4" />
            {sending ? 'جاري الإرسال...' : 'إرسال لـ Hala للمراجعة'}
          </button>
        </div>
      </main>
    </div>
  );
}