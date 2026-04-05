import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const defaultSrc = path.join(root, "js/game/maps.js");
const srcPath = process.argv[2] || defaultSrc;
if (!fs.existsSync(srcPath)) {
    console.error("Missing source file. Usage: node tools/split-maps.mjs <path-to-monolithic-maps.js>");
    console.error("Expected var g_mapData = { submaps: { ... } }; in that file.");
    process.exit(1);
}
const src = fs.readFileSync(srcPath, "utf8");
const openIdx = src.indexOf('"submaps":');
if (openIdx < 0) throw new Error("no submaps");
const braceStart = src.indexOf("{", openIdx);
let depth = 0;
let i = braceStart;
for (; i < src.length; i++) {
    const c = src[i];
    if (c === "{") depth++;
    else if (c === "}") {
        depth--;
        if (depth === 0) {
            i++;
            break;
        }
    }
}
const body = src.slice(braceStart + 1, i - 1);
const re = /^\s*(\d+)\s*:\s*\{/gm;
const hits = [];
let m;
while ((m = re.exec(body)) !== null) {
    hits.push({ id: m[1], abs: m.index, matchLen: m[0].length });
}
console.log("found", hits.length, "maps");

/** @param openPos index of the `{` that opens the map object (after `id: `) */
function extractBalancedFrom(openPos) {
    let d = 0;
    for (let j = openPos; j < body.length; j++) {
        const c = body[j];
        if (c === "{") d++;
        else if (c === "}") {
            d--;
            if (d === 0) return body.slice(openPos, j + 1);
        }
    }
    return null;
}

const outDir = path.join(root, "js/game/maps");
fs.mkdirSync(outDir, { recursive: true });

for (let k = 0; k < hits.length; k++) {
    const h = hits[k];
    const openBrace = h.abs + h.matchLen - 1;
    if (body[openBrace] !== "{") throw new Error("expected { for map " + h.id);
    const chunk = extractBalancedFrom(openBrace);
    if (!chunk) throw new Error("bad chunk " + h.id);
    const inner = chunk.slice(1, -1).trimEnd();
    const file = path.join(outDir, `map-${String(h.id).padStart(2, "0")}.js`);
    const banner = `/* Game map ${h.id} — content split from maps.js */\n`;
    const code =
        banner +
        `(function () {\n    if (typeof registerGameMap !== "function") return;\n    registerGameMap(${h.id}, {${inner}\n    });\n})();\n`;
    fs.writeFileSync(file, code, "utf8");
    console.log("wrote", path.relative(root, file));
}

const regPath = path.join(root, "js/game/maps-registry.js");
const reg = `/* Aggregates g_mapData.submaps via registerGameMap — load before js/game/maps/*.js */
var g_mapData = { submaps: {} };
function registerGameMap(id, config) {
    g_mapData.submaps[id] = config;
}
`;
fs.writeFileSync(regPath, reg, "utf8");
console.log("wrote", path.relative(root, regPath));
