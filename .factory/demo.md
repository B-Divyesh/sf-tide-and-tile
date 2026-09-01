# Demo verification

Open `/demo`. It immediately loads **Sample harbor**, a connected 4×4 route with four marked tiles. Each marked tile needs one clockwise turn, so the shown fewest score is exactly four.

The banner stays visible in demo mode. **Reset demo** restores the sample. **Start for real** deletes `demo:tide-and-tile` and opens the current UTC daily board. Demo mode never reads or writes `tide:tide-and-tile`.

Complete the four marked rotations to reach the win screen. Use any wrong tile until turn 12 to reach the loss screen. Both screens restart the same route with one action. The versioned service worker makes the sample available after an offline reload.

Real data stores daily boards by UTC date and archive boards by seed. Archive practice stays locked until `completedDailyUtc` exactly matches today’s UTC date. Demo data never unlocks it.
