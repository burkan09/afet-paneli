export function energyJoules(magnitude) {
  return Math.pow(10, 1.5 * magnitude + 4.8);
}

const TNT_TON_JOULES = 4.184e9;

export function energyInTntTons(magnitude) {
  return energyJoules(magnitude) / TNT_TON_JOULES;
}

export function energyComparison(joules) {
  const tons = joules / TNT_TON_JOULES;

  if (tons < 1) return `${(tons * 1000).toFixed(0)} kg TNT`;
  if (tons < 1000) return `${tons.toFixed(0)} ton TNT`;
  if (tons < 1000000) return `${(tons / 1000).toFixed(1)} kiloton TNT`;
  return `${(tons / 1000000).toFixed(2)} megaton TNT`;
}

export function totalEnergy(events) {
  return events.reduce((sum, e) => sum + energyJoules(e.magnitude), 0);
}