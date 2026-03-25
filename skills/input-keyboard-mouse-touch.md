# Input: Keyboard, Mouse, Touch, and Gamepad
> Phaser provides a unified input system accessed via `this.input` in any Scene. It supports keyboard polling and events, mouse/pointer interaction with Game Objects (click, hover, drag), multi-touch, mouse wheel, and gamepad input. Input can be handled through event listeners or by polling state each frame.

**Key source paths:** `src/input/InputPlugin.js`, `src/input/Pointer.js`, `src/input/keyboard/KeyboardPlugin.js`, `src/input/keyboard/keys/Key.js`, `src/input/keyboard/keys/KeyCodes.js`, `src/input/keyboard/combo/KeyCombo.js`, `src/input/gamepad/GamepadPlugin.js`, `src/input/gamepad/Gamepad.js`, `src/input/events/`, `src/input/keyboard/events/`
**Related skills files:** sprites-and-images.md, events-system.md, scenes.md

## Quick Start (basic keyboard + pointer input)

```js
class MyScene extends Phaser.Scene {
    create() {
        // Keyboard: create cursor keys (up, down, left, right, space, shift)
        this.cursors = this.input.keyboard.createCursorKeys();

        // Keyboard: listen for a specific key event
        this.input.keyboard.on('keydown-SPACE', (event) => {
            console.log('Space pressed');
        });

        // Pointer: listen for click/tap anywhere on the game canvas
        this.input.on('pointerdown', (pointer) => {
            console.log('Clicked at', pointer.x, pointer.y);
        });

        // Pointer: make a Game Object interactive and clickable
        const sprite = this.add.sprite(400, 300, 'player');
        sprite.setInteractive();
        sprite.on('pointerdown', (pointer, localX, localY, event) => {
            console.log('Sprite clicked at local', localX, localY);
        });
    }

    update() {
        // Poll cursor keys each frame
        if (this.cursors.left.isDown) {
            // move left
        }
        if (this.cursors.right.isDown) {
            // move right
        }
        if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            // fire once per press
        }
    }
}
```

## Core Concepts

### The Input Plugin (this.input)

Accessed via `this.input` in any Scene. It is an `EventEmitter` that handles all input for that Scene.

Key properties:
- `this.input.enabled` (boolean) - toggle input processing for the Scene
- `this.input.topOnly` (boolean, default `true`) - only emit events from the top-most Game Object under the pointer
- `this.input.keyboard` - the KeyboardPlugin instance
- `this.input.gamepad` - the GamepadPlugin instance
- `this.input.mouse` - the MouseManager reference
- `this.input.activePointer` - the most recently active Pointer
- `this.input.mousePointer` - the mouse Pointer (always pointer1)
- `this.input.pointer1` through `this.input.pointer10` - individual pointer references
- `this.input.dragDistanceThreshold` (number, default 0) - pixels a pointer must move before drag starts
- `this.input.dragTimeThreshold` (number, default 0) - ms a pointer must be held before drag starts
- `this.input.pollRate` (number, default -1) - how often pointers are polled; 0 = every frame, -1 = only on movement

Key methods:
- `addPointer(quantity)` - add extra pointers for multi-touch (default is 2; max 10)
- `setHitArea(gameObjects, hitArea, hitAreaCallback)` - set custom hit area on Game Objects
- `setHitAreaCircle(gameObjects, x, y, radius, callback)`
- `setHitAreaEllipse(gameObjects, x, y, width, height, callback)`
- `setHitAreaRectangle(gameObjects, x, y, width, height, callback)`
- `setHitAreaTriangle(gameObjects, x1, y1, x2, y2, x3, y3, callback)`
- `setHitAreaFromTexture(gameObjects, callback)` - use the texture frame dimensions
- `setDraggable(gameObjects, value)` - enable or disable dragging
- `makePixelPerfect(alphaTolerance)` - returns a callback for pixel-perfect hit testing

### Pointers

A `Pointer` object encapsulates both mouse and touch input. By default Phaser creates 2 pointers. Use `this.input.addPointer(quantity)` for more (up to 10 total).

