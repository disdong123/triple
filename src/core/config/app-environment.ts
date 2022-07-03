import { AppEnvEnum } from './app-env.enum';

/**
 *
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
   *
   */
  export function setEnvPostfix(): string {
    return `.env.${process.env.ENV_POSTFIX}`;
  }

  /**
   *
   */
  export function ignoreEnvFile(): boolean {
    return (
      process.env.ENV_POSTFIX !== 'test' && process.env.ENV_POSTFIX !== 'local'
    );
  }
}
