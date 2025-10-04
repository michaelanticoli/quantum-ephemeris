/**
 * QuantumMelodies Client - ENHANCED VERSION
 * Features: Aspects, Transits, Database Save/Load
 */

import { createClient } from '@supabase/supabase-js';

// REPLACE WITH YOUR ACTUAL VALUES
const SUPABASE_URL = 'https://pqxnvninbjjzddppaebf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxeG52bmluYmpqemRkcHBhZWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1Mjk3ODYsImV4cCI6MjA2MzEwNTc4Nn0.iuND4AopQqkzm3sryd9_jPyh23C7m49-wz45tViH4Xg';
const EPHEMERIS_API = 'https://quantum-ephemeris.onrender.com';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Types
export interface BirthData {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  timezone_offset: number;
}

export interface PlanetPosition {
  name: string;
  longitude: number;
  zodiac_sign: string;
  zodiac_degree: number;
  house: number;
  retrograde: boolean;
}

export interface Aspect {
  planet1: string;
  planet2: string;
  aspect_name: string;
  aspect_angle: number;
  exact_angle: number;
  orb: number;
  musical_interval: string;
  harmony_type: string;
}

export interface NatalChart {
  planets: PlanetPosition[];
  calculation_time: string;
}

export interface EnhancedNatalChart extends NatalChart {
  aspects: Aspect[];
}

export interface SavedChart {
  id: string;
  user_id: string;
  chart_name: string;
  birth_datetime: string;
  birth_latitude: number;
  birth_longitude: number;
  birth_location_name?: string;
  timezone_offset: number;
  created_at: string;
}

export interface Transit {
  transiting_planet: string;
  natal_planet: string;
  aspect_name: string;
  exact_angle: number;
  orb: number;
  musical_interval: string;
}

// Aspect definitions with musical intervals
const ASPECT_DEFINITIONS = [
  { name: 'Conjunction', angle: 0, orb: 8, interval: 'Unison', harmony: 'Neutral' },
  { name: 'Sextile', angle: 60, orb: 6, interval: 'Major Third', harmony: 'Harmonious' },
  { name: 'Square', angle: 90, orb: 8, interval: 'Tritone', harmony: 'Challenging' },
  { name: 'Trine', angle: 120, orb: 8, interval: 'Perfect Fifth', harmony: 'Harmonious' },
  { name: 'Opposition', angle: 180, orb: 8, interval: 'Octave', harmony: 'Neutral' },
  { name: 'Quincunx', angle: 150, orb: 3, interval: 'Minor Seventh', harmony: 'Challenging' },
];

/**
 * Calculate aspects between planets
 */
function calculateAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = [];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];

      // Calculate angle between planets
      let angle = Math.abs(planet1.longitude - planet2.longitude);
      if (angle > 180) angle = 360 - angle;

      // Check each aspect definition
      for (const aspectDef of ASPECT_DEFINITIONS) {
        const orb = Math.abs(angle - aspectDef.angle);
        
        if (orb <= aspectDef.orb) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            aspect_name: aspectDef.name,
            aspect_angle: aspectDef.angle,
            exact_angle: angle,
            orb: orb,
            musical_interval: aspectDef.interval,
            harmony_type: aspectDef.harmony,
          });
          break; // Only one aspect per planet pair
        }
      }
    }
  }

  return aspects;
}

/**
 * Calculate natal chart with aspects
 */
export async function calculateNatalChart(birthData: BirthData): Promise<EnhancedNatalChart> {
  const response = await fetch(`${EPHEMERIS_API}/natal-chart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(birthData),
  });

  if (!response.ok) {
    throw new Error('Failed to calculate chart');
  }

  const chart: NatalChart = await response.json();
  const aspects = calculateAspects(chart.planets);

  return {
    ...chart,
    aspects,
  };
}

/**
 * Get current planetary positions (for transits)
 */
export async function getCurrentPlanetaryPositions(
  latitude: number,
  longitude: number
): Promise<PlanetPosition[]> {
  const now = new Date();
  
  const currentData: BirthData = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    hour: now.getHours(),
    minute: now.getMinutes(),
    latitude,
    longitude,
    timezone_offset: 0, // UTC
  };

  const chart = await calculateNatalChart(currentData);
  return chart.planets;
}

/**
 * Calculate transits (current planets vs natal planets)
 */
export async function calculateTransits(
  natalChart: EnhancedNatalChart,
  latitude: number,
  longitude: number
): Promise<Transit[]> {
  const currentPlanets = await getCurrentPlanetaryPositions(latitude, longitude);
  const transits: Transit[] = [];

  for (const transitingPlanet of currentPlanets) {
    for (const natalPlanet of natalChart.planets) {
      // Calculate angle
      let angle = Math.abs(transitingPlanet.longitude - natalPlanet.longitude);
      if (angle > 180) angle = 360 - angle;

      // Check aspects
      for (const aspectDef of ASPECT_DEFINITIONS) {
        const orb = Math.abs(angle - aspectDef.angle);
        
        if (orb <= aspectDef.orb) {
          transits.push({
            transiting_planet: transitingPlanet.name,
            natal_planet: natalPlanet.name,
            aspect_name: aspectDef.name,
            exact_angle: angle,
            orb: orb,
            musical_interval: aspectDef.interval,
          });
          break;
        }
      }
    }
  }

  return transits;
}

/**
 * Save chart to database
 */
export async function saveChart(
  birthData: BirthData,
  chartName: string,
  locationName?: string
): Promise<SavedChart> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Must be logged in to save charts');

  const birthDatetime = new Date(
    Date.UTC(
      birthData.year,
      birthData.month - 1,
      birthData.day,
      birthData.hour,
      birthData.minute
    )
  ).toISOString();

  const { data, error } = await supabase
    .from('natal_charts')
    .insert({
      user_id: user.id,
      chart_name: chartName,
      birth_datetime: birthDatetime,
      birth_latitude: birthData.latitude,
      birth_longitude: birthData.longitude,
      birth_location_name: locationName,
      timezone_offset: birthData.timezone_offset * 60, // Convert to minutes
      house_system_id: 1, // Placidus
    })
    .select()
    .single();

  if (error) throw error;
  return data as SavedChart;
}

/**
 * Get all saved charts for current user
 */
export async function getSavedCharts(): Promise<SavedChart[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('natal_charts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as SavedChart[];
}

/**
 * Delete a saved chart
 */
export async function deleteChart(chartId: string): Promise<void> {
  const { error } = await supabase
    .from('natal_charts')
    .delete()
    .eq('id', chartId);

  if (error) throw error;
}

/**
 * Convert saved chart back to BirthData
 */
export function savedChartToBirthData(saved: SavedChart): BirthData {
  const date = new Date(saved.birth_datetime);
  
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    latitude: saved.birth_latitude,
    longitude: saved.birth_longitude,
    timezone_offset: saved.timezone_offset / 60, // Convert from minutes
  };
}

// Auth helpers
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email: string, password: string) {
  return await supabase.auth.signUp({ email, password });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export { supabase };