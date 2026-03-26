```markdown
<!--
  Open Graph Meta Tags for Social Sharing
  <meta property="og:title" content="Pig Latin Email Server 🐷✉️" />
  <meta property="og:description" content="An unhinged Node.js email server that replies to every email in Pig Latin. Because professionalism is overrated." />
  <meta property="og:image" content="https://repository-images.githubusercontent.com/piglatin-email-server/banner.png" />
  <meta property="og:url" content="https://github.com/yourusername/piglatin-email-server" />
  <meta property="og:type" content="website" />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content="Pig Latin Email Server 🐷✉️" />
  <meta property="twitter:description" content="Every email you send gets a Pig Latin reply. No exceptions. No mercy." />
  <meta property="twitter:image" content="https://repository-images.githubusercontent.com/piglatin-email-server/banner.png" />
-->

<div align="center">

# 🐷✉️ piglatin-email-server ✉️🐷

### *Ethay ostmay unnecessarilywayomplexcay emailway erversay everyay uiltbay.*

> Your emails deserve to be mocked. This server does exactly that — in Pig Latin.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)](./CONTRIBUTING.md)
[![Chaos Level](https://img.shields.io/badge/Chaos%20Level-Maximum-red?style=for-the-badge)]()
[![Emails Ruined](https://img.shields.io/badge/Emails%20Ruined-∞-purple?style=for-the-badge)]()

<br />

```
  ___________________
 |  📨 Incoming Email |
 |  "Hello, I'd like |
 |   to schedule a   |
 |     meeting."     |
 |___________________|
          |
          ▼
    🐷 PIG LATIN
      ENGINE 🐷
          |
          ▼
  ___________________
 |  📤 Outgoing Reply |
 |  "Ellohay, I'dway |
 |  ikelay otay      |
 |  eduleschay away   |
 |  eetingmay."      |
 |___________________|
