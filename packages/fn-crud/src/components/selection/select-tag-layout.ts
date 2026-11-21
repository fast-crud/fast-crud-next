export function countVisibleTags(
  tagWidths: number[],
  availableWidth: number,
  inputWidth: number,
  gap: number,
  overflowWidths: number[],
): number {
  if (tagWidths.length <= 1) return tagWidths.length;
  let width = tagWidths.reduce((total, tagWidth) => total + tagWidth + gap, inputWidth);
  if (width <= availableWidth) return tagWidths.length;

  for (let visible = tagWidths.length - 1; visible > 0; visible--) {
    width -= tagWidths[visible] + gap;
    const hiddenDigits = String(tagWidths.length - visible).length;
    if (width + overflowWidths[hiddenDigits - 1] + gap <= availableWidth) return visible;
  }
  return 1;
}
