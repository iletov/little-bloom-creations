import type { StructureResolver } from 'sanity/structure';
// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = S =>
  S.list()
    .title('Little Bloom')
    .items([
      S.documentTypeListItem('pageType').title('Pages'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('productType').title('Products'),
      S.divider(),

      S.documentTypeListItem('ekontSenderDetails').title(
        'Еконт данни (подател)',
      ),
      S.documentTypeListItem('speedySenderDetails').title(
        'Спиди данни (подател)',
      ),
      // ...S.documentTypeListItems().filter(
      //   item =>
      //     item.getId() &&
      //     ![
      //       'contactInfo',

      //     ].includes(item.getId()!),
      // ),
    ]);
