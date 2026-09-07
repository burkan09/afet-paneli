"""Coğrafi yardımcılar: mesafe ve fay eksenine izdüşüm."""
import math

R_EARTH = 6371.0


def haversine(lat1, lon1, lat2, lon2):
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = p2 - p1
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * R_EARTH * math.asin(math.sqrt(a))


def to_xy(lat, lon, lat0):
    """Yerel düzlem koordinatı (km). Küçük bölgeler için yeterli."""
    x = math.radians(lon) * R_EARTH * math.cos(math.radians(lat0))
    y = math.radians(lat) * R_EARTH
    return x, y


def project_on_line(lat, lon, line):
    """Noktayı polyline üzerine izdüşür.

    Döner: (fay boyunca mesafe km, faya dik uzaklık km)
    """
    lat0 = sum(p[0] for p in line) / len(line)
    px, py = to_xy(lat, lon, lat0)

    best_along = None
    best_perp = float("inf")
    travelled = 0.0

    for i in range(len(line) - 1):
        ax, ay = to_xy(line[i][0], line[i][1], lat0)
        bx, by = to_xy(line[i + 1][0], line[i + 1][1], lat0)

        vx, vy = bx - ax, by - ay
        seg_len = math.hypot(vx, vy)
        if seg_len == 0:
            continue

        t = ((px - ax) * vx + (py - ay) * vy) / (seg_len ** 2)
        t_clamped = max(0.0, min(1.0, t))

        cx, cy = ax + t_clamped * vx, ay + t_clamped * vy
        perp = math.hypot(px - cx, py - cy)

        if perp < best_perp:
            best_perp = perp
            best_along = travelled + t_clamped * seg_len

        travelled += seg_len

    return best_along, best_perp


def line_length(line):
    lat0 = sum(p[0] for p in line) / len(line)
    total = 0.0
    for i in range(len(line) - 1):
        ax, ay = to_xy(line[i][0], line[i][1], lat0)
        bx, by = to_xy(line[i + 1][0], line[i + 1][1], lat0)
        total += math.hypot(bx - ax, by - ay)
    return total