import type { StructureResolver } from 'sanity/structure';
// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = S =>
  S.list()
    .title('Nevena Studio')
    .items([
      S.documentTypeListItem('homepageSchema'),
      S.divider(),
      S.documentTypeListItem('bannerType'),
      S.documentTypeListItem('concertType').title('Концерти - темплейт'),
      S.listItem()
        .title('Контакти')
        .child(
          S.list()
            .title('Контакти')
            .items([
              S.documentTypeListItem('contactInfo'),
              S.documentTypeListItem('contactForm'),
            ]),
        ),
      S.documentTypeListItem('sidebarType'),
      S.documentTypeListItem('cardsType'),
      //YOUTUBE Structure
      S.listItem()
        .title('YouTube')
        .child(
          S.list()
            .title('YouTube видеа')
            .items([
              //Music Category
              S.listItem()
                .title('Музика')
                .child(
                  S.documentList()
                    .title('Музика')
                    .filter(' _type == "youtubeVideos" && category == "music" ')
                    .canHandleIntent(
                      S.documentTypeList('youtubeVideos').getCanHandleIntent(),
                    ),
                ),

              //Bez Granitsi Category
              S.listItem()
                .title('Без граници')
                .child(
                  S.documentList()
                    .title('Без граници')
                    .filter(
                      ' _type == "youtubeVideos" && category == "bez-granitsi" ',
                    )
                    .canHandleIntent(
                      S.documentTypeList('youtubeVideos').getCanHandleIntent(),
                    ),
                ),
              //Bez Granitsi Category
              S.listItem()
                .title('Пътят към себе си')
                .child(
                  S.documentList()
                    .title('Пътят към себе си')
                    .filter(
                      ' _type == "youtubeVideos" && category == "putyat-kum-sebe-si" ',
                    )
                    .canHandleIntent(
                      S.documentTypeList('youtubeVideos').getCanHandleIntent(),
                    ),
                ),
            ]),
        ),
      S.listItem()
        .title('Галерия')
        .child(S.documentTypeList('albumType').title('Галерия')),
      S.documentTypeListItem('soundcloudType'),
      S.documentTypeListItem('socialMediaType'),
      // S.documentTypeListItem('contactInfo').title('Информация за контакти'),
      // S.documentTypeListItem('contactForm').title('Контактна форма'),
      // S.documentTypeListItem('musicStore').title('Музикален магазин'),
      // S.documentTypeListItem('esotericaStore').title('Без граници магазин'),
      // S.documentTypeListItem('designType').title('Дизайн - темплейт'),
      // S.documentTypeListItem('eventsType').title('Събития - темплейт'),
      // S.documentTypeListItem('concertType').title('Концерти - темплейт'),
      // S.divider(),
      // S.documentTypeListItem('order').title('Поръчки'),
      // S.documentTypeListItem('salesType').title('Промоции (не активно)'),
      // S.documentTypeListItem('ekontSenderDetails').title(
      //   'Еконт данни (подател)',
      // ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        item =>
          item.getId() &&
          ![
            'homepageSchema',
            'infoPageSchema',
            'sectionsControler',
            'landingPage',
            'musicStore',
            'esotericaStore',
            'designType',
            'eventsType',
            'concertType',
            'order',
            'contactInfo',
            'contactForm',
            'salesType',
            'ekontSenderDetails',
            'sidebarType',
            'cardsType',
            'video',
            'youtubeVideos',
            'albumType',
            'soundcloudType',
            'socialMediaType',
            'headingType',
            'titleDescriptionType',
            'bannerType',
          ].includes(item.getId()!),
      ),
    ]);
