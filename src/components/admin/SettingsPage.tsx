'use client'

import { useState, useEffect } from 'react'
import { Save, CheckCircle, AlertCircle, Phone, Mail, MapPin, Clock, Globe, Megaphone, Plus, Trash2 } from 'lucide-react'
import { DEFAULT_CONFIG, type SiteConfig } from '@/lib/site-config'
import { createClient } from '@/lib/supabase/client'

async function saveSettingsToDB(config: Partial<SiteConfig>) {
  const supabase = createClient()
  const entries = Object.entries(config).map(([key, value]) => ({
    key,
    value: typeof value === 'object' ? value : String(value),
  }))
  for (const entry of entries) {
    await (supabase as any).from('site_settings').upsert({ key: entry.key, value: entry.value }, { onConflict: 'key' })
  }
}

function SettingRow({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 items-start py-5 border-b border-border last:border-0">
      <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={16} className="text-brand-blue" strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-3">{label}</p>
        {children}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    // Load from DB
    const load = async () => {
      try {
        const { data } = await (createClient() as any).from('site_settings').select('key, value')
        if (data?.length) {
          const map = Object.fromEntries(data.map((r: any) => [r.key, r.value]))
          setConfig((c) => ({ ...c, ...map }))
        }
      } catch { /* use defaults */ }
    }
    load()
  }, [])

  const set = (key: keyof SiteConfig, val: unknown) => setConfig((c) => ({ ...c, [key]: val }))
  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3500)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveSettingsToDB(config)
      showToast('Settings saved successfully!', 'success')
    } catch (err: any) {
      showToast(err?.message ?? 'Failed to save', 'error')
    } finally { setSaving(false) }
  }

  const input = (label: string, value: string, onChange: (v: string) => void, placeholder = '') => (
    <div>
      <label className="block text-xs font-semibold text-text-secondary mb-1">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full h-9 px-3 rounded-lg border border-border text-sm outline-none focus:border-brand-blue transition-all" />
    </div>
  )

  return (
    <div className="p-6 max-w-3xl">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-large text-sm font-semibold ${toast.type === 'success' ? 'bg-success text-white' : 'bg-error text-white'}`}>
          {toast.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />} {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">Site Settings</h1>
          <p className="text-sm text-text-secondary mt-0.5">Changes go live immediately after saving.</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 h-10 px-5 rounded-xl bg-brand-blue text-white text-sm font-semibold hover:bg-[#1a5ce8] transition-colors shadow-glow-sm disabled:opacity-60">
          <Save size={15} className={saving ? 'animate-spin' : ''} />
          {saving ? 'Saving…' : 'Save All Changes'}
        </button>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-2xl border border-border p-5 mb-5">
        <h2 className="font-semibold text-text-primary mb-1">Contact Information</h2>
        <p className="text-xs text-text-secondary mb-4">Shown in navbar, footer, and all contact sections.</p>
        <SettingRow label="Phone & WhatsApp" icon={Phone}>
          <div className="grid sm:grid-cols-2 gap-3">
            {input('Display Phone', config.phone, (v) => set('phone', v), '+91 99999 99999')}
            {input('WhatsApp Number (no +)', config.whatsapp, (v) => set('whatsapp', v), '919999999999')}
          </div>
        </SettingRow>
        <SettingRow label="Email" icon={Mail}>
          {input('Business Email', config.email, (v) => set('email', v), 'info@jawaharprintingpress.com')}
        </SettingRow>
        <SettingRow label="Address" icon={MapPin}>
          <div className="grid sm:grid-cols-2 gap-3">
            {input('Street Address', config.address, (v) => set('address', v))}
            {input('City', config.city, (v) => set('city', v))}
            {input('State', config.state, (v) => set('state', v))}
            {input('Pincode', config.pincode, (v) => set('pincode', v))}
          </div>
        </SettingRow>
        <SettingRow label="Business Hours" icon={Clock}>
          {input('Hours', config.businessHours, (v) => set('businessHours', v), 'Mon–Sat, 9 AM – 7 PM IST')}
        </SettingRow>
        <SettingRow label="GST Number" icon={Globe}>
          {input('GST', config.gst, (v) => set('gst', v))}
        </SettingRow>
        <SettingRow label="Social Links" icon={Globe}>
          <div className="space-y-2">
            {input('Instagram URL', config.socialLinks.instagram, (v) => set('socialLinks', { ...config.socialLinks, instagram: v }))}
            {input('Facebook URL', config.socialLinks.facebook, (v) => set('socialLinks', { ...config.socialLinks, facebook: v }))}
            {input('YouTube URL', config.socialLinks.youtube, (v) => set('socialLinks', { ...config.socialLinks, youtube: v }))}
          </div>
        </SettingRow>
      </div>

      {/* Announcement bar */}
      <div className="bg-white rounded-2xl border border-border p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-text-primary">Announcement Bar</h2>
            <p className="text-xs text-text-secondary mt-0.5">Rotating offers shown at the top of every page.</p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => set('announcementBar', { ...config.announcementBar, enabled: !config.announcementBar.enabled })}
              className={`w-10 h-6 rounded-full transition-colors relative ${config.announcementBar.enabled ? 'bg-brand-blue' : 'bg-border'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${config.announcementBar.enabled ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
            <span className="text-sm font-medium text-text-primary">{config.announcementBar.enabled ? 'Enabled' : 'Disabled'}</span>
          </label>
        </div>

        <SettingRow label="Messages" icon={Megaphone}>
          <div className="space-y-3">
            {config.announcementBar.messages.map((msg, i) => (
              <div key={i} className="p-3 rounded-xl border border-border bg-bg-secondary space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-secondary uppercase">Message {i + 1}</span>
                  <button onClick={() => set('announcementBar', { ...config.announcementBar, messages: config.announcementBar.messages.filter((_, j) => j !== i) })}
                    className="w-6 h-6 flex items-center justify-center rounded text-text-secondary hover:text-error hover:bg-red-50 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
                <input value={msg.text} onChange={(e) => set('announcementBar', { ...config.announcementBar, messages: config.announcementBar.messages.map((m, j) => j === i ? { ...m, text: e.target.value } : m) })}
                  placeholder="Offer text…"
                  className="w-full h-8 px-2.5 rounded-lg border border-border text-xs outline-none focus:border-brand-blue" />
                <div className="grid grid-cols-2 gap-2">
                  <input value={msg.highlight} onChange={(e) => set('announcementBar', { ...config.announcementBar, messages: config.announcementBar.messages.map((m, j) => j === i ? { ...m, highlight: e.target.value } : m) })}
                    placeholder="Highlighted text (e.g. FIRST10)"
                    className="h-8 px-2.5 rounded-lg border border-border text-xs font-bold outline-none focus:border-brand-blue" />
                  <input value={msg.cta} onChange={(e) => set('announcementBar', { ...config.announcementBar, messages: config.announcementBar.messages.map((m, j) => j === i ? { ...m, cta: e.target.value } : m) })}
                    placeholder="CTA button text"
                    className="h-8 px-2.5 rounded-lg border border-border text-xs outline-none focus:border-brand-blue" />
                </div>
              </div>
            ))}
            {config.announcementBar.messages.length < 5 && (
              <button onClick={() => set('announcementBar', { ...config.announcementBar, messages: [...config.announcementBar.messages, { text: '', highlight: '', suffix: '', cta: 'Learn More', href: '/' }] })}
                className="flex items-center gap-1.5 text-xs text-brand-blue font-semibold hover:underline">
                <Plus size={12} /> Add message
              </button>
            )}
          </div>
        </SettingRow>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 h-11 px-7 rounded-xl bg-brand-blue text-white font-semibold text-sm hover:bg-[#1a5ce8] transition-colors shadow-glow-sm disabled:opacity-60">
          <Save size={15} /> {saving ? 'Saving…' : 'Save All Changes'}
        </button>
      </div>
    </div>
  )
}
