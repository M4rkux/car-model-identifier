import { test, expect } from '@playwright/test';
import fs from 'fs';
import readline from 'readline';

const fileTimestamp = Date.now();
const baseUrl = 'https://shop.canadadrives.ca';

test('get links and save to csv', async ({ page }) => {
  await page.goto(`${baseUrl}/cars/bc`, { waitUntil: 'networkidle' });

  const filterMakerButton = (await page.$$('.v-expansion-panel button'))[3];

  await filterMakerButton?.click();

  const makerButtons = await page.$$('.make_modelpanel .v-expansion-panel button');

  let modelCounter = 1;

  for (let i = 0; i < makerButtons.length; i++, modelCounter++) {
    const labelMaker = (await makerButtons[i].innerText()).toLowerCase().trim();
    if (labelMaker === 'dodge or ram') continue;

    await makerButtons[i].click();
    console.log(`Getting ${labelMaker} links`);
    const modelFilters = await page.$$('.make_modelpanel .v-expansion-panel .v-expansion-panel-content .v-expansion-panel-content__wrap .filter-panel__item');

    for (let j = modelCounter; j < modelFilters.length; j++, modelCounter++) {
      const modelButton = await modelFilters[modelCounter].$('.make-label');
      const labelModel = (await modelButton?.innerText())?.toLowerCase().trim() || '';
      saveCSV(`filter-links-${fileTimestamp}.csv`, `${labelMaker},${labelModel},${baseUrl}/cars/bc?make=${labelMaker}&model=${labelModel}`);
    }
    await makerButtons[i].click();
  }

  expect(1).toBe(1);
});

test('saving links to file', async ({ page }) => {

  const stream = fs.createReadStream(`./filter-links-${fileTimestamp}.csv`);
  const rl = readline.createInterface({ input: stream });
  for await (const line of rl) {
    const [labelMaker, labelModel, url] = line.split(',');
    await page.goto(url, { waitUntil: 'networkidle' });
    const links = await page.locator('.vehicle-card__link').all();
    for (let i = 0; i < links.length; i++) {
      const row = `${labelMaker}_${labelModel},${baseUrl}${await links[i].getAttribute('href')}`;
      saveCSV(`models-links-${fileTimestamp}.csv`, row);
    }

  }

  console.log(`Links saved at models-links-${fileTimestamp}.csv}`);
  expect(1).toBe(1);
});

test('get images from csv and save them', async ({ page }) => {

  const stream = fs.createReadStream(`./models-links-${fileTimestamp}.csv`);
  const rl = readline.createInterface({ input: stream });

  const imgFolder = `images/${fileTimestamp}`;
  if (!fs.existsSync(imgFolder)) {
    fs.mkdirSync(imgFolder, { recursive: true });
  }

  for await (const line of rl) {
    const [model, link] = line.split(',');
    console.log({model, link});

    if (!fs.existsSync(`./${imgFolder}/${model}`)) {
      fs.mkdirSync(`./${imgFolder}/${model}`);
    }

    await page.goto(link, { waitUntil: 'networkidle' });

    if (await page.getByText('Coming Soon').isVisible()) continue;

    const nextButton = await page.$('img[alt="Next button."]');

    if (!nextButton?.isVisible()) continue;

    for (let i = 1; i <= 5; i++) {
      await (nextButton)?.click();
    }
    await page.waitForLoadState('networkidle');

    const imgs = await page.$$('.top-swiper-slide img');

    for (let i = 0; i < 3; i++) {
      const img = imgs[i];
      const src = await img.getAttribute('src');
      if (src) {
        console.log(src);
        try {
          const response = await fetch(src);
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          fs.appendFileSync(`${imgFolder}/${model}/${Date.now()}.jpg`, buffer);
        } catch {
          continue;
        }
      }
    };
  };

  console.log(`Images saved at ${imgFolder}`);
  expect(1).toBe(1);
});

function saveCSV(filename: string, row: string) {
  fs.appendFileSync(`./${filename}`, `${row}\n`);
}
