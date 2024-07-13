# first

## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

```bash
npx blueprint build
``` 

### Test

```bash
npx blueprint test
```

### Deploy or run another script

```bash
npx blueprint run
```

### Add a new contract

```bash
npx blueprint create ContractName
```
