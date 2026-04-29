---
description: 'Use when writing or updating unit tests for Vue components or composables. Covers test structure, mocking strategy, assertion patterns, and what belongs in component vs composable specs.'
applyTo: '**/*.spec.ts'
---

# Testing Conventions

## Component spec structure

- Default to `beforeEach` for setup — remount the component fresh for each test block
- Use `beforeAll` only when an **entire describe block** is tracing sequential state changes on a single shared wrapper (e.g. `when isOpen changes to true` → `when isOpen changes to false`). In this mode the whole spec mounts once at the top level and nested describes mutate reactive mock refs + `await wrapper.vm.$nextTick()` to drive state
- Use `afterEach(() => { vi.clearAllMocks() })` at the top-level describe to reset call counts between tests
- Use `afterAll` inside a nested describe to reset shared mock state after that block finishes

```ts
// Standard pattern — beforeEach remount
describe('MyComponent', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});

// Sequential state machine pattern — beforeAll + reactive mock refs
describe('MyComponent', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    wrapper = factory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when isOpen changes to true', () => {
    beforeAll(async () => {
      isOpenMock.value = true;
      await wrapper.vm.$nextTick();
    });

    describe('when isOpen changes to false', () => {
      beforeAll(async () => {
        isOpenMock.value = false;
        await wrapper.vm.$nextTick();
      });
    });
  });
});
```

## Mocking strategy

- **Component specs**: mock the composable the component calls via `mockNuxtImport`. Never mock lower-level state composables (`useDropdownMenuState`) from a component spec — that's the composable's responsibility
- **Composable specs**: mock lower-level composables and DOM globals; test logic directly via `withSetup`

```ts
// Component spec — mock the whole composable
const isOpenMock = ref(false);
const openSubmenuMock = vi.fn();

mockNuxtImport('useDropdownSubmenu', () => () => ({
  isOpen: isOpenMock,
  openSubmenu: openSubmenuMock,
  // ... all returned values
}));

// Composable spec — mock dependencies, call composable directly
mockNuxtImport('useDropdownMenuState', () => () => ({
  openEventCount: openEventCountMock,
}));

result = withSetup(() => useDropdownSubmenu({ ... }));
```

## What belongs where

| Concern                                         | Component spec | Composable spec |
| ----------------------------------------------- | -------------- | --------------- |
| Template rendering (v-if, classes, styles)      | ✓              |                 |
| Computed properties defined in `<script setup>` | ✓              |                 |
| Event handler wiring (`@mouseenter`, `@click`)  | ✓              |                 |
| Positioning logic                               |                | ✓               |
| AbortController / event listener cleanup        |                | ✓               |
| `onMounted` / `onBeforeUnmount` lifecycle       |                | ✓               |
| Watcher behaviour                               |                | ✓               |
| `matchMedia` / viewport detection               |                | ✓               |

## Assertions

### Element querying

Never use raw tag selectors (`.find('ul')`, `.find('div')`, `.find('li')`) to locate elements. Always use a `ref` or `data-test` attribute:

```ts
// ✓ correct — use a ref
wrapper.find({ ref: 'dropdownPanelRef' });
wrapper.find({ ref: 'dropdownSubListRef' });

// ✓ correct — use data-test-id for elements inside loops
wrapper.find('[data-test-id="track-0"]');

// ✗ wrong — raw tag selector
wrapper.find('ul');
wrapper.find('div');
```

Use `ref` for unique elements. Use `data-test-id` for elements rendered inside `v-for` loops, where a `ref` would collide across iterations. If the target element does not have a `ref` or `data-test-id` attribute, add one to the component template before writing the test.

### Icon props

Use `ICONS` constants — not raw strings. `ButtonLink` receives the mapped value:

```ts
// ✓ correct
expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(ICONS.caretDown);

// ✗ wrong — raw string won't match
expect(wrapper.findComponent(ButtonLink).props('icon')).toBe('caretDown');
```

### Computed properties on `wrapper.vm`

Cast through `unknown` — never use `as any`:

```ts
expect(
  (wrapper.vm as unknown as { transitionName: string }).transitionName,
).toBe('slide-in-right');
```

