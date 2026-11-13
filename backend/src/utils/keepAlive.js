// Keeps the free Render server awake.
//
// Render's free plan puts the server to sleep after 15 minutes without
// requests, and the next visitor then waits 30–50 seconds for it to wake up
// (empty project lists, a slow contact form, the app waiting on its first load).
// Pinging our own public URL every 10 minutes counts as a visit, so it never
// falls asleep. It also runs a tiny database query, which keeps the MySQL
// connection fresh.
//
// Runs only on Render (RENDER_EXTERNAL_URL is set there) or when KEEP_ALIVE_URL
// is set. Turn it off with KEEP_ALIVE=false. One always-on free service uses
// about 744 of the 750 free instance hours Render gives each month.

const INTERVAL_MS = 10 * 60 * 1000;

function startKeepAlive() {
  const base = process.env.KEEP_ALIVE_URL || process.env.RENDER_EXTERNAL_URL;
  if (!base || process.env.KEEP_ALIVE === 'false') return null;

  const url = `${base.replace(/\/+$/, '')}/api/health/db`;
  let failures = 0;

  const ping = async () => {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (failures) console.log(`Keep-alive: back to normal after ${failures} failed ping(s).`);
      failures = 0;
    } catch (error) {
      failures += 1;
      console.error(`Keep-alive ping failed (${failures}): ${error.message}`);
    }
  };

  const timer = setInterval(ping, INTERVAL_MS);
  timer.unref(); // never keeps the process alive on its own (e.g. during shutdown)
  console.log(`Keep-alive: pinging ${url} every ${INTERVAL_MS / 60000} minutes.`);
  return timer;
}

module.exports = { startKeepAlive };
