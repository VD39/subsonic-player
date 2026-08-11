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

      await nextTick();
    });

    describe('when isOpen changes to false', () => {
      beforeAll(async () => {
        isOpenMock.value = false;

        await nextTick();
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

mockNuxtImport('useDropdownSubmenu', (original) => () => ({
 ...original(),
  isOpen: isOpenMock,
  openSubmenu: openSubmenuMock,
  // ... all returned values
}));

// Composable spec — mock dependencies, call composable directly
mockNuxtImport('useDropdownMenuState', (original) => () => ({
 ...original(),
  openEventCount: openEventCountMock,
}));

result = await withSetup(() => useDropdownSubmenu({ ... }));
```

For object-returning mocks, use a concise nested arrow function. Do not wrap it in a block with an explicit `return`:

```ts
// ✓ correct
mockNuxtImport('useRuntimeConfig', (original) => () => ({
  ...original(),
  ...configMock,
}));

// ✗ wrong
mockNuxtImport('useRuntimeConfig', (original) => {
  return () => ({
    ...original(),
    ...configMock,
  });
});
```

## NUXT_E1005 — app initialization errors

`[NUXT_E1005]` on stderr means "Error caught during app initialization". The nuxt vitest environment (with `@nuxt/test-utils` 4) runs the real Nuxt app setup — plugins, global middleware, and the initial navigation — in a `beforeAll` for every spec file. An error thrown there is caught and logged as `[NUXT_E1005]`; tests still pass, but the noise signals a real setup bug. Common causes and fixes:

- **Incomplete `useRouter` mock** — Nuxt client plugins (`chunk-reload`, `navigation-repaint`, `restore-state`, `view-transitions`) call `router.beforeEach`, `router.beforeResolve`, `router.afterEach`, `router.onError`, `router.replace`, and `router.resolve` during app init. Mock a complete router with `useRouterMock` from `@/test/useRouterMock` (see `app.spec.ts`).
- **`useNuxtApp` mock missing `$router`** — `navigateTo` calls `useRouter().resolve(...)` internally, and `useRouter` reads `$router` off the nuxtApp. `$router` is a non-enumerable getter on the real nuxtApp, so the `...original()` spread does not carry it over — add `$router: routerMock` explicitly.
- **`useNuxtApp` mock clobbering `payload`** — do not override `payload` with `{}`; the global middleware's `callOnce` reads `nuxtApp.payload.once`. Spread the real `...original()` payload (or ensure `payload.once` is a `Set`).
- **Shallow `matchMedia` mock** — `plugins/settings.client.ts` runs during app init and calls `matchMedia(...).addEventListener(...)`. If a spec stubs `matchMedia` with only `{ matches }`, the plugin throws. Use `matchMediaMock` from `@/test/matchMediaMock`, which includes `addEventListener`.
- **`$fetch` mock missing `create`** — `plugins/api.ts` calls `$fetch.create(...)` during app init. When a spec mocks `$fetch` (e.g. `server/api/artist.spec.ts`), the mock must expose a `create` function: `Object.assign(vi.fn(), { create: vi.fn() })`.
- **Real `autoLogin` running with an `undefined`-returning `fetchData` mock** — the global middleware (`app.global.ts`) calls `autoLogin()` at app init, and the real `autoLogin` destructures `{ data, error }` from `fetchData(...)`. When a spec mocks `useAPI` with `fetchData: vi.fn()` (returns `undefined`) while `useUser` provides a truthy `server` (so `autoLogin` does not bail early), app init throws. Either mock `autoLogin: vi.fn()` in the `useAuth` mock, or give `fetchData` a default return like `vi.fn(() => ({ data: null }))`.

## Mock data conventions

### No test-only types

Never create a local `type` or `interface` for the purpose of mocking. Always use existing project types (`Album`, `Track`, `Playlist`, etc.) which are globally available in spec files without importing.

### No imports for Nuxt auto-imported values

Never explicitly import types, constants, composables, or utilities that are auto-imported by Nuxt. These are globally available in spec files via the vitest setup. This includes:

- Types from `types/` (e.g. `Album`, `Track`, `Playlist`, `SortOption`)
- Constants from `constants/` and composable-level constants (e.g. `SORT_NAME_OPTIONS`, `SORT_RANDOM_OPTIONS`, `ICONS`, `ROUTE_NAMES`)
- Utilities from `utils/` (e.g. `shuffleArray`, `debounce`)
- Composables from `composables/` (e.g. `useLocalSort`, `useAuth`)

Only import from:

- `@/test/helpers` and `@/test/withSetup` (test utilities)
- The file under test itself (e.g. `import { useLocalSort } from './index'`)

```ts
// ✓ correct — auto-imported, no import statement needed
const sortOptionsMock: SortOption<Album>[] = [...];
expect(result.composable.sortProps.value.activeSort).toBe(SORT_NAME_OPTIONS.key);

// ✗ wrong — explicitly importing auto-imported values
import type { SortOption } from './types';
import { SORT_NAME_OPTIONS, SORT_RANDOM_OPTIONS } from './constants';
```

### Use helpers and fixtures for mock data

Always reach for an existing helper from `@/test/helpers` or a fixture from `@/test/fixtures` before defining mock data inline. If neither covers the case, add to the appropriate file and import it.

The `params` argument on all helpers overrides individual fields per call. All helpers support `name` as an overridable param:

```ts
// ✓ — use the helper, override the fields you need
const tracks = [
  getFormattedTracksMock(1, {
    name: 'Track A',
  })[0],
  getFormattedTracksMock(1, {
    name: 'Track B',
  })[0],
];

// ✓ — multiple items: call with the count you need
const tracks = getFormattedTracksMock(3);

// ✓ — single item: call with 1 and index into the result
const track = getFormattedTracksMock()[0];

// ✗ — do not build mock objects from scratch when a helper exists
const tracks = [
  {
    id: 'track-0',
    name: 'Track A',
  },
];
```

### Where mock data lives

| Data                                                  | Where it lives                        |
| ----------------------------------------------------- | ------------------------------------- |
| Reusable mock objects (shared across spec files)      | `@/test/fixtures` or `@/test/helpers` |
| Test-specific config (e.g. options for a single spec) | Inline in the spec file               |

If a mock constant cannot be derived from an existing helper or fixture, add it to `@/test/fixtures` (static value) or `@/test/helpers` (factory function), then import it. Do not define reusable mocks inline in spec files.

### Type annotations on inline mock constants

Use the project type as an explicit annotation — do not use `as const` on individual string literals as a workaround:

```ts
// ✓ correct — explicit type annotation
const sortOptionsMock: SortOption<Album>[] = [
  {
    defaultDirection: 'asc',
    key: 'year',
    label: 'Year',
  },
];

// ✗ wrong — as const workaround instead of a proper type annotation
const sortOptionsMock = [
  {
    defaultDirection: 'asc' as const,
    key: 'year',
    label: 'Year',
  },
];
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
expect(value).toBeNull();
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

### Composable return values — no standalone describe blocks

Computed values and reactive state returned by a composable only change when something happens. Never give them their own `describe` block. Instead:

- Assert the **initial/default** state with a top-level `it` inside the composable's describe
- Assert **post-change** state inside the relevant condition describe — which can be any meaningful scenario: a function call, an event emission, a prop change, a lifecycle hook, an empty array, etc.

```ts
// ✓ correct — initial state at top level, post-change state inside a condition describe
it('sets the default sortedItems value', () => {
  expect(result.composable.sortedItems.value).toEqual([...]);
});

describe('when the toggleSort function is called', () => {
  beforeEach(() => {
    result.composable.toggleSort('name');
  });

  it('sets the correct sortedItems value', () => {
    expect(result.composable.sortedItems.value).toEqual([...]);
  });
});

describe('when items is an empty array', () => {
  it('sets the correct sortedItems value', () => {
    expect(result.composable.sortedItems.value).toEqual([]);
  });
});

// ✗ wrong — standalone describe block named after a return value
describe('sortedItems', () => {
  describe('when items are sorted by string value', () => {
    it('returns the correct response', () => { ... });
  });
});
```

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

Always reassign the shared `wrapper` variable when remounting with different props — never declare a separate local wrapper variable:

```ts
// ✓ correct — reassign the shared wrapper
describe('when the isStatic prop is true', () => {
  beforeEach(async () => {
    wrapper = factory({
      isStatic: true,
    });

    await nextTick();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});

// ✗ wrong — separate local wrapper variable
describe('when the isStatic prop is true', () => {
  let staticWrapper: VueWrapper;

  beforeEach(async () => {
    staticWrapper = factory({
      isStatic: true,
    });

    await staticWrapper.vm.$nextTick();
  });

  it('matches the snapshot', () => {
    expect(staticWrapper.html()).toMatchSnapshot();
  });
});
```

The only exception is when two different wrappers must exist **simultaneously** in the same test (e.g. comparing two mounted instances side by side). In that case, name the second one descriptively (`iconWrapper`, `emptyWrapper`) and use `beforeEach` so it is recreated fresh for each test.

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
await wrapper.find({ ref: 'dropdownSubmenuRef' }).trigger('mouseenter');
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

    await nextTick();
  });
});
```

## Test description wording

Every `it()` description uses a specific verb. Use the correct one for the assertion type — no substitutes:

| Assertion type                  | Wording                                                                                                                                                                                                                                                                                                                      |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Snapshot                        | `'matches the snapshot'`                                                                                                                                                                                                                                                                                                     |
| Component / element visible     | `'shows the X component'` / `'shows the X element'`                                                                                                                                                                                                                                                                          |
| Component / element not visible | `'does not show the X component'` / `'does not show the X element'`                                                                                                                                                                                                                                                          |
| Default composable state        | `'sets the default X value'`                                                                                                                                                                                                                                                                                                 |
| State after a change            | `'sets the correct X value'`                                                                                                                                                                                                                                                                                                 |
| Composable `.value` property    | `'sets the correct X value'` — never `'returns the correct response'`                                                                                                                                                                                                                                                        |
| Prop on a component             | `'sets the correct X prop on the Y component'`                                                                                                                                                                                                                                                                               |
| Attribute on an element         | `'sets the correct X attribute on the Y element'`                                                                                                                                                                                                                                                                            |
| Mock called with args           | `'calls the X function with the correct parameters'`                                                                                                                                                                                                                                                                         |
| Modal opened with args          | `'calls the openModal function with the correct parameters'`                                                                                                                                                                                                                                                                 |
| Mock called without args        | `'calls the X function'`                                                                                                                                                                                                                                                                                                     |
| Mock not called                 | `'does not call the X function'`                                                                                                                                                                                                                                                                                             |
| Utility return value            | `'returns the correct response'`                                                                                                                                                                                                                                                                                             |
| Component emits                 | `'emits the X event'`                                                                                                                                                                                                                                                                                                        |
| Text content                    | `'displays X in the Y'`                                                                                                                                                                                                                                                                                                      |
| ButtonLink slot content         | `'sets the correct slot data on the X ButtonLink component'`                                                                                                                                                                                                                                                                 |
| Page head title                 | `'sets the useHead function with correct title'`                                                                                                                                                                                                                                                                             |
| Adding to a collection          | `'adds to the X value'`                                                                                                                                                                                                                                                                                                      |
| Removing from a collection      | `'removes from the X value'`                                                                                                                                                                                                                                                                                                 |
| Clearing a collection           | `'clears the X value'`                                                                                                                                                                                                                                                                                                       |
| Class present                   | `'adds the X class to the Y element'` / `'adds the X class to the Y component'`                                                                                                                                                                                                                                              |
| Class absent                    | `'does not add the X class to the Y element'` / `'does not add the X class to the Y component'`                                                                                                                                                                                                                              |
| Prop-driven behaviour           | Both `describe('when the X prop is set', ...)` and `describe('when the X prop is not set', ...)`. Only required when the prop conditionally changes the component (adds/removes a class, shows/hides an element, switches between values). Not needed when the prop value is just passed through to a child component as-is. |

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

// ✓ when the mock wraps a native HTMLAudioElement method, prefix with "audio"
it('calls the audio pause function');
it('calls the audio play function');
it('calls the audio load function');

// ✓ when multiple mocks share a method name, specify the mock with "on the X"
it(
  'calls the connect function on the replayGainNode with the correct parameters',
);
it('calls the disconnect function on the sourceNode');

// ✗ never append the composable name
it('calls the toggleInline function from useDropdownSubmenu');

// ✗ ambiguous when 3 mocks all have .connect and descriptions are identical
it('calls the connect function with the correct parameters');
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

Only call `vi.unmock()` when the module being tested has an explicit mock registered — either via a `__mocks__` file next to it, or via a `vi.mock()` / `mockNuxtImport()` call in `vitest.setup.ts`. Do **not** add `vi.unmock()` speculatively. If no mock is registered for the module, omit `vi.unmock()` entirely.

When a mock is registered, call `vi.unmock()` at the top of the file (before imports):

```ts
// ✓ utils/dom.spec.ts — testing the real dom utility (a __mocks__/dom.ts exists)
vi.unmock('./dom');
import { findClosestElement } from './dom';