Key properties:
- `x`, `y` - position in screen space (read from `position.x`, `position.y`)
- `worldX`, `worldY` - position translated through the most recent Camera
- `downX`, `downY` - position when button was pressed
- `upX`, `upY` - position when button was released
- `isDown` (boolean) - true if any button is held
- `primaryDown` (boolean) - true if primary button (left click / touch) is held
- `button` (number) - which button was pressed/released (0=left, 1=middle, 2=right)
- `buttons` (number) - bitmask of currently held buttons (1=left, 2=right, 4=middle, 8=back, 16=forward)
- `wasTouch` (boolean) - true if input came from touch
- `velocity` (Vector2) - smoothed velocity of pointer movement
- `angle` (number) - angle of movement in radians
- `distance` (number) - smoothed distance moved per frame
- `movementX`, `movementY` - relative movement when pointer is locked
- `deltaX`, `deltaY`, `deltaZ` - mouse wheel scroll amounts
- `locked` (boolean) - whether pointer lock is active
- `camera` - the Camera this Pointer last interacted with

Key methods:
- `leftButtonDown()`, `rightButtonDown()`, `middleButtonDown()`, `backButtonDown()`, `forwardButtonDown()` - check specific buttons
- `leftButtonReleased()`, `rightButtonReleased()`, `middleButtonReleased()` - check recent release
- `getDistance()` - distance between down position and current/up position
- `getDistanceX()`, `getDistanceY()` - horizontal/vertical distance
- `getDuration()` - ms between down and current time or up time
- `getAngle()` - angle between down and current/up position
- `updateWorldPoint(camera)` - recalculate worldX/worldY for a given camera
- `positionToCamera(camera, output)` - translate pointer position through a camera

### Interactive Game Objects (setInteractive)

Call `gameObject.setInteractive()` to enable input on a Game Object. This uses the texture frame as the hit area by default.

```js
// Default hit area from texture
sprite.setInteractive();

// Custom rectangular hit area via config
sprite.setInteractive({ hitArea: new Phaser.Geom.Rectangle(0, 0, 64, 64), hitAreaCallback: Phaser.Geom.Rectangle.Contains });

// Pixel-perfect hit testing
sprite.setInteractive(this.input.makePixelPerfect());
// With alpha tolerance (default 1):
sprite.setInteractive(this.input.makePixelPerfect(150));

// Config object with multiple options
sprite.setInteractive({
    draggable: true,
    dropZone: false,
    useHandCursor: true,
    cursor: 'pointer',
    pixelPerfect: true,
    alphaTolerance: 1
});

// Containers must specify a shape or call setSize first
container.setSize(200, 200);
container.setInteractive();
```

## Common Patterns

### Keyboard Input (cursors, addKey, isDown, JustDown)

**Cursor keys** return an object with `up`, `down`, `left`, `right`, `space`, `shift` Key objects:

```js
this.cursors = this.input.keyboard.createCursorKeys();

// In update():
if (this.cursors.up.isDown) { /* held */ }
if (this.cursors.space.isDown) { /* held */ }
```

**addKey** creates a Key object for any key:

```js
// By string name
const keyW = this.input.keyboard.addKey('W');
// By key code
const keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
// With options: addKey(key, enableCapture, emitOnRepeat)
const keyA = this.input.keyboard.addKey('A', true, false);
```

**addKeys** creates multiple keys at once:

```js
// Comma-separated string returns { W, S, A, D } Key objects
const keys = this.input.keyboard.addKeys('W,S,A,D');
if (keys.W.isDown) { /* ... */ }

// Object form with custom names
const keys = this.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D
});
```

**Polling vs events:**

```js
// Polling in update() - check every frame
if (keyW.isDown) { /* key is currently held */ }
if (keyW.isUp) { /* key is currently released */ }

// JustDown - returns true only once per press, resets after check
if (Phaser.Input.Keyboard.JustDown(keyW)) { /* fire once */ }
if (Phaser.Input.Keyboard.JustUp(keyW)) { /* released once */ }

// checkDown with duration - throttled polling
if (this.input.keyboard.checkDown(keySpace, 250)) {
    // true at most once every 250ms while held
}

// Event-driven: listen for specific key
this.input.keyboard.on('keydown-SPACE', (event) => { /* ... */ });
this.input.keyboard.on('keyup-SPACE', (event) => { /* ... */ });

// Event-driven: listen for any key
this.input.keyboard.on('keydown', (event) => {
    console.log(event.key); // native DOM KeyboardEvent
});

// Event on a Key object itself
const spaceBar = this.input.keyboard.addKey('SPACE');
spaceBar.on('down', (key, event) => { /* Key object + native event */ });
spaceBar.on('up', (key, event) => { /* ... */ });
```

