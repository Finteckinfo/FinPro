## Local env vars (Supabase)

The Supabase **dashboard** URL is not used as an API base. For this project, your Supabase **Project URL** is:

- **Project URL**: `https://haslirlxxyrllbaytwop.supabase.co`

Create a local env file (example name: `.env.local`) in the project root and set:

```bash
VITE_SUPABASE_URL=https://haslirlxxyrllbaytwop.supabase.co
VITE_SUPABASE_ANON_KEY=REPLACE_WITH_YOUR_SUPABASE_ANON_KEY
```

Optional (only if you run a separate FinERP backend server):

```bash
VITE_BACKEND_URL=http://localhost:5000
```


