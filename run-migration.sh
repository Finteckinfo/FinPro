#!/bin/bash

# Supabase Database Migration Helper
# This script helps you run the Telegram messaging migration

echo "=== Supabase Migration Helper ==="
echo ""
echo "To run the migration, you have two options:"
echo ""
echo "OPTION 1 (Recommended): Use Supabase SQL Editor"
echo "  1. Go to: https://supabase.com/dashboard/project/haslirlxxyrllbaytwop/sql"
echo "  2. Click 'New Query'"
echo "  3. Copy the contents of migrations/add_telegram_messaging.sql"
echo "  4. Paste and click 'Run'"
echo ""
echo "OPTION 2: Use psql command"
echo "  1. Go to: https://supabase.com/dashboard/project/haslirlxxyrllbaytwop/settings/database"
echo "  2. Copy the 'Connection string' under 'Connection pooling'"
echo "  3. Replace [YOUR-PASSWORD] with your database password"
echo "  4. Run the command below with your connection string:"
echo ""
echo "  psql 'postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres' -f migrations/add_telegram_messaging.sql"
echo ""
echo "Note: The connection string format is:"
echo "  postgresql://postgres.haslirlxxyrllbaytwop:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres"
echo ""