// ✓ composables/useApi/index.spec.ts — testing the real useAPI (mocked in vitest.setup.ts)
vi.unmock('./index');
import { useAPI } from './index';

// ✗ wrong — no mock is registered for utils.ts, vi.unmock() is unnecessary
vi.unmock('./utils');
import { isNumeric } from './utils';
```

## vi.hoisted() — pre-import mock setup

Use `vi.hoisted()` to declare mock functions or reactive refs that must exist before module imports are resolved. The return value is passed directly to `mockNuxtImport`:

```ts
// Single function
const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

// Named object — destructure to keep each ref individually accessible
const routeMock = reactive({
  name: '',
});

mockNuxtImport('useRoute', () => () => routeMock);

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

## Utility function specs

Utility functions take inputs and return outputs with no side effects and no mocks. Follow these rules:

- **Prefer `describe.each`** for parameterized input/output cases over writing one `it` per value
- **Never add `afterEach(vi.clearAllMocks())`** unless there are actual `vi.fn()` mocks in the file
- **Never add `vi.unmock()`** unless the module has a registered mock (see section above)
- Use `'when the value is %o'` as the `describe.each` label and `'returns the correct response'` as the `it` label

```ts
// ✓ correct — describe.each, no afterEach, no vi.unmock
import { isNumeric } from './utils';

describe('isNumeric', () => {
  describe.each([
    [42, true],
    [NaN, false],
    ['42', true],
    ['hello', false],
    [null, false],
  ])('when the value is %o', (value: unknown, expected: boolean) => {
    it('returns the correct response', () => {
      expect(isNumeric(value)).toBe(expected);
    });
  });
});

// ✗ wrong — individual its, unnecessary afterEach, unnecessary vi.unmock
vi.unmock('./utils');
import { isNumeric } from './utils';

describe('isNumeric', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns true for a number', () => {
    expect(isNumeric(42)).toBe(true);
  });

  it('returns false for NaN', () => {
    expect(isNumeric(NaN)).toBe(false);
  });
});
```

