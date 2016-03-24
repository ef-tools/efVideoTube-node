# efVideoTube (nodejs)

[![Build status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)

efVideoTube (nodejs) is a web service for listing and playing videos and music on the disk.
It's the server part of renewing [efVideoTube (C#)](https://github.com/ef-tools/efVideoTube-cs).
The client (UI) part of the project is under developing and will be available soon.


## Renew

For a few years ago, I developed [efVideoTube (C#)](https://github.com/ef-tools/efVideoTube-cs) for sharing videos among my friends.
As the time goes, I feel some drawbacks of the program, such as inflexible of authentication, unoptimized UI on cell phones, etc.
So I decide to renew the project.

The new project is changed from the architecture, it ditches B/S for SOA.
It composites a web service and clients on different platforms.
Unlike the original C# version, which uses client certificates to authenticate users, this version of efVideoTube uses database to validate user accounts so that it supports all devices.


## Features

- List media files on the disk.
- Configurable media players.
- Extract audio from videos. (requires external applications)
- Converts subtitles to webvtt which is supported by html5. (requires external applications)


## Supported Media Types

- Video
  - `.mp4`
  - `.webm`
  - `.wmv`
  - `.flv`
- Audio
  - `.m4a`
  - `.mp3`
- Subtitle
  - `.ass`
  - `.ssa`
  - `.srt`
  - `.vtt`


## External Dependencies

The website depends on following external applications to make specific function work.
The pathes of these applications could be configured under `web.config`.

- `mp4box`

    For extracting audio from mp4 videos.
    https://gpac.wp.mines-telecom.fr/mp4box/

- `mkvtoolnix`

    For extracting audio from webm videos.
    https://mkvtoolnix.download/

- `ass2srt`

    For converting `.ass`, `.ssa` and `.srt` subtitles to webvtt.
    *Will be published to github soon.*


## License

MIT


[travis-image]: https://img.shields.io/travis/ef-tools/efVideoTube-js.svg?style=flat-square
[travis-url]: https://travis-ci.org/ef-tools/efVideoTube-js
[npm-image]: https://img.shields.io/npm/v/ef-video-tube.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ef-video-tube