### Style assertions

Use `.toContain()` for checking styles (template literal patterns):

```ts
// Regular CSS — use toContain:
const element = wrapper.find({ ref: 'elementRef' });

expect(element.attributes('style')).toContain('top: 10px;');
expect(element.attributes('style')).toContain('left: 20px;');

// CSS variables — use toContain:
expect(element.attributes('style')).toContain(
  `--loop-rows-${prop}: ${defaultValue};`,
);

// No style applied:
expect(sublist.attributes('style')).toBeUndefined();
```

### Class assertions

Use `'adds the X class to the Z element'` / `'adds the X class to the Z component'` (and the `'does not add'` negations) in test descriptions — not "sets". Use "element" for DOM nodes, "component" for Vue components:

```ts
expect(sublist.classes()).toContain('submenu');
expect(sublist.classes()).not.toContain('inlineSubmenu');
```

### Primitive value assertions

Always use `.toBe()` for primitive values — never use matcher aliases:

```ts
// ✓ correct
expect(value).toBe(null);
expect(value).toBe(true);
expect(value).toBe(false);
expect(value).toBe(0);

// ✗ wrong — use toBe instead
expect(value).toBeNull();
expect(value).toBeTruthy();
expect(value).toBeFalsy();
```

The exception is `.toBeUndefined()` — use it when asserting the absence of an attribute (e.g. `style` not set), as there is no primitive literal for `undefined`.

## Describe block naming

### Top-level describe name

The top-level `describe` name mirrors the exported name of the thing being tested. The format varies by file type:

| File type        | Format                       | Example                                         |
| ---------------- | ---------------------------- | ----------------------------------------------- |
| Vue component    | PascalCase — export name     | `'DropdownMenu'`, `'DefaultLayout'`             |
| Vue page         | lowercase — file name        | `'login'`, `'playlists'`, `'radio-stations'`    |
| Composable       | camelCase — export name      | `'useAuth'`, `'useDropdownMenu'`                |
| Middleware       | kebab-case + `'-middleware'` | `'album-middleware'`, `'app-global-middleware'` |
| Plugin           | lowercase + `' plugin'`      | `'api plugin'`, `'head plugin'`                 |
| Utility function | export name                  | `'getParams'`, `'shuffleTrackInQueue'`          |
| Class            | PascalCase — export name     | `'AudioPlayer'`, `'AudioPreloader'`             |

### Nested describe conditions

Use `'when the X value is Z'` / `'when the X value changes to Y'` for reactive ref state. Use `'when X'` for non-reactive conditions. Always start with calling the function first `when the X function is called` and then conditions. Full inventory of condition patterns used in the codebase:

```
when the X function is called
  when the isHoverDevice value is true
    when the openedLeft value is false
    when the openedLeft value is true
      when the openedLeft value changes to false
  when the isOpen value is false
  when the isOpen value changes to true
    when the isOpen value changes to false
  when track.album is undefined
  when newestAlbums is an empty array
  when the component unmounts
  when fetchData response returns null
  when fetchData response returns a value
  when X is undefined
  when X is null
  when X is not set
  when X is an empty array
  when X is not an empty array
  when to.params.X is not defined
  when page:finish event is emitted
  when page:finish event has not emitted
```

For parameterized cases, use `describe.each`:

```ts
describe.each([['play album ButtonLink', 'playAlbumButtonLink', 'playAlbum']])(
  'when the %s component emits the click event',
  (_text, ref, emitEventName) => {
    // ...
  },
);

// From an object's values
describe.each(Object.values(ROUTE_MEDIA_TYPE_PARAMS))(
  'when to.params is %s',
  (mediaType) => {
    /* ... */
  },
);

// From a spread array constant
describe.each([...PAGE_NAVIGATION_ROUTES])('when route name is %s', (name) => {
  /* ... */
});

// With %o to display object values in the description
// Object entries inside describe.each arrays must always be written multi-line — never on one line
// ✓ correct
describe.each([
  [
    {
      content: 'content',
      id: 'id',
      type: 'error',
    },
  ],
])('when value is %o', (value) => {
  /* ... */
});

// ✗ wrong — object on one line
describe.each([[{ content: 'content', id: 'id', type: 'error' }]])(
  'when value is %o',
  (value) => {
    /* ... */
  },
);
```

