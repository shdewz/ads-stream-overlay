# ADS Stream Overlay

NodeCG-based stream overlay for [Americas Draft Showdown](https://osu.ppy.sh/community/forums/topics/2171477?n=1), using [tosu](https://github.com/tosuapp/tosu)'s websocket to read live data.

## Requirements

- [tosu](https://github.com/tosuapp/tosu) >=4.19.1
- Node >=24.0.0

## Running

The overlay runs on [http://localhost:9090](http://localhost:9090) via NodeCG. Graphics and the dashboard panel are accessible from the NodeCG UI.

### Release

Download the latest release from the [releases page](../../releases/latest).

Use `start.bat` (Windows) or `./start.sh` (Linux/macOS). Dependencies are installed automatically on first run or when `package-lock.json` changes.

### From source

Use `scripts/start.bat` (Windows) or `./scripts/start.sh` (Linux/macOS). Dependencies are installed automatically on first run or when `package-lock.json` changes.

To start manually, first build the app:

```sh
npm run build
```

Then start it:

```sh
npm run start
```

## Development

Install dependencies for both the root package and the bundle:

```sh
npm run setup
```

Start NodeCG and Vite in watch mode concurrently:

```sh
npm run dev
```

## Building

Build the bundle's assets:

```sh
npm run build
```

This runs `vite build` for both graphics and the dashboard panel, outputting to `bundles/overlay/graphics/` and `bundles/overlay/panels/`.
