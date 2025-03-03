// Node.js specific type declarations

declare namespace NodeJS {
  interface Process {
    env: ProcessEnv;
    exit(code?: number): never;
    on(event: string, listener: Function): this;
  }

  interface Global {
    process: Process;
  }
} 