## factory function

One factory per spec file. Default props match the simplest valid render. Always accept a `props` param. Add a `slots` param only if the component has slots to test:

```ts
// Props only:
function factory(props = {}) {
  return mount(MyComponent, {
    props: {
      ...props,
    },
  });
}

// With slots:
function factory(props = {}, slots = {}) {
  return mount(MyComponent, {
    attachTo: document.body,
    props: {
      text: 'Test Submenu', // minimal valid prop
      ...props,
    },
    slots: {
      default: 'Default slot content.',
      ...slots,
    },
  });
}
```

Never call `mount` or `shallowMount` directly inside `beforeAll` or `beforeEach` — always go through the factory.

All objects must be written multi-line — never on one line. This applies everywhere in a spec file: factory arguments, mock setups, inline object values, `describe.each` data, `toHaveBeenCalledWith` arguments, etc. The only exception is a single-property object used as a DOM query selector:

```ts
// ✓ correct — multi-line objects
wrapper = factory(
  {
    propName: 'value',
  },
  {
    default: '<li>Item</li>',
  },
);

// ✓ correct — multi-line in assertions
expect(navigateToMock).toHaveBeenCalledWith({
  name: ROUTE_NAMES.albums,
  params: {
    sortBy: 'A-Z',
  },
});

// ✓ correct — multi-line when assigning to a ref
props.value = {
  propName: 'new value',
  anotherProp: 'another value',
};

// ✓ correct exception — single-property selector inline is fine
wrapper.find({ ref: 'dropdownSubmenuRef' }).trigger('mouseenter');
wrapper.findComponent({ ref: 'albumImageLink' });

// ✗ wrong — object args on one line
wrapper = factory({}, { default: '<li>Item</li>' });

// ✗ wrong — object inline in assertion
expect(navigateToMock).toHaveBeenCalledWith({
  name: ROUTE_NAMES.albums,
  params: { sortBy: 'A-Z' },
});

// ✗ wrong — multi-property object inline when assigning
props.value = { propName: 'new value', anotherProp: 'another value' };
```

## Slot content tests

Reassign `wrapper` via the factory with different slot content:

```ts
describe('when the slot content is provided', () => {
  beforeAll(async () => {
    isOpenMock.value = true; // ensure slot is visible
    wrapper = factory(
      {},
      {
        default: '<li>Item</li>',
      },
    );

    await wrapper.vm.$nextTick();
  });
});
```

## Test description wording

Every `it()` description uses a specific verb. Use the correct one for the assertion type — no substitutes:

| Assertion type                  | Wording                                                                                         |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| Snapshot                        | `'matches the snapshot'`                                                                        |
| Component / element visible     | `'shows the X component'` / `'shows the X element'`                                             |
| Component / element not visible | `'does not show the X component'` / `'does not show the X element'`                             |
| Default composable state        | `'sets the default X value'`                                                                    |
| State after a change            | `'sets the correct X value'`                                                                    |
| Prop on a component             | `'sets the correct X prop on the Y component'`                                                  |
| Attribute on an element         | `'sets the correct X attribute on the Y element'`                                               |
| Mock called with args           | `'calls the X function with the correct parameters'`                                            |
| Mock called without args        | `'calls the X function'`                                                                        |
| Mock not called                 | `'does not call the X function'`                                                                |
| Utility return value            | `'returns the correct response'`                                                                |
| Component emits                 | `'emits the X event'`                                                                           |
| Text content                    | `'displays X in the Y'`                                                                         |
| Page head title                 | `'sets the useHead function with correct title'`                                                |
| Adding to a collection          | `'adds to the X value'`                                                                         |
| Removing from a collection      | `'removes from the X value'`                                                                    |
| Clearing a collection           | `'clears the X value'`                                                                          |
| Class present                   | `'adds the X class to the Y element'` / `'adds the X class to the Y component'`                 |
| Class absent                    | `'does not add the X class to the Y element'` / `'does not add the X class to the Y component'` |

