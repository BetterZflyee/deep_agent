# Task: Strategy Agent Interaction Implementation

## Status
- [ ] Update HeroBanner.tsx
- [ ] Verify Implementation

## Requirements
1. **Input Handling**: Capture user input from Editor.
2. **Validation**: Ensure input is not empty.
3. **Trigger**: Send button clicks trigger API call with input.
4. **Feedback**: Show loading state and results.

## Dependencies
- `src/components/create/HeroBanner.tsx`
- `src/pages/api/workflows/strategy.ts` (Already updated)

## Implementation Steps
1. Add `inputText` state to `HeroBanner`.
2. Update `Editor` `onInput` to set `inputText`.
3. Update `trigger` function to accept `payload`.
4. Implement `handleSend` to validate and call `trigger`.
5. Bind `handleSend` to button `onClick`.
