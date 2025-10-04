import React, { useState, useEffect } from 'react';

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
}

interface PlanetPosition {
  name: string;
  longitude: number;
  zodiac_sign: string;
  zodiac_degree: number;
  house: number;
  retrograde: boolean;
}

interface CalculatedAspect {
  planet1: string;
  planet2: string;
  aspect_name: string;
  exact_angle: number;
  orb: number;
  musical_interval: string;
  harmony_type: string;
  strength: number;
}

interface CalculatedTransit {
  transiting_planet: string;
  natal_planet: string;
  aspect_name: string;
  orb: number;
  musical_interval: string;
  intensity: number;
  movement_direction: 'applying' | 'separating';
}

interface SimpleNatalChart {
  planets: PlanetPosition[];
  calculation_time: string;
}

interface MusicalTheme {
  name: string;
  key: string;
  mode: string;
  tempo_base: number;
  emotional_tone: string;
  instruments: string[];
  rhythmic_pattern: string;
}

interface CompositionStructure {
  total_duration: number;
  movements: MovementSection[];
  dominant_themes: MusicalTheme[];
  harmonic_tension_curve: number[];
  rhythmic_complexity: number;
}

interface MovementSection {
  name: string;
  duration: number;
  primary_planets: string[];
  key_changes: string[];
  tempo_shifts: number[];
  emotional_arc: string;
  musical_motifs: string[];
}

interface GeneratedAudio {
  id: string;
  status: 'generating' | 'completed' | 'failed';
  audio_url?: string;
  video_url?: string;
  prompt: string;
  created_at: string;
  metadata?: any;
}

const API_URL = 'https://quantum-ephemeris.onrender.com';
const SUNO_API_KEY = 'your-suno-api-key'; // You'll need to set this

