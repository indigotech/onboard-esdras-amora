declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string | undefined;
    DATABASE_URL: string | undefined;
    JWT_EXPIRATION_TIME: string | undefined;
    JWT_SECRET: string | undefined;
  }
}
