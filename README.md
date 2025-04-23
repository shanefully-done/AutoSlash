# AutoSlash: Daily Web Scraper and Publisher

A JavaScript (Bun) application that automates content extraction from a web page, processes it with Gemini (Google’s LLM), and publishes the result to SlashPage. Scheduled to run daily via GitHub Actions.

# Overview

This application performs the following tasks:

1. Scrapes a specified webpage (e.g., Product Hunt)
2. Passes the scraped content to Gemini for summarization or transformation
3. Publishes the processed result to a blog platform (SlashPage)
4. Runs daily using GitHub Actions

# Technology Stack

- **Runtime:** [Bun](https://bun.sh/)
- **Language:** JavaScript
- **LLM Integration:** Google Gemini API
- **Publishing Platform:** SlashPage (via provided API)
- **Scheduler:** GitHub Actions

# Features

- Customizable source URL
- LLM prompt tuning for Gemini
- SlashPage publishing with templated formatting
- Configurable run schedule via GitHub Actions
- Error logging and fallback handling

# Components

## Web Scraper

- **Target Site:** Product Hunt (or configurable URL)
- **Tooling:** Native fetch + DOM parsing (e.g., `bun:dom` or `cheerio`)
- **Output:** Structured JSON (e.g., title, description, URL, rank)

## Gemini Processor

- **Input:** Scraped JSON content
- **API:** Google Gemini REST API
- **Prompt:** Custom prompt for summarizing or reformatting content
- **Output:** Text content suitable for blogging

## SlashPage Publisher

- **Authentication:** API key (stored as GitHub Secret)
- **API Endpoint:** Provided by SlashPage
- **Payload:** Title, content body (HTML or Markdown), optional metadata (tags, date)

## Scheduler (GitHub Actions)

- **Trigger:** Cron (e.g., `0 9 * * *` for 9 AM UTC daily)
- **Secrets:** Stored in GitHub (API keys, Gemini credentials)
- **Job Steps:**
    - Checkout code
    - Install Bun
    - Run script

# Environment Variables

| Variable Name | Description |
| --- | --- |
| `GEMINI_API_KEY` | API key for accessing Gemini |
| `SLASHPAGE_API_KEY` | API key for publishing to SlashPage |
| `TARGET_URL` | URL to scrape (e.g., Product Hunt) |
