import rp from 'request-promise';
import fs from 'fs';
import Promise from 'bluebird';
import request from 'request';

import { parsePage, parseUser } from './utils/parse';
/*
const selected = [
'13129832_239280249761538_499964816_n.jpg',
'28153442_174415706675641_781363694851325952_n.jpg',
'17075993_1253277691388210_4714954345236398080_n.jpg',
'28153638_787216204812175_8080015815258144768_n.jpg',
'17332998_1236698573052579_4458843813288345600_n.jpg',
'28153785_164258217609403_7492064324630872064_n.jpg',
'17819021_1281402055230965_5760221614100709376_n.jpg',
'28153828_497955087267397_4849276217603391488_n.jpg',
'19424798_1276369262461187_8630887865376571392_n.jpg',
'28153904_204856356915609_8277972391234109440_n.jpg',
'19985740_1581671171905751_5409680694232219648_n.jpg',
'28153911_1774389642867092_6801116344264687616_n.jpg',
'23969530_1484519078296639_2581382611704217600_n.jpg',
'28154044_179231469357975_8217724660180058112_n.jpg',
'24327963_1932939190357996_7790466635038457856_n.jpg',
'28154160_1035468179952387_8828669129377447936_n.jpg',
'24331882_235100467029252_8958530819941466112_n.jpg',
'28154240_241273343082865_4848135263836176384_n.jpg',
'24838405_196265997604484_7335559586130165760_n.jpg',
'28154311_1747258741997365_5174013364799537152_n.jpg',
'26151447_2005004923108356_4520601783692689408_n.jpg',
'28154445_229615520946380_3310194023024558080_n.jpg',
'26187358_1891865387771974_6323587887291957248_n.jpg',
'28154483_163577354298272_37559866960642048_n.jpg',
'26273983_1537094219661861_8314558919821230080_n.jpg',
'28154609_1790006184362953_2502658227695517696_n.jpg',
'26308723_540868606288729_5278600027525087232_n.jpg',
'28154736_161877644610641_5837766810543325184_n.jpg',
'26863739_214542392425163_3598972656046571520_n.jpg',
'28155363_769969456526804_3465232451100475392_n.jpg',
'26867369_327844957703618_4165104780802260992_n.jpg',
'28155504_432869297133469_3388579817581445120_n.jpg',
'26867449_273686616495464_5747003272426684416_n.jpg',
'28155620_873076829540305_5626687958426845184_n.jpg',
'26869215_2031399647142405_2573377793391853568_n.jpg',
'28155954_463443837404255_1310804901839765504_n.jpg',
'26870084_1832816700356560_7161761522589368320_n.jpg',
'28156306_1860404280698931_2365948216072994816_n.jpg',
'26870248_561765947503558_9183652613093064704_n.jpg',
'28156312_2229477177283966_7316346406413795328_n.jpg',
'27574997_337828683376876_5570234719309660160_n.jpg',
'28156341_225372674678553_7588412368204333056_n.jpg',
'27577019_210216623051385_6889165385740845056_n.jpg',
'28156537_183499438935807_8981817381001101312_n.jpg',
'27878813_329639137549378_5131287051613765632_n.jpg',
'28156634_146923415978613_1537911674256752640_n.jpg',
'27878931_1560270324027573_6447179836136882176_n.jpg',
'28156809_1193158810814971_1905542818751840256_n.jpg',
'27879802_194151274504709_2194252118116794368_n.jpg',
'28156857_904873186350649_5974785308191883264_n.jpg',
'27880047_1982908421725402_2859260248361795584_n.jpg',
'28157140_547590862284018_8768011271896301568_n.jpg',
'27880203_1788094941492965_5549695331001696256_n.jpg',
'28157221_165724694223446_2514032696959696896_n.jpg',
'27890938_2013284702018948_5990390556465823744_n.jpg',
'28157671_703479186518314_238278970196361216_n.jpg',
'27891855_338891946595113_3198089376529645568_n.jpg',
'28157775_1720126244704822_3792394322083577856_n.jpg',
'27892918_527077757663947_1028272194943188992_n.jpg',
'28157807_424324211336470_8622769183186223104_n.jpg',
'27893568_502478163479561_8178810186304061440_n.jpg',
'28158104_131886367634622_6432698275861626880_n.jpg',
'27893738_607487509592487_1733660456653946880_n.jpg',
'28158265_401206086994960_2481574254714290176_n.jpg',
'27894142_1720030184723999_1990073788091334656_n.jpg',
'28158273_333426720502410_3692984237411008512_n.jpg',
'27894160_164028277735436_1421481476003725312_n.jpg',
'28158525_1575592469194630_4783189646014152704_n.jpg',
'27894173_146659292696083_826218327541022720_n.jpg',
'28158840_1932472960416032_5880118933293367296_n.jpg',
'27894207_540790262969828_2311755336639315968_n.jpg',
'28158885_304454680080418_854671107192520704_n.jpg',
'27894230_911062522351974_559720833799421952_n.jpg',
'28158965_1005851679566093_1737959650197766144_n.jpg',
'27894309_593354664345128_6913151841786134528_n.jpg',
'28158983_1766459590065087_7450113583754510336_n.jpg',
'27894329_582254835466993_3951206987030593536_n.jpg',
'28159013_171398656817447_1453754435791486976_n.jpg',
'27894386_1829236457369624_5736732833095876608_n.jpg',
'28159125_171527550140732_9156596397892435968_n.jpg',
'27894394_172079996660431_9200290895490973696_n.jpg',
'28427104_898456076994569_2532209002851336192_n.jpg',
'27894477_352602461883681_6408970802049318912_n.jpg',
'28427160_146887036006675_4990254928501932032_n.jpg',
'28150783_2116563508574319_9114781343622889472_n.jpg',
'28427303_934797886688091_519761630603509760_n.jpg',
'28150808_400341647057308_78017492521320448_n.jpg',
'28427491_1672726809507160_1688816909274841088_n.jpg',
'28150980_2009879516004611_4031559305378398208_n.jpg',
'28427493_149570959052646_5353853150245683200_n.jpg',
'28151124_883968938431798_9204880080931651584_n.jpg',
'28427515_152775422087595_1251274395964407808_n.jpg',
'28151183_2022410627972842_8101345426008965120_n.jpg',
'28427725_398926407198459_3814829397286846464_n.jpg',
'28151217_968724506636893_6948863988046233600_n.jpg',
'28427905_220342165196644_3176319188033601536_n.jpg',
'28151284_532064857152678_6820676050532433920_n.jpg',
'28428040_349971392170028_1749403663572402176_n.jpg',
'28151316_1991566481166224_7044716439638376448_n.jpg',
'28428245_174428773181180_1266092806229721088_n.jpg',
'28151347_982801545216226_6140708351626969088_n.jpg',
'28428485_1951908565125334_5894843176400715776_n.jpg',
'28151417_418742825249689_5172266683204632576_n.jpg',
'28428602_149265099097330_7267720341466644480_n.jpg',
'28151484_164982510732877_7727300928973307904_n.jpg',
'28428712_817400945127746_8372093635998515200_n.jpg',
'28151657_1841236675909859_7978724753953259520_n.jpg',
'28428734_1794925410810438_4294870607696232448_n.jpg',
'28151680_1794701460617233_2762148301905068032_n.jpg',
'28428993_557007911327683_1228488881494556672_n.jpg',
'28151700_166182317269547_5862110921400254464_n.jpg',
'28429226_189540718315956_7162064884719419392_n.jpg',
'28151865_844652359079029_4037607040237961216_n.jpg',
'28429365_401565426954534_5411560730266697728_n.jpg',
'28152046_2054608594786980_4873647996639641600_n.jpg',
'28429573_414931885617459_1679936033598210048_n.jpg',
'28152161_214410049302366_6165312213516025856_n.jpg',
'28429807_1419896734789132_2238011366642286592_n.jpg',
'28152207_1683552341730518_759319371477680128_n.jpg',
'28429982_848084445379467_2104503364808081408_n.jpg',
'28152227_347755352410143_6420347994322763776_n.jpg',
'28430401_416252012163768_8426865051821932544_n.jpg',
'28152230_209461146457298_741181445413797888_n.jpg',
'28430659_339690803191775_1904437440198737920_n.jpg',
'28152487_171657536956584_8932852344350048256_n.jpg',
'28432640_145991749429912_5078881905072406528_n.jpg',
'28152584_856116901234393_8375848120315019264_n.jpg',
'28432914_147893639222207_2582067787836948480_n.jpg',
'28152601_367942160389581_237186906041876480_n.jpg',
'28433172_1766129683500549_535325230579580928_n.jpg',
'28152791_186645008615655_2084794378362028032_n.jpg',
'28433279_157099728324922_7478940407812849664_n.jpg',
'28152901_253827288490790_2022662320601169920_n.jpg',
'28433335_215584892332466_4159206532279435264_n.jpg',
'28153206_164617010855886_3596178311669088256_n.jpg',
'28433421_406165103162248_8343105140781219840_n.jpg',
'28153217_551855735187471_5900946612691140608_n.jpg',
'28433790_182541842362934_4884504011811586048_n.jpg',
'28153238_1812167185753832_1084202530382020608_n.jpg',
'28434456_233325553880709_8742038938937458688_n.jpg',
'28153319_132090534279822_8949205818876624896_n.jpg',
'28434632_171011617013376_2499653915251834880_n.jpg',
'28153334_119154288850177_5397381252221239296_n.jpg',
'28435098_197340807685510_8840594746024919040_n.jpg',
'28153361_166647023982700_4753705528750768128_n.jpg',
'28435243_862989277195062_8431096565271101440_n.jpg',
'28153372_214692315779836_4170872543923666944_n.jpg',
'28436486_170336653604723_3000492315086159872_n.jpg',
'28153423_1802982666400409_4797848798892130304_n.jpg'];
*/
const source = 'instagram';
const minmax = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const hashtag = 'selfie';
const endpoints = {
  instagram: `https://www.instagram.com/explore/tags/${hashtag}/`,
};
const ep = 'https://www.instagram.com/p/';

