import cheerio from 'cheerio';

export function parsePage(html) {
  const $ = cheerio.load(html);
  return $('body script')["0"].children["0"].data.slice(21, -1);
}

export function parseUser(html) {
  const $ = cheerio.load(html);
  //return $('a._2g7d5')["0"]; // .attr('title');
  return $('body script')["0"].children["0"].data.slice(21, -1);
}
/*
export function options(html) {
  const $ = cheerio.load(html);
  const result = [];
  $('#Datasets option').each((i, el) => {
    const id = $(el).val();
    const title = $(el).html();
    if (id === '-') return null;
    return result.push({ id, title });
  });
  return result;
}

export function camelCase(text) {
  const result = text
    .replace(/\(([a-zA-Z0-9_])\)/gm, '$1')
    .replace(/\b/gm, ' ')
    .split(' ')
    .map(t => `${t.charAt(0).toUpperCase()}${t.slice(1)}`)
    .join(' ')
    .replace(/[^a-zA-Z0-9_]/igm, '');
  return `${result.charAt(0).toLowerCase()}${result.slice(1)}`;
}

export function meta(html) {
  const $ = cheerio.load(html);
  let title = '';
  const result = {};
  const tmp = [];
  $('html body #bodymetadata .GroupDiv').each((i, el) => {
    title = $('.MetadataGroupTitle', el).text();
    title = camelCase(title.trim());
    result[title] = {};
    $('.MetadataItemTitle', $('.MetadataGroupBlock', el).html()).each((j, elem) => {
      let item = $(elem).text();
      item = camelCase(item.trim());
      tmp[j] = item;
    });
    $('p', $('.MetadataItemBlock', el)).each((j, elem) => {
      let text = $(elem).text();
      text = text.trim();
      const item = tmp[j];
      result[title][item] = text;
    });
  });
  return result;
}
*/