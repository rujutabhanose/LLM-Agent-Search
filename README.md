# LLM Browser Agent POC

## 1. Prerequisites
- Get a Google Custom Search API Key and Search Engine ID (CX, see Google Custom Search docs) [17]
- Get an AI Pipe Token (https://aipipe.org/login)

## 2. How to run
- Download all files to a folder.
- In `tools.js`, set your Google Custom Search API key and CX.
- Open `index.html` in your browser.

## 3. How it works
- User selects model/token.
- All conversation/toll calls happen in browser.
- Supported tools: Google Search, code execution, LLM via AI Pipe.
- Errors show in Bootstrap alerts.

## 4. Customization
- Add/remove providers in `bootstrap-llm-provider.js`.
- Extend tools in `tools.js`.