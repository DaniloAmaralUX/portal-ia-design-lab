# iPod Classic

iPod classic with a working click wheel, menus, and music playback.

```tsx
import {
  IpodClassic,
  type IpodLibrary,
} from "@/components/ipod-classic"

// Song metadata and previews from the iTunes Lookup API, streamed only.
const library: IpodLibrary = {
  songs: [
    {
      id: "1396678789",
      name: "Take California",
      artistName: "Propellerheads",
      albumName: "Decksandrumsandrockandroll 20th Anniversary",
      previewUrl:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/3f/11/ac/3f11ac5b-69ca-bbb8-18be-ddd0e3a2e8b7/mzaf_10860549742340277721.plus.aac.p.m4a",
      url: "https://music.apple.com/us/album/take-california/1396678787?i=1396678789",
    },
    {
      id: "1308567740",
      name: "Shut Up and Let Me Go",
      artistName: "The Ting Tings",
      albumName: "We Started Nothing",
      previewUrl:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/69/61/ca/6961cad7-f5ee-29ee-c8e6-664ec7b48502/mzaf_5353190306364204304.plus.aac.p.m4a",
      url: "https://music.apple.com/us/album/shut-up-and-let-me-go/1308567129?i=1308567740",
    },
    {
      id: "693620735",
      name: "Feel Good Inc",
      artistName: "Gorillaz",
      albumName: "Feel Good Inc - EP",
      previewUrl:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ca/f9/87/caf9879f-a8f3-6d0a-1016-2e7dbf7dec98/mzaf_13876270285889477958.plus.aac.p.m4a",
      url: "https://music.apple.com/us/album/feel-good-inc/693620734?i=693620735",
    },
    {
      id: "693751201",
      name: "Technologic",
      artistName: "Daft Punk",
      albumName: "Human After All",
      previewUrl:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d9/d7/72/d9d7726c-edc5-687a-2429-6dffa4a38496/mzaf_17942222817121564427.plus.aac.p.m4a",
      url: "https://music.apple.com/us/album/technologic/693748807?i=693751201",
    },
  ],
  playlists: [
    {
      id: "ipod-ads",
      name: "Songs From iPod Ads",
      songIds: ["1396678789", "1308567740", "693620735", "693751201"],
    },
  ],
}

export default function IpodClassicDemo() {
  return <IpodClassic library={library} className="w-full max-w-sm" />
}

```

Dependencies: jotai, motion

## Features

* Click wheel scrolling that speeds up as you spin.
* Crossfade between songs and wheel click sounds.
* Settings and volume persist between visits.
* Hidden Brick game: hold Select on About for 5 seconds.

## Use cases

* Playful music player on a personal site.
* Easter egg on a 404 page.

## Installation

```bash
npx shadcn@latest add @ncdai/ipod-classic
```

CLI only. Browse the source on [GitHub](https://github.com/ncdai/chanhdai.com/tree/main/src/registry/components/ipod-classic).

<Callout>
  Requires the [Chicago Kare](https://github.com/KingDuane/Chicago-Kare) font,
  exposed as `--font-chicago-kare`.
</Callout>

## Usage

```tsx
import { IpodClassic, type IpodLibrary } from "@/components/ipod-classic"
```

```tsx
const library: IpodLibrary = {
  songs: [
    { id: "1", name: "Song", artistName: "Artist", previewUrl: "/song.m4a" },
  ],
  playlists: [{ id: "favorites", name: "Favorites", songIds: ["1"] }],
}

<IpodClassic library={library} />
```

## API reference

### IpodClassic

Extends `div` props.

<TypeTable
  id="type-table-props.ts-IpodClassicProps"
  type={{
  "id": "props.ts-IpodClassicProps",
  "name": "IpodClassicProps",
  "description": "",
  "entries": [
    {
      "name": "library",
      "description": "Songs and playlists to browse and play.",
      "tags": [
        {
          "name": "fumadocsHref",
          "text": "#ipodlibrary"
        }
      ],
      "type": "IpodLibrary",
      "simplifiedType": "IpodLibrary",
      "required": true,
      "deprecated": false,
      "typeHref": "#ipodlibrary"
    }
  ]
}}
/>

### IpodLibrary

<TypeTable
  id="type-table-types.ts-IpodLibrary"
  type={{
  "id": "types.ts-IpodLibrary",
  "name": "IpodLibrary",
  "description": "",
  "entries": [
    {
      "name": "songs",
      "description": "Every song. Songs and Artists list them by name.",
      "tags": [
        {
          "name": "fumadocsHref",
          "text": "#ipodsong"
        }
      ],
      "type": "IpodSong[]",
      "simplifiedType": "array",
      "required": true,
      "deprecated": false,
      "typeHref": "#ipodsong"
    },
    {
      "name": "playlists",
      "description": "Shown in Playlists, in this order.",
      "tags": [
        {
          "name": "fumadocsHref",
          "text": "#ipodplaylist"
        }
      ],
      "type": "IpodPlaylist[]",
      "simplifiedType": "array",
      "required": true,
      "deprecated": false,
      "typeHref": "#ipodplaylist"
    }
  ]
}}
/>

### IpodSong

<TypeTable
  id="type-table-types.ts-IpodSong"
  type={{
  "id": "types.ts-IpodSong",
  "name": "IpodSong",
  "description": "",
  "entries": [
    {
      "name": "id",
      "description": "",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "name",
      "description": "",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "artistName",
      "description": "Groups songs in Artists.",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "albumName",
      "description": "",
      "tags": [],
      "type": "string | undefined",
      "simplifiedType": "string",
      "required": false,
      "deprecated": false
    },
    {
      "name": "previewUrl",
      "description": "Audio file to play. Must be served with CORS headers.",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "url",
      "description": "Opened when the song title on Now Playing is clicked.",
      "tags": [],
      "type": "string | undefined",
      "simplifiedType": "string",
      "required": false,
      "deprecated": false
    }
  ]
}}
/>

### IpodPlaylist

<TypeTable
  id="type-table-types.ts-IpodPlaylist"
  type={{
  "id": "types.ts-IpodPlaylist",
  "name": "IpodPlaylist",
  "description": "",
  "entries": [
    {
      "name": "id",
      "description": "",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "name",
      "description": "",
      "tags": [],
      "type": "string",
      "simplifiedType": "string",
      "required": true,
      "deprecated": false
    },
    {
      "name": "songIds",
      "description": "In playback order.",
      "tags": [],
      "type": "string[]",
      "simplifiedType": "array",
      "required": true,
      "deprecated": false
    }
  ]
}}
/>

## Accessibility

* Arrow keys move, Enter and Space select, Escape goes back.
* Wheel buttons are labeled, and status changes are announced.

## Credits

* [Apple](https://music.apple.com/us/jfdsalkfavsd)
* [KingDuane](https://github.com/KingDuane/Chicago-Kare)

## License and usage

* Free to use and modify in both personal and commercial projects.
* Attribution is appreciated but not required.
* Released under the [MIT License](https://github.com/ncdai/chanhdai.com/blob/main/LICENSE).


Last updated on October 27, 2026