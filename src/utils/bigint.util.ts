/**
 * BigInt를 문자열로 변환하는 유틸리티
 * JSON.stringify에서 BigInt를 직렬화할 수 없기 때문에 사용
 */

/**
 * 객체 내의 모든 BigInt 값을 문자열로 변환
 */
export const serializeBigInt = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'bigint') {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(serializeBigInt);
  }

  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = serializeBigInt(obj[key]);
      }
    }
    return result;
  }

  return obj;
};

/**
 * JSON.stringify의 replacer 함수로 사용
 */
export const bigIntReplacer = (key: string, value: any): any => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
};

