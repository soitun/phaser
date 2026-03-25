# Phaser - HTML5 Game Framework

![Phaser Banner](changelog/assets/phaser-banner.png "Phaser Banner")

[![Discord](https://img.shields.io/discord/244245946873937922?style=for-the-badge)](https://discord.gg/phaser)
![JSDelivr](https://img.shields.io/jsdelivr/npm/hm/phaser?style=for-the-badge)
![GitHub](https://img.shields.io/github/downloads/phaserjs/phaser/total?style=for-the-badge)

Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers and has been actively developed for over 10 years.

Games can be built for the web, or as YouTube Playables, Discord Activities, Twitch Overlays or compiled to iOS, Android, Steam and native apps using 3rd party tools. You can use JavaScript or TypeScript for development. Phaser supports over 40 different front-end frameworks including React and Vue.

Phaser is commercially developed and maintained by **Phaser Studio Inc** along with our fantastic open source community. As a result of rapid support, and a developer friendly API, Phaser is currently one of the [most starred](https://github.com/collections/javascript-game-engines) game frameworks on GitHub.

Interested in learning more? Click the image below to watch our intro video.

[![YouTube](http://i.ytimg.com/vi/jHTRu4iNTcA/maxresdefault.jpg)](https://www.youtube.com/watch?v=jHTRu4iNTcA)

## Phaser 4 - Release Candidate 7

Phaser 4 draws ever closer to its official release with **RC7** - the most feature-rich release candidate yet. Originally planned for other projects, we adapted everything that made sense directly into Phaser. The result is a framework that's already more powerful and more reliable than Phaser 3 ever was.

### What's New in RC7

**Tint Overhaul** - Tint has been completely reworked. Color and mode are now separate concerns, with 6 tint modes available: MULTIPLY, FILL, ADD, SCREEN, OVERLAY, and HARD_LIGHT. The new `setTintMode()` method gives you explicit control, and FILL mode now works correctly with partially transparent pixels.

**Return of the Lost FX** - Every FX that was cut during the Filters unification has been re-implemented. Bloom, Circle, Gradient, Shine, Vignette, and Wipe are all back - some as Filters, others finding better homes as Actions or Game Objects.

**New Game Objects** - Several powerful new shader-based game objects:
- **Gradient** - Highly configurable color gradients in linear, radial, conic, and bilinear shapes, powered by the new `ColorBand` and `ColorRamp` display classes.
- **Noise, NoiseCell (2D/3D/4D), and NoiseSimplex (2D/3D)** - Generate and animate cellular noise, simplex noise, and random static, with support for normal map output. Great for naturalistic patterns, reflections, clouds, and procedural generation.

**New Filters** - A whole suite of new filters including **ImageLight** for environment mapping and image-based lighting, **PanoramaBlur** for diffuse lighting textures, **CombineColorMatrix** for channel remixing, **GradientMap** for palette-swap effects, **Key** for chroma keying, **NormalTools** for normal map adjustment, and **Quantize** for retro dithered palette effects.

**New Texture Management** - `TextureManager.addFlatColor()` creates proxy textures, and `Texture.setSource()` lets you hot-swap texture sources at runtime.

**Plus** -- `NineSlice` tiling support (thanks @skhoroshavin!), `Actions.FitToRegion()` for quick scaling, `GameObject.isDestroyed` flag, HSV color interpolation, smoother FPS limiting, new deterministic noise functions in `Phaser.Math`, and numerous bug fixes from community feedback.

Full details in the [RC7 Change Log](changelog/4.0/CHANGELOG-v4.0.0-rc.7.md) and the [full v4 Change Log](changelog/4.0/CHANGELOG-v4.0.0.md).

Phaser 4 contains a brand-new and highly efficient WebGL renderer -- the entire renderer from v3 has been replaced. The public API has remained mostly, but not entirely, the same.

## Installing Phaser 4 Beta from NPM

Install via [npm](https://www.npmjs.com/package/phaser):

```bash
npm install phaser@beta
```

## Phaser TypeScript Definitions

Full TypeScript definitions can be found inside the [types folder](https://github.com/phaserjs/phaser/tree/master/types). They are also referenced in the `types` entry in `package.json`, meaning modern editors such as VSCode will detect them automatically.

Depending on your project, you may need to add the following to your `tsconfig.json` file:

```json
"lib": ["es6", "dom", "dom.iterable", "scripthost"],
"typeRoots": ["./node_modules/phaser/types"],
"types": ["Phaser"]
```

## Have fun!

Grab the source and join the fun!

Phaser wouldn't have been possible without the fantastic support of the community. Thank you to everyone who supports our work, who shares our belief in the future of HTML5 gaming, and Phaser's role in that.

Happy coding everyone!

Cheers,

[Rich](mailto:rich@phaser.io) and the whole team at Phaser Studio

![boogie](https://www.phaser.io/images/spacedancer.gif)

**Visit** the [Phaser website](https://phaser.io)<br />
**Play** some [amazing games](https://phaser.io/games)<br />
**Learn** By browsing our [API Docs](https://docs.phaser.io) or [Support Forum](https://phaser.discourse.group/)<br />
**Be Social:** Join us on [Discord](https://discord.gg/phaser) and [Reddit](https://phaser.io/community/reddit) or follow us on [Twitter](https://twitter.com/phaser_)<br />
**Code Examples?** We've over 2000 [Examples](https://phaser.io/examples) to learn from<br />

Powered by coffee, anime, pixels and love.

The Phaser logo and characters are &copy; 2011 - 2026 Phaser Studio Inc.

All rights reserved.

"Above all, video games are meant to be just one thing: fun. Fun for everyone." - Satoru Iwata
