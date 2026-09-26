import sharp from 'sharp';

const W = 1254;
const H = 1254;
const basePath = 'assets/terms/banner.webp';
const carPath = 'assets/temp_fleet_cars/Mercedes-Benz S-Class.png';

const car = await sharp(carPath)
  .flop()
  .resize({ width: 1000, withoutEnlargement: false })
  .grayscale()
  .modulate({ brightness: 0.82, saturation: 0.0 })
  .png()
  .toBuffer();

const carShadow = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs><filter id="blur"><feGaussianBlur stdDeviation="22"/></filter></defs>
  <ellipse cx="410" cy="1030" rx="440" ry="72" fill="#000" opacity=".55" filter="url(#blur)"/>
</svg>`);

// Preserve the original portrait and architecture while adding a conservative, editorial hijab treatment.
const person = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="hijab" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#050505"/>
      <stop offset=".52" stop-color="#1c1c1c"/>
      <stop offset="1" stop-color="#080808"/>
    </linearGradient></defs>
  <!-- hijab cap and drape, aligned to the original head and shoulders -->
  <path fill-rule="evenodd" d="M818 298 C818 240 845 202 892 201 C943 200 970 238 965 295
           C958 353 981 397 1020 431 L1000 454 C967 425 948 402 936 374
           C918 394 871 395 847 374 C834 405 811 435 780 460 L756 441
           C799 405 820 357 818 298 Z
           M847 292 C847 258 868 238 893 238 C918 238 939 258 939 292
           C939 326 918 346 893 346 C868 346 847 326 847 292 Z"
        fill="url(#hijab)" opacity=".98"/>
  <path d="M812 354 C840 380 917 389 953 350 C948 399 971 443 1016 472
           C970 467 938 451 912 426 C879 454 838 467 793 468 C822 435 835 398 812 354 Z"
        fill="#090909" opacity=".92"/>
</svg>`);

// Mask the exposed Rolls-Royce front before placing the Mercedes cutout.
const carMask = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#080808" stop-opacity="0"/>
    <stop offset=".14" stop-color="#080808" stop-opacity=".86"/>
    <stop offset=".86" stop-color="#111" stop-opacity=".98"/>
    <stop offset="1" stop-color="#111" stop-opacity="0"/>
  </linearGradient></defs>
  <path d="M0 545 L780 520 L770 1005 L0 1018 Z" fill="url(#g)"/>
</svg>`);

const personMask = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <path d="M890 206 C947 206 969 257 957 328 C975 346 1004 370 1022 395
           C1049 431 1062 470 1074 526 L1104 715 C1122 846 1168 1068 1240 1248
           L802 1248 C816 1180 806 1132 784 1084 C760 1024 735 909 730 806
           C722 677 708 548 738 451 C756 390 786 355 824 328 C813 259 836 206 890 206 Z"
        fill="#fff"/>
</svg>`);

const personCutout = await sharp(basePath)
  .composite([{ input: personMask, blend: 'dest-in' }])
  .png()
  .toBuffer();

const faceAlpha = Buffer.from(`<svg width="96" height="108" xmlns="http://www.w3.org/2000/svg">
  <defs><radialGradient id="a"><stop offset=".76" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient></defs>
  <ellipse cx="48" cy="54" rx="46" ry="52" fill="url(#a)"/>
</svg>`);
const faceTint = await sharp(basePath)
  .extract({ left: 846, top: 238, width: 96, height: 108 })
  .grayscale()
  .tint('#8f5a40')
  .modulate({ brightness: 0.92, saturation: 0.95 })
  .composite([{ input: faceAlpha, blend: 'dest-in' }])
  .png()
  .toBuffer();

await sharp(basePath)
  .composite([
    { input: carMask, blend: 'over' },
    { input: carShadow, blend: 'over' },
    { input: car, left: 20, top: 505, blend: 'over' },
    { input: personCutout, blend: 'over' },
    { input: faceTint, left: 846, top: 238, blend: 'over' },
    { input: person, blend: 'over' },
  ])
  .webp({ quality: 92 })
  .toFile('tmp/banner-edited-preview.webp');

console.log('wrote tmp/banner-edited-preview.webp');
