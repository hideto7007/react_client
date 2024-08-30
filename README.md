## React Next MUI web application

### overview
make Annual income management and stock price prediction web front application.


### Environment
```bash
1. docker exec
docker container exec -it react_client /bin/bash
cd ./react_client

2. react, next, typescript install
npx create-next-app client --typescript
cd ./client
npm install @mui/material @emotion/react @emotion/styled
```


### UnitTest
- 1. jest install
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event babel-jest ts-node jest-environment-jsdom next
```

- 2. jest.config.ts
```typescript
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
        '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['next/babel'] }],
    },
    globals: {
        'ts-jest': {
            tsconfig: {
                jsx: 'react-jsx',
            },
        },
    },
};

```