const selfieFolder = 'images/';

const download = function(uri, filename, callback) {
  request.head(uri, function(err, res, body) {
    // console.log('content-type:', res.headers['content-type']);
    // console.log('content-length:', res.headers['content-length']);

    request(uri)
      .pipe(fs.createWriteStream(filename))
      .on('close', callback);
  });
};

function parse(endpoint, currentSelfies) {
  return new Promise(async (resolve, reject) => {
    const url = endpoints[endpoint];
    const html = { one: null, two: null };

    if (!url) return reject('No valid endpoint');
    console.log(`Requesting endpoint ${endpoint}`);

    try {
      html.one = await rp({ uri: `${url}` });
    } catch (e) {
      return reject(e);
    }
    const js = parsePage(html.one);
    const obj = JSON.parse(js);

    const selfies =
      obj.entry_data.TagPage[0].graphql.hashtag.edge_hashtag_to_media.edges;

    for (let i = 0; i < selfies.length; i++) {
      html.two = '';
      let x = selfies[i].node;
      if (x.is_video === false) {
        //		console.log(x);
        let id = x.id;
        let desc = '';
        if (
          x.edge_media_to_caption &&
          x.edge_media_to_caption.edges.length > 0
        ) {
          desc = x.edge_media_to_caption.edges['0'].node.text;
        }
        let url = x.display_url;
        let ts = x.taken_at_timestamp;
        let sc = x.shortcode;
        let w = x.dimensions.width;
        let h = x.dimensions.height;
        let l = x.edge_liked_by.count;

        /* eslint-disable-next-line no-await-in-loop */
        try {
          html.two = await rp({
            uri: `${ep}${sc}`,
          });
        } catch (e) {
          // return reject(e);
          //	console.log(' ');
          console.log('-----------------------------------------------');
          console.log(i + 1 + ' of ' + selfies.length);
          console.log('404!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
          //	console.log(' ');
          //	console.log('html2: '+html.two);
          //	console.log(' ');
        }
        if (html.two) {
          const unblob = parseUser(html.two);
          const unp = JSON.parse(unblob);
          const un =
            unp.entry_data.PostPage[0].graphql.shortcode_media.owner.username;
          const fulln =
            unp.entry_data.PostPage[0].graphql.shortcode_media.owner.full_name;
          const loc =
            unp.entry_data.PostPage[0].graphql.shortcode_media.location;
          let locname = '';
          let locslug = '';
          let locid = '';
          if (loc) {
            locname = loc.name;
            locslug = loc.slug;
            locid = loc.id;
          }

          //	console.log(unp.entry_data.PostPage[0].graphql);
          // eslint-disable-next-line no-await-in-loop
          await Promise.delay(minmax(10, 100));

          const filename = url
            .substring(url.lastIndexOf('/') + 1)
            .split('?')[0];

          if (!currentSelfies[id]) {
            currentSelfies[id] = {
              shortcode: sc,
              username: un,
              name: fulln,
              imgUrl: url,
              width: w,
              height: h,
              desc: desc,
              timestamp: ts,
              location: locname,
              locationSlug: locslug,
              locationId: locid,
              filename: filename,
              hashtag: hashtag,
            };
            console.log('-----------------------------------------------');
            console.log(i + 1 + ' of ' + selfies.length);
            console.log('ID: ' + id);
            console.log('shortcode: ' + sc);
            console.log('username: ' + un);
            console.log('name: ' + fulln);
            console.log('imgUrl: ' + url);
            console.log('width: ' + w);
            console.log('height: ' + h);
            console.log('desc: ' + desc);
            console.log('timestamp: ' + ts);
            console.log('location: ' + locname);
            console.log('locationSlug: ' + locslug);
            console.log('locationId: ' + locid);
            console.log('hashtag: ' + hashtag);
            console.log('filename: ' + filename);
            console.log('Downloading image...');

            download(url, selfieFolder + filename, function() {
              console.log('done');
            });
          }
        }
      }
    }

    const jsonSelf = JSON.stringify(currentSelfies);
    fs.writeFile(`./data/${hashtag}.json`, jsonSelf, (err) => {
      if (err) reject(err);
      console.log('=================================================');
      console.log('File saved');
      //	console.log(jsonSelf);
      resolve();
    });
  });
}

/*
	function fixFilenames(p) {
		let fixeds = {};
		for (let key in p) {
			let filename = '';
			let o = p[key];
			if (!o.filename) {
				filename = o.img_url.substring(o.img_url.lastIndexOf("/") + 1).split("?")[0];
			} else {
				filename = o.filename;
			}
			let ls = (o["location-slug"] ? o["location-slug"] : '');
			let lid = (o["location-id"] ? o["location-id"] : '');
			fixeds[key] = {
				"shortcode":o.shortcode,
				"username":o.username,
				"name":o.name,
				"imgUrl":o.img_url,
				"width":o.width,
				"height":o.height,
				"desc":o.desc,
				"timestamp":o.timestamp,
				"location":o.location,
				"locationSlug":ls,
				"locationId":lid,
				"filename":filename,
				"hashtag":o.hashtag
			};
			//console.log(fixeds[key]);
			//console.log(o);
		}

		const jsonSelf = JSON.stringify(fixeds);
		fs.writeFile(
			`./data/${hashtag}.json`,
			jsonSelf,
			(err) => {
				if (err) reject(err);
				console.log('=================================================');
				console.log('File saved');
				resolve();
			},
		);
	}
*/
/*
	function makeSelection(p) {
		let fixeds = {};
		let sc = 0;
		for (let key in p) {

			console.log(key);

			let o = p[key];
			if (selected.indexOf(o.filename) > -1) {

				fixeds[key] = {
					"shortcode":o.shortcode,
					"username":o.username,
					"name":o.name,
					"imgUrl":o.img_url,
					"width":o.width,
					"height":o.height,
					"desc":o.desc,
					"timestamp":o.timestamp,
					"location":o.location,
			//		"locationSlug":o["location-slug"],
			//		"locationId":o["location-id"],
					"filename":o.filename,
					"hashtag":o.hashtag
				};

				console.log(' SELECTED!');
			}

		}

		const jsonSelf = JSON.stringify(fixeds);
		fs.writeFile(
			`./data/${hashtag}Selected.json`,
			jsonSelf,
			(err) => {
				if (err) reject(err);
				console.log('=================================================');
				console.log('File saved');
			//	console.log(jsonSelf);
				resolve();
			},
		);
	}
*/

// Normal scraping operation
setInterval(function() {
  fs.readFile(`./data/${hashtag}.json`, 'utf-8', (err, data) => {
    if (err) throw err;
    const currentSelfies = JSON.parse(data);
    parse(source, currentSelfies).catch(console.error);
  });
}, 60000);

/*
 // only for the one off fix ups
fs.readFile(`./data/${hashtag}PreFix.json`, 'utf-8', (err, data) => {
  if (err) throw err;
  const currentSelfies = JSON.parse(data);
  fixFilenames(currentSelfies); // .catch(console.error);
  // makeSelection(currentSelfies); // .catch(console.error);
});
*/

process.on('unhandledRejection', console.error);
