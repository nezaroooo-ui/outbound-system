import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Company Info
const COMPANY_INFO = {
  name: 'نزار كامل',
  title: 'مؤسس NK-AI Video',
  company: 'NK-AI Video',
  website: 'nezarkamel.com',
  instagram: '@nezarkamelai',
  tiktok: '@nezarkamelai',
  youtube: '@nezarkamel-AI',
  x: '@nezarkamel_AI'
};

// Proof Bank - Auto-select based on sector
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
  const sectorMap: Record<string, string> = {
    'fashion': 'الأزياء',
    'beauty': 'الجمال',
    'food': 'الطعام',
    'restaurant': 'المطاعم',
    'medical': 'الطب',
    'health': 'الصحة',
    'real estate': 'العقارات',
    'ecommerce': 'التجارة الإلكترونية',
    'retail': 'التجزئة'
  };
  const sectorLower = sector?.toLowerCase() || '';
  for (const key of Object.keys(sectorMap)) {
    if (sectorLower.includes(key)) {
      return sectorMap[key];
    }
  }
  return sector || 'قطاعكم';
};

// Email Templates
const templates = {
  // Email 1 - First Touch (Day 1) - Under 130 words
  initial: (data: { company: string; sector: string; observation?: string; subject?: string; cta?: string }) => {
    const proof = getProof(data.sector);
    const sectorDisplay = formatSector(data.sector);
    
    const observation = data.observation || `أاحظ أن ${data.company} في طور التوسع في ${sectorDisplay} بالسوق السعودي`;
    const cta = data.cta || 'هل أجرب أقترح فكرة وحدة؟';
    
    return `Subject: ${data.subject || 'فكرة لنمو متجركم'}

${observation}

خلال أكثر من 10 سنوات في التسويق الرقمي وإدارة حملات لعشرات المتاجر والشركات في السعودية والخليج، تعلمت شيئاً واحداً: الفيديو الذي يُباع ليس الأجمل، بل الأذكى تسويقياً.

${proof}

${cta}

نزار كامل
NK-AI Video
nezarkamel.com
Instagram & TikTok: @nezarkamelai
YouTube: @nezarkamel-AI | X: @nezarkamel_AI`;
  },

  // Email 2 - Follow Up (Day 3) - Under 80 words
  followup: (data: { company: string; sector: string; question?: string; insight?: string }) => {
    const sectorDisplay = formatSector(data.sector);
    const question = data.question || `هل تجد أن محتوى الفيديو الحالي يعكس فعلاً مستوى منتجاتكم في ${sectorDisplay}؟`;
    const insight = data.insight || `في ${sectorDisplay} الآن، الفيديو الأقصر (15-30 ثانية) يحقق تفاعلاً أعلى ب70%`;
    
    return `Subject: سؤال واحد عن ${data.company}

${question}

${insight}

${data.company}@gmail.com | nezarkamel.com

—
نزار كامل | NK-AI Video`;
  },

  // Email 3 - Value Email (Day 7) - Under 100 words
  value: (data: { company: string; sector: string; observation?: string; result?: string; question?: string }) => {
    const sectorDisplay = formatSector(data.sector);
    const proof = data.result || getProof(data.sector);
    const observation = data.observation || `في قطاع ${sectorDisplay} هذا الشهر، لاحظت تحولاً نحو المحتوى البصري`;
    const question = data.question || 'هل هذا يلاحظه فريقكم أيضاً؟';
    
    return `Subject: ما لاحظته في ${sectorDisplay} هذا الشهر

${observation}

فيديو واحد ذكي يمكن أن يُحدث فرقاً في كيفية رؤية عملائكم لمنتجاتكم.

${proof}

${question}

—
نزار كامل | nezarkamel.com | NK-AI Video`;
  },

  // Email 4 - Closing (Day 12) - Under 60 words
  final: (data: { company: string }) => {
    return `Subject: آخر رسالة مني

أفهم أن التوقيت قد لا يكون مناسباً الآن.

إذا قررت يوماً أن تحوّل أفكارك إلى فيديو يحكي قصة منتجك ويحقق نتائج حقيقية، أنا هنا.

التواصل متاح دائماً على nezarkamel.com

—
نزار كامل
NK-AI Video`;
  }
};

// Banned phrases that must never appear
const BANNED_PHRASES = [
  'أتمنى أن تجدك رسالتي بخير',
  'تعرفت على شركتكم',
  'نقدم خدمات في مجال',
  'يسعدنا التواصل معكم',
  'لا تترددوا في التواصل',
  'نتطلع لسماع ردكم'
];