const QuantumMelodicMetaSystem: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'chart' | 'aspects' | 'transits' | 'composition' | 'audio'>('chart');
  const [user, setUser] = useState<any>({ email: 'quantum@user.com' });
  const [loading, setLoading] = useState(false);
  const [chart, setChart] = useState<SimpleNatalChart | null>(null);
  const [aspects, setAspects] = useState<CalculatedAspect[]>([]);
  const [transits, setTransits] = useState<CalculatedTransit[]>([]);
  const [composition, setComposition] = useState<CompositionStructure | null>(null);
  
  // Audio generation state
  const [generatedAudio, setGeneratedAudio] = useState<GeneratedAudio | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioHistory, setAudioHistory] = useState<GeneratedAudio[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  
  // Location search state
  const [locationQuery, setLocationQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    year: new Date().getFullYear() - 30,
    month: 4,
    day: 24,
    hour: 12,
    minute: 0,
    latitude: 40.7128,
    longitude: -74.0060,
    timezone_offset: -4
  });

  // Particles effect
  useEffect(() => {
    const canvas = document.getElementById('particles') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: any[] = [];
    
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);

  // Enhanced Musical Engine (same as before)
  const ASPECT_DEFINITIONS = [
    { name: 'Conjunction', angle: 0, orb: 8, musical_interval: 'Unison', harmony_type: 'Fusion', tension: 0.8 },
    { name: 'Sextile', angle: 60, orb: 6, musical_interval: 'Major Third', harmony_type: 'Flow', tension: 0.2 },
    { name: 'Square', angle: 90, orb: 8, musical_interval: 'Tritone', harmony_type: 'Friction', tension: 0.9 },
    { name: 'Trine', angle: 120, orb: 8, musical_interval: 'Perfect Fifth', harmony_type: 'Harmony', tension: 0.1 },
    { name: 'Opposition', angle: 180, orb: 8, musical_interval: 'Octave', harmony_type: 'Polarity', tension: 0.7 },
    { name: 'Quincunx', angle: 150, orb: 3, musical_interval: 'Minor Seventh', harmony_type: 'Adjustment', tension: 0.6 }
  ];

  const PLANETARY_MUSICAL_DNA = {
    Sun: { base_note: 'C', instrument_family: 'brass', tempo_modifier: 1.0, emotional_core: 'confident', rhythmic_signature: '4/4', harmonic_preference: 'major' },
    Moon: { base_note: 'A', instrument_family: 'strings', tempo_modifier: 0.7, emotional_core: 'intuitive', rhythmic_signature: '3/4', harmonic_preference: 'minor' },
    Mercury: { base_note: 'E', instrument_family: 'woodwinds', tempo_modifier: 1.4, emotional_core: 'quick', rhythmic_signature: '6/8', harmonic_preference: 'diminished' },
    Venus: { base_note: 'F', instrument_family: 'strings', tempo_modifier: 0.85, emotional_core: 'beautiful', rhythmic_signature: '3/4', harmonic_preference: 'major' },
    Mars: { base_note: 'G', instrument_family: 'percussion', tempo_modifier: 1.5, emotional_core: 'driving', rhythmic_signature: '4/4', harmonic_preference: 'augmented' },
    Jupiter: { base_note: 'D', instrument_family: 'brass', tempo_modifier: 0.9, emotional_core: 'expansive', rhythmic_signature: '4/4', harmonic_preference: 'major' },
    Saturn: { base_note: 'Bb', instrument_family: 'organ', tempo_modifier: 0.6, emotional_core: 'structured', rhythmic_signature: '4/4', harmonic_preference: 'minor' },
    Uranus: { base_note: 'F#', instrument_family: 'electronic', tempo_modifier: 1.2, emotional_core: 'innovative', rhythmic_signature: '7/8', harmonic_preference: 'augmented' },
    Neptune: { base_note: 'Db', instrument_family: 'ambient', tempo_modifier: 0.5, emotional_core: 'ethereal', rhythmic_signature: '5/4', harmonic_preference: 'suspended' },
    Pluto: { base_note: 'Ab', instrument_family: 'bass', tempo_modifier: 0.4, emotional_core: 'transformative', rhythmic_signature: '4/4', harmonic_preference: 'diminished' }
  };

  // Audio Generation Functions
  const generateDetailedPrompt = (composition: CompositionStructure, aspects: CalculatedAspect[], transits: CalculatedTransit[], chart: SimpleNatalChart): string => {
    const strongAspects = aspects.filter(a => a.strength > 0.7);
    const activeTransits = transits.filter(t => t.intensity > 0.6);
    
    const birthDate = new Date(formData.year, formData.month - 1, formData.day);
    const birthTime = `${String(formData.hour).padStart(2, '0')}:${String(formData.minute).padStart(2, '0')}`;
    
    return `Create a cosmic ambient symphony titled "Natal Symphony - ${birthDate.toLocaleDateString()}" with these precise specifications:

🎵 **MUSICAL STRUCTURE:**
• Duration: ${formatDuration(composition.total_duration)} 
• Primary Key: ${composition.dominant_themes[0].key} ${composition.dominant_themes[0].mode}
• Base Tempo: ${composition.dominant_themes[0].tempo_base} BPM
• Movements: ${composition.movements.length} distinct sections

🌌 **MOVEMENT BREAKDOWN:**
${composition.movements.map((movement, idx) => `
${idx + 1}. "${movement.name}" (${formatDuration(movement.duration)})
   → Emotional Journey: ${movement.emotional_arc}
   → Planetary Influences: ${movement.primary_planets.join(', ')}
   → Key Progression: ${movement.key_changes.join(' → ')}
   → Tempo Evolution: ${movement.tempo_shifts.join(' → ')} BPM
   → Musical Motifs: ${movement.musical_motifs.join(', ')}`).join('')}

⚡ **HARMONIC FOUNDATION:**
${strongAspects.slice(0, 5).map(aspect => 
  `• ${aspect.planet1}-${aspect.planet2} ${aspect.aspect_name}: ${aspect.musical_interval} (${aspect.harmony_type}) - ${(aspect.strength * 100).toFixed(0)}% strength`
).join('\n')}

🌟 **CURRENT COSMIC WEATHER:**
${activeTransits.slice(0, 3).map(transit =>
  `• ${transit.transiting_planet} ${transit.aspect_name} ${transit.natal_planet}: ${transit.musical_interval} tension (${(transit.intensity * 100).toFixed(0)}% intensity, ${transit.movement_direction})`
).join('\n')}

🎼 **STYLE & ATMOSPHERE:**
• Genre: Cosmic ambient with celestial orchestration
• Primary Instruments: Synthesizer pads, cosmic bells, space drones, celestial strings
• Secondary Textures: Harmonic resonators, stellar winds, planetary tones
• Audio Effects: Deep space reverb, cosmic delay, harmonic crystallization
• Emotional Palette: ${composition.dominant_themes[0].emotional_tone}, meditative yet dynamic
• Rhythmic Complexity: ${(composition.rhythmic_complexity * 100).toFixed(0)}% intricate polyrhythms

🎯 **TENSION & DYNAMICS:**
• Opening: Gentle emergence (${(composition.harmonic_tension_curve[0] * 100).toFixed(0)}% intensity)
• Development: Building cosmic tension (peak at ${Math.max(...composition.harmonic_tension_curve) * 100}%)
• Resolution: Harmonic integration and peaceful conclusion
• Overall Arc: ${composition.harmonic_tension_curve.map((t, i) => `${(i/composition.harmonic_tension_curve.length*100).toFixed(0)}%→${(t*100).toFixed(0)}%`).join(', ')}

🌠 **BIRTH CHART CONTEXT:**
Born ${birthDate.toLocaleDateString()} at ${birthTime} in ${selectedLocation}
This composition translates the unique astrological blueprint into an immersive sonic journey, where each planetary position, aspect, and current transit influences the musical narrative. Create a transcendent listening experience that captures the cosmic essence of this natal chart.`;
  };

  const generateAudioWithSuno = async () => {
    if (!composition || !chart) return;
    
    setAudioLoading(true);
    
    try {
      const prompt = generateDetailedPrompt(composition, aspects, transits, chart);
      setCurrentPrompt(prompt);
      
      // Note: This is a mock implementation since we don't have actual Suno API access
      // In a real implementation, you would use the actual Suno API
      const mockSunoResponse = await mockSunoAPICall(prompt, composition.total_duration);
      
      const newAudio: GeneratedAudio = {
        id: `audio_${Date.now()}`,
        status: 'generating',
        prompt: prompt,
        created_at: new Date().toISOString(),
        metadata: {
          duration: composition.total_duration,
          movements: composition.movements.length,
          key: composition.dominant_themes[0].key,
          tempo: composition.dominant_themes[0].tempo_base
        }
      };
      
      setGeneratedAudio(newAudio);
      setAudioHistory(prev => [newAudio, ...prev]);
      
      // Simulate generation process
      setTimeout(() => {
        setGeneratedAudio(prev => prev ? {
          ...prev,
          status: 'completed',
          audio_url: mockSunoResponse.audio_url,
          video_url: mockSunoResponse.video_url
        } : null);
        
        setAudioHistory(prev => prev.map(audio => 
          audio.id === newAudio.id ? {
            ...audio,
            status: 'completed',
            audio_url: mockSunoResponse.audio_url,
            video_url: mockSunoResponse.video_url
          } : audio
        ));
      }, 8000); // Simulate 8 second generation time
      
    } catch (error) {
      console.error('Error generating audio:', error);
      setGeneratedAudio(prev => prev ? {...prev, status: 'failed'} : null);
    } finally {
      setAudioLoading(false);
    }
  };

  // Mock Suno API call (replace with real implementation)
  const mockSunoAPICall = async (prompt: string, duration: number) => {
    // This would be the actual Suno API call:
    /*
    const response = await fetch('https://api.suno.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUNO_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        duration: duration,
        style: 'ambient_electronic',
        instrumental: true,
        private: false
      })
    });
    
    return await response.json();
    */
    
    // Mock response for demo
    return {
      id: `suno_${Date.now()}`,
      audio_url: 'https://www.soundjay.com/misc/sounds/magic-chime-02.mp3', // Demo audio
      video_url: null,
      status: 'completed'
    };
  };

  const downloadAudio = (audioUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareAudio = async (audio: GeneratedAudio) => {
    if (navigator.share && audio.audio_url) {
      try {
        await navigator.share({
          title: 'My Cosmic Symphony',
          text: 'Check out my personalized astrological music composition!',
          url: audio.audio_url
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(audio.audio_url || '');
      alert('Audio URL copied to clipboard!');
    }
  };

  // All the previous calculation functions remain the same...
  const calculateAngleDifference = (angle1: number, angle2: number): number => {
    let diff = Math.abs(angle1 - angle2);
    if (diff > 180) diff = 360 - diff;
    return diff;
  };

  const calculateAspectStrength = (orb: number, maxOrb: number): number => {
    return Math.max(0, (maxOrb - orb) / maxOrb);
  };

  const calculateAspects = (planets: PlanetPosition[]): CalculatedAspect[] => {
    const calculatedAspects: CalculatedAspect[] = [];
    
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const planet1 = planets[i];
        const planet2 = planets[j];
        const angleDiff = calculateAngleDifference(planet1.longitude, planet2.longitude);
        
        for (const aspectDef of ASPECT_DEFINITIONS) {
          const orb = Math.abs(angleDiff - aspectDef.angle);
          
          if (orb <= aspectDef.orb) {
            const strength = calculateAspectStrength(orb, aspectDef.orb);
            calculatedAspects.push({
              planet1: planet1.name,
              planet2: planet2.name,
              aspect_name: aspectDef.name,
              exact_angle: angleDiff,
              orb: orb,
              musical_interval: aspectDef.musical_interval,
              harmony_type: aspectDef.harmony_type,
              strength: strength
            });
            break;
          }
        }
      }
    }
    
    return calculatedAspects.sort((a, b) => b.strength - a.strength);
  };

  const getCurrentPlanets = async (): Promise<PlanetPosition[]> => {
    const now = new Date();
    const currentBirthData = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      hour: now.getHours(),
      minute: now.getMinutes(),
      latitude: formData.latitude,
      longitude: formData.longitude,
      timezone_offset: formData.timezone_offset
    };
    
    try {
      const response = await fetch(`${API_URL}/natal-chart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentBirthData)
      });
      const data = await response.json();
      return data.planets;
    } catch (error) {
      console.error('Error fetching current planets:', error);
      return [];
    }
  };

  const calculateTransitsFunction = async (natalPlanets: PlanetPosition[]): Promise<CalculatedTransit[]> => {
    const currentPlanets = await getCurrentPlanets();
    const calculatedTransits: CalculatedTransit[] = [];
    
    for (const transitPlanet of currentPlanets) {
      for (const natalPlanet of natalPlanets) {
        const angleDiff = calculateAngleDifference(transitPlanet.longitude, natalPlanet.longitude);
        
        for (const aspectDef of ASPECT_DEFINITIONS) {
          const orb = Math.abs(angleDiff - aspectDef.angle);
          
          if (orb <= aspectDef.orb) {
            const intensity = calculateAspectStrength(orb, aspectDef.orb);
            calculatedTransits.push({
              transiting_planet: transitPlanet.name,
              natal_planet: natalPlanet.name,
              aspect_name: aspectDef.name,
              orb: orb,
              musical_interval: aspectDef.musical_interval,
              intensity: intensity,
              movement_direction: orb < 1 ? 'applying' : 'separating'
            });
            break;
          }
        }
      }
    }
    
    return calculatedTransits.sort((a, b) => b.intensity - a.intensity);
  };

  const generateComposition = (natalChart: SimpleNatalChart, natalAspects: CalculatedAspect[], currentTransits: CalculatedTransit[]): CompositionStructure => {
    const baseDuration = 180 + Math.random() * 120;
    const strongestAspects = natalAspects.filter(a => a.strength > 0.7).slice(0, 5);
    const activeTransits = currentTransits.filter(t => t.intensity > 0.6).slice(0, 3);
    
    const movements: MovementSection[] = [
      {
        name: 'Natal Foundation',
        duration: 45,
        primary_planets: strongestAspects.slice(0, 2).flatMap(a => [a.planet1, a.planet2]),
        key_changes: ['C'],
        tempo_shifts: [80],
        emotional_arc: 'establishing',
        musical_motifs: ['foundation theme', 'planetary signatures']
      },
      {
        name: 'Cosmic Interplay',
        duration: 75,
        primary_planets: strongestAspects.slice(0, 3).flatMap(a => [a.planet1, a.planet2]),
        key_changes: ['C', 'G', 'F'],
        tempo_shifts: [80, 100, 120],
        emotional_arc: 'developing',
        musical_motifs: strongestAspects.map(a => `${a.planet1}-${a.planet2} ${a.harmony_type}`)
      },
      {
        name: 'Transit Integration',
        duration: 60,
        primary_planets: activeTransits.slice(0, 2).map(t => t.transiting_planet),
        key_changes: ['Am', 'C'],
        tempo_shifts: [110, 85],
        emotional_arc: 'climax',
        musical_motifs: ['current tensions', 'dynamic shifts']
      },
      {
        name: 'Resolution',
        duration: 45,
        primary_planets: ['Sun'],
        key_changes: ['C'],
        tempo_shifts: [75],
        emotional_arc: 'resolving',
        musical_motifs: ['synthesis', 'return home']
      }
    ];

    const tensionCurve = [0.3, 0.4, 0.6, 0.8, 1.0, 0.9, 0.7, 0.5, 0.3, 0.2];
    
    return {
      total_duration: movements.reduce((sum, m) => sum + m.duration, 0),
      movements,
      dominant_themes: [{
        name: 'Primary Theme',
        key: 'C',
        mode: 'Ionian',
        tempo_base: 85,
        emotional_tone: 'contemplative',
        instruments: ['piano', 'strings'],
        rhythmic_pattern: '4/4'
      }],
      harmonic_tension_curve: tensionCurve,
      rhythmic_complexity: 0.7
    };
  };

  const searchLocations = async (query: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      setLocationSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error searching locations:', error);
    }
  };

  const selectLocation = (location: LocationSuggestion) => {
    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);
    
    setFormData({
      ...formData,
      latitude: lat,
      longitude: lon,
      timezone_offset: Math.round(lon / 15)
    });
    
    setSelectedLocation(location.display_name);
    setLocationQuery(location.display_name);
    setShowSuggestions(false);
  };

  const calculateChart = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/natal-chart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result: SimpleNatalChart = await response.json();
      setChart(result);
      
      const calculatedAspects = calculateAspects(result.planets);
      setAspects(calculatedAspects);
      
      const calculatedTransits = await calculateTransitsFunction(result.planets);
      setTransits(calculatedTransits);
      
      const composition = generateComposition(result, calculatedAspects, calculatedTransits);
      setComposition(composition);
      
      setCurrentStep(4);
    } catch (error: any) {
      console.error('Error:', error);
      alert('Error calculating chart: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (locationQuery.length > 2) {
        searchLocations(locationQuery);
      } else {
        setLocationSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [locationQuery]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAspectSymbol = (aspectType: string): string => {
    const symbols: Record<string, string> = {
      'Conjunction': '☌',
      'Sextile': '⚹',
      'Square': '□',
      'Trine': '△',
      'Opposition': '☍',
      'Quincunx': '⚻'
    };
    return symbols[aspectType] || aspectType;
  };

  const getPlanetSymbol = (planet: string): string => {
    const symbols: Record<string, string> = {
      'Sun': '☉',
      'Moon': '☽',
      'Mercury': '☿',
      'Venus': '♀',
      'Mars': '♂',
      'Jupiter': '♃',
      'Saturn': '♄',
      'Uranus': '♅',
      'Neptune': '♆',
      'Pluto': '♇'
    };
    return symbols[planet] || planet;
  };

  const getSignSymbol = (sign: string): string => {
    const symbols: Record<string, string> = {
      'Aries': '♈',
      'Taurus': '♉',
      'Gemini': '♊',
      'Cancer': '♋',
      'Leo': '♌',
      'Virgo': '♍',
      'Libra': '♎',
      'Scorpio': '♏',
      'Sagittarius': '♐',
      'Capricorn': '♑',
      'Aquarius': '♒',
      'Pisces': '♓'
    };
    return symbols[sign] || sign;
  };

  return (
    <div style={{
      background: '#0A0A0F',
      color: 'white',
      fontFamily: '"Space Mono", monospace',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Particles Background */}
      <canvas 
        id="particles" 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Steps 1-3 remain the same... */}
        {currentStep === 1 && (
          <section style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '0.5rem',
              padding: '4rem',
              maxWidth: '48rem',
              margin: '0 auto'
            }}>
              <h1 style={{
                fontSize: '4.5rem',
                fontWeight: 'bold',
                marginBottom: '2rem',
                background: 'linear-gradient(135deg, #FFD700, #FF6B6B, #4ECDC4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                lineHeight: '1.1'
              }}>
                QuantumMelodic MetaSystem
              </h1>
              
              <p style={{
                fontSize: '1.25rem',
                marginBottom: '3rem',
                opacity: 0.8,
                lineHeight: '1.6'
              }}>
                Transform your cosmic blueprint into a personalized musical composition. 
                Experience the intersection of astrology, quantum resonance, and AI music generation.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '3rem'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎵</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>AI Music Generation</div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Real-time Analysis</div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌌</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Cosmic Harmony</div>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                style={{
                  background: 'white',
                  color: 'black',
                  padding: '1rem 2rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Begin Cosmic Analysis
              </button>
            </div>
          </section>
        )}

        {/* Step 2: Data Input - same as before */}
        {currentStep === 2 && (
          <section style={{
            minHeight: '100vh',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ maxWidth: '72rem', margin: '0 auto', width: '100%' }}>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '0.5rem',
                padding: '3rem',
                marginBottom: '2rem'
              }}>
                <h2 style={{
                  fontSize: '2.25rem',
                  fontWeight: 'bold',
                  marginBottom: '2rem',
                  textAlign: 'center'
                }}>
                  Birth Data Configuration
                </h2>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '2rem',
                  marginBottom: '2rem'
                }}>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem',
                      opacity: 0.8,
                      fontWeight: 'bold'
                    }}>
                      Birth Date
                    </label>
                    <input
                      type="date"
                      value={`${formData.year}-${String(formData.month).padStart(2, '0')}-${String(formData.day).padStart(2, '0')}`}
                      onChange={(e) => {
                        const [year, month, day] = e.target.value.split('-').map(Number);
                        setFormData({...formData, year, month, day});
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '0.5rem',
                        padding: '0.75rem 1rem',
                        color: 'white',
                        width: '100%',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem',
                      opacity: 0.8,
                      fontWeight: 'bold'
                    }}>
                      Birth Time
                    </label>
                    <input
                      type="time"
                      value={`${String(formData.hour).padStart(2, '0')}:${String(formData.minute).padStart(2, '0')}`}
                      onChange={(e) => {
                        const [hour, minute] = e.target.value.split(':').map(Number);
                        setFormData({...formData, hour, minute});
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '0.5rem',
                        padding: '0.75rem 1rem',
                        color: 'white',
                        width: '100%',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem',
                      opacity: 0.8,
                      fontWeight: 'bold'
                    }}>
                      Timezone Offset
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={formData.timezone_offset}
                      onChange={(e) => setFormData({...formData, timezone_offset: Number(e.target.value)})}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '0.5rem',
                        padding: '0.75rem 1rem',
                        color: 'white',
                        width: '100%',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                </div>

                <div style={{ position: 'relative', marginBottom: '2rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem',
                    opacity: 0.8,
                    fontWeight: 'bold'
                  }}>
                    Birth Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter city name..."
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(locationSuggestions.length > 0)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.5rem',
                      padding: '0.75rem 1rem',
                      color: 'white',
                      width: '100%',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  
                  {showSuggestions && locationSuggestions.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.5rem',
                      marginTop: '0.25rem',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 10
                    }}>
                      {locationSuggestions.map((result, idx) => (
                        <button
                          key={idx}
                          onClick={() => selectLocation(result)}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.75rem 1rem',
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            borderBottom: idx < locationSuggestions.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <div style={{ fontWeight: 'bold' }}>{result.display_name}</div>
                          <div style={{ opacity: 0.6, fontSize: '0.75rem' }}>
                            {parseFloat(result.lat).toFixed(4)}, {parseFloat(result.lon).toFixed(4)}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {selectedLocation && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(76, 205, 196, 0.5)'
                    }}>
                      <div style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '0.25rem' }}>Selected Location:</div>
                      <div style={{ fontWeight: 'bold' }}>{selectedLocation}</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                        Coordinates: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button
                    onClick={() => setCurrentStep(1)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={!selectedLocation}
                    style={{
                      background: selectedLocation ? 'white' : 'rgba(255, 255, 255, 0.3)',
                      color: selectedLocation ? 'black' : 'rgba(255, 255, 255, 0.5)',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      cursor: selectedLocation ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Step 3: Processing - same as before */}
        {currentStep === 3 && (
          <section style={{
            minHeight: '100vh',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '0.5rem',
              padding: '4rem',
              textAlign: 'center',
              maxWidth: '36rem'
            }}>
              <h2 style={{
                fontSize: '2.25rem',
                fontWeight: 'bold',
                marginBottom: '2rem'
              }}>
                Ready for Cosmic Analysis
              </h2>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2rem',
                borderRadius: '0.5rem',
                marginBottom: '2rem'
              }}>
                <div style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '1rem' }}>Birth Data Summary</div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>{new Date(formData.year, formData.month - 1, formData.day).toLocaleDateString()}</strong> at{' '}
                  <strong>{String(formData.hour).padStart(2, '0')}:{String(formData.minute).padStart(2, '0')}</strong>
                </div>
                <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                  {selectedLocation}
                </div>
              </div>

              <p style={{
                fontSize: '1rem',
                marginBottom: '3rem',
                opacity: 0.8,
                lineHeight: '1.6'
              }}>
                We will calculate your natal chart, analyze planetary aspects, 
                process current transits, and generate your personalized cosmic symphony.
              </p>

              <button
                onClick={calculateChart}
                disabled={loading}
                style={{
                  background: loading ? 'rgba(255, 255, 255, 0.3)' : 'white',
                  color: loading ? 'rgba(255, 255, 255, 0.7)' : 'black',
                  padding: '1rem 2rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: '0 auto'
                }}
              >
                {loading && (
                  <div style={{
                    width: '1rem',
                    height: '1rem',
                    border: '2px solid rgba(0, 0, 0, 0.3)',
                    borderTop: '2px solid black',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                )}
                {loading ? 'Analyzing Cosmos...' : 'Generate My Symphony'}
              </button>
            </div>
          </section>
        )}

        {/* Step 4: Results with NEW Audio Tab */}
        {currentStep === 4 && chart && (
          <section style={{ padding: '2rem', minHeight: '100vh' }}>
            <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
              
              {/* Header */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '0.5rem',
                padding: '2rem',
                marginBottom: '2rem',
                textAlign: 'center'
              }}>
                <h1 style={{
                  fontSize: '2.25rem',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  background: 'linear-gradient(135deg, #FFD700, #FF6B6B, #4ECDC4)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}>
                  Your Cosmic Analysis Complete
                </h1>
                <p style={{ fontSize: '1rem', opacity: 0.8 }}>
                  Birth: {new Date(formData.year, formData.month - 1, formData.day).toLocaleDateString()} at{' '}
                  {String(formData.hour).padStart(2, '0')}:{String(formData.minute).padStart(2, '0')} • {selectedLocation}
                </p>
              </div>

              {/* Navigation Tabs - NOW WITH AUDIO TAB */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                marginBottom: '2rem',
                display: 'flex',
                gap: '0.5rem'
              }}>
                {[
                  { key: 'chart', label: 'Natal Chart', count: chart.planets.length, icon: '🌟' },
                  { key: 'aspects', label: 'Aspects', count: aspects.length, icon: '⚡' },
                  { key: 'transits', label: 'Transits', count: transits.length, icon: '🌌' },
                  { key: 'composition', label: 'Music', count: composition?.movements.length || 0, icon: '🎼' },
                  { key: 'audio', label: 'Generated Audio', count: audioHistory.length, icon: '🎵' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    style={{
                      flex: 1,
                      padding: '1rem 1.5rem',
                      borderRadius: '0.25rem',
                      border: 'none',
                      background: activeTab === tab.key ? 'white' : 'transparent',
                      color: activeTab === tab.key ? 'black' : 'white',
                      fontSize: '0.875rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{tab.icon}</div>
                    {tab.label}
                    <div style={{ 
                      fontSize: '0.75rem', 
                      opacity: 0.7,
                      marginTop: '0.25rem'
                    }}>
                      ({tab.count})
                    </div>
                  </button>
                ))}
              </div>

              {/* NEW AUDIO GENERATION TAB */}
              {activeTab === 'audio' && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '0.5rem',
                  padding: '2rem'
                }}>
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '2rem',
                    textAlign: 'center'
                  }}>
                    🎵 AI-Generated Cosmic Symphony
                  </h2>

                  {/* Generate Audio Button */}
                  {!generatedAudio && (
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '2rem',
                      borderRadius: '0.5rem',
                      marginBottom: '2rem',
                      textAlign: 'center'
                    }}>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                        Ready to Generate Your Cosmic Symphony?
                      </h3>
                      <p style={{ opacity: 0.8, marginBottom: '2rem', lineHeight: '1.6' }}>
                        Using advanced AI music generation, we'll transform your astrological data 
                        into a beautiful, personalized ambient composition that captures the essence 
                        of your cosmic blueprint.
                      </p>
                      
                      <button
                        onClick={generateAudioWithSuno}
                        disabled={audioLoading || !composition}
                        style={{
                          background: 'linear-gradient(135deg, #FFD700, #FF6B6B)',
                          color: 'white',
                          padding: '1rem 2rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          cursor: audioLoading ? 'not-allowed' : 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          margin: '0 auto'
                        }}
                      >
                        {audioLoading && (
                          <div style={{
                            width: '1rem',
                            height: '1rem',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            borderTop: '2px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }} />
                        )}
                        {audioLoading ? 'Generating Symphony...' : '🎵 Generate My Cosmic Symphony'}
                      </button>
                    </div>
                  )}

                  {/* Current Generation Status */}
                  {generatedAudio && (
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '2rem',
                      borderRadius: '0.5rem',
                      marginBottom: '2rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem'
                      }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                          Current Generation
                        </h3>
                        <div style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          background: generatedAudio.status === 'generating' ? 'rgba(255, 193, 7, 0.2)' :
                                     generatedAudio.status === 'completed' ? 'rgba(40, 167, 69, 0.2)' :
                                     'rgba(220, 53, 69, 0.2)',
                          color: generatedAudio.status === 'generating' ? '#FFC107' :
                                 generatedAudio.status === 'completed' ? '#28A745' :
                                 '#DC3545'
                        }}>
                          {generatedAudio.status === 'generating' && '⏳ Generating...'}
                          {generatedAudio.status === 'completed' && '✅ Completed'}
                          {generatedAudio.status === 'failed' && '❌ Failed'}
                        </div>
                      </div>

                      {generatedAudio.status === 'generating' && (
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '0.5rem',
                          padding: '1rem',
                          marginBottom: '1rem'
                        }}>
                          <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', opacity: 0.8 }}>
                            Processing your cosmic data...
                          </div>
                          <div style={{
                            width: '100%',
                            height: '4px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '2px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: '100%',
                              height: '100%',
                              background: 'linear-gradient(90deg, #FFD700, #FF6B6B)',
                              animation: 'pulse 2s ease-in-out infinite'
                            }} />
                          </div>
                        </div>
                      )}

                      {generatedAudio.status === 'completed' && generatedAudio.audio_url && (
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '0.5rem',
                          padding: '1.5rem',
                          marginBottom: '1rem'
                        }}>
                          <div style={{ marginBottom: '1rem' }}>
                            <audio 
                              controls 
                              style={{ 
                                width: '100%',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '0.5rem'
                              }}
                            >
                              <source src={generatedAudio.audio_url} type="audio/mpeg" />
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                          
                          <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                          }}>
                            <button
                              onClick={() => downloadAudio(generatedAudio.audio_url!, `cosmic-symphony-${new Date().getTime()}.mp3`)}
                              style={{
                                background: 'rgba(76, 205, 196, 0.2)',
                                color: '#4ECDC4',
                                border: '1px solid #4ECDC4',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.25rem',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              📥 Download MP3
                            </button>
                            
                            <button
                              onClick={() => shareAudio(generatedAudio)}
                              style={{
                                background: 'rgba(155, 89, 182, 0.2)',
                                color: '#9B59B6',
                                border: '1px solid #9B59B6',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.25rem',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              🔗 Share
                            </button>
                            
                            <button
                              onClick={() => setGeneratedAudio(null)}
                              style={{
                                background: 'rgba(255, 107, 107, 0.2)',
                                color: '#FF6B6B',
                                border: '1px solid #FF6B6B',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.25rem',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              🗑️ Clear
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Metadata */}
                      {generatedAudio.metadata && (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                          gap: '1rem',
                          fontSize: '0.875rem'
                        }}>
                          <div>
                            <div style={{ opacity: 0.7 }}>Duration</div>
                            <div style={{ fontWeight: 'bold', color: '#FFD700' }}>
                              {formatDuration(generatedAudio.metadata.duration)}
                            </div>
                          </div>
                          <div>
                            <div style={{ opacity: 0.7 }}>Movements</div>
                            <div style={{ fontWeight: 'bold', color: '#4ECDC4' }}>
                              {generatedAudio.metadata.movements}
                            </div>
                          </div>
                          <div>
                            <div style={{ opacity: 0.7 }}>Key</div>
                            <div style={{ fontWeight: 'bold', color: '#FF6B6B' }}>
                              {generatedAudio.metadata.key}
                            </div>
                          </div>
                          <div>
                            <div style={{ opacity: 0.7 }}>Tempo</div>
                            <div style={{ fontWeight: 'bold', color: '#9B59B6' }}>
                              {generatedAudio.metadata.tempo} BPM
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Generation Prompt Display */}
                  {currentPrompt && (
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '1.5rem',
                      borderRadius: '0.5rem',
                      marginBottom: '2rem'
                    }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        🎯 AI Generation Prompt
                      </h4>
                      <div style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        padding: '1rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        lineHeight: '1.4',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {currentPrompt}
                      </div>
                    </div>
                  )}

                  {/* Audio History */}
                  {audioHistory.length > 0 && (
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        🗂️ Generation History ({audioHistory.length})
                      </h3>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1rem'
                      }}>
                        {audioHistory.map((audio, idx) => (
                          <div key={audio.id} style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '0.5rem'
                            }}>
                              <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                                Generation #{audioHistory.length - idx}
                              </div>
                              <div style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.25rem',
                                fontSize: '0.75rem',
                                background: audio.status === 'completed' ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)',
                                color: audio.status === 'completed' ? '#28A745' : '#DC3545'
                              }}>
                                {audio.status}
                              </div>
                            </div>
                            
                            <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '1rem' }}>
                              {new Date(audio.created_at).toLocaleString()}
                            </div>
                            
                            {audio.audio_url && (
                              <div style={{ marginBottom: '1rem' }}>
                                <audio 
                                  controls 
                                  style={{ 
                                    width: '100%',
                                    height: '30px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '0.25rem'
                                  }}
                                >
                                  <source src={audio.audio_url} type="audio/mpeg" />
                                </audio>
                              </div>
                            )}
                            
                            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
                              {audio.audio_url && (
                                <>
                                  <button
                                    onClick={() => downloadAudio(audio.audio_url!, `cosmic-symphony-${audio.id}.mp3`)}
                                    style={{
                                      background: 'transparent',
                                      color: '#4ECDC4',
                                      border: '1px solid #4ECDC4',
                                      padding: '0.25rem 0.5rem',
                                      borderRadius: '0.25rem',
                                      cursor: 'pointer',
                                      fontSize: '0.75rem'
                                    }}
                                  >
                                    📥
                                  </button>
                                  <button
                                    onClick={() => shareAudio(audio)}
                                    style={{
                                      background: 'transparent',
                                      color: '#9B59B6',
                                      border: '1px solid #9B59B6',
                                      padding: '0.25rem 0.5rem',
                                      borderRadius: '0.25rem',
                                      cursor: 'pointer',
                                      fontSize: '0.75rem'
                                    }}
                                  >
                                    🔗
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* All other tabs (chart, aspects, transits, composition) remain the same... */}
              {/* For brevity, I'm not repeating all the other tab content here, but they remain unchanged */}
              
            </div>
          </section>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default QuantumMelodicMetaSystem;
