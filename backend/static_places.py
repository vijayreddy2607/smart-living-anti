"""
Static curated food & gym data for all supported areas.
Used as a fallback when Google Places API key is not configured.
Data is realistic and salary-aware (multiple tiers per area).
"""
from __future__ import annotations

# ─── Structure per entry ───────────────────────────────────────────────
# { name, address, rating, location: {latitude, longitude}, ai_insight }

STATIC_PLACES: dict[str, dict[str, list[dict]]] = {

    # ══════════════ PUNE ══════════════════════════════════════════════

    "Kharadi": {
        "food": [
            {"name": "Café Goodluck", "address": "EON IT Park Rd, Kharadi, Pune", "rating": 4.3,
             "location": {"latitude": 18.5529, "longitude": 73.9411},
             "ai_insight": "Classic Pune café — great for quick lunches and working breakfasts."},
            {"name": "Barbeque Nation Kharadi", "address": "Kharadi Bypass, Pune", "rating": 4.4,
             "location": {"latitude": 18.5540, "longitude": 73.9425},
             "ai_insight": "Popular all-you-can-eat BBQ spot ideal for team dinners and celebrations."},
            {"name": "Spice Kitchen", "address": "Zenith, Kharadi, Pune", "rating": 4.1,
             "location": {"latitude": 18.5515, "longitude": 73.9398},
             "ai_insight": "Budget-friendly North & South Indian thali — perfect for daily home-style meals."},
            {"name": "McDonald's Kharadi", "address": "EON Free Zone, Kharadi, Pune", "rating": 4.0,
             "location": {"latitude": 18.5533, "longitude": 73.9415},
             "ai_insight": "Reliable quick meal for busy workdays. Value combos within ₹250."},
            {"name": "The Biryani House", "address": "World Trade Center Rd, Kharadi", "rating": 4.2,
             "location": {"latitude": 18.5521, "longitude": 73.9402},
             "ai_insight": "Best biryani near IT Park — generous portions and quick delivery."},
        ],
        "gym": [
            {"name": "Snap Fitness Kharadi", "address": "EON IT Park, Kharadi, Pune", "rating": 4.3,
             "location": {"latitude": 18.5525, "longitude": 73.9408},
             "ai_insight": "24/7 access — ideal for IT professionals working late shifts."},
            {"name": "Gold's Gym Kharadi", "address": "Zenith Complex, Kharadi, Pune", "rating": 4.4,
             "location": {"latitude": 18.5538, "longitude": 73.9420},
             "ai_insight": "Premium gym with trained coaches and full cardio + weights floor."},
            {"name": "Anytime Fitness Kharadi", "address": "Kumar City, Kharadi, Pune", "rating": 4.2,
             "location": {"latitude": 18.5512, "longitude": 73.9396},
             "ai_insight": "International standard gym with global access membership option."},
        ],
    },

    "Viman Nagar": {
        "food": [
            {"name": "The Juice Bar", "address": "Phoenix Marketcity, Viman Nagar, Pune", "rating": 4.2,
             "location": {"latitude": 18.5679, "longitude": 73.9143},
             "ai_insight": "Fresh juices and healthy snacks — a go-to for health-conscious professionals."},
            {"name": "Mainland China", "address": "Koreskar Rd, Viman Nagar, Pune", "rating": 4.3,
             "location": {"latitude": 18.5690, "longitude": 73.9155},
             "ai_insight": "Upscale Chinese cuisine — great for client dinners and special occasions."},
            {"name": "Burger King Viman Nagar", "address": "Phoenix Mall, Viman Nagar", "rating": 4.1,
             "location": {"latitude": 18.5672, "longitude": 73.9135},
             "ai_insight": "Quick, affordable burgers near the mall. Ideal for weekend outings."},
            {"name": "Shiv Sagar Restaurant", "address": "Clover Park, Viman Nagar, Pune", "rating": 4.0,
             "location": {"latitude": 18.5665, "longitude": 73.9128},
             "ai_insight": "Pure-veg Maharashtrian thali — homely flavours at ₹150–₹250."},
        ],
        "gym": [
            {"name": "Talwalkars Viman Nagar", "address": "Clover Park, Viman Nagar, Pune", "rating": 4.2,
             "location": {"latitude": 18.5675, "longitude": 73.9140},
             "ai_insight": "Established chain gym with steam room and group classes."},
            {"name": "Cult.fit Viman Nagar", "address": "Phoenix Marketcity Area, Pune", "rating": 4.5,
             "location": {"latitude": 18.5682, "longitude": 73.9148},
             "ai_insight": "Cult classes including HIIT, yoga and boxing — best in class for fitness communities."},
        ],
    },

    "Hadapsar": {
        "food": [
            {"name": "Wadeshwar Restaurant", "address": "Magarpatta Rd, Hadapsar, Pune", "rating": 4.2,
             "location": {"latitude": 18.5042, "longitude": 73.9360},
             "ai_insight": "Best value Maharashtrian thali in Hadapsar — popular with IT workers."},
            {"name": "Domino's Hadapsar", "address": "Magarpatta City, Hadapsar, Pune", "rating": 4.0,
             "location": {"latitude": 18.5055, "longitude": 73.9372},
             "ai_insight": "Quick delivery within the IT park zone. Good for late-night hunger."},
            {"name": "Hotel Sai Palace", "address": "NIBM Rd, Hadapsar, Pune", "rating": 4.1,
             "location": {"latitude": 18.5030, "longitude": 73.9345},
             "ai_insight": "Affordable non-veg and veg meals — great dal rice combos under ₹150."},
            {"name": "The Biryani Zone", "address": "Fatima Nagar, Hadapsar, Pune", "rating": 4.3,
             "location": {"latitude": 18.5048, "longitude": 73.9365},
             "ai_insight": "Dum biryani specialists — try the Hyderabadi dum at ₹200."},
        ],
        "gym": [
            {"name": "Fitness One Hadapsar", "address": "Magarpatta City, Hadapsar, Pune", "rating": 4.1,
             "location": {"latitude": 18.5050, "longitude": 73.9368},
             "ai_insight": "Inside the IT park complex — zero commute to your workout."},
            {"name": "Snap Fitness Hadapsar", "address": "NIBM Rd, Hadapsar, Pune", "rating": 4.0,
             "location": {"latitude": 18.5038, "longitude": 73.9355},
             "ai_insight": "Budget-friendly 24/7 gym with essential equipment."},
        ],
    },

    "Hinjewadi": {
        "food": [
            {"name": "Urban Tadka", "address": "Phase 1, Hinjewadi, Pune", "rating": 4.2,
             "location": {"latitude": 18.5930, "longitude": 73.7371},
             "ai_insight": "Popular IT lunch spot — unlimited Punjabi thali at ₹170."},
            {"name": "Barbeque Nation Hinjewadi", "address": "Phase 2, Hinjewadi, Pune", "rating": 4.4,
             "location": {"latitude": 18.5945, "longitude": 73.7388},
             "ai_insight": "Best evening outing destination for Hinjewadi tech workers."},
            {"name": "Chaat Corner", "address": "Phase 3, Hinjewadi, Pune", "rating": 4.0,
             "location": {"latitude": 18.5918, "longitude": 73.7360},
             "ai_insight": "Street-style chaat and pav bhaji — great evening snack under ₹80."},
            {"name": "Subway Hinjewadi", "address": "Hinjewadi Phase 1, Pune", "rating": 4.1,
             "location": {"latitude": 18.5936, "longitude": 73.7378},
             "ai_insight": "Healthy sub options — a solid lunch choice for calorie-conscious professionals."},
        ],
        "gym": [
            {"name": "Gold's Gym Hinjewadi", "address": "Phase 1, Hinjewadi, Pune", "rating": 4.3,
             "location": {"latitude": 18.5928, "longitude": 73.7369},
             "ai_insight": "Full-service gym inside the IT park — very convenient for professionals."},
            {"name": "Kinetic Fitness Hinjewadi", "address": "Phase 2, Hinjewadi, Pune", "rating": 4.2,
             "location": {"latitude": 18.5942, "longitude": 73.7385},
             "ai_insight": "Group fitness studio with Zumba, HIIT, and functional training classes."},
        ],
    },

    "Baner": {
        "food": [
            {"name": "Paasha Restaurant", "address": "Baner Rd, Pune", "rating": 4.5,
             "location": {"latitude": 18.5587, "longitude": 73.7847},
             "ai_insight": "Rooftop dining with city views — romantic dinners and corporate lunches."},
            {"name": "Café Dario", "address": "Sus Rd, Baner, Pune", "rating": 4.3,
             "location": {"latitude": 18.5600, "longitude": 73.7860},
             "ai_insight": "European-inspired café — excellent for remote work with great WiFi."},
            {"name": "Vaishali Restaurant", "address": "Baner-Pashan Link Rd, Pune", "rating": 4.4,
             "location": {"latitude": 18.5575, "longitude": 73.7835},
             "ai_insight": "Iconic Pune restaurant — don't miss the Masala Dosa and Filter Coffee."},
            {"name": "Wingreen Café", "address": "Panchvati Colony, Baner, Pune", "rating": 4.2,
             "location": {"latitude": 18.5593, "longitude": 73.7852},
             "ai_insight": "Health-conscious menu — smoothies, salads, and grilled wraps."},
        ],
        "gym": [
            {"name": "Cult.fit Baner", "address": "Baner Rd, Pune", "rating": 4.6,
             "location": {"latitude": 18.5585, "longitude": 73.7845},
             "ai_insight": "Premium fitness classes — HIIT, yoga, boxing under one roof."},
            {"name": "Anytime Fitness Baner", "address": "Sus Bridge, Baner, Pune", "rating": 4.3,
             "location": {"latitude": 18.5598, "longitude": 73.7858},
             "ai_insight": "International chain with 24/7 access — good for flexible schedules."},
            {"name": "Fitness First Baner", "address": "Baner-Pashan Link Rd, Pune", "rating": 4.2,
             "location": {"latitude": 18.5572, "longitude": 73.7832},
             "ai_insight": "Well-equipped gym with certified personal trainers."},
        ],
    },

    "Wakad": {
        "food": [
            {"name": "Vaishali Restaurant Wakad", "address": "Wakad-Hinjewadi Rd, Pune", "rating": 4.2,
             "location": {"latitude": 18.5988, "longitude": 73.7618},
             "ai_insight": "South Indian breakfast favourite — idli-dosa combo at ₹80."},
            {"name": "The Great Kabab Factory", "address": "Hotel Radisson, Wakad, Pune", "rating": 4.4,
             "location": {"latitude": 18.6002, "longitude": 73.7632},
             "ai_insight": "Premium unlimited kebab dinner — great for special evenings."},
            {"name": "Chit-Chat Dhaba Wakad", "address": "Wakad Circle, Pune", "rating": 4.1,
             "location": {"latitude": 18.5975, "longitude": 73.7605},
             "ai_insight": "Punjabi dhaba-style meals — dal makhani and rotis at ₹150."},
            {"name": "McDonald's Wakad", "address": "Wakad Main Rd, Pune", "rating": 4.0,
             "location": {"latitude": 18.5990, "longitude": 73.7621},
             "ai_insight": "Quick and reliable meal — good value combos under ₹250."},
        ],
        "gym": [
            {"name": "Gold's Gym Wakad", "address": "Wakad-Hinjewadi Rd, Pune", "rating": 4.2,
             "location": {"latitude": 18.5986, "longitude": 73.7616},
             "ai_insight": "Full-service premium gym popular with Hinjewadi IT workers."},
            {"name": "Fitness Hub Wakad", "address": "Wakad Circle, Pune", "rating": 4.0,
             "location": {"latitude": 18.5978, "longitude": 73.7608},
             "ai_insight": "Budget-friendly local gym — good equipment at affordable rates."},
        ],
    },

    "Koregaon Park": {
        "food": [
            {"name": "The Place — Touché the Sizzler", "address": "North Main Rd, Koregaon Park, Pune", "rating": 4.5,
             "location": {"latitude": 18.5362, "longitude": 73.8948},
             "ai_insight": "Pune's iconic sizzler restaurant since 1978 — must-visit landmark."},
            {"name": "Malaka Spice", "address": "North Lane, Koregaon Park, Pune", "rating": 4.4,
             "location": {"latitude": 18.5378, "longitude": 73.8962},
             "ai_insight": "Best South East Asian restaurant in Pune — outdoor seating and great cocktails."},
            {"name": "Café Peter", "address": "North Main Rd, Koregaon Park, Pune", "rating": 4.3,
             "location": {"latitude": 18.5348, "longitude": 73.8934},
             "ai_insight": "Classic Pune café — eggs and toast breakfast is legendary."},
            {"name": "Oh! Calcutta", "address": "Koregaon Park, Pune", "rating": 4.3,
             "location": {"latitude": 18.5370, "longitude": 73.8955},
             "ai_insight": "Authentic Bengali cuisine — hilsa fish and mishti doi are specialities."},
        ],
        "gym": [
            {"name": "Cult.fit Koregaon Park", "address": "North Main Rd, Koregaon Park, Pune", "rating": 4.5,
             "location": {"latitude": 18.5360, "longitude": 73.8946},
             "ai_insight": "Premium fitness studio in Pune's trendiest neighbourhood."},
            {"name": "Snap Fitness Koregaon Park", "address": "Bund Garden Rd, Koregaon Park, Pune", "rating": 4.2,
             "location": {"latitude": 18.5375, "longitude": 73.8959},
             "ai_insight": "24/7 gym ideal for night-owls in this vibrant area."},
        ],
    },

    "Shivajinagar": {
        "food": [
            {"name": "Café Goodluck Shivajinagar", "address": "Deccan Gymkhana, Shivajinagar, Pune", "rating": 4.5,
             "location": {"latitude": 18.5242, "longitude": 73.8418},
             "ai_insight": "Pune's most iconic café since 1935 — the bun maska and chai are legendary."},
            {"name": "Shabree Restaurant", "address": "Fergusson College Rd, Shivajinagar, Pune", "rating": 4.3,
             "location": {"latitude": 18.5258, "longitude": 73.8434},
             "ai_insight": "Budget Maharashtrian thali — unbeatable value at ₹120 for students & workers."},
            {"name": "Hotel Roopali", "address": "Fergusson College Rd, Shivajinagar, Pune", "rating": 4.2,
             "location": {"latitude": 18.5228, "longitude": 73.8402},
             "ai_insight": "Classic Pune breakfast spot — puri bhaji and misal pav are must-haves."},
        ],
        "gym": [
            {"name": "Talwalkars Shivajinagar", "address": "Deccan Gymkhana, Shivajinagar, Pune", "rating": 4.1,
             "location": {"latitude": 18.5240, "longitude": 73.8415},
             "ai_insight": "Established chain with AC and group yoga classes."},
            {"name": "Deccan Gym", "address": "Fergusson College Rd, Shivajinagar, Pune", "rating": 3.9,
             "location": {"latitude": 18.5254, "longitude": 73.8430},
             "ai_insight": "Budget gym popular with college students — basic but functional."},
        ],
    },

    # ══════════════ BENGALURU ═════════════════════════════════════════

    "Whitefield": {
        "food": [
            {"name": "Meghana Foods Whitefield", "address": "Whitefield Main Rd, Bengaluru", "rating": 4.5,
             "location": {"latitude": 12.9698, "longitude": 77.7500},
             "ai_insight": "Best Andhra chicken biryani in Whitefield — legendary for value and spice."},
            {"name": "Truffles Whitefield", "address": "ITPL Main Rd, Whitefield, Bengaluru", "rating": 4.4,
             "location": {"latitude": 12.9710, "longitude": 77.7515},
             "ai_insight": "Signature smash burgers and all-day breakfast — always packed on weekends."},
            {"name": "Biryani Blues", "address": "EPIP Zone, Whitefield, Bengaluru", "rating": 4.3,
             "location": {"latitude": 12.9688, "longitude": 77.7488},
             "ai_insight": "Authentic dum biryani from Lucknow — affordable pots starting at ₹220."},
            {"name": "Brahmin's Coffee Bar", "address": "Whitefield, Bengaluru", "rating": 4.2,
             "location": {"latitude": 12.9702, "longitude": 77.7504},
             "ai_insight": "Classic South Indian tiffin — idli-vada combo is a must at ₹60."},
        ],
        "gym": [
            {"name": "Cult.fit Whitefield", "address": "ITPL Main Rd, Bengaluru", "rating": 4.5,
             "location": {"latitude": 12.9695, "longitude": 77.7496},
             "ai_insight": "Top-rated fitness facility with yoga, MMA, and strength classes."},
            {"name": "Gold's Gym Whitefield", "address": "EPIP Zone, Whitefield, Bengaluru", "rating": 4.3,
             "location": {"latitude": 12.9706, "longitude": 77.7508},
             "ai_insight": "Established gym with professional trainers and supplement store."},
            {"name": "Snap Fitness Whitefield", "address": "Forum Neighbourhood Mall, Whitefield", "rating": 4.1,
             "location": {"latitude": 12.9685, "longitude": 77.7482},
             "ai_insight": "Affordable 24/7 gym — no frills but solid equipment."},
        ],
    },

    "Koramangala": {
        "food": [
            {"name": "Truffles Koramangala", "address": "4th Block, Koramangala, Bengaluru", "rating": 4.5,
             "location": {"latitude": 12.9352, "longitude": 77.6245},
             "ai_insight": "The original Truffles — legendary burgers that founded the chain. Must-visit."},
            {"name": "Meghana Foods Koramangala", "address": "6th Block, Koramangala, Bengaluru", "rating": 4.5,
             "location": {"latitude": 12.9360, "longitude": 77.6258},
             "ai_insight": "Famous biryani chain — the goat biryani is a Bengaluru institution."},
            {"name": "Hole in the Wall Café", "address": "5th Block, Koramangala, Bengaluru", "rating": 4.3,
             "location": {"latitude": 12.9345, "longitude": 77.6235},
             "ai_insight": "Cozy café great for remote working with amazing pastas and desserts."},
            {"name": "Adiga's Koramangala", "address": "1st Block, Koramangala, Bengaluru", "rating": 4.2,
             "location": {"latitude": 12.9340, "longitude": 77.6228},
             "ai_insight": "Budget-friendly South Indian meals — best masala dosa under ₹80."},
        ],
        "gym": [
            {"name": "Cult.fit Koramangala", "address": "4th Block, Koramangala, Bengaluru", "rating": 4.6,
             "location": {"latitude": 12.9355, "longitude": 77.6248},
             "ai_insight": "One of Bengaluru's best fitness studios — great community vibe."},
            {"name": "Anytime Fitness Koramangala", "address": "6th Block, Koramangala", "rating": 4.3,
             "location": {"latitude": 12.9358, "longitude": 77.6255},
             "ai_insight": "Clean, 24/7 facility with international equipment standards."},
        ],
    },

    "HSR Layout": {
        "food": [
            {"name": "Thatte Idli Shop", "address": "Sector 2, HSR Layout, Bengaluru", "rating": 4.4,
             "location": {"latitude": 12.9116, "longitude": 77.6389},
             "ai_insight": "Famous thatte idli — soft, large idlis with coconut chutney under ₹50."},
            {"name": "Onesta HSR", "address": "Sector 6, HSR Layout, Bengaluru", "rating": 4.4,
             "location": {"latitude": 12.9128, "longitude": 77.6402},
             "ai_insight": "Best wood-fired pizzas in south Bengaluru — reasonable at ₹400-600."},
            {"name": "Biryani House HSR", "address": "27th Main, HSR Layout, Bengaluru", "rating": 4.3,
             "location": {"latitude": 12.9108, "longitude": 77.6378},
             "ai_insight": "Neighbourhood biryani joint with home-style Hyderabadi dum."},
        ],
        "gym": [
            {"name": "Cult.fit HSR", "address": "27th Main, HSR Layout, Bengaluru", "rating": 4.5,
             "location": {"latitude": 12.9118, "longitude": 77.6391},
             "ai_insight": "HIIT and yoga classes — HSR's most popular fitness community."},
            {"name": "Talwalkars HSR", "address": "BDA Complex, HSR Layout, Bengaluru", "rating": 4.0,
             "location": {"latitude": 12.9110, "longitude": 77.6381},
             "ai_insight": "Affordable monthly plans with steam room access."},
        ],
    },

    "Indiranagar": {
        "food": [
            {"name": "Toit Brewpub", "address": "100 Feet Rd, Indiranagar, Bengaluru", "rating": 4.5,
             "location": {"latitude": 12.9784, "longitude": 77.6408},
             "ai_insight": "Bengaluru's best craft brewery — excellent food alongside artisanal beers."},
            {"name": "Hole in the Wall Indiranagar", "address": "12th Main, Indiranagar", "rating": 4.3,
             "location": {"latitude": 12.9796, "longitude": 77.6420},
             "ai_insight": "All-day breakfast café with WiFi — remote workers' paradise."},
            {"name": "Brahmin's Coffee Bar", "address": "5th Cross, Indiranagar, Bengaluru", "rating": 4.4,
             "location": {"latitude": 12.9778, "longitude": 77.6396},
             "ai_insight": "Iconic South Indian tiffin — queue is worth it for the authentic taste."},
            {"name": "Meghana Foods Indiranagar", "address": "100 Feet Rd, Indiranagar", "rating": 4.4,
             "location": {"latitude": 12.9790, "longitude": 77.6415},
             "ai_insight": "Premium biryani — the chicken boneless dum at ₹320 is outstanding."},
        ],
        "gym": [
            {"name": "Cult.fit Indiranagar", "address": "100 Feet Rd, Indiranagar, Bengaluru", "rating": 4.6,
             "location": {"latitude": 12.9782, "longitude": 77.6406},
             "ai_insight": "Flagship Cult studio — all disciplines available with expert coaches."},
            {"name": "Gold's Gym Indiranagar", "address": "CMH Rd, Indiranagar, Bengaluru", "rating": 4.3,
             "location": {"latitude": 12.9788, "longitude": 77.6412},
             "ai_insight": "Premium equipment and protein bar in one of Bengaluru's trendiest areas."},
        ],
    },

    "Electronic City": {
        "food": [
            {"name": "Nagarjuna Restaurant", "address": "Electronic City Phase 1, Bengaluru", "rating": 4.3,
             "location": {"latitude": 12.8456, "longitude": 77.6603},
             "ai_insight": "Andhra-style unlimited meals — unbeatable value for ₹200."},
            {"name": "Café Coffee Day EC", "address": "Infosys Campus, Electronic City", "rating": 4.0,
             "location": {"latitude": 12.8468, "longitude": 77.6615},
             "ai_insight": "Quick coffee and snacks for tech park workers between meetings."},
            {"name": "The Biryani Pot", "address": "Phase 2, Electronic City, Bengaluru", "rating": 4.2,
             "location": {"latitude": 12.8445, "longitude": 77.6591},
             "ai_insight": "Massive value biryani portions — serves 600+ employees daily."},
        ],
        "gym": [
            {"name": "Fitness Plus EC", "address": "Electronic City Phase 1, Bengaluru", "rating": 4.1,
             "location": {"latitude": 12.8460, "longitude": 77.6606},
             "ai_insight": "Budget gym with extended hours catering to IT shift workers."},
            {"name": "Cult.fit Electronic City", "address": "Neeladri Rd, Electronic City", "rating": 4.3,
             "location": {"latitude": 12.8450, "longitude": 77.6596},
             "ai_insight": "Group fitness classes at affordable rates near the tech park."},
        ],
    },

    # ══════════════ HYDERABAD ══════════════════════════════════════════

    "HITEC City": {
        "food": [
            {"name": "Shah Ghouse Café", "address": "Madhapur Rd, HITEC City, Hyderabad", "rating": 4.5,
             "location": {"latitude": 17.4435, "longitude": 78.3772},
             "ai_insight": "Legendary Hyderabadi biryani and Irani chai — a Hyderabad institution."},
            {"name": "Paradise Biryani HITEC City", "address": "Cyber Towers Rd, HITEC City", "rating": 4.4,
             "location": {"latitude": 17.4448, "longitude": 78.3786},
             "ai_insight": "Hyderabad's most famous biryani chain — must try the Hyderabadi dum."},
            {"name": "The Fusion Kitchen", "address": "Phase 2, HITEC City, Hyderabad", "rating": 4.2,
             "location": {"latitude": 17.4422, "longitude": 78.3758},
             "ai_insight": "Multi-cuisine cafeteria popular with IT professionals — quick and affordable."},
            {"name": "Hotel Minerva", "address": "Cyber Pearl, HITEC City, Hyderabad", "rating": 4.1,
             "location": {"latitude": 17.4440, "longitude": 78.3778},
             "ai_insight": "Budget Andhra meals and tiffin — unlimited thali at ₹160."},
        ],
        "gym": [
            {"name": "Snap Fitness HITEC City", "address": "Cyber Towers, HITEC City, Hyderabad", "rating": 4.3,
             "location": {"latitude": 17.4432, "longitude": 78.3768},
             "ai_insight": "24/7 gym inside the IT hub — no excuses for missing workouts."},
            {"name": "Gold's Gym HITEC City", "address": "Cyber Pearl, HITEC City, Hyderabad", "rating": 4.4,
             "location": {"latitude": 17.4445, "longitude": 78.3782},
             "ai_insight": "Premium gym with Olympic lifting area and certified coaches."},
            {"name": "Cult.fit HITEC City", "address": "Phase 1, HITEC City, Hyderabad", "rating": 4.5,
             "location": {"latitude": 17.4428, "longitude": 78.3762},
             "ai_insight": "Best fitness classes in Hyderabad's IT corridor — HIIT, boxing, yoga."},
        ],
    },

    "Gachibowli": {
        "food": [
            {"name": "Ohri's Jiva Imperia", "address": "ISB Rd, Gachibowli, Hyderabad", "rating": 4.3,
             "location": {"latitude": 17.4400, "longitude": 78.3489},
             "ai_insight": "Upscale multi-cuisine — best for client lunches near DLF Cybercity."},
            {"name": "Paradise Biryani Gachibowli", "address": "Manjeera Mall, Gachibowli", "rating": 4.4,
             "location": {"latitude": 17.4415, "longitude": 78.3502},
             "ai_insight": "Consistent Hyderabadi biryani in Gachibowli — queue moves fast."},
            {"name": "Chitranna Corner", "address": "Gachibowli Main Rd, Hyderabad", "rating": 4.2,
             "location": {"latitude": 17.4388, "longitude": 78.3476},
             "ai_insight": "Budget South Indian breakfasts — great for cost-saving on food."},
        ],
        "gym": [
            {"name": "Muscle Factory Gachibowli", "address": "DLF Cybercity, Gachibowli", "rating": 4.2,
             "location": {"latitude": 17.4398, "longitude": 78.3486},
             "ai_insight": "Popular with DLF tech workers — heavy-lifting friendly."},
            {"name": "Anytime Fitness Gachibowli", "address": "ISB Rd, Gachibowli, Hyderabad", "rating": 4.1,
             "location": {"latitude": 17.4412, "longitude": 78.3499},
             "ai_insight": "Standard 24/7 gym with clean facilities."},
        ],
    },

    "Kondapur": {
        "food": [
            {"name": "Minerva Coffee Shop", "address": "Kondapur Main Rd, Hyderabad", "rating": 4.2,
             "location": {"latitude": 17.4600, "longitude": 78.3498},
             "ai_insight": "Classic Andhra dosas and filter coffee — budget breakfast under ₹80."},
            {"name": "Biryani By Kilo", "address": "Kondapur, Hyderabad", "rating": 4.3,
             "location": {"latitude": 17.4615, "longitude": 78.3514},
             "ai_insight": "Artisanal biryani in handis — premium experience worth ₹350+."},
            {"name": "Subway Kondapur", "address": "Kondapur Main Rd, Hyderabad", "rating": 4.0,
             "location": {"latitude": 17.4592, "longitude": 78.3483},
             "ai_insight": "Healthy subs for health-conscious IT workers."},
        ],
        "gym": [
            {"name": "Talwalkars Kondapur", "address": "Kondapur Circle, Hyderabad", "rating": 4.0,
             "location": {"latitude": 17.4598, "longitude": 78.3494},
             "ai_insight": "Established chain with good equipment and classes."},
            {"name": "Fitness Hub Kondapur", "address": "Kondapur, Hyderabad", "rating": 3.9,
             "location": {"latitude": 17.4608, "longitude": 78.3506},
             "ai_insight": "Budget-friendly local gym — great value for money."},
        ],
    },

    "Madhapur": {
        "food": [
            {"name": "Shah Ghouse Madhapur", "address": "Aditya Trade Centre, Madhapur, Hyderabad", "rating": 4.5,
             "location": {"latitude": 17.4500, "longitude": 78.3900},
             "ai_insight": "Branch of the legendary biryani house — just as good as the original."},
            {"name": "The Beer Café Madhapur", "address": "Road No. 2, Madhapur, Hyderabad", "rating": 4.2,
             "location": {"latitude": 17.4515, "longitude": 78.3915},
             "ai_insight": "Craft beers and bar bites — popular Friday evening hangout for tech workers."},
            {"name": "Chutneys Madhapur", "address": "Film Nagar Rd, Madhapur, Hyderabad", "rating": 4.4,
             "location": {"latitude": 17.4488, "longitude": 78.3885},
             "ai_insight": "Premium South Indian tiffin — the pesarattu here is legendary."},
        ],
        "gym": [
            {"name": "Gold's Gym Madhapur", "address": "Aditya Trade Centre, Madhapur", "rating": 4.3,
             "location": {"latitude": 17.4498, "longitude": 78.3897},
             "ai_insight": "Well-equipped premium gym in the heart of the IT district."},
            {"name": "Cult.fit Madhapur", "address": "Road No. 2, Madhapur, Hyderabad", "rating": 4.4,
             "location": {"latitude": 17.4512, "longitude": 78.3911},
             "ai_insight": "Dynamic fitness classes — the best for professionals wanting variety."},
        ],
    },

    "Banjara Hills": {
        "food": [
            {"name": "Barbeque Nation Banjara Hills", "address": "Road No. 3, Banjara Hills, Hyderabad", "rating": 4.4,
             "location": {"latitude": 17.4162, "longitude": 78.4480},
             "ai_insight": "Premium unlimited BBQ — ideal for weekend celebrations."},
            {"name": "Fusion 9 Banjara Hills", "address": "Road No. 9, Banjara Hills, Hyderabad", "rating": 4.3,
             "location": {"latitude": 17.4178, "longitude": 78.4495},
             "ai_insight": "Rooftop restaurant with city views — excellent for client entertainment."},
            {"name": "Chutneys Banjara Hills", "address": "Road No. 1, Banjara Hills, Hyderabad", "rating": 4.5,
             "location": {"latitude": 17.4148, "longitude": 78.4466},
             "ai_insight": "Best South Indian breakfast destination in all of Hyderabad."},
        ],
        "gym": [
            {"name": "Anytime Fitness Banjara Hills", "address": "Road No. 3, Banjara Hills", "rating": 4.2,
             "location": {"latitude": 17.4160, "longitude": 78.4478},
             "ai_insight": "Premium 24/7 gym in an upscale locality."},
            {"name": "Snap Fitness Banjara Hills", "address": "Road No. 9, Banjara Hills", "rating": 4.1,
             "location": {"latitude": 17.4175, "longitude": 78.4492},
             "ai_insight": "Clean and well-maintained — suited for the upscale crowd."},
        ],
    },

    # ══════════════ CHENNAI ════════════════════════════════════════════

    "Sholinganallur": {
        "food": [
            {"name": "Murugan Idli Shop Sholinganallur", "address": "OMR, Sholinganallur, Chennai", "rating": 4.5,
             "location": {"latitude": 12.9010, "longitude": 80.2279},
             "ai_insight": "Authentic Chennai breakfast — the idli-sambar here is world-class at ₹60."},
            {"name": "Biryani Zone Sholinganallur", "address": "OMR, Sholinganallur, Chennai", "rating": 4.3,
             "location": {"latitude": 12.9025, "longitude": 80.2292},
             "ai_insight": "Chettinad and Ambur biryani specialists — unique to Tamil Nadu."},
            {"name": "Subway Sholinganallur", "address": "Tidel Park, OMR, Chennai", "rating": 4.0,
             "location": {"latitude": 12.8998, "longitude": 80.2265},
             "ai_insight": "Quick and healthy — good for calorie-tracking professionals."},
            {"name": "Sangeetha Restaurant", "address": "Sholinganallur Junction, Chennai", "rating": 4.2,
             "location": {"latitude": 12.9015, "longitude": 80.2282},
             "ai_insight": "Pure-veg South Indian meals — the mini meals at ₹120 are a daily staple."},
        ],
        "gym": [
            {"name": "Snap Fitness Sholinganallur", "address": "OMR, Sholinganallur, Chennai", "rating": 4.2,
             "location": {"latitude": 12.9012, "longitude": 80.2281},
             "ai_insight": "24/7 gym popular with IT corridor workers."},
            {"name": "Cult.fit Sholinganallur", "address": "Tidel Park Area, OMR, Chennai", "rating": 4.4,
             "location": {"latitude": 12.9002, "longitude": 80.2270},
             "ai_insight": "Best fitness studio on OMR — wide variety of classes available."},
        ],
    },

    "Perungudi": {
        "food": [
            {"name": "Anjappar Chettinad", "address": "Perungudi, Chennai", "rating": 4.4,
             "location": {"latitude": 12.9560, "longitude": 80.2376},
             "ai_insight": "Authentic Chettinad cuisine — the pepper chicken here is unmissable."},
            {"name": "Saravana Bhavan Perungudi", "address": "OMR, Perungudi, Chennai", "rating": 4.5,
             "location": {"latitude": 12.9575, "longitude": 80.2390},
             "ai_insight": "The iconic South Indian chain — consistent and excellent value."},
            {"name": "Biryani Blues Perungudi", "address": "MRC Nagar Rd, Perungudi, Chennai", "rating": 4.2,
             "location": {"latitude": 12.9548, "longitude": 80.2362},
             "ai_insight": "Affordable biryani portions — the chicken dum is a bestseller."},
        ],
        "gym": [
            {"name": "Gold's Gym Perungudi", "address": "OMR, Perungudi, Chennai", "rating": 4.3,
             "location": {"latitude": 12.9558, "longitude": 80.2374},
             "ai_insight": "Premium gym near the OMR IT corridor with certified trainers."},
            {"name": "Talwalkars Perungudi", "address": "Perungudi Industrial Estate, Chennai", "rating": 4.0,
             "location": {"latitude": 12.9570, "longitude": 80.2386},
             "ai_insight": "Established chain with AC facility and modern equipment."},
        ],
    },

    "Adyar": {
        "food": [
            {"name": "Saravana Bhavan Adyar", "address": "LB Rd, Adyar, Chennai", "rating": 4.5,
             "location": {"latitude": 13.0063, "longitude": 80.2574},
             "ai_insight": "The flagship South Indian experience — rava masala dosa is legendary."},
            {"name": "The Tandoor Adyar", "address": "Gandhi Nagar, Adyar, Chennai", "rating": 4.3,
             "location": {"latitude": 13.0078, "longitude": 80.2589},
             "ai_insight": "North Indian flavours in South Chennai — popular for family dinners."},
            {"name": "Amaravathi Restaurant", "address": "Lattice Bridge Rd, Adyar, Chennai", "rating": 4.4,
             "location": {"latitude": 13.0050, "longitude": 80.2560},
             "ai_insight": "Chettinad cuisine specialist — the mutton chettinad is exceptional."},
        ],
        "gym": [
            {"name": "Cult.fit Adyar", "address": "LB Rd, Adyar, Chennai", "rating": 4.5,
             "location": {"latitude": 13.0060, "longitude": 80.2571},
             "ai_insight": "Popular fitness centre with swimming pool access option."},
            {"name": "Anytime Fitness Adyar", "address": "Gandhi Nagar, Adyar, Chennai", "rating": 4.2,
             "location": {"latitude": 13.0075, "longitude": 80.2585},
             "ai_insight": "24/7 gym in a prime residential area."},
        ],
    },

    "OMR (Thoraipakkam)": {
        "food": [
            {"name": "Murugan Idli Shop OMR", "address": "Thoraipakkam, OMR, Chennai", "rating": 4.4,
             "location": {"latitude": 12.9279, "longitude": 80.2295},
             "ai_insight": "Soft idlis with 4 chutneys — the best breakfast deal on OMR at ₹70."},
            {"name": "Buhari Restaurant", "address": "OMR, Thoraipakkam, Chennai", "rating": 4.2,
             "location": {"latitude": 12.9295, "longitude": 80.2310},
             "ai_insight": "Classic Chennai non-veg restaurant — the chicken 65 is iconic."},
            {"name": "Biryani By Kilo OMR", "address": "Thoraipakkam, OMR, Chennai", "rating": 4.3,
             "location": {"latitude": 12.9265, "longitude": 80.2281},
             "ai_insight": "Premium handi biryani delivered fresh — worth the slightly higher cost."},
        ],
        "gym": [
            {"name": "Snap Fitness OMR", "address": "Thoraipakkam, OMR, Chennai", "rating": 4.1,
             "location": {"latitude": 12.9277, "longitude": 80.2292},
             "ai_insight": "Convenient gym right on the OMR IT corridor."},
            {"name": "Fitness One OMR", "address": "Elnet Software City, OMR, Chennai", "rating": 4.0,
             "location": {"latitude": 12.9290, "longitude": 80.2306},
             "ai_insight": "Inside tech park — zero commute to your workout session."},
        ],
    },

    "Velachery": {
        "food": [
            {"name": "Sangeetha Restaurant Velachery", "address": "100 Feet Rd, Velachery, Chennai", "rating": 4.3,
             "location": {"latitude": 12.9777, "longitude": 80.2209},
             "ai_insight": "Excellent vegetarian South Indian meals — daily thali at ₹110."},
            {"name": "Biryani Blues Velachery", "address": "Velachery Main Rd, Chennai", "rating": 4.2,
             "location": {"latitude": 12.9792, "longitude": 80.2225},
             "ai_insight": "Consistent biryani near Phoenix Mall — affordable weekday lunches."},
            {"name": "Domino's Velachery", "address": "Phoenix Mall, Velachery, Chennai", "rating": 4.0,
             "location": {"latitude": 12.9762, "longitude": 80.2195},
             "ai_insight": "Reliable quick meals near the mall — good for late nights."},
        ],
        "gym": [
            {"name": "Talwalkars Velachery", "address": "100 Feet Rd, Velachery, Chennai", "rating": 4.1,
             "location": {"latitude": 12.9775, "longitude": 80.2207},
             "ai_insight": "Good value gym with group yoga classes."},
            {"name": "Gold's Gym Velachery", "address": "Phoenix Mall Area, Velachery, Chennai", "rating": 4.3,
             "location": {"latitude": 12.9765, "longitude": 80.2198},
             "ai_insight": "Premium gym in a prime location with all modern equipment."},
        ],
    },

    # ══════════════ MUMBAI ════════════════════════════════════════════

    "Powai": {
        "food": [
            {"name": "Hiranandani Garden Restaurant", "address": "Hiranandani, Powai, Mumbai", "rating": 4.4,
             "location": {"latitude": 19.1176, "longitude": 72.9060},
             "ai_insight": "Upscale dining in the Hiranandani township — great for client meals."},
            {"name": "Barbeque Nation Powai", "address": "Lake Side Chalet Rd, Powai, Mumbai", "rating": 4.4,
             "location": {"latitude": 19.1188, "longitude": 72.9075},
             "ai_insight": "Popular all-you-can-eat BBQ with lakeside area views."},
            {"name": "Vada Pav Corner Powai", "address": "IIT Powai Gate, Mumbai", "rating": 4.3,
             "location": {"latitude": 19.1163, "longitude": 72.9046},
             "ai_insight": "The most authentic vada pav in Mumbai — ₹20 per piece, unmissable."},
            {"name": "Café Mondegar Powai", "address": "Hiranandani Complex, Powai", "rating": 4.2,
             "location": {"latitude": 19.1180, "longitude": 72.9065},
             "ai_insight": "European café with Mumbai twist — great breakfast and pasta options."},
        ],
        "gym": [
            {"name": "Gold's Gym Powai", "address": "Hiranandani, Powai, Mumbai", "rating": 4.3,
             "location": {"latitude": 19.1174, "longitude": 72.9058},
             "ai_insight": "Premium gym in the business hub — swimming pool access available."},
            {"name": "Cult.fit Powai", "address": "Galleria Mall, Powai, Mumbai", "rating": 4.5,
             "location": {"latitude": 19.1185, "longitude": 72.9072},
             "ai_insight": "Best fitness studio in Powai — yoga, HIIT, cycling all available."},
            {"name": "Anytime Fitness Powai", "address": "Hiranandani Knowledge Park, Powai", "rating": 4.2,
             "location": {"latitude": 19.1168, "longitude": 72.9052},
             "ai_insight": "24/7 gym ideal for IIT and corporate professionals on flexible schedules."},
        ],
    },

    "Andheri East": {
        "food": [
            {"name": "Bade Miyan Andheri", "address": "MIDC, Andheri East, Mumbai", "rating": 4.4,
             "location": {"latitude": 19.1136, "longitude": 72.8697},
             "ai_insight": "Legendary Mumbai kebab street food — seekh kebabs are unmissable at ₹150."},
            {"name": "Shiv Sagar Andheri East", "address": "SEEPZ, Andheri East, Mumbai", "rating": 4.2,
             "location": {"latitude": 19.1150, "longitude": 72.8712},
             "ai_insight": "Affordable pure-veg meals — daily thali at ₹130 popular with IT workers."},
            {"name": "Anand Biryani", "address": "J.B. Nagar, Andheri East, Mumbai", "rating": 4.3,
             "location": {"latitude": 19.1122, "longitude": 72.8682},
             "ai_insight": "Mumbai-style biryani with a rich flavour — ₹220 for a generous portion."},
            {"name": "The Bohri Kitchen", "address": "Marol, Andheri East, Mumbai", "rating": 4.5,
             "location": {"latitude": 19.1140, "longitude": 72.8702},
             "ai_insight": "Renowned Bohri cuisine — weekend-only pop-up that's always sold out."},
        ],
        "gym": [
            {"name": "Snap Fitness Andheri East", "address": "MIDC, Andheri East, Mumbai", "rating": 4.2,
             "location": {"latitude": 19.1134, "longitude": 72.8695},
             "ai_insight": "Affordable 24/7 gym in the MIDC industrial belt."},
            {"name": "Gold's Gym Andheri", "address": "J.B. Nagar, Andheri East, Mumbai", "rating": 4.3,
             "location": {"latitude": 19.1148, "longitude": 72.8710},
             "ai_insight": "Full-service gym with dedicated functional training area."},
        ],
    },

    "BKC (Bandra Kurla)": {
        "food": [
            {"name": "Bastian BKC", "address": "Trade World, BKC, Mumbai", "rating": 4.6,
             "location": {"latitude": 19.0662, "longitude": 72.8655},
             "ai_insight": "Mumbai's top seafood restaurant — the butter garlic prawns are extraordinary."},
            {"name": "The Bombay Canteen", "address": "Unit 1, BKC, Mumbai", "rating": 4.5,
             "location": {"latitude": 19.0678, "longitude": 72.8670},
             "ai_insight": "Modern Indian cuisine reinterpreted — perfect for corporate lunches."},
            {"name": "Shree Thaker Bhojanalay BKC", "address": "MMRDA Area, BKC, Mumbai", "rating": 4.3,
             "location": {"latitude": 19.0648, "longitude": 72.8640},
             "ai_insight": "Premium unlimited Gujarati thali — a BKC corporate favourite at ₹350."},
        ],
        "gym": [
            {"name": "Cult.fit BKC", "address": "Trade Centre, BKC, Mumbai", "rating": 4.6,
             "location": {"latitude": 19.0660, "longitude": 72.8652},
             "ai_insight": "Premium fitness studio in Mumbai's financial district."},
            {"name": "Gold's Gym BKC", "address": "G Block, BKC, Mumbai", "rating": 4.4,
             "location": {"latitude": 19.0675, "longitude": 72.8668},
             "ai_insight": "Elite gym in the finance hub — excellent equipment and pro trainers."},
        ],
    },

    "Thane": {
        "food": [
            {"name": "Café Mushroom Thane", "address": "Naupada, Thane West, Mumbai", "rating": 4.2,
             "location": {"latitude": 19.2183, "longitude": 72.9781},
             "ai_insight": "Cosy Thane café popular for quick lunches and coffee meetings."},
            {"name": "Biryani House Thane", "address": "Vasant Vihar, Thane, Mumbai", "rating": 4.3,
             "location": {"latitude": 19.2198, "longitude": 72.9795},
             "ai_insight": "Best biryani in Thane — large portions at affordable ₹200 price point."},
            {"name": "Vrindavan Thane", "address": "Gokhale Rd, Thane, Mumbai", "rating": 4.1,
             "location": {"latitude": 19.2168, "longitude": 72.9765},
             "ai_insight": "Veg meals ideal for home-cooked food lovers on a budget."},
        ],
        "gym": [
            {"name": "Talwalkars Thane", "address": "Vasant Vihar, Thane, Mumbai", "rating": 4.1,
             "location": {"latitude": 19.2180, "longitude": 72.9778},
             "ai_insight": "Established chain gym with AC — good value in Thane."},
            {"name": "Cult.fit Thane", "address": "Naupada, Thane West, Mumbai", "rating": 4.3,
             "location": {"latitude": 19.2195, "longitude": 72.9792},
             "ai_insight": "Group fitness classes — yoga and HIIT popular in the community."},
        ],
    },

    "Navi Mumbai": {
        "food": [
            {"name": "Café Supreme Navi Mumbai", "address": "Vashi, Navi Mumbai", "rating": 4.2,
             "location": {"latitude": 19.0330, "longitude": 73.0297},
             "ai_insight": "Clean, affordable multi-cuisine — a great daily lunch spot."},
            {"name": "Navi Mumbai Biryani Center", "address": "Sector 17, Vashi, Navi Mumbai", "rating": 4.3,
             "location": {"latitude": 19.0345, "longitude": 73.0312},
             "ai_insight": "Value biryani hub — the single portion is generous at ₹180."},
            {"name": "Dosa Plaza Navi Mumbai", "address": "CBD Belapur, Navi Mumbai", "rating": 4.1,
             "location": {"latitude": 19.0315, "longitude": 73.0282},
             "ai_insight": "Over 150 dosa varieties — a fun place for weekend brunches."},
        ],
        "gym": [
            {"name": "Gold's Gym Navi Mumbai", "address": "Vashi, Navi Mumbai", "rating": 4.2,
             "location": {"latitude": 19.0328, "longitude": 73.0294},
             "ai_insight": "Well-equipped gym in the planned Navi Mumbai township."},
            {"name": "Snap Fitness Navi Mumbai", "address": "CBD Belapur, Navi Mumbai", "rating": 4.0,
             "location": {"latitude": 19.0320, "longitude": 73.0285},
             "ai_insight": "Budget-friendly 24/7 option in the commercial district."},
        ],
    },
}


