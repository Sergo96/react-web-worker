# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-05-14

### Changed

- **Breaking:** npm package is now **`offthread`** (unscoped). Install with `npm install offthread` and import from `"offthread"`.

## [0.1.2] - 2026-05-14

### Changed

- Adopt **Offthread** as the public-facing product name.

## [0.1.1] - 2026-05-14

### Changed

- Published on npm as a **scoped** package because the unscoped name `react-web-worker` is rejected as too similar to the existing package [`react-webworker`](https://www.npmjs.com/package/react-webworker).

## [0.1.0] - 2026-05-13

### Added

- `useBlobWorker` hook: run a synchronous function in a Web Worker via an inline Blob URL.
- MIT license, README, CI workflow, and a Vite + React example under `examples/vite-react`.

[0.2.0]: https://github.com/Sergo96/react-web-worker/releases/tag/v0.2.0
[0.1.2]: https://github.com/Sergo96/react-web-worker/releases/tag/v0.1.2
[0.1.1]: https://github.com/Sergo96/react-web-worker/releases/tag/v0.1.1
[0.1.0]: https://github.com/Sergo96/react-web-worker/releases/tag/v0.1.0
