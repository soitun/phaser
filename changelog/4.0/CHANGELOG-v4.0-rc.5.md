# Version 4.0 - Release Candidate 5

## New Features

- `Mask` filter now supports `scaleFactor` parameter, allowing the creation of scaled-down framebuffers. This can save memory in large games, but you must manage scaling logic yourself. Thanks to kimdanielarthur-cowlabs for developing the initial solution.
- `Camera` has the new property `isObjectInversion`, used internally to support special transforms for filters.

## Improvements

- Drawing contexts, including filters, can now be larger than 4096 if the current device supports them. Thanks to kimdanielarthur-cowlabs for suggesting this.

## Fixes

- `Blocky` filter now has a minimum size of 1, which prevents the object from disappearing.
- `TilemapGPULayer` now takes the first tileset if it receives an array of tilesets (which is valid for Tilemaps but not for TilemapGPULayer). Thanks to ChrisCPI for the fix.
- Filters now correctly transform the camera to focus objects with intricate transforms.
- Filters now correctly handle parent transforms when focusing to the game camera.
- `DynamicTexture` method `startCapture` now handles nested parent transforms correctly. This is used in `Mask`, so masks within `Container` objects should behave correctly too.
