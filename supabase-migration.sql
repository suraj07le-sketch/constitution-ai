-- =============================================================
-- Supabase SQL Migration for Constitution AI
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- =============================================================

-- 1. Enable the pgvector extension
create extension if not exists vector;

-- 2. Create the table to store constitution chunks with embeddings
create table if not exists constitution_chunks (
  id text primary key,
  content text not null,
  embedding vector(1536),
  chunk_index integer not null,
  start_char integer not null,
  end_char integer not null,
  approximate_articles text,
  created_at timestamptz default now()
);

-- 3. Create an HNSW index for fast cosine similarity searches
create index if not exists constitution_chunks_embedding_idx
  on constitution_chunks
  using hnsw (embedding vector_cosine_ops);

-- 4. Create the RPC function used by the app for semantic search
create or replace function match_chunks(
  query_embedding vector(1536),
  match_count int default 5
)
returns table (
  id text,
  content text,
  chunk_index integer,
  approximate_articles text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    cc.id,
    cc.content,
    cc.chunk_index,
    cc.approximate_articles,
    1 - (cc.embedding <=> query_embedding) as similarity
  from constitution_chunks cc
  order by cc.embedding <=> query_embedding
  limit match_count;
end;
$$;
