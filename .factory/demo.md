# Demo verification

Open `/demo` (the canonical demo route). It immediately loads the guided **Sample harbor** board. Tap a tile, use Enter on a focused tile, or use arrow keys to choose a neighboring tile.

The demo banner remains visible while sample mode is active. **Reset demo** replaces the sample state. **Start for real** clears `demo:tide-and-tile` and opens the current daily board. Demo mode never reads or writes the real `tide:tide-and-tile` key.

The service worker caches the shell and game resources after the first visit, so the sample board can reload offline.
