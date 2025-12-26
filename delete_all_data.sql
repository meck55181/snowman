-- 모든 데이터 삭제 SQL 쿼리
-- Supabase SQL Editor에서 실행하세요
-- ⚠️ 주의: 이 쿼리는 모든 데이터를 영구적으로 삭제합니다!

-- 방법 1: 모든 행 삭제 (테이블 구조는 유지)
DELETE FROM responses;

-- 방법 2: 테이블 자체를 삭제하고 다시 생성하려면 (완전 초기화)
-- DROP TABLE IF EXISTS responses CASCADE;
-- 
-- 그 다음 migration.sql을 다시 실행하여 테이블을 재생성하세요.

-- 삭제 확인 (실행 후 결과가 0개여야 함)
SELECT COUNT(*) FROM responses;

