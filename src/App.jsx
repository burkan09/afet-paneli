import { useEffect, useState } from "react";
import { checkAll } from "./api/corsCheck";
import { fetchUsgs } from "./api/usgs";
import { normalizeUsgsCollection } from "./lib/normalize";
import { timeAgo, magnitudeColor } from "./lib/format";

function App() {
  const [checks, setChecks] = useState(null);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAll().then(setChecks);
  }, []);

  useEffect(() => {
    fetchUsgs("day")
      .then((json) => setEvents(normalizeUsgsCollection(json)))
      .catch((err) => setError(err.message));
  }, []);

  const top = [...events].sort((a, b) => b.magnitude - a.magnitude).slice(0, 10);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-8">
      <h1 className="text-2xl font-bold text-emerald-400 mb-6">
        Faz 0.5 — Bağlantı Testi
      </h1>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">API erişilebilirliği</h2>
        {!checks && <p className="text-slate-400">Test ediliyor...</p>}
        {checks && (
          <ul className="space-y-2">
            {checks.map((c) => (
              <li
                key={c.key}
                className="flex items-center gap-3 bg-slate-800 rounded px-4 py-2"
              >
                <span className={c.ok ? "text-emerald-400" : "text-red-400"}>
                  {c.ok ? "BASARILI" : "HATA"}
                </span>
                <span className="font-medium">{c.name}</span>
                <span className="text-slate-400 text-sm">
                  {c.detail} · {c.ms} ms
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">
          Son 24 saatin en büyük 10 depremi
        </h2>
        {error && <p className="text-red-400">Hata: {error}</p>}
        {!error && events.length === 0 && (
          <p className="text-slate-400">Yükleniyor...</p>
        )}
        <ul className="space-y-1">
          {top.map((e) => (
            <li key={e.id} className="bg-slate-800 rounded px-4 py-2 flex gap-4">
              <span className={`font-bold w-12 ${magnitudeColor(e.magnitude)}`}>
                {e.magnitude.toFixed(1)}
              </span>
              <span className="flex-1">{e.title}</span>
              <span className="text-slate-500 text-sm">{timeAgo(e.time)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;