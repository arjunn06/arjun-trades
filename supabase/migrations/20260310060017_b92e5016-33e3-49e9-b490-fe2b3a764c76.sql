
-- Create role enum
create type public.app_role as enum ('admin', 'user');

-- Create user_roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security definer function for role checking
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- RLS for user_roles: users can read their own roles
create policy "Users can read own roles"
on public.user_roles for select
to authenticated
using (user_id = auth.uid());

-- Create blogs table
create table public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  cover_image_url text,
  author_id uuid references auth.users(id) on delete cascade not null,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blogs enable row level security;

-- Everyone can read published blogs
create policy "Anyone can read published blogs"
on public.blogs for select
using (published = true);

-- Admins can do everything with blogs
create policy "Admins can insert blogs"
on public.blogs for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update blogs"
on public.blogs for update
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete blogs"
on public.blogs for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Admins can also read all blogs (including unpublished)
create policy "Admins can read all blogs"
on public.blogs for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for blog images
insert into storage.buckets (id, name, public) values ('blog-images', 'blog-images', true);

create policy "Anyone can read blog images"
on storage.objects for select
using (bucket_id = 'blog-images');

create policy "Admins can upload blog images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'blog-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete blog images"
on storage.objects for delete
to authenticated
using (bucket_id = 'blog-images' and public.has_role(auth.uid(), 'admin'));
