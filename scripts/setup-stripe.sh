#!/bin/bash
# S.O.S — Stripe Setup Script
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: ./setup-stripe.sh <STRIPE_SECRET_KEY> <STRIPE_WEBHOOK_SECRET>"
  exit 1
fi
supabase secrets set STRIPE_SECRET_KEY="$1" --project-ref hgribqgyzzsxgyfvooaf
supabase secrets set STRIPE_WEBHOOK_SECRET="$2" --project-ref hgribqgyzzsxgyfvooaf
echo "✅ Stripe configured!"
