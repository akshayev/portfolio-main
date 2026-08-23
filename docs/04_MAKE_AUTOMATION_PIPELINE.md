# 04. Make.com Data Automation & Sanity Webhook Pipeline Runbook

## Executive Overview
This runbook documents the zero-friction data automation pipeline connecting GitHub repository releases, Make.com integration scenarios, Sanity.io headless CMS, and Next.js 15 App Router edge revalidation.

```
┌─────────────────────────┐     1. Release Tag      ┌─────────────────────────┐
│   GitHub Repository     │ ──────────────────────> │    Make.com Scenario    │
│ (e.g., release-portfolio│                         │ (3-Step Automation Flow)│
└─────────────────────────┘                         └────────────┬────────────┘
                                                                 │ 2. Mutate Document
                                                                 ▼
┌─────────────────────────┐     4. Revalidate Tag   ┌─────────────────────────┐
│ Next.js 15 App Router   │ <────────────────────── │      Sanity.io CMS      │
│  (/api/revalidate)      │   3. Webhook Trigger    │   (Production Dataset)  │
└─────────────────────────┘                         └─────────────────────────┘
```

---

## Part 1: Make.com 3-Step Scenario Architecture

### Step 1: Trigger — Watch GitHub Tags / Releases
* **Module Name**: GitHub -> Watch Tags / Releases
* **Connection**: GitHub OAuth / Personal Access Token (`repo`, `read:packages` scope)
* **Repository**: `akshayev/portfolio-main` (or designated project repository)
* **Filter Rule**: 
  * Only trigger when tag name starts with `release-` or matches pattern `release-portfolio`
* **Outputs**:
  * `tag_name` (e.g., `release-portfolio-v1.2.0`)
  * `release_title`
  * `release_body` (contains markdown case study details)
  * `target_commitish`
  * `published_at`

### Step 2: Action — Format & Transform Data
* **Module Name**: Tools / JSON Parser & Text Aggregator
* **Transformation Logic**:
  * Parse `release_body` to extract structured JSON or key sections:
    * `title`: Extracted from release name or repository name.
    * `slug`: Formatted as kebab-case string (`title.toLowerCase().replace(/ /g, '-')`).
    * `tagline`: First line of release description.
    * `techStack`: Parsed string array (e.g., `["Next.js 15", "Sanity.io", "Make.com", "Tailwind CSS v4"]`).
    * `problemStatement`: Section under `## Problem Statement`.
    * `architecture`: Section under `## Architecture`.
    * `metrics`: Bullet points extracted from `## Key Metrics`.
    * `githubUrl`: Repository HTML URL.
    * `liveUrl`: Production application deployment URL.
* **Output Payload**: Structured JSON matching the `project` schema in `src/sanity/schemaTypes/projectType.ts`.

### Step 3: Action — Create/Update Sanity Document via API
* **Module Name**: HTTP -> Make an API Request
* **URL**: `https://{{SANITY_PROJECT_ID}}.api.sanity.io/v2024-01-01/data/mutate/{{SANITY_DATASET}}`
* **Method**: `POST`
* **Headers**:
  * `Content-Type`: `application/json`
  * `Authorization`: `Bearer {{SANITY_API_WRITE_TOKEN}}`
* **Body (Mutations Payload)**:
  ```json
  {
    "mutations": [
      {
        "createOrReplace": {
          "_id": "project-{{slug}}",
          "_type": "project",
          "title": "{{title}}",
          "slug": {
            "_type": "slug",
            "current": "{{slug}}"
          },
          "tagline": "{{tagline}}",
          "techStack": {{techStackArray}},
          "problemStatement": "{{problemStatement}}",
          "architecture": "{{architecture}}",
          "metrics": {{metricsArray}},
          "githubUrl": "{{githubUrl}}",
          "liveUrl": "{{liveUrl}}"
        }
      }
    ]
  }
  ```

---

## Part 2: Sanity Webhook Setup for Next.js Cache Purging

Whenever a document is created or updated in Sanity (manually via Studio or automatically via Make.com), Sanity triggers a webhook to purge Next.js 15's data cache tag (`projects`).

### Webhook Configuration Steps (Sanity Management Dashboard)
1. Go to [Sanity Management Console](https://www.sanity.io/manage) and select your Project ID.
2. Navigate to **API** -> **Webhooks**.
3. Click **Create Webhook**.
4. Configure the fields:
   * **Name**: `Next.js 15 Portfolio Revalidation`
   * **URL**: `https://<your-domain.com>/api/revalidate`
   * **Dataset**: `production`
   * **Trigger on**: Create, Update, Delete
   * **Filter**: `_type == "project"`
   * **HTTP Method**: `POST`
   * **HTTP Headers**:
     * `x-sanity-secret`: `<SANITY_REVALIDATE_SECRET_VALUE>`
   * **API Version**: `v2024-01-01`
5. Save Webhook.

---

## Part 3: Environment Variables Checklist

Ensure the following variables are defined in your deployment environment (`.env.local` / Vercel):

```env
NEXT_PUBLIC_SANITY_PROJECT_ID="<your-project-id>"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-01-01"
SANITY_REVALIDATE_SECRET="<random-secure-secret-token>"
```

---

## Part 4: Local & Production Testing Verification

### 1. Test Revalidation API Endpoint
Run the following curl command against your local server or production URL:

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "x-sanity-secret: <SANITY_REVALIDATE_SECRET_VALUE>" \
  -H "Content-Type: application/json" \
  -d '{"_type": "project", "_id": "test-project"}'
```

**Expected Response**:
```json
{
  "revalidated": true,
  "now": 1771714800000,
  "tag": "projects",
  "documentId": "test-project",
  "documentType": "project",
  "message": "Cache tag 'projects' successfully revalidated"
}
```

---

*Runbook generated for Sub-Phase 4.2 Data Automation & CMS Integration.*
