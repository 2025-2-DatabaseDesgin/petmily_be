import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function seedRoutesAndFacilities() {
  try {
    console.log('📝 SQL 파일 읽는 중...');
    const sqlFilePath = path.join(__dirname, 'seed_routes_and_facilities.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf-8');

    // SQL 문을 세미콜론으로 분리 (주석 제거 및 빈 줄 제거)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📊 ${statements.length}개의 SQL 문 실행 중...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await prisma.$executeRawUnsafe(statement);
          console.log(`✅ [${i + 1}/${statements.length}] 실행 완료`);
        } catch (error: any) {
          // 이미 존재하는 데이터는 무시
          if (error.code === 'P2002' || error.message?.includes('Duplicate entry')) {
            console.log(`⚠️  [${i + 1}/${statements.length}] 이미 존재하는 데이터 (건너뜀)`);
          } else {
            console.error(`❌ [${i + 1}/${statements.length}] 실행 실패:`, error.message);
            console.error('SQL:', statement.substring(0, 100) + '...');
          }
        }
      }
    }

    console.log('✨ 시드 데이터 삽입 완료!');
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedRoutesAndFacilities();