**Key object properties:**
- `isDown` / `isUp` (boolean)
- `keyCode` (number)
- `altKey`, `ctrlKey`, `shiftKey`, `metaKey` (boolean) - modifier state when pressed
- `duration` (number) - ms held in previous down-up cycle
- `timeDown`, `timeUp` (number) - timestamps
- `repeats` (number) - repeat count while held
- `emitOnRepeat` (boolean) - if true, fires 'down' event on each repeat
- `enabled` (boolean) - can this key be processed

**Prevent browser default behavior:**

```js
// Capture specific keys to prevent browser scrolling etc.
this.input.keyboard.addCapture('SPACE,UP,DOWN,LEFT,RIGHT');
this.input.keyboard.addCapture([ 32, 37, 38, 39, 40 ]);
this.input.keyboard.removeCapture('SPACE');
// Note: captures are global across all Scenes
```

**Common KeyCodes:** `BACKSPACE(8)`, `TAB(9)`, `ENTER(13)`, `SHIFT(16)`, `CTRL(17)`, `ALT(18)`, `ESC(27)`, `SPACE(32)`, `LEFT(37)`, `UP(38)`, `RIGHT(39)`, `DOWN(40)`, `A-Z(65-90)`, `ZERO-NINE(48-57)`, `F1-F12(112-123)`. Access via `Phaser.Input.Keyboard.KeyCodes.SPACE` etc.

### Mouse/Pointer Click and Hover

**Scene-level pointer events** (fire anywhere on the canvas):

```js
this.input.on('pointerdown', (pointer, currentlyOver) => {
    // pointer: Pointer object, currentlyOver: array of interactive Game Objects under pointer
});
this.input.on('pointerup', (pointer, currentlyOver) => { /* ... */ });
this.input.on('pointermove', (pointer, currentlyOver) => { /* ... */ });
this.input.on('wheel', (pointer, currentlyOver, deltaX, deltaY, deltaZ) => { /* ... */ });
```

**Game Object pointer events** (require setInteractive):

```js
sprite.setInteractive();

// pointerdown on this specific object
sprite.on('pointerdown', (pointer, localX, localY, event) => {
    // localX/localY are relative to the Game Object's top-left
    // event.stopPropagation() prevents the event from going further
});

sprite.on('pointerup', (pointer, localX, localY, event) => { /* ... */ });
sprite.on('pointermove', (pointer, localX, localY, event) => { /* ... */ });
sprite.on('pointerover', (pointer, localX, localY, event) => { /* ... */ });
sprite.on('pointerout', (pointer, event) => { /* ... */ });
sprite.on('wheel', (pointer, deltaX, deltaY, deltaZ, event) => { /* ... */ });
```

**Right-click handling:**

```js
this.input.on('pointerdown', (pointer) => {
    if (pointer.rightButtonDown()) {
        // right-click
    }
});

// Disable context menu
this.input.mouse.disableContextMenu();
```

**Pointer lock (FPS-style mouse capture):**

```js
// Request lock on click
this.input.on('pointerdown', () => {
    this.input.mouse.requestPointerLock();
});

this.input.on('pointerlockchange', (event, locked) => {
    // locked: boolean
});

// Read relative movement while locked
// pointer.movementX, pointer.movementY
```

### Drag and Drop

