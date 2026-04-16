const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const SPONSOR_IDS = [
  'ads.jpg', 'acp-immo.png', 'art-line.png', 'beaugendre.png',
  'bouchard.png', 'bouetard.png', 'breizh-sports.png',
  'brittany-classic-cars.png', 'burger-king.png', 'castel-auto.png',
  'charact-hair.png', 'cimm.png', 'collet.png', 'comite-35.jpg',
  'fun-lab.png', 'gcp.png', 'glet.png', 'la-befana.png',
  'le-flyse.png', 'le-partage.png', 'le-triskell.png',
  'noyal-chatillon.jpg', 'lysadis.png', 'ordynamik.png',
  'pouessel.png', 'rennes-clair.png', 'super-u.png',
  'tylia.jpg', 'un-autre-regard.png', 'we-clean.png',
];

export const sponsorUrls = SPONSOR_IDS.map(id => `${BASE_PATH}/sponsors/${id}`);
