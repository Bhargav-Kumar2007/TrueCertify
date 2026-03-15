# TrueCertify

Blockchain-inspired certificate issuance and verification with tamper-resistant hashing.

---

## Overview

TrueCertify helps institutions issue and verify certificates using a simple, secure workflow. Certificates are hashed locally (SHA-256), stored in Firebase Firestore, and verified by re-hashing the uploaded file and checking for a match.

The UI presents an IPFS/Polygon-style flow for clarity, while the current storage and verification are handled via Firestore.

---

## Problem

Fake or altered certificates are increasingly common across education and professional training. Manual verification is slow, inconsistent, and easy to bypass.

---

## Solution

TrueCertify provides a fast, tamper-resistant verification flow:

1. Upload a certificate.
2. Generate a SHA-256 hash locally.
3. Store the record in Firestore with issuer, course, and validity data.
4. Verify later by re-uploading the certificate and matching the hash.

Duplicate issuance is blocked: if the hash already exists, issuance stops and an alert is shown.

---

## Key Features

- Issue certificates with custom issuer, course, and expiry date.
- SHA-256 hashing in the browser for tamper resistance.
- Duplicate issuance prevention by hash check.
- Instant verification by re-hashing and lookup.
- Verification result shows issuer, course, validity, and blockchain-style metadata.

---

## Verification Results

- Verified: Hash exists and data is returned.
- Failed: No matching hash found.
- Expired: Issued but beyond expiry date.

---

## Tech Stack

- Frontend: React, TailwindCSS, Motion
- Backend: Node.js, Express (dev server)
- Data: Firebase Firestore
- Crypto: Web Crypto API (SHA-256)

---

## Project Structure

```
truecertify/
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   └── lib/
├── server.ts
├── index.html
├── firebase-applet-config.json
├── firebase-blueprint.json
└── README.md
```

---

## Getting Started

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open the app at `http://localhost:3000`

---

## Future Improvements

- Real blockchain anchoring for hashes.
- IPFS pinning for certificate files.
- Role-based issuer access controls.
- Batch issuance and verification.

---

## License

MIT License
