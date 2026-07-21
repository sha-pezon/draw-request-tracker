# Pezon Construction Draw Tracker - Build Summary

## Purpose

The Pezon Construction Draw Tracker was built to help the team manage construction draw requests in one shared workspace. The tool tracks contractor updates, invoices, photos, eBudget line items, inspection status, lender requirements, and remaining holdback balances.

The goal is to make draw requests cleaner, easier to review, and easier to prepare before submission.

## What Was Built

A web-based draw request tracker with:

- Company login for Pezon Properties users
- Shared Supabase database
- Team activity tracking
- Draw readiness dashboard
- Editable draw request records
- Budget comparison
- Lender requirement checklist
- Photo evidence section
- PDF, Word document, and image upload
- AI document/photo extraction
- Draw summary report download
- Employee user guide PDF

## Main Technologies

- Frontend: HTML, CSS, JavaScript
- Hosting: Vercel
- Database and login: Supabase
- Source control: GitHub
- AI extraction: OpenAI API through a secure Vercel server endpoint

## How Access Works

Employees sign in with an `@pezonproperties.com` email address. Supabase manages user accounts, authentication, and sessions.

The tracker saves each user’s name, email, and activity so the team can see who made edits and when.

## How Shared Data Works

The app uses Supabase as the shared database. Everyone in the company sees the same tracker data after signing in.

The current version stores:

- The main project summary
- Draw request records
- Team activity logs
- User profile records

Row Level Security is enabled in Supabase so only authenticated Pezon Properties users can access the shared tracker data.

## How AI Extraction Works

When a user uploads a PDF, Word document, or image, the file is sent to a secure Vercel server function at:

`/api/extract-draw`

That server function sends the file to OpenAI for analysis. The AI attempts to extract:

- Contractor name
- Property name
- Draw number or milestone
- Requested amount
- Approved amount/date
- Submitted construction budget
- Remaining budget
- Completion percentage
- Inspection status
- Holdback amounts
- Missing documentation
- Budget line items
- Photo evidence notes
- Follow-up tasks

The extracted information is placed into an editable draw record. Employees should still review the AI output before using it for lender submission.

## Upload Design

There are two upload locations:

1. `Upload doc/photo` at the top of the app
   - Used to import a source file and create a new draw draft.

2. `Add photo` inside the Photo Evidence section
   - Used to attach photo evidence to the selected draw request.

This keeps document importing and photo evidence organized separately.

## Deployment Flow

The project code is stored in GitHub:

`sha-pezon/draw-request-tracker`

Vercel is connected to the GitHub repository. When updates are pushed to GitHub, Vercel redeploys the website.

Supabase stores the shared data and authentication settings.

## Required Environment Variables

Vercel needs these environment variables:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `COMPANY_DOMAIN=pezonproperties.com`
- `OPENAI_API_KEY`
- Optional: `OPENAI_MODEL=gpt-5.6`

The OpenAI API key stays on the server and is never exposed in browser code.

## Current Demo Property

The tracker includes a test/demo property:

- Property: 3606 Springer Street
- Contractor: Ignite Construction
- Submitted construction budget: $92,525.00
- Approved amount: $10,773.77
- Approved date: July 8, 2026
- Remaining budget: $13,319.14
- Expected next draw request date: July 29, 2026

## Long-Term Improvements

Good future improvements would be:

- Real file storage for uploaded documents and photos
- Admin roles and permissions
- Email reminders for next draw dates
- Better relational database tables for reporting
- Direct Gmail/Outlook integration for draw reminder emails
- Better audit history per field
- Export to lender-ready PDF package

## Summary

This tool was built as a shared company web app using Vercel, GitHub, Supabase, and OpenAI. It gives Pezon Properties one place to track draw requests, review documentation, compare against budgets, manage photo evidence, and identify what is ready or missing before submission.
