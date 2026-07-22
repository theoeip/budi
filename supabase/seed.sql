-- BUDI Seed Data
-- This file contains development seed data.
-- WARNING: Do not use in production.

-- Seed schools
INSERT INTO schools (id, name, slug, address, phone, email)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'SMA Negeri 1 Jakarta', 'sman1-jkt', 'Jl. Merdeka No. 1, Jakarta', '021-12345678', 'info@sman1-jkt.sch.id'),
  ('00000000-0000-0000-0000-000000000002', 'SMP Bina Bangsa', 'smp-bbangsa', 'Jl. Pendidikan No. 10, Bandung', '022-87654321', 'info@smp-bbinabangsa.sch.id');

-- Note: Add seed data for other tables as they are created
-- See docs/database.md for table definitions

