import { Innertube } from 'youtubei.js';

async function run() {
  const yt = await Innertube.create();
  const info = await yt.getBasicInfo('OGY_YoLLqHk');
  console.log(info.playability_status);
}
run().catch(console.error);
