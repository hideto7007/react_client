module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/$1',
    },
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
        '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['next/babel'] }],
    },
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts']
};
