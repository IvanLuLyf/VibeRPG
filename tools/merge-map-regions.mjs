/**
 * Concatenate per-id map-NN.js files into regional bundles (one IIFE each preserved).
 * Run from repo root: node tools/merge-map-regions.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dir = path.join(root, "js/game/maps");

function pad(n) {
    return String(n).padStart(2, "0");
}
function load(id) {
    return fs.readFileSync(path.join(dir, `map-${pad(id)}.js`), "utf8");
}
function stripLeadingBanner(s) {
    return s.replace(/^\/\*[\s\S]*?\*\/\s*/, "");
}

const groups = [
    { file: "maps-world.js", banner: "World overworld (SUBMAP_WORLD_MAP)", ids: [0] },
    { file: "maps-town-milford.js", banner: "Milford: town + houses + library (8–12)", ids: [8, 9, 10, 11, 12] },
    { file: "maps-mountain-pass.js", banner: "Mountain pass (13–14)", ids: [13, 14] },
    {
        file: "maps-region-castle-town.js",
        banner: "Castle Town area: main map, wings, houses, armory, throne, weird house (15–22, 32–35)",
        ids: [15, 16, 17, 18, 19, 20, 21, 22, 32, 33, 34, 35]
    },
    {
        file: "maps-region-kingdom.js",
        banner: "Kingdom of Gran: overworld, towers, caves, shops (23–31)",
        ids: [23, 24, 25, 26, 27, 28, 29, 30, 31]
    }
];

for (const g of groups) {
    const chunks = [`/* ${g.banner} */\n`];
    for (const id of g.ids) {
        const p = path.join(dir, `map-${pad(id)}.js`);
        if (!fs.existsSync(p)) {
            console.error("Missing", p);
            process.exit(1);
        }
        chunks.push(stripLeadingBanner(load(id)));
        if (!chunks[chunks.length - 1].endsWith("\n")) chunks.push("\n");
        chunks.push("\n");
    }
    const outPath = path.join(dir, g.file);
    fs.writeFileSync(outPath, chunks.join(""), "utf8");
    console.log("wrote", path.relative(root, outPath));
}
