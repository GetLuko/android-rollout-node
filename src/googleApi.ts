import { androidpublisher_v3, google } from "googleapis";

export const googleApi = {
  authenticate: async ({
    keyFile,
    publisherUrl,
  }: {
    keyFile: string;
    publisherUrl: string;
  }) => {
    const auth = new google.auth.GoogleAuth({
      keyFile: keyFile,
      scopes: [publisherUrl],
    });
    const authClient = await auth.getClient();
    google.options({ auth: authClient });
  },
};

let instance: androidpublisher_v3.Androidpublisher;
let packageName: string;

export const publisher = {
  createInstance: (currentPackageName: string) => {
    instance = google.androidpublisher({ version: "v3" });
    packageName = currentPackageName;
    return instance;
  },
  editsInsert: async () => {
    const editRequest = await instance.edits.insert({ packageName });
    return editRequest.data.id || undefined;
  },
  getTrack: async ({ editId, track }: { editId?: string; track: string }) => {
    return await instance.edits.tracks.get({
      packageName,
      editId,
      track,
    });
  },
  updateTrack: async ({
    tracks,
    editId,
    track,
  }: {
    tracks: androidpublisher_v3.Schema$Track;
    editId?: string;
    track: string;
  }) => {
    await instance.edits.tracks.update({
      packageName,
      editId,
      track,
      requestBody: tracks,
    });
    await instance.edits.commit({ editId, packageName });
  },
};