## Composable spec setup

### Composable instantiation (no lifecycle)

Simple composables that do not use `onMounted`, watchers, or `onBeforeUnmount` do not need `withSetup`, but with `@nuxt/test-utils` 4 the composable must be instantiated inside a `beforeEach`, never at module scope (module-scope calls throw `NUXT_E1001` at import). Declare `let composable` and assign it in the top-level `beforeEach`, then reference every destructured member through `composable.`:

```ts
// ✓ beforeEach — the Nuxt app context is only available inside lifecycle hooks
describe('useSidebar', () => {
  let composable: ReturnType<typeof useSidebar>;

  beforeEach(() => {
    composable = useSidebar();
  });

  it('sets the default collapsed value', () => {
    expect(composable.collapsed.value).toBe(false);
  });
});
```

`beforeEach` runs before any nested `beforeAll`, so setup inside nested `beforeAll` blocks still sees the freshly instantiated composable.

Composables that use `onMounted`, watchers, or `onBeforeUnmount` must be mounted with `withSetup` (see below).

### withSetup (lifecycle required)

Use `withSetup` when the composable calls `onMounted`, registers watchers, or calls `onBeforeUnmount`. Import from `@/test/withSetup`:

```ts
import { withSetup } from '@/test/withSetup';

let result: Awaited<
  ReturnType<typeof withSetup<ReturnType<typeof useAudioPlayer>>>
>;

beforeEach(async () => {
  result = await withSetup(useAudioPlayer);
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

### mountSuspended() with routes

For a component or page spec that depends on the Nuxt route, use `mountSuspended()` with a real route instead of mocking `useRoute`. The factory becomes async and every assignment must await it:

```ts
import { mountSuspended } from '@nuxt/test-utils/runtime';

