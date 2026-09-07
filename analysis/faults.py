"""Fay hatlari: her biri bir polyline (lat, lon) dizisi."""

FAULTS = {
    "kuzey_anadolu": {
        "label": "Kuzey Anadolu Fayı",
        "line": [
            (39.80, 39.50),
            (40.30, 38.00),
            (40.60, 36.00),
            (40.75, 34.00),
            (40.70, 32.00),
            (40.75, 30.50),
            (40.72, 29.00),
            (40.60, 27.50),
            (40.40, 26.00),
        ],
        "half_width_km": 60,
        "min_magnitude": 6.7,
        "year_range": (1939, 2000),
        "note": "Stein ve ark. (1997) tarafindan tanimlanan dizi",
    },
    "dogu_anadolu": {
        "label": "Doğu Anadolu Fayı",
        "line": [
            (39.20, 41.00),
            (38.60, 39.80),
            (38.00, 38.50),
            (37.40, 37.20),
            (36.60, 36.30),
        ],
        "half_width_km": 50,
        "min_magnitude": 6.0,
    },
    "san_andreas": {
        "label": "San Andreas",
        "line": [
            (40.30, -124.40),
            (38.50, -123.00),
            (37.20, -121.90),
            (35.80, -120.30),
            (34.40, -118.50),
            (33.30, -115.80),
        ],
        "half_width_km": 60,
        "min_magnitude": 6.0,
    },
    "sumatra": {
        "label": "Sumatra Fayı",
        "line": [
            (5.50, 95.30),
            (3.00, 97.50),
            (0.00, 100.00),
            (-2.50, 102.00),
            (-5.50, 104.50),
        ],
        "half_width_km": 60,
        "min_magnitude": 6.5,
    },
    "japonya_hendegi": {
        "label": "Japonya Hendeği",
        "line": [
            (41.50, 144.00),
            (39.00, 143.50),
            (37.00, 142.50),
            (35.00, 141.50),
        ],
        "half_width_km": 90,
        "min_magnitude": 7.0,
    },
}