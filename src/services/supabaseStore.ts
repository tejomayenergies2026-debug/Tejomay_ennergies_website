/**
 * supabaseStore.ts
 * -----------------
 * All DB operations for Services and Testimonials.
 * Falls back to localStorage defaults if Supabase is unreachable.
 *
 * Tables expected in Supabase (public schema):
 *   services    — columns match ServiceItem fields (features stored as jsonb)
 *   testimonials — columns match TestimonialItem fields
 */

import { supabase } from '../lib/supabase';
import {
  ServiceItem,
  TestimonialItem,
  DEFAULT_SERVICES,
  DEFAULT_TESTIMONIALS,
} from './store';

// ─── SERVICES ────────────────────────────────────────────────────────────────

export async function fetchServices(): Promise<ServiceItem[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return DEFAULT_SERVICES;

    return data as ServiceItem[];
  } catch (err) {
    console.warn('[Supabase] fetchServices failed, using defaults:', err);
    return DEFAULT_SERVICES;
  }
}

export async function upsertService(item: ServiceItem): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('services')
      .upsert({ ...item }, { onConflict: 'id' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('[Supabase] upsertService failed:', err);
    return false;
  }
}

export async function deleteService(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('[Supabase] deleteService failed:', err);
    return false;
  }
}

export async function replaceAllServices(items: ServiceItem[]): Promise<boolean> {
  try {
    // Delete all existing rows, then insert fresh
    await supabase.from('services').delete().neq('id', '');
    const { error } = await supabase.from('services').insert(items);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('[Supabase] replaceAllServices failed:', err);
    return false;
  }
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

export async function fetchTestimonials(): Promise<TestimonialItem[]> {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return DEFAULT_TESTIMONIALS;

    return data as TestimonialItem[];
  } catch (err) {
    console.warn('[Supabase] fetchTestimonials failed, using defaults:', err);
    return DEFAULT_TESTIMONIALS;
  }
}

export async function upsertTestimonial(item: TestimonialItem): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('testimonials')
      .upsert({ ...item }, { onConflict: 'id' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('[Supabase] upsertTestimonial failed:', err);
    return false;
  }
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('[Supabase] deleteTestimonial failed:', err);
    return false;
  }
}

export async function replaceAllTestimonials(items: TestimonialItem[]): Promise<boolean> {
  try {
    await supabase.from('testimonials').delete().neq('id', '');
    const { error } = await supabase.from('testimonials').insert(items);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('[Supabase] replaceAllTestimonials failed:', err);
    return false;
  }
}

// ─── IMAGE UPLOAD ─────────────────────────────────────────────────────────────

export async function uploadImage(file: File, folder: 'services' | 'testimonials'): Promise<string | null> {
  try {
    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from('tejomay-media')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;

    const { data } = supabase.storage
      .from('tejomay-media')
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (err) {
    console.error('[Supabase] uploadImage failed:', err);
    return null;
  }
}

export async function deleteImage(publicUrl: string): Promise<boolean> {
  try {
    if (!publicUrl || !publicUrl.includes('tejomay-media/')) return false;
    const parts = publicUrl.split('tejomay-media/');
    if (parts.length < 2) return false;
    const filePath = decodeURIComponent(parts[1]);

    const { error } = await supabase.storage
      .from('tejomay-media')
      .remove([filePath]);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('[Supabase] deleteImage failed:', err);
    return false;
  }
}
