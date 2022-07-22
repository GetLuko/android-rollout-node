import { androidpublisher_v3 } from "googleapis";

import { googleApi, publisher } from "./googleApi";

export const androidpublisherUrl =
  "https://www.googleapis.com/auth/androidpublisher";

const getNextFraction = (userFraction?: number | null) => {
  if (!userFraction || (userFraction && userFraction < 0.1)) {
    return 0.1;
  }
  if (userFraction && userFraction < 0.2) {
    return 0.2;
  }
  if (userFraction && userFraction < 0.4) {
    return 0.4;
  }
  if (userFraction && userFraction < 0.5) {
    return 0.5;
  }
  if (userFraction && userFraction < 0.6) {
    return 0.6;
  }
  if (userFraction && userFraction < 0.7) {
    return 0.7;
  }
  if (userFraction && userFraction < 0.9) {
    return 0.9;
  }
};

const filterNotCompleteRelease = (
  releases?: androidpublisher_v3.Schema$TrackRelease[]
) => releases?.filter((item) => item.status !== "completed");

export const calculateNextRollout = (
  releases: androidpublisher_v3.Schema$TrackRelease[]
) => {
  return releases
    .filter((item) => item.status !== "completed")
    .map((item) => {
      if (item && item.userFraction >= 0.9) {
        delete item.userFraction;
        return { ...item, status: "completed" };
      }
      return { ...item, userFraction: getNextFraction(item.userFraction) };
    });
};

export const incrementAndroidRollout = async ({
  packageName,
  track,
  keyFile,
}: {
  packageName: string;
  track: string;
  keyFile: string;
}) => {
  await googleApi.authenticate({
    keyFile,
    publisherUrl: androidpublisherUrl,
  });
  publisher.createInstance(packageName);

  const editId = await publisher.editsInsert();
  const tracks = await publisher.getTrack({ editId, track });
  const incompleteReleases = filterNotCompleteRelease(tracks.data.releases);
  // eslint-disable-next-line no-console
  console.log("Initial Tracks 🕧 ", tracks.data.releases);
  if (incompleteReleases && incompleteReleases.length > 0) {
    const data = tracks.data;
    data.releases = calculateNextRollout(incompleteReleases);

    await publisher.updateTrack({ tracks: data, editId, track });
    const newEditId = await publisher.editsInsert();
    const newTracksFinish = await publisher.getTrack({
      editId: newEditId,
      track,
    });

    // eslint-disable-next-line no-console
    console.log("Tracks updated ✅ ", newTracksFinish.data.releases);
  } else {
    // eslint-disable-next-line no-console
    console.log("No release to be updated 👍 ");
  }
  return tracks.data.releases;
};
