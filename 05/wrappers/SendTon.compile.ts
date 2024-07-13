import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/send_ton.tact',
    options: {
        debug: true,
    },
};