```js
const sprite = this.add.sprite(400, 300, 'item');
sprite.setInteractive();
this.input.setDraggable(sprite);

// Or use config:
// sprite.setInteractive({ draggable: true });

// Drag events on the Scene input
this.input.on('dragstart', (pointer, gameObject) => {
    gameObject.setTint(0xff0000);
});

this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
    gameObject.x = dragX;
    gameObject.y = dragY;
});

this.input.on('dragend', (pointer, gameObject) => {
    gameObject.clearTint();
});

// Drop zones
const zone = this.add.zone(600, 300, 200, 200).setRectangleDropZone(200, 200);

this.input.on('drop', (pointer, gameObject, dropZone) => {
    gameObject.x = dropZone.x;
    gameObject.y = dropZone.y;
});

this.input.on('dragenter', (pointer, gameObject, dropZone) => { /* ... */ });
this.input.on('dragleave', (pointer, gameObject, dropZone) => { /* ... */ });
this.input.on('dragover', (pointer, gameObject, dropZone) => { /* ... */ });
```

Game Object-level drag events are also available:

```js
sprite.on('drag', (pointer, dragX, dragY) => {
    sprite.x = dragX;
    sprite.y = dragY;
});
sprite.on('dragstart', (pointer, dragX, dragY) => { /* ... */ });
sprite.on('dragend', (pointer, dragX, dragY) => { /* ... */ });
sprite.on('drop', (pointer, dropZone) => { /* ... */ });
```

Drag thresholds:

```js
this.input.dragDistanceThreshold = 16; // must move 16px before drag starts
this.input.dragTimeThreshold = 200;    // must hold 200ms before drag starts
```

### Gamepad Input

Enable gamepads in the game config:

```js
const config = {
    input: {
        gamepad: true
    }
};
```

Access via `this.input.gamepad`. Gamepads are available as `pad1` through `pad4`:

```js
// Wait for connection
this.input.gamepad.once('connected', (pad) => {
    console.log('Gamepad connected:', pad.id);
});

// If already connected, check total
if (this.input.gamepad.total > 0) {
    const pad = this.input.gamepad.pad1;
}
```

**Polling gamepad state in update():**

```js
update() {
    const pad = this.input.gamepad.pad1;
    if (!pad) return;

    // D-pad (boolean properties)
    if (pad.up) { /* d-pad up */ }
    if (pad.down) { /* d-pad down */ }
    if (pad.left) { /* d-pad left */ }
    if (pad.right) { /* d-pad right */ }

    // Face buttons (boolean) - Xbox naming convention
    if (pad.A) { /* bottom button (Xbox A / PS X) */ }
    if (pad.B) { /* right button (Xbox B / PS Circle) */ }
    if (pad.X) { /* left button (Xbox X / PS Square) */ }
    if (pad.Y) { /* top button (Xbox Y / PS Triangle) */ }

    // Shoulder buttons (float 0-1)
    if (pad.L1 > 0) { /* left shoulder top (LB) */ }
    if (pad.L2 > 0) { /* left shoulder bottom / trigger (LT) */ }
    if (pad.R1 > 0) { /* right shoulder top (RB) */ }
    if (pad.R2 > 0) { /* right shoulder bottom / trigger (RT) */ }

    // Analog sticks (Vector2, values -1 to 1)
    const lx = pad.leftStick.x;  // left stick horizontal
    const ly = pad.leftStick.y;  // left stick vertical
    const rx = pad.rightStick.x;
    const ry = pad.rightStick.y;

    // Raw axis/button access
    pad.getAxisValue(0);    // float
    pad.getButtonValue(0);  // float 0-1
    pad.isButtonDown(0);    // boolean
    pad.setAxisThreshold(0.1); // ignore values below threshold
}
```

**Gamepad events:**

```js
// Plugin-level events (any gamepad)
this.input.gamepad.on('connected', (pad, event) => { /* ... */ });
this.input.gamepad.on('disconnected', (pad, event) => { /* ... */ });
this.input.gamepad.on('down', (pad, button, value) => { /* any button on any pad */ });
this.input.gamepad.on('up', (pad, button, value) => { /* ... */ });

// Gamepad-instance events
pad.on('down', (index, value, button) => { /* button on this specific pad */ });
pad.on('up', (index, value, button) => { /* ... */ });
```

**Vibration (experimental, hardware/browser dependent):**

```js
if (pad.vibration) {
    pad.vibration.playEffect('dual-rumble', {
        duration: 200,
        strongMagnitude: 1.0,
        weakMagnitude: 0.5
    });
}
```

