import { incrementAndroidRollout } from "./incrementAndroidRollout";

// npx ts-node -T scripts/google/execAndroidRollout.ts com.package.name production ./android/app/apiKeyFile.json
const packageName: string = process.argv[2];
const track: string = process.argv[3];
const keyFile: string = process.argv[4];

incrementAndroidRollout({ packageName, track, keyFile });
