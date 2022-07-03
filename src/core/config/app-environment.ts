import { AppEnvEnum } from './app-env.enum';

/**
 * AppEnvironment 와 관련된 메서드 모음입니다.
 */
export namespace AppEnvironment {
  const value = process.env.APP_ENV;

  export function isLocal(): boolean {
    return value === AppEnvEnum.LOCAL;
  }

  export function isDev(): boolean {
    return value === AppEnvEnum.DEV;
  }

  export function isProd(): boolean {
    return value === AppEnvEnum.PROD;
  }

  export function isTest(): boolean {
    return value === AppEnvEnum.TEST;
  }

  /**
   * envFile 의 postfix 를 설정합니다.
   */
  export function setEnvPostfix(): string {
    return `.env.${process.env.ENV_POSTFIX}`;
  }

  /**
   * envFile 을 무시할지 결정합니다.
   */
  export function ignoreEnvFile(): boolean {
    return (
      process.env.ENV_POSTFIX !== 'test' && process.env.ENV_POSTFIX !== 'local'
    );
  }
}