### Key Combos

Listen for a sequence of keys:

```js
// String-based combo
this.input.keyboard.createCombo('PHASER');

// Array of key codes (Konami code)
this.input.keyboard.createCombo(
    [ 38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13 ],
    { resetOnMatch: true }
);

// Listen for match
this.input.keyboard.on('keycombomatch', (keyCombo, event) => {
    console.log('Combo matched!');
});
```

**createCombo(keys, config):**
- `keys`: a string (each character is a key) or an array of key codes / Key objects
- `config.resetOnWrongKey` (boolean, default true) - reset progress if wrong key is pressed
- `config.maxKeyDelay` (number, default 0) - max ms between key presses; 0 = no limit
- `config.resetOnMatch` (boolean, default false) - reset combo after a successful match
- `config.deleteOnMatch` (boolean, default false) - remove combo after first match

## Events (input events with callback signatures)

### Keyboard Events (on `this.input.keyboard`)

| Event String | Callback Signature | Description |
|---|---|---|
| `'keydown'` | `(event: KeyboardEvent)` | Any key pressed |
| `'keyup'` | `(event: KeyboardEvent)` | Any key released |
| `'keydown-KEY'` | `(event: KeyboardEvent)` | Specific key pressed (e.g. `'keydown-SPACE'`, `'keydown-A'`) |
| `'keyup-KEY'` | `(event: KeyboardEvent)` | Specific key released |
| `'keycombomatch'` | `(keyCombo: KeyCombo, event: KeyboardEvent)` | A key combo was matched |

### Key Object Events (on a Key instance)

| Event String | Callback Signature | Description |
|---|---|---|
| `'down'` | `(key: Key, event: KeyboardEvent)` | This key was pressed |
| `'up'` | `(key: Key, event: KeyboardEvent)` | This key was released |

### Pointer Events (on `this.input`)

| Event String | Callback Signature | Description |
|---|---|---|
| `'pointerdown'` | `(pointer, currentlyOver: GameObject[])` | Pointer pressed anywhere |
| `'pointerup'` | `(pointer, currentlyOver: GameObject[])` | Pointer released anywhere |
| `'pointermove'` | `(pointer, currentlyOver: GameObject[])` | Pointer moved anywhere |
| `'pointerdownoutside'` | `(pointer)` | Pointer pressed outside the game canvas |
| `'pointerupoutside'` | `(pointer)` | Pointer released outside the game canvas |
| `'wheel'` | `(pointer, currentlyOver: GameObject[], deltaX, deltaY, deltaZ)` | Mouse wheel scrolled |
| `'gameout'` | `(event)` | Pointer left the game canvas |
| `'gameover'` | `(event)` | Pointer entered the game canvas |
| `'pointerlockchange'` | `(event, locked: boolean)` | Pointer lock state changed |

### Game Object Pointer Events (on an interactive Game Object)

| Event String | Callback Signature | Description |
|---|---|---|
| `'pointerdown'` | `(pointer, localX, localY, event)` | Pointer pressed on this object |
| `'pointerup'` | `(pointer, localX, localY, event)` | Pointer released on this object |
| `'pointermove'` | `(pointer, localX, localY, event)` | Pointer moved over this object |
| `'pointerover'` | `(pointer, localX, localY, event)` | Pointer entered this object |
| `'pointerout'` | `(pointer, event)` | Pointer left this object |
| `'wheel'` | `(pointer, deltaX, deltaY, deltaZ, event)` | Mouse wheel over this object |

All Game Object events provide `event.stopPropagation()` to halt further event flow.

### Drag Events (on `this.input`)

| Event String | Callback Signature |
|---|---|
| `'dragstart'` | `(pointer, gameObject)` |
| `'drag'` | `(pointer, gameObject, dragX, dragY)` |
| `'dragend'` | `(pointer, gameObject)` |
| `'dragenter'` | `(pointer, gameObject, dropZone)` |
| `'dragleave'` | `(pointer, gameObject, dropZone)` |
| `'dragover'` | `(pointer, gameObject, dropZone)` |
| `'drop'` | `(pointer, gameObject, target)` |