```

<br />

**You send a serious email. You get back nonsense. That's the deal.**

[Getting Started](#-getting-started) •
[How It Works](#-how-it-works) •
[API Endpoints](#-api-endpoints) •
[Deployment](#-deployment) •
[Contributing](#-contributing)

</div>

---

## 📖 What Is This?

**piglatin-email-server** is a fully functional Node.js email server that intercepts incoming emails (via SMTP or webhook), translates the *entire* message body into Pig Latin, and fires back an automated reply to the sender. It is professional-grade infrastructure pointed squarely at an absurd goal.

Imagine your boss emails you asking for Q3 projections. Now imagine they receive this in response:

> *"Ankthay ouyay orfay ouryay emailway. Ouryay equestreay ashay eenbay eceiveday andway isway eingbay ocessedpray. Easplay expectway away esponsereay inway 3-5 usinessbay aysday. Ustjay iddingkay — isthay isway igpay atinlay."*

That's what this does. **No exceptions. No mercy. No unsubscribe link.**

---

## ✨ Features

| Feature | Description |
|---|---|
| 📥 **Dual Ingestion** | Accepts emails via both SMTP (port 2525) and HTTP webhook — your choice of chaos delivery |
| 🐷 **Industrial-Grade Pig Latin Engine** | Handles contractions, punctuation, capitalization, and edge cases like "rhythm" (ythmrhay? We debate this internally.) |
| 📤 **Auto-Reply System** | Automatically sends a fully formatted Pig Latin response back to the original sender |
| 🧵 **Thread Preservation** | Maintains `In-Reply-To` and `References` headers so your Pig Latin reply shows up *in the same email thread* |
| 📎 **Attachment Passthrough** | Attachments are re-attached to the reply untouched — because translating a PDF to Pig Latin is a problem for v2 |
| 🎨 **HTML Email Support** | Parses and translates HTML email bodies while preserving formatting, links, and images |
| 📊 **Request Logging** | Full structured logging with [pino](https://github.com/pinojs/pino) so you can audit exactly how much chaos you've caused |
| 🛡️ **Rate Limiting** | Configurable rate limiting so you don't accidentally DDoS someone's inbox with oink-speak |
| 🏥 **Health Checks** | `/health` endpoint for uptime monitoring, because even chaos needs observability |
| 🐳 **Docker Ready** | Dockerfile and docker-compose included for one-command deployment |

---

## 🧠 How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        ARCHITECTURE                             │
│                                                                 │
│  ┌──────────┐     ┌──────────────┐     ┌────────────────────┐  │
│  │  Sender  │────▶│  Ingestion   │────▶│  Pig Latin Engine  │  │
│  │  (Email) │     │  Layer       │     │                    │  │
│  └──────────┘     │              │     │  • Tokenization    │  │
│                   │  • SMTP      │     │  • Consonant       │  │
│                   │    (port     │     │    cluster detect   │  │
│                   │     2525)    │     │  • Suffix append    │  │
│                   │  • Webhook   │     │  • Case matching    │  │
│                   │    (POST     │     │  • Punctuation      │  │
│                   │     /inbound)│     │    preservation     │  │
│                   └──────┬───────┘     └─────────┬──────────┘  │
│                          │                       │              │
│                          ▼                       ▼              │
│                   ┌──────────────┐     ┌────────────────────┐  │
│                   │  Email       │     │  Reply Composer     │  │
│                   │  Parser      │────▶│                    │  │
│                   │  (mailparser)│     │  • Thread headers   │  │
│                   └──────────────┘     │  • Subject prefix   │  │
│                                       │  • Signature block   │  │
│                                       └─────────┬──────────┘  │
│                                                  │              │
│                                                  ▼              │
│                                        ┌────────────────────┐  │
│                                        │  SMTP Transport     │  │
│                                        │  (nodemailer)       │  │
│                                        │                     │  │
│                                        │  📤 Reply sent to   │  │
│                                        │     original sender │  │
│                                        └────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### The Pipeline

1. **Email arrives** — via SMTP on port 2525 or as a POST request to `/api/v1/inbound` (compatible with SendGrid, Mailgun, and Postmark inbound webhooks).

2. **Parsing** — The raw email is parsed using [mailparser](https://nodemailer.com/extras/mailparser/). We extract the sender, subject, plain text body, HTML body, and attachments.

3. **Translation** — The Pig Latin engine processes every word in the email body:
   - Words starting with a vowel → append **"way"** (*email → emailway*)
   - Words starting with a consonant → move consonant cluster to end, append **"ay"** (*string → ingstray*)
   - Capitalization is preserved (*Hello → Ellohay*)
   - Punctuation stays in place (*meeting? → eetingmay?*)
   - URLs, email addresses, and code blocks are left untouched (we're chaotic, not *monsters*)

4. **Reply Composition** — A reply email is built with:
   - Subject: `Re: [Original Subject]` (in Pig Latin, naturally)
   - Proper `In-Reply-To` / `References` headers for threading
   - A delightful signature block
   - Original attachments re-attached

5. **Dispatch** — The reply is sent via SMTP using [nodemailer](https://nodemailer.com/) through your configured mail provider.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (or yarn/pnpm — we don't judge)
- An **SMTP provider** for sending replies (Gmail, SendGrid, Mailgun, AWS SES, etc.)
- A healthy disregard for professional email etiquette

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/piglatin-email-server.git

# Navigate into the project
cd piglatin-email-server

# Install dependencies
npm install

# Copy the example environment file
cp .env.example .env

# Edit .env with your actual configuration (see below)
nano .env

# Run database migrations (SQLite for email logging)
npm run migrate

# Start the server
npm run dev
```

You should see:

```
🐷 piglatin-email-server is running!
   → HTTP webhook listener: http://localhost:3000
   → SMTP listener: smtp://localhost:2525
   → Health check: http://localhost:3000/health
   
   Eadyray otay uinray omesay emailsway! 🐷
```

### Quick Test

