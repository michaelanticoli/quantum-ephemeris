"""
Swiss Ephemeris API - Calculates Natal Charts
Just copy this entire file to main.py
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
from datetime import datetime, timezone, timedelta
import swisseph as swe
import os
from pathlib import Path

# Setup
app = FastAPI(title="Swiss Ephemeris API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tell Swiss Ephemeris where to find data files
EPHEMERIS_PATH = os.getenv("EPHEMERIS_PATH", "./ephemeris")
Path(EPHEMERIS_PATH).mkdir(parents=True, exist_ok=True)
swe.set_ephe_path(EPHEMERIS_PATH)

# Planet codes
PLANETS = {
    "Sun": 0, "Moon": 1, "Mercury": 2, "Venus": 3, "Mars": 4,
    "Jupiter": 5, "Saturn": 6, "Uranus": 7, "Neptune": 8, "Pluto": 9
}

HOUSE_SYSTEMS = {"Placidus": b'P', "Koch": b'K', "Equal": b'E', "Whole Sign": b'W'}

# Request format
class BirthData(BaseModel):
    year: int
    month: int
    day: int
    hour: int
    minute: int
    latitude: float
    longitude: float
    timezone_offset: float = 0
    house_system: str = "Placidus"

# Response format
class PlanetPosition(BaseModel):
    name: str
    longitude: float
    zodiac_sign: str
    zodiac_degree: float
    house: int
    retrograde: bool

class NatalChart(BaseModel):
    planets: List[PlanetPosition]
    calculation_time: str

# Helper functions
def get_zodiac_sign(longitude: float):
    signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
             "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
    sign_index = int(longitude / 30)
    degree = longitude % 30
    return signs[sign_index], degree

def julian_day(year, month, day, hour, minute, tz_offset):
    ut_hour = hour - tz_offset
    if ut_hour < 0:
        day -= 1
        ut_hour += 24
    elif ut_hour >= 24:
        day += 1
        ut_hour -= 24
    time_decimal = ut_hour + (minute / 60.0)
    return swe.julday(year, month, day, time_decimal)

def determine_house(longitude, cusps):
    for i in range(12):
        cusp_start = cusps[i]
        cusp_end = cusps[(i + 1) % 12]
        if cusp_start < cusp_end:
            if cusp_start <= longitude < cusp_end:
                return i + 1
        else:
            if longitude >= cusp_start or longitude < cusp_end:
                return i + 1
    return 1

# API Endpoints
@app.get("/")
def home():
    return {"status": "Swiss Ephemeris API is running", "version": "1.0"}

@app.get("/health")
def health():
    files_exist = any(Path(EPHEMERIS_PATH).glob("*.se1"))
    return {
        "status": "healthy" if files_exist else "missing ephemeris files",
        "ephemeris_files": files_exist
    }

@app.post("/natal-chart", response_model=NatalChart)
def calculate_natal_chart(birth: BirthData):
    try:
        # Calculate Julian Day
        jd = julian_day(birth.year, birth.month, birth.day, 
                       birth.hour, birth.minute, birth.timezone_offset)
        
        # Calculate houses
        house_system = HOUSE_SYSTEMS.get(birth.house_system, b'P')
        cusps, ascmc = swe.houses(jd, birth.latitude, birth.longitude, house_system)
        
        # Calculate planets
        planets = []
        for planet_name, planet_code in PLANETS.items():
            result, _ = swe.calc_ut(jd, planet_code)
            longitude = result[0]
            speed = result[3]
            
            sign, degree = get_zodiac_sign(longitude)
            house = determine_house(longitude, cusps)
            
            planets.append(PlanetPosition(
                name=planet_name,
                longitude=longitude,
                zodiac_sign=sign,
                zodiac_degree=round(degree, 2),
                house=house,
                retrograde=(speed < 0)
            ))
        
        return NatalChart(
            planets=planets,
            calculation_time=datetime.now(timezone.utc).isoformat()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))