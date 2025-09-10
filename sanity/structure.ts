import type { StructureResolver } from 'sanity/structure';
// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = S =>
  S.list()
    .title('Little Bloom')
    .items([
      S.documentTypeListItem('ekontSenderDetails').title(
        'Еконт данни (подател)',
      ),
      S.divider(),
      // ...S.documentTypeListItems().filter(
      //   item =>
      //     item.getId() &&
      //     ![
      //       'contactInfo',

      //     ].includes(item.getId()!),
      // ),
    ]);
