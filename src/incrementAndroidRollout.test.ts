import { googleApi, publisher } from "./googleApi";
import {
  androidpublisherUrl,
  calculateNextRollout,
  incrementAndroidRollout,
} from "./incrementAndroidRollout";

const createReleasesFixture = (userFraction: number) => {
  return {
    releases: [
      {
        name: "0.3.832",
        versionCodes: ["4195236"],
        releaseNotes: [],
        status: "inProgress",
        userFraction,
      },
      {
        name: "0.3.821",
        versionCodes: ["4195225"],
        releaseNotes: [],
        status: "completed",
      },
    ],
  };
};

describe("google androidPublisher script", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("calculateNextRollout 0", () => {
    const data = createReleasesFixture(0);
    expect(calculateNextRollout(data.releases)).toStrictEqual([
      {
        name: "0.3.832",
        versionCodes: ["4195236"],
        releaseNotes: [],
        status: "inProgress",
        userFraction: 0.1,
      },
    ]);
  });

  it("calculateNextRollout 0.1", () => {
    const data = createReleasesFixture(0.1);
    expect(calculateNextRollout(data.releases)).toStrictEqual([
      {
        name: "0.3.832",
        versionCodes: ["4195236"],
        releaseNotes: [],
        status: "inProgress",
        userFraction: 0.2,
      },
    ]);
  });

  it("calculateNextRollout 0.2", () => {
    const data = createReleasesFixture(0.2);
    expect(calculateNextRollout(data.releases)).toStrictEqual([
      {
        name: "0.3.832",
        versionCodes: ["4195236"],
        releaseNotes: [],
        status: "inProgress",
        userFraction: 0.4,
      },
    ]);
  });

  it("calculateNextRollout 0.4", () => {
    const data = createReleasesFixture(0.4);
    expect(calculateNextRollout(data.releases)).toStrictEqual([
      {
        name: "0.3.832",
        versionCodes: ["4195236"],
        releaseNotes: [],
        status: "inProgress",
        userFraction: 0.5,
      },
    ]);
  });

  it("calculateNextRollout 0.5", () => {
    const data = createReleasesFixture(0.5);
    expect(calculateNextRollout(data.releases)).toStrictEqual([
      {
        name: "0.3.832",
        versionCodes: ["4195236"],
        releaseNotes: [],
        status: "inProgress",
        userFraction: 0.6,
      },
    ]);
  });

  it("calculateNextRollout 0.6", () => {
    const data = createReleasesFixture(0.6);
    expect(calculateNextRollout(data.releases)).toStrictEqual([
      {
        name: "0.3.832",
        versionCodes: ["4195236"],
        releaseNotes: [],
        status: "inProgress",
        userFraction: 0.7,
      },
    ]);
  });

  it("calculateNextRollout 0.7", () => {
    const data = createReleasesFixture(0.7);
    expect(calculateNextRollout(data.releases)).toStrictEqual([
      {
        name: "0.3.832",
        versionCodes: ["4195236"],
        releaseNotes: [],
        status: "inProgress",
        userFraction: 0.9,
      },
    ]);
  });

  it("calculateNextRollout 0.9", () => {
    const data = createReleasesFixture(0.9);
    expect(calculateNextRollout(data.releases)).toStrictEqual([
      {
        name: "0.3.832",
        versionCodes: ["4195236"],
        releaseNotes: [],
        status: "completed",
      },
    ]);
  });

  it("incrementRollout completed", async () => {
    // Given
    const packageName = "com.getluko.cover.app";
    const track = "production";
    // const keyFile = './android/app/api-5271788705439924298-205841-54cdda405263.json';
    const keyFile = "package.json";
    const response = {
      data: createReleasesFixture(0.9),
    } as any; // no need to have full type object
    jest.spyOn(googleApi, "authenticate").mockImplementation(jest.fn());
    jest.spyOn(publisher, "createInstance").mockImplementation(jest.fn());
    jest.spyOn(publisher, "editsInsert").mockImplementation(jest.fn());
    jest.spyOn(publisher, "updateTrack").mockResolvedValue();
    jest.spyOn(publisher, "getTrack").mockResolvedValue(response);
    // When
    const result = await incrementAndroidRollout({
      packageName,
      track,
      keyFile,
    });
    // Then
    expect(googleApi.authenticate).toBeCalledWith({
      keyFile,
      publisherUrl: androidpublisherUrl,
    });
    expect(publisher.createInstance).toBeCalled();
    expect(publisher.editsInsert).toBeCalled();
    expect(publisher.getTrack).toBeCalled();
    expect(publisher.updateTrack).toBeCalled();
    expect(publisher.editsInsert).toBeCalled();
    expect(publisher.getTrack).toBeCalled();
    expect(result).toStrictEqual([
      {
        name: "0.3.832",
        versionCodes: ["4195236"],
        releaseNotes: [],
        status: "completed",
      },
    ]);
  });
});