async function factory(props = {}, route = '/albums/newest') {
  return mountSuspended(AlbumsPage, {
    props: {
      ...props,
    },
    route,
  });
}

beforeEach(async () => {
  wrapper = await factory();
});

describe('when the sortBy route param is random', () => {
  beforeEach(async () => {
    wrapper = await factory({}, '/albums/random');
  });
});
```

For a composable spec, keep `useRoute` as a mocked dependency. Return one reactive route object so state changes are observed by the composable; do not replace the mock implementation after the composable has been created:

```ts
const routeMock = reactive({
  name: ROUTE_NAMES.index,
});

mockNuxtImport('useRoute', () => () => routeMock);

describe('when the route name is not in the navigation', () => {
  beforeEach(() => {
    routeMock.name = 'not-in-navigation';
  });
});
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

it('sets the correct to prop on the RouterLink component', () => {
  expect(wrapper.findComponent(RouterLinkStub).props('to')).toEqual({
    params: {
      id: 'album-0',
    },
  });
});
```

### .emitted() for event assertions

Use `.vm.$emit(...)` only to simulate a **custom child-component event** whose payload is part of that child's public contract. Use `await .trigger(...)` for native DOM interactions, including `click`, `focus`, keyboard, pointer, and form events. Never simulate a native interaction with `$emit('click')`.

Always await `trigger()`, including when it is part of a multiline chain, and make the enclosing hook or test `async`:

```ts
// ✓ correct — native DOM interaction
beforeEach(async () => {
  await wrapper.findComponent(ButtonLink).trigger('click');
});