### Gamepad Events (on `this.input.gamepad`)

| Event String | Callback Signature |
|---|---|
| `'connected'` | `(pad: Gamepad, event: Event)` |
| `'disconnected'` | `(pad: Gamepad, event: Event)` |
| `'down'` | `(pad: Gamepad, button: Button, value: number)` |
| `'up'` | `(pad: Gamepad, button: Button, value: number)` |

### Event Dispatch Order (pointer events)

For down/up/move events, the dispatch order is:
1. `GAMEOBJECT_POINTER_DOWN` (on the Game Object itself)
2. `GAMEOBJECT_DOWN` (on `this.input` with Game Object as param)
3. `POINTER_DOWN` (on `this.input`, scene-wide)

Higher-priority handlers can call `event.stopPropagation()` to prevent lower ones from firing.

## API Quick Reference

### InputPlugin (this.input)

| Method / Property | Signature | Returns |
|---|---|---|
| `on(event, fn, context)` | Event listener | this |
| `addPointer(quantity)` | `(number)` | Pointer[] |
| `setDraggable(gameObjects, value)` | `(GameObject[], boolean)` | this |
| `makePixelPerfect(alphaTolerance)` | `(number)` | Function |
| `setHitArea(gameObjects, hitArea, callback)` | `(GameObject[], any, Function)` | this |
| `setHitAreaCircle(go, x, y, r, cb)` | | this |
| `setHitAreaRectangle(go, x, y, w, h, cb)` | | this |
| `setHitAreaFromTexture(go, cb)` | | this |
| `activePointer` | | Pointer |
| `mousePointer` | | Pointer |
| `keyboard` | | KeyboardPlugin |
| `gamepad` | | GamepadPlugin |

### KeyboardPlugin (this.input.keyboard)

| Method / Property | Signature | Returns |
|---|---|---|
| `createCursorKeys()` | | CursorKeys (`{up, down, left, right, space, shift}`) |
| `addKey(key, capture, emitOnRepeat)` | `(Key\|string\|number, boolean?, boolean?)` | Key |
| `addKeys(keys, capture, emitOnRepeat)` | `(object\|string, boolean?, boolean?)` | object |
| `removeKey(key, destroy)` | `(Key\|string\|number, boolean?)` | this |
| `createCombo(keys, config)` | `(string\|number[]\|object[], object?)` | KeyCombo |
| `checkDown(key, duration)` | `(Key, number?)` | boolean |
| `addCapture(keycode)` | `(string\|number\|number[])` | this |
| `removeCapture(keycode)` | `(string\|number\|number[])` | this |
| `enabled` | boolean | |

### Keyboard Utility Functions

| Function | Signature | Returns |
|---|---|---|
| `Phaser.Input.Keyboard.JustDown(key)` | `(Key)` | boolean (true once per press) |
| `Phaser.Input.Keyboard.JustUp(key)` | `(Key)` | boolean (true once per release) |

### Pointer

| Property | Type | Description |
|---|---|---|
| `x`, `y` | number | Screen-space position |
| `worldX`, `worldY` | number | Camera-translated position |
| `isDown` | boolean | Any button held |
| `primaryDown` | boolean | Primary button held |
| `button` | number | Button that triggered last event |
| `wasTouch` | boolean | Last event was touch |
| `velocity` | Vector2 | Smoothed movement velocity |
| `deltaX/Y/Z` | number | Wheel scroll amounts |

| Method | Returns | Description |
|---|---|---|
| `leftButtonDown()` | boolean | Left button held |
| `rightButtonDown()` | boolean | Right button held |
| `getDistance()` | number | Distance from down to current/up |
| `getDuration()` | number | Ms from down to current/up |
| `updateWorldPoint(camera)` | this | Recalculate world coords |

### Gamepad

| Property | Type | Description |
|---|---|---|
| `leftStick` | Vector2 | Left analog stick (x,y from -1 to 1) |
| `rightStick` | Vector2 | Right analog stick |
| `A`, `B`, `X`, `Y` | boolean | Face buttons |
| `up`, `down`, `left`, `right` | boolean | D-pad |
| `L1`, `L2`, `R1`, `R2` | number | Shoulder buttons (0-1) |
| `id` | string | Controller identifier string |
| `connected` | boolean | Connection state |

