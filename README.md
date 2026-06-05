# Écouter

#### Video Demo: https://www.youtube.com/watch?v=A4_MpmUmpbU
#### Description:

Écouter means "to listen" in French.

This project is a French language listening app, and the goal is to help learners get better at understanding spoken French.

The problem I wanted to solve is that language learners often recognise words when they see them written down, but struggle to hear them clearly in natural speech. Écouter is focused on developing this specific skill, using repetition to help learners connect words they already know with their spoken form, rhythm, and boundaries in French.

## How it works

The sentence library currently contains around 22,000 audio files, made from 5,500 French-English sentence pairs, with four audio versions for each pair: French female, French male, English female, and English male. The sentences are grouped into sets of 100 and ordered by character count, so the user can browse the library, choose a range, play all sentences in that range, or select individual sentences.

By default, the app plays the French audio several times with pauses in between, then plays the English translation, then returns to French. This listening profile is customisable: users can choose which language and voice variant to use, add pauses, reorder the sequence, or use presets. The purpose is repeated exposure to hearing the same sentence enough times to start noticing sounds, word boundaries, and familiar words.

The text is hidden by default, but the user can reveal the French text or English translation when they need to.

There is also a settings screen for theme, default quick-run size, and automatic text reveal options.


## Sentence And Audio Data

Écouter uses a processed sentence dataset. Each sentence has:

- an ID
- French text
- English text
- a character count
- public audio URLs

The sentence ID is important because it follows the sentence through the app.

```txt
sentence JSON
  -> processed app data
  -> audio URL fields
  -> frontend player
```

The audio has been generated using a local text-to-speech LLM, and is hosted on Cloudflare R2. 

The backend serves the sentence metadata at runtime, and the frontend plays audio directly from the stored Cloudflare URLs.

## Runtime Data Flow

The processed runtime data is:

```txt
data/processed/sentences.app.json
```

That processed file reads while the app is running. It contains the French text, English text, sentence position, character length, and Cloudflare audio URLs.

```txt
sentences.app.json
  -> backend service
  -> backend controller
  -> API response
  -> frontend hook
  -> player UI
```

For audio:

```txt
sentence audio URL
  -> listening profile chooses the current step
  -> browser Audio API plays the Cloudflare file
```

## Tech Stack

- React
- TypeScript
- Vite
- Express
- JSON data files
- Cloudflare R2

## Backend API

```txt
GET /health
GET /api/sentences
GET /api/sentence-ranges
GET /api/sentences/:sentenceId
```

Examples:

```txt
/api/sentences?page=1&limit=100
/api/sentences?startPosition=37&limit=20
```

## Setup

Install dependencies:

```bash
npm install
```

Run frontend and backend together:

```bash
npm run dev
```

Or separately:

```bash
npm run dev:backend
npm run dev:frontend
```

Run checks:

```bash
npm run typecheck
npm run test:backend
npm run build
```

## AI Declaration

I used AI throughout the development of Écouter. AI helped me plan the app and the data flow, debug errors, write tests, and refactor the code after the WAV files moved from a local directory to Cloudflare R2 hosting. AI helped to write the scripts that generate the processed sentence data and audio manifests. It also helped implement and refine the CSS used across the app’s components.

Although it is separate from this repository, a Python voice-generation project was used to create Écouter’s audio, and this relied heavily on AI. I used a local text-to-speech model to generate the voice files, and AI assisted with tuning the voice generation settings, writing supporting scripts, validating sentence data, organising the workflow, and creating a repeatable process for producing and uploading audio files to Cloudflare R2. This required significant trial and error on my part and was a good learning experience working with local LLMs.

This process also involved a substantial amount of data management. Across the four voice versions, the project produced more than 22,000 WAV files, and the sentence IDs, filenames, audio files, JSON manifests, and Cloudflare uploads all needed to remain consistent across the pipeline. One interesting problem I encountered was designing an indexing system that kept the sentences ordered by character count while preserving stable IDs when audio files were added, regenerated, or removed. 

The app itself does not call AI services, as the sentence data and audio files are prepared ahead of time. The frontend plays pre-generated audio from the stored Cloudflare R2 URLs.

## Sentence Data Attribution

The French and English sentence data used in Écouter comes from the Tatoeba Project.

Tatoeba sentence data is released under the Creative Commons Attribution 2.0 France license (CC BY 2.0 FR).
