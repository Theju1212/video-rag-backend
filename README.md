# Video Comparison RAG Chatbot - Backend

## Overview

This backend powers a Retrieval-Augmented Generation (RAG) chatbot that compares a YouTube video and an Instagram Reel.

The system extracts transcripts and metadata, generates embeddings, stores vectors in Pinecone, and uses LangChain with Gemini to answer creator-focused questions.

---

## Features

* YouTube Transcript Extraction
* Instagram Reel Metadata Extraction
* Dynamic Metadata Processing
* Engagement Rate Calculation
* Transcript Chunking
* Embedding Generation
* Pinecone Vector Storage
* LangChain Retrieval Pipeline
* Conversational Memory
* Video Comparison
* Creator Improvement Recommendations

---

## Architecture

YouTube URL + Instagram URL

↓

Transcript & Metadata Extraction

↓

Chunking

↓

Embedding Generation

↓

Pinecone Vector Database

↓

LangChain Retrieval

↓

Gemini LLM

↓

Response Generation

---

## Tech Stack

### Backend

* Node.js
* Express.js

### LLM

* Gemini

### Orchestration

* LangChain

### Embeddings

* Hugging Face Embeddings

### Vector Database

* Pinecone

### Transcript Sources

* youtube-transcript
* instagram-url-direct

---

## Supported Analysis

### Video A

YouTube Video

### Video B

Instagram Reel

The chatbot can answer:

* What is the engagement rate of each video?
* Why did Video A perform better than Video B?
* Compare the hooks in the first few seconds.
* Suggest improvements for Video B.
* Who is the creator of Video B?

---

## Engagement Rate

Formula:

Engagement Rate = (Likes + Comments) / Views × 100

Note:

Instagram public extraction sources do not expose comment count, follower count, or upload date.

In a production environment, these fields would be retrieved through the Instagram Graph API.

---

## Scalability Considerations

Current Implementation

* Transcript chunking
* Vector retrieval using Pinecone
* Retrieval before generation
* Context-aware responses

Future Improvements

* Batch embedding generation
* Metadata caching
* Queue-based ingestion
* Redis caching
* Multi-tenant vector namespaces
* Official social platform APIs

---

## Installation

Install dependencies

npm install

Start development server

npm run dev

---

## Environment Variables

Create a .env file:

GEMINI_API_KEY=your_key

PINECONE_API_KEY=your_key

HUGGINGFACE_API_KEY=your_key

---

## API Endpoints

GET /analyze

Analyze YouTube video

GET /instagram

Analyze Instagram Reel

POST /compare

Compare Video A and Video B

POST /chat

RAG Chat Interface

---

## Author

Thejaswini Velvaluri