// Validate email for banned phrases
const validateEmail = (text: string): { valid: boolean; violations: string[] } => {
  const violations: string[] = [];
  for (const phrase of BANNED_PHRASES) {
    if (text.toLowerCase().includes(phrase.toLowerCase())) {
      violations.push(phrase);
    }
  }
  return { valid: violations.length === 0, violations };
};

// Get template by type
const getTemplate = (type: string) => {
  const templateKeys: Record<string, string> = {
    '1': 'initial',
    'first': 'initial',
    'initial': 'initial',
    'day1': 'initial',
    '2': 'followup',
    'follow': 'followup',
    'followup': 'followup',
    'day3': 'followup',
    '3': 'value',
    'value': 'value',
    'day7': 'value',
    '4': 'final',
    'closing': 'final',
    'final': 'final',
    'day12': 'final'
  };
  return templateKeys[type?.toLowerCase()] || 'initial';
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      to, 
      companyName, 
      sector = 'default',
      observation,
      subject,
      cta,
      question,
      insight,
      result,
      emailType = 'initial'
    } = body;

    if (!to || !companyName) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: to, companyName',
        availableTypes: ['initial', 'followup', 'value', 'final']
      }, { status: 400 });
    }

    // Get template function
    const templateKey = getTemplate(emailType);
    const templateFn = templates[templateKey as keyof typeof templates];
    
    // Build data object
    const templateData = {
      company: companyName,
      sector,
      observation,
      subject,
      cta,
      question,
      insight,
      result
    };
    
    // Generate email
    const emailBody = templateFn(templateData);
    
    // Extract subject line
    const subjectLine = emailBody.split('\n')[0].replace('Subject: ', '').trim();
    const emailContent = emailBody.split('\n').slice(1).join('\n').trim();
    
    // Validate
    const validation = validateEmail(emailContent);
    if (!validation.valid) {
      console.warn('⚠️ Email contains banned phrases:', validation.violations);
    }

    // Get SMTP config
    const configPath = path.join(process.env.HOME || '/root', '.config/imap-smtp-email/.env');
    
    if (!fs.existsSync(configPath)) {
      return NextResponse.json({ success: false, error: 'Email not configured' }, { status: 500 });
    }

    const configContent = fs.readFileSync(configPath, 'utf8');
    const smtpHost = configContent.match(/SMTP_HOST=(.+)/)?.[1]?.trim() || 'smtp.gmail.com';
    const smtpPort = configContent.match(/SMTP_PORT=(.+)/)?.[1]?.trim() || '587';
    const smtpUser = configContent.match(/SMTP_USER=(.+)/)?.[1]?.trim();
    const smtpPass = configContent.match(/SMTP_PASS=(.+)/)?.[1]?.trim();
    const smtpFrom = configContent.match(/SMTP_FROM=(.+)/)?.[1]?.trim();

    if (!smtpUser || !smtpPass) {
      return NextResponse.json({ success: false, error: 'SMTP not configured' }, { status: 500 });
    }

    // Send email
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: smtpPort === '465',
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: smtpFrom || smtpUser,
      to: to,
      subject: subjectLine,
      text: emailContent,
    });

    console.log(`📧 Email sent: type=${templateKey}, to=${to}, subject="${subjectLine}"`);

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully',
      details: {
        type: templateKey,
        subject: subjectLine,
        to: to,
        company: companyName,
        sector: sector,
        proofUsed: getProof(sector),
        wordCount: emailContent.split(/\s+/).length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Email send error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET - Return available templates and company info
export async function GET() {
  return NextResponse.json({
    company: COMPANY_INFO,
    templates: Object.keys(templates),
    proofBank: PROOF_BANK,
    bannedPhrases: BANNED_PHRASES,
    usage: {
      POST: {
        to: 'email@example.com',
        companyName: 'اسم الشركة',
        sector: 'fashion | food | medical | real estate | ecommerce | default',
        observation: 'ملاحظة محددة عن الشركة',
        subject: 'سطر الموضوع',
        cta: 'دعوة للإجراء',
        question: 'سؤال للمتابعة',
        insight: 'نقطة قيمة',
        emailType: 'initial | followup | value | final'
      },
      examples: {
        firstTouch: '/api/email/send with emailType: "initial"',
        followUp: '/api/email/send with emailType: "followup"',
        valueEmail: '/api/email/send with emailType: "value"',
        closing: '/api/email/send with emailType: "final"'
      }
    }
  });
}