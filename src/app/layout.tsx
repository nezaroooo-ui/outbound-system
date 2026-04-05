import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NK-AI Video | AI Video Production',
  description: 'NK-AI Video - AI Video Production Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="gradient-mesh">
        {/* Header */}
        <header className="fixed top-0 right-0 left-0 z-50 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-700">
          <div className="flex items-center justify-between h-full px-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">NK-AI Video</h1>
                <p className="text-xs text-slate-400">AI Video Production</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {[
                { name: 'لوحة التحكم', href: '/', active: true },
                { name: 'العملاء المحتملين', href: '/pipeline', active: false },
                { name: 'الرسائل', href: '/templates', active: false },
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

            {/* Status & Time */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="status-dot active"></span>
                <span className="text-slate-400">نظام نشط</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-mono text-white" id="current-time"></p>
                <p className="text-xs text-slate-500">بتوقيت القاهرة</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-20 pb-8 px-6 min-h-screen">
          {children}
        </main>

        {/* Time Update Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function updateTime() {
                const now = new Date();
                const options = { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                document.getElementById('current-time').textContent = now.toLocaleTimeString('ar-EG', options);
              }
              updateTime();
              setInterval(updateTime, 1000);
            `,
          }}
        />
      </body>
    </html>
  );
}