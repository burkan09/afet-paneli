"""Dunya genelindeki baslica fay ve dalma-batma zonlari."""

FAULTS = {
    "kuzey_anadolu": {
        "label": "Kuzey Anadolu Fayı",
        "line": [(39.80, 39.50), (40.30, 38.00), (40.60, 36.00), (40.75, 34.00),
                 (40.70, 32.00), (40.75, 30.50), (40.72, 29.00), (40.60, 27.50),
                 (40.40, 26.00)],
        "half_width_km": 60, "min_magnitude": 6.7,
        "year_range": (1939, 2000),
        "note": "Stein ve ark. (1997) dizisi",
    },
    "dogu_anadolu": {
        "label": "Doğu Anadolu Fayı",
        "line": [(39.20, 41.00), (38.60, 39.80), (38.00, 38.50),
                 (37.40, 37.20), (36.60, 36.30)],
        "half_width_km": 50, "min_magnitude": 6.0,
    },
    "olu_deniz": {
        "label": "Ölü Deniz Fayı",
        "line": [(29.50, 34.90), (31.00, 35.40), (32.50, 35.55),
                 (33.50, 35.60), (34.50, 36.00), (36.00, 36.30)],
        "half_width_km": 50, "min_magnitude": 5.5,
    },
    "zagros": {
        "label": "Zagros Kuşağı",
        "line": [(38.00, 44.50), (36.00, 46.50), (34.00, 48.00), (32.00, 50.00),
                 (30.00, 52.00), (28.00, 54.00), (27.00, 56.00)],
        "half_width_km": 90, "min_magnitude": 6.0,
    },
    "chaman": {
        "label": "Chaman Fayı",
        "line": [(34.50, 70.00), (32.00, 68.00), (30.00, 66.80), (28.00, 66.00)],
        "half_width_km": 70, "min_magnitude": 6.0,
    },
    "himalaya": {
        "label": "Himalaya Ana Bindirmesi",
        "line": [(35.00, 74.00), (33.00, 78.00), (31.00, 81.00), (29.00, 84.00),
                 (28.00, 88.00), (27.50, 91.00), (28.00, 95.00)],
        "half_width_km": 100, "min_magnitude": 6.0,
    },
    "altyn_tagh": {
        "label": "Altyn Tagh Fayı",
        "line": [(39.50, 94.00), (38.50, 90.00), (37.50, 86.00), (36.50, 82.00)],
        "half_width_km": 70, "min_magnitude": 5.5,
    },
    "xianshuihe": {
        "label": "Xianshuihe Fayı",
        "line": [(32.00, 100.00), (30.50, 101.50), (29.00, 102.50), (27.00, 101.50)],
        "half_width_km": 60, "min_magnitude": 5.5,
    },
    "sagaing": {
        "label": "Sagaing Fayı",
        "line": [(25.50, 96.50), (22.00, 96.00), (19.00, 96.20), (16.50, 96.50)],
        "half_width_km": 60, "min_magnitude": 6.0,
    },
    "sumatra": {
        "label": "Sumatra Fayı",
        "line": [(5.50, 95.30), (3.00, 97.50), (0.00, 100.00),
                 (-2.50, 102.00), (-5.50, 104.50)],
        "half_width_km": 60, "min_magnitude": 6.5,
    },
    "java_hendegi": {
        "label": "Java Hendeği",
        "line": [(-8.00, 105.00), (-9.50, 110.00), (-10.50, 115.00), (-11.00, 120.00)],
        "half_width_km": 90, "min_magnitude": 6.5,
    },
    "manila_hendegi": {
        "label": "Manila Hendeği",
        "line": [(21.00, 120.00), (18.00, 119.50), (15.00, 119.00), (13.00, 119.50)],
        "half_width_km": 80, "min_magnitude": 6.0,
    },
    "filipin_fayi": {
        "label": "Filipin Fayı",
        "line": [(18.00, 121.50), (16.00, 121.00), (13.50, 122.50),
                 (11.00, 124.50), (8.50, 125.50), (6.50, 126.00)],
        "half_width_km": 60, "min_magnitude": 6.0,
    },
    "japonya_hendegi": {
        "label": "Japonya Hendeği",
        "line": [(41.50, 144.00), (39.00, 143.50), (37.00, 142.50), (35.00, 141.50)],
        "half_width_km": 90, "min_magnitude": 7.0,
    },
    "kuril_kamcatka": {
        "label": "Kuril-Kamçatka Hendeği",
        "line": [(56.00, 163.00), (52.00, 159.50), (48.00, 154.50),
                 (45.00, 150.00), (43.00, 146.00)],
        "half_width_km": 100, "min_magnitude": 6.5,
    },
    "aleut_hendegi": {
        "label": "Aleut Hendeği",
        "line": [(54.00, -160.00), (52.50, -166.00), (51.50, -172.00), (51.00, -178.00)],
        "half_width_km": 110, "min_magnitude": 6.5,
    },
    "denali": {
        "label": "Denali Fayı",
        "line": [(62.00, -141.00), (63.00, -145.00), (63.30, -149.00),
                 (62.80, -152.00), (62.00, -155.00)],
        "half_width_km": 60, "min_magnitude": 5.5,
    },
    "queen_charlotte": {
        "label": "Queen Charlotte Fayı",
        "line": [(51.50, -130.90), (53.50, -133.00), (56.00, -135.00), (58.00, -137.50)],
        "half_width_km": 60, "min_magnitude": 6.0,
    },
    "kaskadya": {
        "label": "Kaskadya Dalma-Batması",
        "line": [(40.40, -124.70), (43.00, -125.30), (46.00, -125.80), (48.50, -126.50)],
        "half_width_km": 90, "min_magnitude": 5.5,
    },
    "san_andreas": {
        "label": "San Andreas",
        "line": [(40.30, -124.40), (38.50, -123.00), (37.20, -121.90),
                 (35.80, -120.30), (34.40, -118.50), (33.30, -115.80)],
        "half_width_km": 60, "min_magnitude": 6.0,
    },
    "orta_amerika": {
        "label": "Orta Amerika Hendeği",
        "line": [(16.00, -95.00), (14.00, -92.00), (12.50, -89.00),
                 (11.00, -86.50), (9.50, -84.50)],
        "half_width_km": 90, "min_magnitude": 6.0,
    },
    "karayip_kuzey": {
        "label": "Kuzey Karayip Fayı",
        "line": [(19.80, -72.00), (19.50, -70.00), (19.30, -68.00), (19.00, -65.00)],
        "half_width_km": 70, "min_magnitude": 5.5,
    },
    "peru_hendegi": {
        "label": "Peru Hendeği",
        "line": [(-3.00, -81.50), (-8.00, -80.50), (-12.00, -78.00),
                 (-16.00, -75.00), (-18.00, -72.50)],
        "half_width_km": 100, "min_magnitude": 6.5,
    },
    "sili_hendegi": {
        "label": "Şili Hendeği",
        "line": [(-20.00, -70.80), (-25.00, -71.00), (-30.00, -71.80),
                 (-35.00, -73.00), (-40.00, -74.50), (-45.00, -75.50)],
        "half_width_km": 110, "min_magnitude": 6.5,
    },
    "helen_yayi": {
        "label": "Helen Yayı",
        "line": [(35.50, 21.50), (34.80, 23.50), (34.50, 26.00),
                 (35.30, 28.00), (36.50, 29.50)],
        "half_width_km": 80, "min_magnitude": 5.5,
    },
    "alp_fayi": {
        "label": "Alp Fayı (Yeni Zelanda)",
        "line": [(-45.00, 167.00), (-44.00, 168.80), (-43.00, 170.50),
                 (-42.00, 172.50), (-41.50, 174.00)],
        "half_width_km": 70, "min_magnitude": 5.5,
    },
    "tonga_kermadec": {
        "label": "Tonga-Kermadec Hendeği",
        "line": [(-15.00, -173.00), (-20.00, -173.50), (-25.00, -175.50),
                 (-29.00, -177.00)],
        "half_width_km": 110, "min_magnitude": 6.5,
    },
}