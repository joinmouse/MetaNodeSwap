// 本地开发环境使用代理路径，会通过 webpack 代理转发到 localhost:8080
// 生产环境需要配置实际的后端地址
const getBaseUrl = () => {
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  if (host.includes('127.0.0.1') || host.includes('localhost')) {
    return '/api/v21'; // 本地代理
  }
  return 'https://pledge.rcc-tec.xyz/api/v22'; // 生产环境
};

export const DEFAULT_TOKEN_LIST_URL = `${getBaseUrl()}/token?chainId=97`;

export const DEFAULT_LIST_OF_LISTS: string[] = [
  `${getBaseUrl()}/token?chainId=97`,
  `${getBaseUrl()}/token?chainId=56`,
];