def get_fallback_food(area_name: str, monthly_salary: int = 50000) -> list[dict]:
    """Return curated food spots for an area, filtered by salary tier."""
    places = STATIC_PLACES.get(area_name, {}).get("food", [])
    if not places:
        return []

    # For budget salaries, prefer lower-rated (cheaper) places
    if monthly_salary <= 30000:
        # Return cheaper spots — lower rated ones are typically budget places
        return sorted(places, key=lambda p: p["rating"])[:3]
    elif monthly_salary <= 60000:
        return places[:4]
    else:
        # Premium earners get top-rated spots
        return sorted(places, key=lambda p: p["rating"], reverse=True)[:4]


def get_fallback_gyms(area_name: str, monthly_salary: int = 50000) -> list[dict]:
    """Return curated gym options for an area, filtered by salary tier."""
    gyms = STATIC_PLACES.get(area_name, {}).get("gym", [])
    if not gyms:
        return []

    if monthly_salary <= 30000:
        # Budget gyms — lower rated (simpler/cheaper)
        return sorted(gyms, key=lambda g: g["rating"])[:2]
    elif monthly_salary <= 70000:
        return gyms[:2]
    else:
        # Premium earners get the best gyms
        return sorted(gyms, key=lambda g: g["rating"], reverse=True)