```bash
# Send a test email via the webhook endpoint
curl -X POST http://localhost:3000/api/v1/inbound \
  -H "Content-Type: application/json" \
  -d '{
    "from": "boss@company.com",
    "to": "piglatin@yourdomain.com",
    "subject": "Q3 Budget Review Meeting",
    "text": "Hi team, please review the attached budget spreadsheet before our meeting on Thursday. Let me know if you have any questions. Thanks, Margaret"
  }'
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root with the following configuration:

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3000` | HTTP server port for webhook ingestion |
| `SMTP_LISTEN_PORT` | No | `2525` | Port for the inbound SMTP server |
| `SMTP_HOST` | **Yes** | — | Outbound SMTP host (e.g., `smtp.gmail.com`) |
| `SMTP_PORT` | No | `587` | Outbound SMTP port |
| `SMTP_USER` | **Yes** | — | SMTP username / email for authentication |
| `SMTP_PASS` | **Yes** | — | SMTP password or app-specific password |
| `SMTP_SECURE` | No | `false` | Use TLS for outbound SMTP (`true` for port 465) |
| `FROM_NAME` | No | `Pig Latin Email Server 🐷` | Display name on outgoing replies |
| `FROM_EMAIL` | **Yes** | — | Email address replies are sent from |
| `WEBHOOK_SECRET` | No | — | Shared secret for webhook signature verification |
| `RATE_LIMIT_MAX` | No | `100` | Max replies per sender per hour |
| `RATE_LIMIT_WINDOW` | No | `3600000` | Rate limit window in milliseconds |
| `LOG_LEVEL` | No | `info` | Logging level (`debug`, `info`, `warn`, `error`) |
| `PRESERVE_URLS` | No | `true` | Skip Pig Latin translation for URLs |
| `PRESERVE_CODE_BLOCKS` | No | `true` | Skip translation inside code blocks |
| `SIGNATURE_ENABLED` | No | `true` | Append the Pig Latin signature to replies |
| `NODE_ENV` | No | `development` | Environment (`development`, `production`, `test`) |

<details>
<summary>📄 Example <code>.env</code> file</summary>

```env
PORT=3000
SMTP_LISTEN_PORT=2525

# Outbound SMTP (example: Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-pig-latin-server@gmail.com
SMTP_PASS=your-app-specific-password
SMTP_SECURE=false

# Reply identity
FROM_NAME=Pig Latin Email Server 🐷
FROM_EMAIL=your-pig-latin-server@gmail.com

# Security
WEBHOOK_SECRET=your-super-secret-webhook-key

# Rate limiting
RATE_LIMIT_MAX=50
RATE_LIMIT_WINDOW=3600000

# Behavior
LOG_LEVEL=info
PRESERVE_URLS=true
PRESERVE_CODE_BLOCKS=true
SIGNATURE_ENABLED=true

NODE_ENV=production
```

</details>

---

## 📬 Example Input / Output

### Incoming Email

```
From:    margaret.chen@bigcorp.com
To:      piglatin@yourdomain.com
Subject: Q3 Budget Review Meeting

Hi team,

Please review the attached budget spreadsheet before our meeting on Thursday.
I need everyone's input on the marketing allocation — we're currently 15% over
budget and need to find cuts somewhere.

Also, don't forget to submit your expense reports by Friday. The finance
department is getting restless.

Let me know if you have any questions.

Thanks,
Margaret
```

### Outgoing Reply

```
From:    Pig Latin Email Server 🐷 <piglatin@yourdomain.com>
To:      margaret.chen@bigcorp.com
Subject: Re: Q3 Udgetbay Eviewray Eetingmay

Ihay eamtay,

Easeplay eviewray ethay attachedway udgetbay eadsheetspray eforebay ouray
eetingmay onway Ursdaythay. Iway eednay everyone'sway inputway onway ethay
arketingmay allocationway — eway'eray urrentlycay 15% overway udgetbay andway
eednay otay indfay utscay omewheresay.

Alsoway, on'tday orgetfay otay ubmitsay ouryay expenseway eportsray ybay
Idayfray. Ethay inancefay epartmentday isway ettinggay estlessray.

Etlay emay owknay ifway ouyay avehay anyway estionsquay.

Anksthay,
Argaretmay

—
🐷 Isthay emailway ashay eenbay anslatedtray otay Igpay Atinlay