### Negation

Always `'does not X'` — never "shouldn't", "won't", "isn't", or "is not":

```ts
// ✓ correct
it('does not show the NoMediaMessage component');
it('does not call the navigateTo function');
it('does not emit the update event');
it('does not add the submenu class to the list element');
```

### Function call assertions

```ts
// ✓ with arguments — always "with the correct parameters"
it('calls the navigateTo function with the correct parameters');
it('calls the fetchData function with the correct parameters');

// ✓ without specific argument verification — omit "with the correct parameters"
it('calls the resetAllUserState function');
it('calls the clearQueue function');

// ✗ never append the composable name
it('calls the toggleInline function from useDropdownSubmenu');
```

### Event wiring describes

```ts
// Vue component emits
describe('when the SearchForm component emits a search event', ...)
describe('when the MixedTracksList component emits the addToPlaylist event', ...)

// Native DOM — "when the {event} is triggered on {element}"
describe('when the mouseenter is triggered on the submenu', ...)
describe('when the mouseover is triggered on wrapper', ...)

// Click shorthand
describe('when the update ButtonLink component is clicked', ...)

// ✗ wrong
describe('when the dropdownSubmenuRef element receives a mouseenter event', ...)
```

### "shows" not "renders"

Use **"shows"** for visibility assertions. **"displays"** is reserved for text content only:

```ts
// ✓ correct — visibility
it('shows the MainLoader component');
it('does not show the PageNavigation component');

// ✓ correct — text content only
it('displays zero queue count in the title');
it('displays the correct queue count in the title');

// ✗ wrong
it('renders the MainLoader component');
```

## Globals to avoid in component specs

- Do not `vi.stubGlobal('matchMedia', ...)` — matchMedia detection is a composable concern
- Do not use `vi.stubGlobal('AbortController', ...)` — AbortController usage is a composable concern
- Do not `Object.defineProperty(globalThis, 'innerWidth', ...)` — positioning is a composable concern

## Global test setup (vitest.setup.ts)

The following are available in every spec file without per-file mocking. Do not re-mock these unless a specific test requires different behaviour:

| Global                 | Behaviour                                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| `useAPI`               | `fetchData: vi.fn(() => ({ data: null }))`, `getDownloadUrl/getImageUrl/getStreamUrl: vi.fn(path => path)` |
| `debounce`             | pass-through — calls the callback directly without delay                                                   |
| `callOnce`             | pass-through — calls the callback immediately                                                              |
| `useId`                | returns a random string                                                                                    |
| `RouterLink`           | globally stubbed to `RouterLinkStub` from `@vue/test-utils`                                                |
| `teleport`             | globally stubbed to `true` — renders slot content inline                                                   |
| `MutationObserver`     | basic stub with `observe: vi.fn()` and `disconnect: vi.fn()`                                               |
| `IntersectionObserver` | full stub via `intersectionObserverMock([{ isIntersecting: true }])`                                       |
| `$fetch`               | stub that resolves to `{}`                                                                                 |
| `crypto-js/md5`        | returns `'MD5'`                                                                                            |

## vi.unmock() — testing real implementations

Nuxt's test environment auto-mocks modules in the same project. Call `vi.unmock()` at the top of the file (before imports) when the spec is testing the real implementation of a module that would otherwise be mocked:

```ts
// ✓ utils/dom.spec.ts — testing the real dom utility
vi.unmock('./dom');
import { findClosestElement } from './dom';

// ✓ composables/useApi/index.spec.ts — testing the real useAPI
vi.unmock('./index');
import { useAPI } from './index';
```

## vi.hoisted() — pre-import mock setup

Use `vi.hoisted()` to declare mock functions or reactive refs that must exist before module imports are resolved. The return value is passed directly to `mockNuxtImport`:

```ts
// Single function
const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

// Named object — destructure to keep each ref individually accessible
const { routeMock } = vi.hoisted(() => ({
  routeMock: vi.fn().mockReturnValue({
    name: '',
  }),
}));

mockNuxtImport('useRoute', () => routeMock);

// Typed generic — when the mock return type must be explicit
const getLocalStorageMock = vi.hoisted(() =>
  vi.fn<() => null | typeof AUDIO_PLAYER_DEFAULT_STATES>(() => null),
);

mockNuxtImport('getLocalStorage', () => getLocalStorageMock);
```

Always place a blank line between the mock variable declaration and the `mockNuxtImport` / `vi.mock` / `vi.spyOn` call that registers it. This applies whether the declaration uses `vi.hoisted()`, `ref()`, or `vi.fn()`.

`vi.hoisted()` is not needed for plain `ref()` or `vi.fn()` values used only inside `mockNuxtImport` factory callbacks — those are already evaluated lazily.

## Snapshot testing

Call `expect(wrapper.html()).toMatchSnapshot()` at the end of each component's default-state test. Snapshot files live in `__snapshots__/` next to the spec file and are committed to the repository.

```ts
it('matches the snapshot', () => {
  expect(wrapper.html()).toMatchSnapshot();
});
```

Also include it inside `describe.each` blocks when the snapshot varies per parameter:

```ts
describe.each([...])(
  'when the image prop is set to %s',
  (image) => {
    beforeEach(() => {
      wrapper = factory({
        image,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  },
);
```

Always use the wording **`'matches the snapshot'`** — no other wording is acceptable.

## Composable spec setup

### Module-scope calls (no lifecycle)

Simple composables that do not use `onMounted`, watchers, or `onBeforeUnmount` are called directly at module scope and destructured. Do not wrap them in `withSetup`:

```ts
// ✓ module scope — no lifecycle needed
const { collapsed, toggle, width } = useSidebar();
const { isQueueListOpened, toggleQueueList } = useQueue();
const { isDarkTheme, toggleTheme } = useTheme();

describe('useSidebar', () => {
  it('sets the default collapsed value', () => {
    expect(collapsed.value).toBe(false);
  });
});
```

### withSetup (lifecycle required)

Use `withSetup` when the composable calls `onMounted`, registers watchers, or calls `onBeforeUnmount`. Import from `@/test/withSetup`:

```ts
import { withSetup } from '@/test/withSetup';

let result: ReturnType<typeof withSetup<ReturnType<typeof useAudioPlayer>>>;

beforeEach(() => {
  result = withSetup(useAudioPlayer);
});
```

Call `result.app.unmount()` inside a `'when the component unmounts'` describe to trigger `onBeforeUnmount` hooks:

```ts
describe('when the component unmounts', () => {
  beforeAll(() => {
    result.app.unmount();
  });

  it('calls the abort function', () => {
    expect(abortMock).toHaveBeenCalled();
  });
});
```

## Async and timer utilities

### flushPromises()

Import from `@vue/test-utils`. Use `await flushPromises()` after triggering an async action (middleware call, composable async function) before asserting the settled state:

```ts
import { flushPromises } from '@vue/test-utils';

describe('when the navigateTo function is called', () => {
  beforeEach(async () => {
    await appGlobalMiddleware(to, from);
    await flushPromises();
  });

  it('calls the navigateTo function with the correct parameters', () => {
    expect(navigateToMock).toHaveBeenCalledWith({
      name: ROUTE_NAMES.login,
    });
  });
});
```

### vi.useFakeTimers()

Call at module scope (not inside `beforeEach`). Use `vi.advanceTimersByTime(ms)` to move time forward. Clean up with `vi.runOnlyPendingTimers()` in `afterEach`:

```ts
vi.useFakeTimers();

describe('doubleClick', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.runOnlyPendingTimers();
  });

  describe('when doubleClick is called again within 250ms', () => {
    beforeEach(() => {
      doubleClick(callbackMock);
      vi.advanceTimersByTime(300);
      doubleClick(callbackMock);
    });

    it('does not call the callback', () => {
      expect(callbackMock).not.toHaveBeenCalled();
    });
  });
});
```

### Async mock values

Declare the mock with a typed default, then override per describe block with `mockResolvedValue` / `mockRejectedValue`:

````ts
const fetchDataMock = vi.fn<() => DataMock>(() => ({
  data: null,
}));