// ✓ correct — custom event emitted by a child component
beforeEach(() => {
  wrapper.findComponent(AlbumTracksListItem).vm.$emit('dragStart', DragEvent);
});

// ✗ wrong — trigger is not awaited
beforeEach(() => {
  wrapper.findComponent(ButtonLink).trigger('click');
});

// ✗ wrong — click is a native interaction, not a child contract event
wrapper.findComponent(ButtonLink).vm.$emit('click');
```

Then assert on the parent with `.emitted()`:

```ts
describe('when the AlbumTracksListItem component emits the dragStart event', () => {
  beforeEach(async () => {
    wrapper.findComponent(AlbumTracksListItem).vm.$emit('dragStart', DragEvent);
  });

  it('emits the dragStart event with the correct value', () => {
    expect(wrapper.emitted('dragStart')).toEqual([
      [track, expect.any(DragEvent)],
    ]);
  });
});

describe('when the ButtonLink component is clicked', () => {
  beforeEach(async () => {
    await wrapper.findComponent(ButtonLink).trigger('click');
  });

  it('emits the addToQueue event with the correct value', () => {
    expect(wrapper.emitted('addToQueue')).toEqual([[track]]);
  });
});
```

### Mock call arguments

When the implementation passes stable, meaningful arguments to a mock, assert them with `.toHaveBeenCalledWith(...)`. Keep `.toHaveBeenCalled()` only for genuinely argument-free calls.

```ts
// ✓ correct — the endpoint is part of the behavior
expect(fetchDataMock).toHaveBeenCalledWith('/ping');

// ✓ correct — a callback is registered
expect(onPlayMock).toHaveBeenCalledWith(expect.any(Function));

// ✓ correct — no arguments are passed
expect(playMock).toHaveBeenCalled();

// ✗ wrong — omits an important argument contract
expect(fetchDataMock).toHaveBeenCalled();
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
const consoleErrorSpy = vi
  .spyOn(console, 'error')
  .mockImplementation(() => ({}));
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

### browserMocks

Stubs browser APIs that are not available in the test environment via `Object.defineProperty`. Call at module scope in **composable specs**.

**`cachesMock()`** — Stubs `globalThis.caches` for PWA cache testing. Returns `{ deleteMock, keysMock, restore }`:

```ts
import { cachesMock } from '@/test/browserMocks';

const { deleteMock, keysMock } = cachesMock();

it('calls the caches.delete function with the correct parameters', () => {
  expect(deleteMock).toHaveBeenCalledWith('audio-cache');
});
```

Only call `restore` when a test deletes `globalThis.caches` (e.g. testing the "API not available" path):

