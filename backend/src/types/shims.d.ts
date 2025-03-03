// This file ensures that Node.js globals like 'process' are recognized

import * as NodeJS from 'node';

declare global {
  const process: NodeJS.Process;
  
  namespace NodeJS {
    interface Global {
      process: NodeJS.Process;
    }
  }
} 