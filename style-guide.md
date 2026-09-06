# Portfolio design system

## Direction

An editorial, personal healthcare engineering portfolio. Lead with the person and the applications of their work. Use large type, deliberate whitespace, restrained borders, and meaningful project details.

## Tokens

| Token | Value     | Use                                  |
| ----- | --------- | ------------------------------------ |
| Paper | `#f6f5ef` | Main background                      |
| White | `#fffefb` | Cards and inputs                     |
| Ink   | `#243a32` | Text                                 |
| Muted | `#637068` | Supporting copy                      |
| Green | `#254e3f` | Primary actions and featured project |
| Lime  | `#deedbc` | Accent on dark surfaces              |
| Line  | `#d9ddd2` | Dividers                             |

DM Sans is used for body copy and headings; italic Newsreader supplies selective emphasis. Body copy is 14–16px, metadata 9–12px, section headings 36–58px, and the main heading 60–98px. Avoid long all-caps text and use generous leading for paragraphs.

## Layout

Maximum content width: 1200px. Desktop gutters: 56px; tablet: 32px; mobile: 20px (16px on the smallest screens). Two-column hero and project grid become one column at 760px. Expertise uses four columns, then two at 1050px, then one at 760px. Navigation is a progressively enhanced mobile disclosure.

Use 4–8px corners for components, with pills reserved for filters. Original artwork should preserve its aspect ratio; project images are conceptual and labelled accordingly.

## Behaviour and accessibility

- Semantic sections, heading hierarchy, a skip link, labelled inputs, visible focus indicators, and `aria-pressed` filters.
- Never hide primary content behind scroll animations.
- Honour `prefers-reduced-motion`.
- Native `details` for project depth. Chat is currently disabled; its launcher and dialog are not rendered.
- External links opening a new tab disclose that behaviour to assistive technology.
- Show explicit loading, error, and success states; preserve drafts on error.
- All content, anchor navigation and disclosures remain usable without JavaScript.

## Voice

Use first person, short explanations, Australian English, and concrete methods. Differentiate individual contributions from product capabilities and published study results. Add employment dates, qualifications and numerical achievements only when supported by the owner or a reliable source.
