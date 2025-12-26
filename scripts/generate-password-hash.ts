/**
 * 비밀번호 해시 생성 스크립트
 * 
 * 사용법:
 *   npx tsx scripts/generate-password-hash.ts [비밀번호]
 * 
 * 예시:
 *   npx tsx scripts/generate-password-hash.ts password123
 */

import bcrypt from 'bcrypt';

const password = process.argv[2] || 'password123';

bcrypt.hash(password, 10)
  .then((hash) => {
    console.log(`\n비밀번호: ${password}`);
    console.log(`해시값: ${hash}\n`);
    console.log('SQL 쿼리에서 사용할 수 있는 형식:');
    console.log(`'${hash}'`);
  })
  .catch((error) => {
    console.error('해시 생성 중 오류 발생:', error);
    process.exit(1);
  });


