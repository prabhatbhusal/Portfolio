/** how far a pile of sticky cards has stacked: 0 while only the first is
 *  up, 1 once the second has landed on it, 2 for the third, and fractions
 *  in between. measured from the cards themselves, so the 3d scene and the
 *  option list can never drift from what is on screen */
export function stackProgress(cards: HTMLElement[]) {
  if (cards.length < 2) return 0;
  const gap = parseFloat(getComputedStyle(cards[0].parentElement!).rowGap) || 0;
  const pitch = cards[0].offsetHeight + gap;
  let t = 0;
  for (let i = 1; i < cards.length; i++) {
    const stick = parseFloat(getComputedStyle(cards[i]).top) || 0;
    const distance = cards[i].getBoundingClientRect().top - stick;
    t += Math.min(1, Math.max(0, 1 - distance / pitch));
  }
  return t;
}
