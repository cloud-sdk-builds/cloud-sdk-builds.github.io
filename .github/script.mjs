import {env} from "node:process";
import {writeFileSync,appendFileSync,renameSync} from "node:fs";
import {repos} from "./../docs/repos.mjs";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const urlpagedom = "https://cloud-sdk-builds.github.io/"
const __dirname = dirname(fileURLToPath(import.meta.url));
const sitemaploc = `${__dirname}/sitemap.xml`;
const owner = env.ORG_NAME;
const token = env.GITHUB_TOKEN;
const domain = "https://api.github.com";
const resource = {};

const headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${token}`,
    "X-GitHub-Api-Version": "2026-03-10"
}
const myregex = /sha384-[A-Za-z0-9+\/=]{64}/
const mypromises = [];
async function getreleases(repo,page=1){
    if (!resource[repo]) {
        resource[repo] = {};
    }
    let response = await fetch(`${domain}/repos/${owner}/${repo}/releases?page=${page}&per_page=100`, {
        "method": "GET",
        "headers": headers
    });
    if (!response.ok) {
        process.exit(1);
    }
    response = await response.json();
    for (const release of response) {
        const hash = release.body.match(myregex);
        if (!hash) {
            continue;
        }
        resource[repo][release.tag_name] = hash[0];
        appendFileSync(sitemaploc,
`   <url>
        <loc>https://${owner}.github.io/?sdk=${repo}&amp;version=${release.tag_name}</loc>
        <lastmod>${release.published_at}</lastmod>
        <changefreq>never</changefreq>
    </url>
`);
    }
    if (response.length === 100) {
        await getreleases(repo, page + 1);
    }else{
        if (Object.keys(resource[repo]).length === 0) {
            delete resource[repo];
        }
        return;
    }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
writeFileSync(sitemaploc, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${urlpagedom}</loc>
        <changefreq>daily</changefreq>
    </url>
`, "utf-8");

for (let i = 0; i < repos.length; i += 80) {
    const batch = repos.slice(i, i + 80);
    await Promise.all(batch.map(repo => getreleases(repo)));
    if (i + 80 < repos.length) {
        await sleep(10000);
    }
}

appendFileSync(sitemaploc, "</urlset>", "utf-8");
renameSync(sitemaploc, `${__dirname}/../docs/sitemap.xml`);
writeFileSync(`${__dirname}/../docs/packages.mjs`, "export const packages = " + JSON.stringify(resource, null, 0) + ";\nexport default packages;");