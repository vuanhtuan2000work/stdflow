# Supabase Database Setup

## Migration Files

This directory contains SQL migration files for setting up the StudyFlow database.

## Quick Start

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for project to be ready

### 2. Run Migration
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `migrations/001_initial_schema.sql`
3. Paste into SQL Editor
4. Click "Run" to execute

### 3. Verify Setup
After running migration, verify:
- ✅ All tables created (profiles, subjects, flashcards, etc.)
- ✅ RLS policies enabled
- ✅ Functions created (handle_new_user, user_has_role, etc.)
- ✅ Trigger created (on_auth_user_created)
- ✅ Default roles inserted (student, teacher, admin)

### 4. Setup Storage Buckets
1. Go to Storage → Create bucket
2. Create `avatars` bucket (public)
3. Create `attachments` bucket (public or private)

### 5. Configure OAuth (Optional)
1. Go to Authentication → Providers
2. Enable Google OAuth
3. Add Client ID and Secret
4. Add redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://your-domain.com/auth/callback`

## Migration File Structure

```
supabase/
  migrations/
    001_initial_schema.sql  # Initial database schema
  README.md                 # This file
```

## What Gets Created

### Tables
- `profiles` - User profiles
- `roles` - Role definitions
- `user_roles` - User role assignments
- `subjects` - Study subjects
- `flashcards` - Flashcards
- `study_sessions` - Study session history
- `notes` - User notes
- `classes` - Teacher classes
- `class_members` - Class enrollments
- `shared_flashcards` - Shared flashcards

### Security
- Row Level Security (RLS) enabled on all tables
- RLS policies for ownership and sharing
- Secure function definitions

### Functions
- `handle_new_user()` - Auto-create profile on signup
- `user_has_role()` - Check user role
- `generate_class_code()` - Generate unique class codes

### Views
- `users_with_roles` - Users with their roles
- `classes_with_stats` - Classes with member counts

## Troubleshooting

### Migration Fails
- Check if tables already exist (use `IF NOT EXISTS` in migration)
- Verify you have proper permissions
- Check Supabase logs for errors

### RLS Policies Not Working
- Verify RLS is enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
- Check policy definitions match your use case
- Test with authenticated user

### Trigger Not Firing
- Verify trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
- Check function exists: `SELECT * FROM pg_proc WHERE proname = 'handle_new_user';`
- Test by creating a new user

## Next Steps

After migration:
1. Get project URL and keys from Settings → API
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
3. Test authentication flow
4. Test database queries

