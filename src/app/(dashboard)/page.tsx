'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Mail, 
  Send,
  RefreshCw,
  Plus,
  Filter,
  Search,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { DashboardLayout, designTokens } from '@/components/dashboard/layout';
import { cn } from '@/lib/utils';

const t = designTokens;
const FORCE_DARK = true;

const statusLabels: Record<string, string> = {
  'new': 'جديد',
  'researched': 'تم البحث',
  'enriched': 'مُثري',
  'ready for messaging': 'جاهز للرسائل',
  'ready for qa': 'في مراجعة الجودة',
  'approved': 'معتمد',
  'sent': 'تم الإرسال',
  'opened': 'مفتوح',
  'replied': 'رد',
  'interested': 'مهتم',
};

export default function HomePage() {
  const [stats, setStats] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{sheets: boolean; email: boolean}>({sheets: false, email: false});
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch('/api/dashboard/stats?t=' + Date.now());
      const data = await res.json();
      
      // Get all leads from API
      const allLeads = data.leads || [];
      
      setLeads(allLeads);
      setStats(data.stats || {
        overview: {
          totalLeads: data.stats?.totalLeads || 0,
          emailsSent: data.stats?.pipeline?.sent || 0,
          replies: data.stats?.pipeline?.replied || 0,
          hotLeads: data.stats?.pipeline?.interested || 0,
          warmLeads: 0
        }
      });
      setConnectionStatus({
        sheets: data.connected === true,
        email: data.emailConnected === true
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleStartResearch = async () => {
    try {
      const res = await fetch('/api/agents/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: 'mazen', action: 'start-research' })
      });
      const data = await res.json();
      if(data.success) {
        alert('تم تشغيل دورة البحث!');
        fetchData(true);
      } else {
        alert('فشل في تشغيل دورة البحث.');
      }
    } catch (error) {
      console.error('Failed to start research:', error);
      alert('فشل في تشغيل دورة البحث.');
    }
  };

  const handleAddLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await fetch('/api/leads/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-lead',
          leadData: {
            companyName: formData.get('companyName'),
            website: formData.get('website'),
            email: formData.get('email'),
            industry: formData.get('industry'),
            country: formData.get('country'),
            notes: formData.get('notes'),
          }
        })
      });
      
      if (res.ok) {
        setShowAddModal(false);
        fetchData(true);
      }
    } catch (error) {
      console.error('Failed to add lead:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={cn("text-2xl font-bold", t.textPrimary)}>لوحة التحكم</h1>
            <p className={cn("mt-1", t.textMuted)}>نظرة عامة على أداء النظام</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => fetchData(true)}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-lg border", t.borderDefault, t.textSecondary, t.hover)}
            >
              <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
              تحديث
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-lg", t.accentBg, "text-white", t.accentHover)}
            >
              <Plus className="w-4 h-4" />
              إضافة عميل
            </button>
          </div>
        </div>

        {/* Stats - KPIs from Google Sheets */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={cn(t.bgCard, "rounded-xl border", t.borderDefault, "p-5")}>
            <div className={cn("flex items-center gap-3 mb-2")}>
              <div className={cn(t.bgTertiary, "p-2 rounded-lg")}>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <p className={cn("text-2xl font-bold", t.textPrimary)}>{stats?.overview?.totalLeads || 0}</p>
            <p className={cn("text-sm", t.textMuted)}>إجمالي الليدز</p>
          </div>
          
          <div className={cn(t.bgCard, "rounded-xl border", t.borderDefault, "p-5")}>
            <div className={cn("flex items-center gap-3 mb-2")}>
              <div className={cn(t.bgTertiary, "p-2 rounded-lg")}>
                <Mail className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
            <p className={cn("text-2xl font-bold", t.textPrimary)}>{stats?.overview?.emailsSent || 0}</p>
            <p className={cn("text-sm", t.textMuted)}>إيميلات أُرسلت</p>
          </div>
          
          <div className={cn(t.bgCard, "rounded-xl border", t.borderDefault, "p-5")}>
            <div className={cn("flex items-center gap-3 mb-2")}>
              <div className={cn(t.bgTertiary, "p-2 rounded-lg")}>
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <p className={cn("text-2xl font-bold", t.textPrimary)}>{stats?.overview?.replies || 0}</p>
            <p className={cn("text-sm", t.textMuted)}>ردود مستلمة</p>
          </div>
          
          <div className={cn(t.bgCard, "rounded-xl border", t.borderDefault, "p-5")}>
            <div className={cn("flex items-center gap-3 mb-2")}>
              <div className={cn(t.bgTertiary, "p-2 rounded-lg")}>
                <Send className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <p className={cn("text-2xl font-bold", t.textPrimary)}>{stats?.overview?.hotLeads || 0}</p>
            <p className={cn("text-sm", t.textMuted)}>عملاء ساخنون</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={handleStartResearch}
            className={cn(t.bgCard, "rounded-xl border", t.borderDefault, "p-5 hover:border-blue-500 transition-colors cursor-pointer")}
          >
            <div className="flex items-center gap-4">
              <div className={cn(t.bgTertiary, "p-3 rounded-lg")}>
                <Search className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-right">
                <p className={cn("font-medium", t.textPrimary)}>بدء البحث</p>
                <p className={cn("text-sm", t.textMuted)}>ابحث عن عملاء جدد</p>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => window.location.href = '/pipeline'}
            className={cn(t.bgCard, "rounded-xl border", t.borderDefault, "p-5 hover:border-blue-500 transition-colors cursor-pointer")}
          >
            <div className="flex items-center gap-4">
              <div className={cn(t.bgTertiary, "p-3 rounded-lg")}>
                <Send className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-right">
                <p className={cn("font-medium", t.textPrimary)}>إرسال رسائل</p>
                <p className={cn("text-sm", t.textMuted)}>ارسل للعملاء المستعدين</p>
              </div>
            </div>
          </button>
          
          <div className={cn(t.bgCard, "rounded-xl border", t.borderDefault, "p-5")}>
            <div className="flex items-center gap-4">
              <div className={cn(t.bgTertiary, "p-3 rounded-lg")}>
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-right">
                <p className={cn("font-medium", t.textPrimary)}>حالة النظام</p>
                <p className={cn("text-sm", connectionStatus.sheets ? "text-green-400" : "text-red-400")}>
                  {connectionStatus.sheets ? 'Google Sheets متصل' : 'غير متصل'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Leads with Emails */}
        <div className={cn(t.bgCard, "rounded-xl border", t.borderDefault)}>
          <div className={cn("px-6 py-4 border-b", t.borderDefault)}>
            <h2 className={cn("text-lg font-semibold", t.textPrimary)}>العملاء المتاحون (مع إيميل)</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {leads.length > 0 ? leads.slice(0, 8).map((lead: any, idx: number) => (
              <div key={idx} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className={cn("font-medium", t.textPrimary)}>{lead.company_name}</p>
                  <p className={cn("text-sm", t.textMuted)}>{lead.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-xs px-2 py-1 rounded-full", 
                    lead.current_status === 'sent' ? 'bg-green-400/20 text-green-400' :
                    lead.current_status === 'replied' ? 'bg-blue-400/20 text-blue-400' :
                    'bg-gray-400/20 text-gray-400')}>
                    {statusLabels[lead.current_status] || 'جديد'}
                  </span>
                </div>
              </div>
            )) : (
              <div className="px-6 py-8 text-center">
                <AlertCircle className={cn("w-8 h-8 mx-auto mb-2", t.textMuted)} />
                <p className={cn(t.textMuted)}>لا يوجد عملاء مع إيميل</p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className={cn("mt-3 text-sm text-blue-400 hover:text-blue-300")}
                >
                  أضف عميل جديد
                </button>
              </div>
            )}
          </div>
          {leads.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-800">
              <a href="/pipeline" className={cn("text-sm text-blue-400 hover:text-blue-300")}>
                عرض الكل ({leads.length}) →
              </a>
            </div>
          )}
        </div>

        {/* Add Lead Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={cn(t.bgCard, "rounded-xl border", t.borderDefault, "w-full max-w-md p-6")}>
              <h2 className={cn("text-xl font-bold mb-4", t.textPrimary)}>إضافة عميل جديد</h2>
              <form onSubmit={handleAddLead} className="space-y-4">
                <div>
                  <label className={cn("block text-sm mb-1", t.textSecondary)}>اسم الشركة *</label>
                  <input
                    name="companyName"
                    required
                    className={cn("w-full px-3 py-2 rounded-lg bg-transparent border", t.borderDefault, t.textPrimary, "focus:outline-none focus:border-blue-500")}
                  />
                </div>
                <div>
                  <label className={cn("block text-sm mb-1", t.textSecondary)}>الموقع *</label>
                  <input
                    name="website"
                    type="url"
                    required
                    className={cn("w-full px-3 py-2 rounded-lg bg-transparent border", t.borderDefault, t.textPrimary, "focus:outline-none focus:border-blue-500")}
                  />
                </div>
                <div>
                  <label className={cn("block text-sm mb-1", t.textSecondary)}>البريد الإلكتروني *</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className={cn("w-full px-3 py-2 rounded-lg bg-transparent border", t.borderDefault, t.textPrimary, "focus:outline-none focus:border-blue-500")}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={cn("block text-sm mb-1", t.textSecondary)}>القطاع</label>
                    <select name="industry" className={cn("w-full px-3 py-2 rounded-lg bg-transparent border", t.borderDefault, t.textPrimary, "focus:outline-none focus:border-blue-500")}>
                      <option value="Perfume/Beauty">عطور وجمال</option>
                      <option value="eCommerce">تجارة إلكترونية</option>
                      <option value="Luxury Retail">تجزئة فاخرة</option>
                      <option value="Real Estate">عقارات</option>
                      <option value="Other">أخرى</option>
                    </select>
                  </div>
                  <div>
                    <label className={cn("block text-sm mb-1", t.textSecondary)}>الدولة</label>
                    <select name="country" defaultValue="SA" className={cn("w-full px-3 py-2 rounded-lg bg-transparent border", t.borderDefault, t.textPrimary, "focus:outline-none focus:border-blue-500")}>
                      <option value="SA">السعودية</option>
                      <option value="AE">الإمارات</option>
                      <option value="KW">الكويت</option>
                      <option value="QA">قطر</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={cn("block text-sm mb-1", t.textSecondary)}>ملاحظات</label>
                  <textarea name="notes" rows={2} className={cn("w-full px-3 py-2 rounded-lg bg-transparent border", t.borderDefault, t.textPrimary, "focus:outline-none focus:border-blue-500")} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className={cn("flex-1 px-4 py-2 rounded-lg border", t.borderDefault, t.textSecondary)}>
                    إلغاء
                  </button>
                  <button type="submit" className={cn("flex-1 px-4 py-2 rounded-lg", t.accentBg, "text-white")}>
                    إضافة
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}