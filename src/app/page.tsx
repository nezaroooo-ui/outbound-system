'use client';

import { useState, useEffect } from 'react';

// Types
interface KPIData {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  stage: string;
  lastContact: string;
  source: string;
}

interface AgentActivity {
  agent: string;
  action: string;
  time: string;
  status: 'completed' | 'running' | 'pending';
}

interface Alert {
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  time: string;
}

// Component: KPI Card
function KPICard({ title, value, change, trend, icon }: { title: string; value: number; change: number; trend: 'up' | 'down' | 'neutral'; icon: React.ReactNode }) {
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-yellow-400';
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  
  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 card-hover animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-blue-600/20 rounded-xl">{icon}</div>
        <span className={`text-sm font-medium ${trendColor}`}>{trendIcon} {Math.abs(change)}%</span>
      </div>
      <h3 className="text-slate-400 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value.toLocaleString('ar-EG')}</p>
    </div>
  );
}

// Component: Pipeline Funnel
function PipelineFunnel({ data }: { data: { stage: string; count: number; color: string }[] }) {
  const maxCount = Math.max(...data.map(d => d.count));
  
  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 animate-fade-in">
      <h3 className="text-lg font-semibold text-white mb-6">مسار العميل المحتمل</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.stage} className="relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-300">{item.stage}</span>
              <span className="text-sm font-mono text-slate-400">{item.count}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${(item.count / maxCount) * 100}%`,
                  background: item.color 
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Component: Recent Leads
function RecentLeads({ leads }: { leads: Lead[] }) {
  const stageColors: Record<string, string> = {
    'جديد': 'bg-blue-500/20 text-blue-400',
    'تم التواصل': 'bg-purple-500/20 text-purple-400',
    'مهتم': 'bg-green-500/20 text-green-400',
    'في انتظار الرد': 'bg-yellow-500/20 text-yellow-400',
  };
  
  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">أحدث العملاء المحتملين</h3>
        <button className="text-sm text-blue-400 hover:text-blue-300">عرض الكل →</button>
      </div>
      <div className="space-y-3">
        {leads.map((lead) => (
          <div key={lead.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                {lead.name.charAt(0)}
              </div>
              <div>
                <p className="text-white font-medium">{lead.name}</p>
                <p className="text-sm text-slate-400">{lead.company}</p>
              </div>
            </div>
            <div className="text-left">
              <span className={`text-xs px-3 py-1 rounded-full ${stageColors[lead.stage] || 'bg-slate-500/20 text-slate-400'}`}>
                {lead.stage}
              </span>
              <p className="text-xs text-slate-500 mt-1">{lead.lastContact}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Component: Agent Timeline
function AgentTimeline({ activities }: { activities: AgentActivity[] }) {
  const statusColors: Record<string, string> = {
    'completed': 'bg-green-500',
    'running': 'bg-blue-500 animate-pulse-soft',
    'pending': 'bg-yellow-500',
  };
  
  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 animate-fade-in">
      <h3 className="text-lg font-semibold text-white mb-6">نشاط الوكلاء اليوم</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-4 animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${statusColors[activity.status]}`} />
              {index < activities.length - 1 && <div className="w-px h-full bg-slate-700 mt-1" />}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{activity.agent}</span>
                <span className="text-xs text-slate-500 font-mono">{activity.time}</span>
              </div>
              <p className="text-sm text-slate-400">{activity.action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Component: System Health
function SystemHealth({ health, alerts }: { health: { metric: string; value: string; status: string }[]; alerts: Alert[] }) {
  const statusColors: Record<string, string> = {
    'good': 'text-green-400',
    'warning': 'text-yellow-400', 
    'error': 'text-red-400',
  };
  
  const alertColors: Record<string, string> = {
    'info': 'bg-blue-500/20 border-blue-500/50 text-blue-300',
    'warning': 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
    'error': 'bg-red-500/20 border-red-500/50 text-red-300',
    'success': 'bg-green-500/20 border-green-500/50 text-green-300',
  };
  
  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 animate-fade-in">
      <h3 className="text-lg font-semibold text-white mb-6">صحة النظام والتنبيهات</h3>
      
      {/* Health Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {health.map((item, index) => (
          <div key={index} className="p-4 bg-slate-700/30 rounded-xl">
            <p className="text-sm text-slate-400 mb-1">{item.metric}</p>
            <p className={`text-lg font-semibold ${statusColors[item.status]}`}>{item.value}</p>
          </div>
        ))}
      </div>
      
      {/* Alerts */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-400 mb-3">التنبيهات الأخيرة</h4>
        {alerts.map((alert, index) => (
          <div key={index} className={`p-3 rounded-xl border ${alertColors[alert.type]}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm">{alert.message}</span>
              <span className="text-xs opacity-70">{alert.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Dashboard
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState<KPIData[]>([
    { label: 'إجمالي الليدز', value: 0, change: 0, trend: 'neutral' },
    { label: 'إيميلات أُرسلت', value: 0, change: 0, trend: 'neutral' },
    { label: 'ردود مستلمة', value: 0, change: 0, trend: 'neutral' },
    { label: 'عملاء ساخنون', value: 0, change: 0, trend: 'neutral' },
  ]);
  
  const [pipelineData, setPipelineData] = useState([
    { stage: 'جديد', count: 0, color: '#3b82f6' },
    { stage: 'تم البحث', count: 0, color: '#8b5cf6' },
    { stage: 'تم التواصل', count: 0, color: '#06b6d4' },
    { stage: 'مهتم', count: 0, color: '#22c55e' },
    { stage: 'ساخن', count: 0, color: '#f59e0b' },
  ]);
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [healthData, setHealthData] = useState([
    { metric: 'API', value: '...', status: 'warning' },
    { metric: 'Google Sheets', value: 'جاري الاتصال...', status: 'warning' },
  ]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  // Fetch real data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard/stats?t=' + Date.now());
        const data = await res.json();
        
        if (data.connected) {
          // Update KPIs from real sheet data
          const totalLeads = data.stats?.overview?.totalLeads || data.stats?.totalLeads || 0;
          const emailsSent = data.stats?.overview?.emailsSent || data.stats?.pipeline?.sent || 0;
          const replies = data.stats?.overview?.replies || data.stats?.pipeline?.replied || 0;
          const hotLeads = data.stats?.overview?.hotLeads || data.stats?.pipeline?.interested || 0;
          
          setKpiData([
            { label: 'إجمالي الليدز', value: totalLeads, change: 0, trend: totalLeads > 0 ? 'up' : 'neutral' },
            { label: 'إيميلات أُرسلت', value: emailsSent, change: 0, trend: emailsSent > 0 ? 'up' : 'neutral' },
            { label: 'ردود مستلمة', value: replies, change: 0, trend: replies > 0 ? 'up' : 'neutral' },
            { label: 'عملاء ساخنون', value: hotLeads, change: 0, trend: hotLeads > 0 ? 'up' : 'neutral' },
          ]);
          
          // Update pipeline
          const pipeline = data.stats?.pipelineByStage || {};
          setPipelineData([
            { stage: 'جديد', count: pipeline['جديد (New)'] || 0, color: '#3b82f6' },
            { stage: 'مُثرى', count: pipeline['مُثرى (Enriched)'] || 0, color: '#8b5cf6' },
            { stage: 'Sent', count: emailsSent, color: '#06b6d4' },
            { stage: 'Replied', count: replies, color: '#22c55e' },
            { stage: 'ساخن', count: hotLeads, color: '#f59e0b' },
          ]);
          
          // Update leads from sheet
          if (data.leads && data.leads.length > 0) {
            const mappedLeads = data.leads.slice(0, 5).map((l: any, idx: number) => ({
              id: String(idx + 1),
              name: l.company_name || l.company || l['الشركة'] || 'غير معروف',
              company: l.website || l.email || '—',
              email: l.email || '—',
              stage: l.status || l['الحالة'] || 'جديد',
              lastContact: l['التاريخ'] || '—',
              source: 'Google Sheets',
            }));
            setLeads(mappedLeads);
          }
          
          // Update health
          setHealthData([
            { metric: 'API', value: '99.9%', status: 'good' },
            { metric: 'Google Sheets', value: 'متصل', status: 'good' },
          ]);
          
          // Add data status alert
          setAlerts([
            { type: 'success' as const, message: `تم تحميل ${totalLeads} ليد من Google Sheets`, time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) },
          ]);
        } else {
          setAlerts([{ type: 'warning' as const, message: 'لم يتم الاتصال بـ Google Sheets', time: 'الآن' }]);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setAlerts([{ type: 'error' as const, message: 'فشل في تحميل البيانات', time: 'الآن' }]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">مرحباً، نزار 👋</h2>
        <p className="text-slate-400">هنا ملخص أداء نظام النمو外向بي اليوم</p>
      </div>

      {/* KPI Cards - Section 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard 
          title="إجمالي العملاء المحتملين" 
          value={kpiData[0].value} 
          change={kpiData[0].change} 
          trend={kpiData[0].trend}
          icon={<svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <KPICard 
          title="الرسائل المرسلة" 
          value={kpiData[1].value} 
          change={kpiData[1].change} 
          trend={kpiData[1].trend}
          icon={<svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
        />
        <KPICard 
          title="نسبة الاستجابة" 
          value={kpiData[2].value} 
          change={kpiData[2].change} 
          trend={kpiData[2].trend}
          icon={<svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>}
        />
        <KPICard 
          title="اجتماعات مجدولة" 
          value={kpiData[3].value} 
          change={kpiData[3].change} 
          trend={kpiData[3].trend}
          icon={<svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
      </div>

      {/* Pipeline Funnel - Section 3 */}
      <div className="mb-8">
        <PipelineFunnel data={pipelineData} />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Leads - Section 4 */}
        <RecentLeads leads={leads.length > 0 ? leads : [
          { id: '1', name: '—', company: 'لا توجد بيانات', email: '—', stage: 'جديد', lastContact: '—', source: '—' }
        ]} />
        
        {/* Agent Timeline - Section 5 */}
        <AgentTimeline activities={leads.length > 0 ? [
          { agent: 'النظام', action: 'تم تحميل البيانات من Google Sheets', time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }), status: 'completed' as const },
        ] : [
          { agent: 'النظام', action: 'في انتظار البيانات...', time: '—', status: 'pending' as const },
        ]} />
      </div>

      {/* System Health - Section 6 */}
      <SystemHealth health={healthData} alerts={alerts} />
    </div>
  );
}