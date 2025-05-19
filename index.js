import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { load } from "cheerio";

const { GEMINI_API_KEY, SLASHPAGE_API_KEY, TARGET_URL } = process.env;

if (!GEMINI_API_KEY || !SLASHPAGE_API_KEY || !TARGET_URL) {
	console.error(
		"Missing one or more required environment variables: GEMINI_API_KEY, SLASHPAGE_API_KEY, TARGET_URL"
	);
	process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function scrape(url) {
	console.log(`Scraping ${url}...`);
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
	}
	const html = await res.text();
	return { html };
}

async function generateContent(data) {
	console.log("Generating content with Gemini...");
	const prompt = `# 🧠 SEO Blog Writing Guideline: Daily SaaS Product Reviews (Plain Text Format)

Use this guide to craft engaging, SEO-optimized blog posts reviewing new SaaS products discovered daily. Your writing must follow the structure, tone, and format below. At the end of the guideline, there will be a HTML content block that you will use to generate the blog post.

## ✅ Goal
Generate clear, concise, and SEO-friendly blog posts that:
- Introduce and explain new SaaS products  
- Provide helpful, relevant commentary  
- Encourage exploration through direct product links  
- Rank well in search engines (no mention of source websites)  

---

## ✍️ Writing Rules

- **DO NOT use markdown formatting** — all responses must be in plain text.  
- **DO NOT include a title in your response.**  
- **DO NOT mention Product Hunt** or any discovery platform.  
- Include links as plain URLs, on their own line below the product name.  
- **All URLs start with 'https://www.producthunt.com/'.**
- **DO NOT make up your own URLs.**
- URLs are provided in the source.  
- Use emojis as shown in the structure to help segment the content.  
- Use line breaks to separate each section clearly.  
- Keep a tone that is **engaging, informative, and curious**.  
- Each product review should be **2–4 sentences**.  
- Pick top 5 tools.  

---

## 🧩 Suggested Structure

\`\`\`
🚀 Product Name  
https://www.producthunt.com/product-name-1  
Briefly explain what the product does, who it’s for, and what makes it stand out.  
Mention any unique features or use cases.  

🔍 Product Name  
https://www.producthunt.com/product-name-2  
Explain the product in simple terms.  
Highlight any interesting value proposition or differentiator.  

🧠 Product Name  
https://www.producthunt.com/product-name-3  
Describe how this tool could benefit a specific audience or solve a particular problem.  
\`\`\`

---

## SEO & Readability Tips

- Include keywords like “SaaS tools”, “AI software”, “startup apps”, “productivity tools” where appropriate.  
- Vary sentence structure for rhythm and flow.  
- Use consistent spacing and clean formatting for easier reading.  
- Prioritize clarity, relevance, and real-world application.  

---

# HTML Content

${JSON.stringify(data)}`;
	const response = await ai.models.generateContent({
		model: "gemini-2.0-flash-lite",
		contents: prompt,
	});
	console.log("Finished generating content...");
	return response.text;
}

async function publish(title, body) {
	console.log("Publishing to SlashPage...");
	const webhookUrl = `https://slashpage.com/api-webhook/note/ixtj-dev/1q3vdn2pjv43p2xy49pr/${SLASHPAGE_API_KEY}`;
	const payload = { title, body };
	const res = await fetch(webhookUrl, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(
			`Failed to publish: ${res.status} ${res.statusText} - ${errorText}`
		);
	}
	console.log("Published successfully!");
}

async function main() {
	try {
		const data = await scrape(TARGET_URL);
		const content = await generateContent(data);
		const date = new Date().toISOString().split("T")[0];
		const title = `Daily Product News - ${date}`;
		await publish(title, content);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
}

await main();