```ts
const { restore: restoreCachesMock } = cachesMock();

afterEach(() => {
  vi.clearAllMocks();
  restoreCachesMock();
});

describe('when the caches API is not available', () => {
  beforeEach(async () => {
    delete (globalThis as Record<string, unknown>).caches;
    await clearPwaCaches();
  });
});
```

**`navigatorStorageMock()`** — Stubs `globalThis.navigator.storage` for storage estimate testing. Returns `{ estimateMock, restore }`:

```ts
import { navigatorStorageMock } from '@/test/browserMocks';

const { estimateMock } = navigatorStorageMock();
```

Only call `restore` when a test deletes `navigator.storage`:

```ts
const { restore: restoreStorageMock } = navigatorStorageMock();

afterEach(() => {
  vi.clearAllMocks();
  restoreStorageMock();
});
```

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

### matchMediaMock

Stubs `globalThis.matchMedia` with a `MediaQueryList`-shaped object and captures the `change` callback. Returns `{ matchMediaSpy, matchesMock, triggerChangeEvent }`:

```ts
import { matchMediaMock } from '@/test/matchMediaMock';

const { matchesMock, triggerChangeEvent } = matchMediaMock();

// Drive the matches value read by useDropdownSubmenu / resolveDarkTheme
matchesMock.value = true;

// Fire the change listener registered by plugins/settings.client.ts
triggerChangeEvent();
```

The mock object includes `addEventListener`/`removeEventListener`. This is required because the real `plugins/settings.client.ts` runs during app initialization in every spec and calls `matchMedia(...).addEventListener(...)` — a shallow `{ matches }` stub throws at app init and logs `[NUXT_E1005]` to stderr (see "NUXT_E1005 — app initialization errors").

### fixtures

Static mock data objects used as building blocks for tests. Import from `@/test/fixtures`. Each fixture represents a real entity shape used across the project:

```ts
import { albumMock, trackMock, settingsMock } from '@/test/fixtures';
```

Available fixtures are split into two categories:

**Raw API responses** (match Subsonic API types):
`authDataMock`, `cookieMock`, `apiDateMock`, `trackBlobMock`, `routeMock`, `musicFolderMock`, `radioStationMock`, `trackMock`, `queueMock`, `albumMock`, `artistMock`, `artistInfo2Mock`, `artistDataMock`, `similarSongsMock`, `topSongsMock`, `playlistMock`, `podcastEpisodeMock`, `podcastMock`, `genreMock`

**Formatted entities** (match app-level display types):
`formattedGenreMock`, `formattedTrackMock`, `formattedPlaylistMock`, `formattedAlbumMock`, `formattedArtistMock`, `formattedPodcastEpisodeMock`, `formattedBookmarkMock`, `formattedPodcastMock`, `formattedRadioStationMock`

**Configuration mocks:**
`gridWrapperPropsMock`, `appInformationMock`, `serverInformationMock`, `searchSuggestionsMock`, `settingsMock`

These are the single-instance defaults. Use `helpers` factory functions when you need multiple items with unique IDs.

### helpers

Factory functions that generate arrays of mock objects with auto-incrementing IDs. Import from `@/test/helpers`. Each factory accepts a `length` (default `1`) and optional `params` override:

```ts
import { getFormattedTracksMock, getFormattedAlbumsMock } from '@/test/helpers';

// Single item
const track = getFormattedTracksMock()[0];

// Multiple items with overrides
const albums = getFormattedAlbumsMock(3, { year: 2024 });

// With type override for queue tracks
const podcasts = getFormattedQueueTracksMock(2, {
  type: MEDIA_TYPE.podcastEpisode,
});
```

Available factories:
`getAlbumsMock`, `getFormattedAlbumsMock`, `getFormattedArtistsMock`, `getFormattedBookmarksMock`, `getFormattedGenresMock`, `getFormattedPlaylistsMock`, `getFormattedPodcastEpisodesMock`, `getFormattedPodcastsMock`, `getFormattedQueueTracksMock`, `getFormattedRadioStationMock`, `getFormattedTracksMock`, `getPlaylistsMock`, `getPodcastEpisodesMock`, `getTracksMock`

The `params` argument on all helpers overrides individual fields per call. All helpers support `name` as an overridable param.

### types