## Gotchas and Common Mistakes

1. **Must call setInteractive() before listening for Game Object events.** Without it, `pointerdown` etc. will never fire on that object.

2. **Containers need a size for hit testing.** Call `container.setSize(w, h)` or pass a shape to `setInteractive()`. Pixel-perfect testing does not work on Containers.

3. **JustDown/JustUp only return true once per check.** They consume the flag on read, so calling `JustDown(key)` twice in the same frame gives true then false. Store the result in a variable if needed in multiple places.

4. **Keyboard captures are global.** Calling `addCapture('SPACE')` in one Scene prevents the browser default for all Scenes, not just the calling Scene.

5. **Browser extensions can interfere with keyboard input.** Extensions like Vimium can intercept keys (e.g. D key). Check extensions when debugging missing key events.

6. **Pointer worldX/worldY are only accurate inside input handlers.** Outside of event callbacks, call `pointer.updateWorldPoint(camera)` first to get correct camera-translated coordinates.

7. **topOnly defaults to true.** Only the top-most interactive Game Object under the pointer receives events. Set `this.input.topOnly = false` to emit to all objects below the pointer.

8. **Gamepad requires SSL in modern browsers.** Chrome and others block the Gamepad API on non-HTTPS pages. The browser may also require a button press before exposing the gamepad.

9. **Gamepad may already be connected.** The `'connected'` event only fires on new connections. Check `this.input.gamepad.total` on Scene start and use `pad1`-`pad4` if already present.

10. **Drag events require both setInteractive and setDraggable.** Just calling `setInteractive()` is not enough; you must also call `this.input.setDraggable(sprite)` or use the `{ draggable: true }` config.

11. **Pointer lock must be requested from a user gesture.** Call `this.input.mouse.requestPointerLock()` from inside a `pointerdown` or `pointerup` handler.

12. **Key.emitOnRepeat defaults to false.** By default, holding a key only emits one `'down'` event. Set `emitOnRepeat` to true in `addKey()` or on the Key to get continuous events.

## Source File Map

| File | Purpose |
|---|---|
| `src/input/InputPlugin.js` | Scene input plugin (`this.input`), setInteractive, hit areas, drag |
| `src/input/Pointer.js` | Pointer class (mouse + touch), coordinates, button state |
| `src/input/keyboard/KeyboardPlugin.js` | Keyboard plugin (`this.input.keyboard`), addKey, createCursorKeys, combos |
| `src/input/keyboard/keys/Key.js` | Key object (isDown, isUp, events) |
| `src/input/keyboard/keys/KeyCodes.js` | Enum of all key codes (SPACE, ENTER, A-Z, etc.) |
| `src/input/keyboard/keys/JustDown.js` | `Phaser.Input.Keyboard.JustDown(key)` utility |
| `src/input/keyboard/keys/JustUp.js` | `Phaser.Input.Keyboard.JustUp(key)` utility |
| `src/input/keyboard/combo/KeyCombo.js` | Key combo sequence detection |
| `src/input/keyboard/events/` | Keyboard events: `ANY_KEY_DOWN`, `ANY_KEY_UP`, `KEY_DOWN`, `KEY_UP`, `DOWN`, `UP`, `COMBO_MATCH` |
| `src/input/events/` | Input events: `POINTER_DOWN`, `POINTER_UP`, `POINTER_MOVE`, `POINTER_WHEEL`, `DRAG_*`, `DROP`, `GAMEOBJECT_*` |
| `src/input/gamepad/GamepadPlugin.js` | Gamepad plugin (`this.input.gamepad`), pad1-pad4 |
| `src/input/gamepad/Gamepad.js` | Gamepad class, sticks, buttons, d-pad properties |
| `src/input/gamepad/Axis.js` | Gamepad axis with threshold |
| `src/input/gamepad/Button.js` | Gamepad button (pressed, value) |
| `src/input/gamepad/events/` | Gamepad events: `CONNECTED`, `DISCONNECTED`, `BUTTON_DOWN`, `BUTTON_UP` |
