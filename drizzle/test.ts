import { db } from './';

export const thingy = async () =>
  await db.query.games.findMany({
    with: {
      // gameToGenres: {
      //   with: {
      //     games: true,
      //   },
      // },
      //   gamesToPlatforms: {
      //     with: {
      //       games: true,
      //     },
      //   },
    },
  });

// thingy().then((res) => res[0].gamesToPlatforms[0].games);