Shared TypeScript types used across test utilities. Import from `@/test/types`:

```ts
import type { DataMock, EventCallback, EventHandler } from '@/test/types';
```

- `DataMock` — Object with `data: unknown` and optional `error` field, used as a generic API response shape
- `EventCallback` — Function type accepting an optional partial event, used for event handler tests
- `EventHandler` — Generic variadic function type `(...args: unknown[]) => void`

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

result = await withSetup(() =>
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

### useQueueMock

Globally mocks `useQueue` for component specs via `mockNuxtImport`. Call at module scope and destructure only the refs and mocks needed by the test:

```ts
import { useQueueMock } from '@/test/useQueueMock';

const { addTracksMock, currentTrackMock, queueListMock, resetQueueMock } =
  useQueueMock();
```

Provides mocks for every return value of `useQueue`: `addTracksMock`, `closeQueuePanelsMock`, `currentQueueIndexMock`, `currentTrackMock`, `enrichTracksWithPositionsMock`, `hasCurrentTrackMock`, `hasNextTrackMock`, `hasPreviousTrackMock`, `hasQueueTracksMock`, `isCurrentTrackMock`, `isLastTrackMock`, `isPodcastEpisodeMock`, `isQueueListOpenedMock`, `isQueuePlayerOpenedMock`, `isRadioStationMock`, `isTrackMock`, `loadQueueStateMock`, `mergeBookmarksToCurrentQueueMock`, `navigateQueueMock`, `originalQueueListMock`, `queueListMock`, `removeAllByTrackIdMock`, `removeTrackMock`, `reorderQueueTracksMock`, `resetQueueMock`, `restoreLocalStateMock`, `restoreQueueStateFromLocalMock`, `restoreQueueStateFromServerMock`, `shuffleQueueMock`, `toggleQueueListMock`, `toggleQueuePlayerMock`, `unshuffleQueueMock`, `updateCurrentTrackPositionMock`, `updateTrackFavouriteMock`.

Pre-populated defaults: `queueListMock.value` starts with 5 formatted queue tracks, `currentTrackMock.value` is the first item, `addTracksMock` pushes into `queueListMock`, and `resetQueueMock` empties the list and resets the index. Override any mock in `beforeEach` as needed.

### useRouterMock

Globally mocks `useRouter` for component specs via `mockNuxtImport`. Call at module scope; returns the composed `routerMock` plus one mock per router method:

```ts
import { useRouterMock } from '@/test/useRouterMock';

const { routerMock } = useRouterMock();

mockNuxtImport('useNuxtApp', (original) => () => ({
  ...original(),
  $router: routerMock,
  ...
}));
```

`routerMock` is a complete router object — every method (`addRoute`, `afterEach`, `back`, `beforeEach`, `beforeResolve`, `currentRoute`, `forward`, `getRoutes`, `go`, `hasRoute`, `install`, `isReady`, `onError`, `push`, `removeRoute`, `replace`, `resolve`) is a `vi.fn()`. A shallow `{ afterEach, beforeResolve }` stub is not enough: Nuxt client plugins call `router.beforeEach`/`onError`/`replace`/`resolve` during app initialization, so an incomplete mock throws and logs `[NUXT_E1005]` (see "NUXT_E1005 — app initialization errors").

Also assign `routerMock` to `$router` on a mocked `useNuxtApp`. `navigateTo` calls `useRouter().resolve(...)` internally, and `$router` is a non-enumerable getter on the real nuxtApp that the `...original()` spread drops.

## Partial match assertions

Use `expect.arrayContaining`, `expect.objectContaining`, and `expect.any` when only part of the structure matters:

### Modal argument assertions

When a component or page calls `openModal`, assert the `MODAL_TYPE` and relevant static attrs. Use `expect.any(Function)` for callback references to avoid coupling to closure identity:

```ts
it('calls the openModal function with the correct parameters', () => {
  expect(openModalMock).toHaveBeenCalledWith(
    MODAL_TYPE.<modalType>,
    {
      ...attrs,
      onCancel: expect.any(Function),
      onConfirm: expect.any(Function),
    },
  );
});
```

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

mockNuxtImport('usePlaylist', (original) => () => ({
  ...original(),
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

mockNuxtImport('useNuxtApp', (original) => () => ({
  ...original(),
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
