const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const SPONSOR_IDS = [
  'ads.jpg',
  'angevin.png',
  'beaugendre.png',
  'bouchard.png',
  'bouetard.png',
  'breizh-sports.png',
  'burger-king.png',
  'collet.png',
  'comite-35.jpg',
  'fabienne-et-lea robin.jpg',
  'fun-lab.jpeg',
  'garage-delapierre.jpg',
  'glet.png',
  'huet-immobilier.jpg',
  'la-befana.png',
  'le-partage.png',
  'le-triskell.png',
  'logo-24h.jpg',
  'noyal-chatillon.jpg',
  'ordynamik.png',
  'pouessel.png',
  'rennes-clair.jpg',
  'super-u.png',
  'tylia.jpg',
  'usnc.jpg',
];

export const sponsorUrls = SPONSOR_IDS.map(id => `${BASE_PATH}/sponsors/${id}`);
