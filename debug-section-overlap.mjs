import { appendFileSync } from "node:fs";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";

const LOG_PATH = "/opt/cursor/logs/debug.log";
const URL = process.env.DEBUG_URL ?? "http://localhost:3000";
const viewports = [
  { width: 1280, height: 720 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

function agentLog(hypothesisId, location, message, data) {
  appendFileSync(
    LOG_PATH,
    `${JSON.stringify({
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now(),
    })}\n`,
  );
}

// #region agent log
agentLog("A,D", "debug-section-overlap.mjs:26", "measurement run started", {
  url: URL,
  viewports,
});
// #endregion

const profile = await mkdtemp(join(tmpdir(), "section-overlap-"));
const chrome = spawn(
  process.env.CHROME_BIN ?? "google-chrome",
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: ["ignore", "ignore", "pipe"] },
);

const browserWebSocketUrl = await new Promise((resolve, reject) => {
  let stderr = "";
  const timer = setTimeout(
    () => reject(new Error(`Chrome did not start: ${stderr}`)),
    10_000,
  );

  chrome.stderr.setEncoding("utf8");
  chrome.stderr.on("data", (chunk) => {
    stderr += chunk;
    const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
    if (match) {
      clearTimeout(timer);
      resolve(match[1]);
    }
  });
  chrome.once("error", reject);
  chrome.once("exit", (code) => {
    if (code !== null && code !== 0) {
      clearTimeout(timer);
      reject(new Error(`Chrome exited with code ${code}: ${stderr}`));
    }
  });
});

const targets = await fetch(
  `http://${new URL(browserWebSocketUrl).host}/json/list`,
).then((response) => response.json());
const target = targets.find((candidate) => candidate.type === "page");
if (!target) throw new Error("Chrome did not expose a page target");

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let commandId = 0;
const pending = new Map();
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (!message.id) return;
  const request = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) request.reject(new Error(message.error.message));
  else request.resolve(message.result);
});

function command(method, params = {}) {
  const id = ++commandId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
  });
}

async function evaluate(expression) {
  const result = await command("Runtime.evaluate", {
    awaitPromise: true,
    expression,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text);
  }
  return result.result.value;
}

await command("Page.enable");
await command("Runtime.enable");
const results = [];

for (const viewport of viewports) {
  await command("Emulation.setDeviceMetricsOverride", {
    ...viewport,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await command("Page.navigate", { url: URL });
  await evaluate(`new Promise(async (resolve) => {
    while (document.readyState !== "complete") {
      await new Promise((next) => setTimeout(next, 20));
    }
    await document.fonts.ready;
    resolve(true);
  })`);

  const result = await evaluate(`(async () => {
    const rect = (element) => {
      const value = element.getBoundingClientRect();
      return {
        top: value.top + scrollY,
        bottom: value.bottom + scrollY,
        height: value.height,
      };
    };
    const gate = document.querySelector(".gate-section");
    const gateWindow = document.querySelector(".gate-window");
    const gateReveal = document.querySelector(".gate-visual");
    const handoff = document.querySelector(".handoff-section");
    const heading = handoff.querySelector(".section-heading");
    const samples = [];
    const start = handoff.offsetTop - innerHeight;
    const end = handoff.offsetTop + 160;

    for (let y = start; y <= end; y += 32) {
      scrollTo(0, y);
      await new Promise(requestAnimationFrame);
      const gateRect = gate.getBoundingClientRect();
      const windowRect = gateWindow.getBoundingClientRect();
      const handoffRect = handoff.getBoundingClientRect();
      const headingRect = heading.getBoundingClientRect();
      samples.push({
        scrollY,
        sectionGap: handoffRect.top - gateRect.bottom,
        contentGap: headingRect.top - windowRect.bottom,
        gateTransform: getComputedStyle(gateReveal).transform,
        headingTransform: getComputedStyle(heading).transform,
        headingOpacity: getComputedStyle(heading).opacity,
      });
    }

    return {
      viewport: { width: innerWidth, height: innerHeight },
      sections: {
        gate: rect(gate),
        handoff: rect(handoff),
        flowGap: rect(handoff).top - rect(gate).bottom,
      },
      children: {
        gateWindow: rect(gateWindow),
        handoffHeading: rect(heading),
        visualGap: rect(heading).top - rect(gateWindow).bottom,
        gateOverflow: rect(gateWindow).bottom - rect(gate).bottom,
      },
      samples,
    };
  })()`);
  results.push(result);
}

// #region agent log
agentLog(
  "A",
  "debug-section-overlap.mjs:175",
  "adjacent section flow geometry",
  results.map(({ viewport, sections }) => ({ viewport, sections })),
);
// #endregion

// #region agent log
agentLog(
  "B",
  "debug-section-overlap.mjs:185",
  "gate card and handoff heading geometry",
  results.map(({ viewport, children }) => ({ viewport, children })),
);
// #endregion

// #region agent log
agentLog(
  "C",
  "debug-section-overlap.mjs:195",
  "scroll reveal geometry extrema",
  results.map(({ viewport, samples }) => ({
    viewport,
    minSectionGap: Math.min(...samples.map(({ sectionGap }) => sectionGap)),
    minContentGap: Math.min(...samples.map(({ contentGap }) => contentGap)),
    transforms: [...new Set(samples.flatMap(
      ({ gateTransform, headingTransform }) => [
        gateTransform,
        headingTransform,
      ],
    ))],
    headingOpacities: [...new Set(samples.map(({ headingOpacity }) => headingOpacity))],
  })),
);
// #endregion

const summary = results.map(({ viewport, sections, children, samples }) => ({
  viewport,
  sectionOverlap: sections.flowGap < -0.5,
  childOverlap: children.visualGap < -0.5,
  overflowIntoNextSection: children.gateOverflow > 0.5,
  transientOverlap: samples.some(
    ({ sectionGap, contentGap }) => sectionGap < -0.5 || contentGap < -0.5,
  ),
}));

// #region agent log
agentLog("A,B,C,D", "debug-section-overlap.mjs:225", "overlap verdict", {
  summary,
});
// #endregion

console.log(JSON.stringify(summary, null, 2));
await command("Browser.close");