describe('when fetchData response returns null', () => {
  beforeEach(async () => {
    fetchDataMock.mockResolvedValue({
      data: null,
    });

    await getPlaylists();
  });

  it('sets the default playlists value', () => {
    expect(playlists.value).toEqual([]);
  });
});

describe('when fetchData response returns a value', () => {
  beforeEach(async () => {
    fetchDataMock.mockResolvedValue({
      data: playlistsMock,
    });

    await getPlaylists();
  });

  it('sets the correct playlists value', () => {
    expect(playlists.value).toEqual(playlistsMock);
  });
});

## Component mount options

### global.stubs

Use `global.stubs` in the factory to stub child components. Never use `shallowMount`:

```ts
// Boolean stub — silences the component
function factory(props = {}) {
  return mount(MyPage, {
    global: {
      stubs: {
        MusicPlayerAndQueue: true,
        NuxtPage: true,
      },
    },
    props: { ...props },
  });
}

// Template stub — when the slot must render through
function factory(props = {}) {
  return mount(App, {
    global: {
      stubs: {
        NuxtLayout: {
          template: '<div><slot /></div>',
        },
        NuxtPage: true,
      },
    },
  });
}
````

### attachTo: document.body

Add `attachTo: document.body` to the factory when the component requires real layout or positioning (`getBoundingClientRect`, `scrollHeight`, focus management):

```ts
function factory(props = {}) {
  return mount(DropdownMenu, {
    attachTo: document.body,
    props: {
      ...props,
    },
    slots: {
      default: 'Default slot content.',
    },
  });
}
```

### setProps()

Use `await wrapper.setProps(...)` inside `beforeEach` to update a prop without remounting. Always `await` it:

```ts
describe('when the modelValue prop updates', () => {
  beforeEach(async () => {
    await wrapper.setProps({
      modelValue: 5,
    });
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
```

### RouterLinkStub

`RouterLink` is globally stubbed to `RouterLinkStub` (set in `vitest.setup.ts`). Import from `@vue/test-utils` to query it:

```ts
import { mount, RouterLinkStub } from '@vue/test-utils';

it('sets the correct to prop on the RouterLinkStub component', () => {
  expect(wrapper.findComponent(RouterLinkStub).props('to')).toEqual({
    params: {
      id: 'album-0',
    },
  });
});
```

### .emitted() for event assertions

Trigger a child emit with `.vm.$emit(...)`, then assert on the parent with `.emitted()`:

```ts
describe('when the AlbumTracksListItem component emits the dragStart event', () => {
  beforeEach(async () => {
    wrapper
      .findComponent(AlbumTracksListItem)
      .vm.$emit('dragStart', new DragEvent('dragstart'));

    await wrapper.vm.$nextTick();
  });

  it('emits the dragStart event with the correct value', () => {
    expect(wrapper.emitted('dragStart')).toEqual([
      [track, expect.any(DragEvent)],
    ]);
  });
});
```

## DOM and browser API mocking

These patterns are used in **composable specs only** — not component specs. See "Globals to avoid in component specs".

### Object.defineProperty for browser APIs

Use `Object.defineProperty` to mock browser APIs that cannot be assigned directly:

```ts
// navigator.mediaSession
Object.defineProperty(globalThis.navigator, 'mediaSession', {
  configurable: true,
  value: {
    playbackState: '',
    setActionHandler: vi.fn(),
    setPositionState: vi.fn(),
  },
  writable: true,
});

// document.visibilityState
Object.defineProperty(document, 'visibilityState', {
  value: 'hidden',
  writable: true,
});

// Custom global class
Object.defineProperty(globalThis, 'TouchEvent', {
  configurable: true,
  value: TestTouchEvent,
  writable: true,
});
```

### vi.spyOn for DOM methods

```ts
// Spy on prototype methods
const appendChildSpy = vi.spyOn(document.body, 'appendChild');
const querySelectorSpy = vi.spyOn(HTMLElement.prototype, 'querySelector');

const containsSpy = vi
  .spyOn(HTMLElement.prototype, 'contains')
  .mockReturnValue(false);

// Spy on globals
const requestAnimationFrameSpy = vi
  .spyOn(globalThis, 'requestAnimationFrame')
  .mockImplementation((callback) => {
    callback(0);
    return 0;
  });

// Spy on console
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
```

### HTMLElement.prototype for layout measurements

```ts
// Fixed rect for all elements
HTMLElement.prototype.getBoundingClientRect = () => new DOMRect(0, 0, 100, 0);

// Sequential values with mockImplementationOnce
HTMLElement.prototype.getClientRects = vi
  .fn()
  .mockImplementationOnce(() => ({ length: 3 }) as DOMRectList)
  .mockImplementationOnce(() => ({ length: 2.5 }) as DOMRectList);
```

### Multiple nextTick() calls

Call `await nextTick()` twice when a watcher needs two ticks to propagate (e.g. a `watchEffect` triggered by a `ref` that itself triggers another reactive update):

```ts
listContainerRef.value = container;
await nextTick();
await nextTick();
```

## Centralized test utilities (test/ folder)

Import from `@/test/...`. Each utility stubs a global and returns its internal mocks for assertions.

### abortControllerMock

Stubs `globalThis.AbortController`. Returns `{ abortControllerConstructorMock, abortMock, signalMock }`:

```ts
import { abortControllerMock } from '@/test/abortControllerMock';

const { abortControllerConstructorMock, abortMock, signalMock } =
  abortControllerMock();

it('creates the AbortController', () => {
  expect(abortControllerConstructorMock).toHaveBeenCalled();
});
```

### audioElementMock

Stubs the `<audio>` element for audio player tests. Call before `withSetup(useAudioPlayer)`.

### classListMock

Stubs `HTMLElement.prototype.classList`. Returns `{ addClassMock, containsClassMock, removeClassMock }`:

```ts
import { classListMock } from '@/test/classListMock';

const { addClassMock, removeClassMock } = classListMock();

it('adds the lockScroll class to the document.body', () => {
  expect(addClassMock).toHaveBeenCalledWith('lockScroll');
});
```

### eventListenersMock

Captures event callbacks registered on `document` and `window`. Returns `{ documentEvents, windowEvents, documentAddEventListenerSpy, documentRemoveEventListenerSpy, windowAddEventListenerSpy, windowRemoveEventListenerSpy }`:

```ts
import {
  documentEventListenerMock,
  windowEventListenerMock,
} from '@/test/eventListenersMock';

const { documentAddEventListenerSpy, documentEvents } =
  documentEventListenerMock();
const { windowEvents } = windowEventListenerMock();

it('adds the keydown event listener function', () => {
  expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
    'keydown',
    expect.any(Function),
    {
      signal: signalMock,
    },
  );
});

// Trigger the captured callback directly
documentEvents.keydown(new KeyboardEvent('keydown', { key: 'Escape' }));
windowEvents.click(new MouseEvent('click'));
```

### intersectionObserverMock

Stubs `globalThis.IntersectionObserver` (also called globally in `vitest.setup.ts` with `isIntersecting: true`). Call locally to override or capture refs. Returns `{ observeMock, disconnectMock }`:

```ts
import { intersectionObserverMock } from '@/test/intersectionObserverMock';

const { observeMock, disconnectMock } = intersectionObserverMock();
```

### mutationObserverMock

Overrides the basic `vitest.setup.ts` stub with a full implementation that captures the observer callback. Returns `{ observeMock, disconnectMock, triggerMutationObserver }`:

```ts
import { mutationObserverMock } from '@/test/mutationObserverMock';

const { observeMock, triggerMutationObserver } = mutationObserverMock();

it('observes the element with MutationObserver', () => {
  expect(observeMock).toHaveBeenCalled();
});

// Trigger the observer callback manually
triggerMutationObserver();
```

### refElementMock

Returns a `ref<HTMLElement>` pre-loaded with spy methods. Returns `{ refMock, containsMock, getBoundingClientRectMock }`:

```ts
import { refElementMock } from '@/test/refElementMock';

const dropdownMenuRef = refElementMock();
const dropdownListRef = refElementMock();

result = withSetup(() =>
  useDropdownMenu({
    dropdownListRef: dropdownListRef.refMock,
    dropdownMenuRef: dropdownMenuRef.refMock,
  }),
);
```

### requestAnimationFrameMock

Replaces `globalThis.requestAnimationFrame` with a controllable version. Returns `{ requestAnimationFrameSpy, cancelAnimationFrameSpy, triggerAnimationFrame }`:

```ts
import { requestAnimationFrameMock } from '@/test/requestAnimationFrameMock';

const { triggerAnimationFrame, requestAnimationFrameSpy } =
  requestAnimationFrameMock();

// Manually invoke the last scheduled callback
triggerAnimationFrame();
```

### useAudioPlayerMock

Globally mocks `useAudioPlayer` for component specs. Call at module scope and destructure only the refs and functions needed by the tests:

```ts
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';

const { currentTrackMock, isPlayingMock, togglePlayMock } =
  useAudioPlayerMock();
```

### useHeadMock

Globally mocks `useHead` and exposes `useHeadTitleMock` — a reactive ref that receives the title string set by the component:

```ts
import { useHeadMock } from '@/test/useHeadMock';

const { useHeadTitleMock } = useHeadMock();

it('sets the useHead function with correct title', () => {
  expect(useHeadTitleMock.value).toBe('Playlists');
});
```

## Partial match assertions

Use `expect.arrayContaining`, `expect.objectContaining`, and `expect.any` when only part of the structure matters:

```ts
// Array — check a subset of items
expect(snacks.value).toEqual(
  expect.arrayContaining([
    {
      content: DEFAULT_ERROR_MESSAGE,
      id: 'randomString',
      timer: expect.any(Object),
      type: 'error',
    },
  ]),
);

// Object — check a subset of keys
expect(formatAlbum({ ...albumMock, coverArt: undefined })).toEqual(
  expect.objectContaining({
    image: IMAGE_DEFAULT_BY_TYPE.album,
  }),
);

// Type — when the exact value is unknown
expect(fetchDataMock).toHaveBeenCalledWith('/search3', {
  query: {
    artistId: 'id',
  },
  transform: expect.any(Function),
});
```

## Reactive mock state

Declare mock reactive values at module scope using `ref()`. Mutate them in `beforeEach` — the factory remount in the parent `beforeEach` picks up the updated value automatically:

```ts
const playlistsMock = ref<Playlist[]>([]);

mockNuxtImport('usePlaylist', () => () => ({
  getPlaylists: getPlaylistsMock,
  playlists: playlistsMock,
}));

describe('when data returns a value', () => {
  beforeEach(() => {
    playlistsMock.value = getFormattedPlaylistsMock(2);

    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
```

Inside `describe.each`, add a matching `afterEach` to restore the ref after each parameterized run:

```ts
describe.each([
  [
    {
      content: 'content',
      id: 'id',
      type: 'error',
    },
  ],
])('when value is %o', (value) => {
  beforeEach(() => {
    snacksMock.value = [value as Snack];
  });

  afterEach(() => {
    snacksMock.value = [];
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
```

Use `reactive()` for plain object mocks (e.g. `$pwa`) where the whole object must be reactive:

```ts
const needRefreshMock = ref(false);

mockNuxtImport('useNuxtApp', () => () => ({
  $pwa: reactive({
    cancelPrompt: cancelPromptMock,
    needRefresh: needRefreshMock,
    updateServiceWorker: updateServiceWorkerMock,
  }),
}));
```

## Typed mock functions

Use TypeScript generics with `vi.fn` when the return type must be explicit:

```ts
// Typed return value — provides a default and constrains overrides
const fetchDataMock = vi.fn<() => DataMock>(() => ({
  data: null,
}));

// Typed with null union — via vi.hoisted
const getLocalStorageMock = vi.hoisted(() =>
  vi.fn<() => null | typeof AUDIO_PLAYER_DEFAULT_STATES>(() => null),
);
```

Always provide a default implementation inline — do not leave `vi.fn()` empty if a return value is expected in the default state of the tests.

```

```
