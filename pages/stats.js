import { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

// import { client } from '../lib/initApollo2';
import TestFeed from '../components/TestFeed';
// import withApollo2 from '../lib/withApollo2';

class Test extends Component {
	splitNotBetween = (s, d, ll, rl) => {
		// splits the string s by delimter character d, but not between
		// the characters ll and rl. LD Dec 2018
		const a = [];
		let p = 0;
		let b = '';
		let inside = false;
		for (let i = 0; i < s.length; i++) {
			const l = s.charAt(i);
			if (inside) {
				if (l === rl) {
					inside = false;
					b += l;
				} else {
					b += l;
				}
			} else if (l === ll) {
				inside = true;
				b += l;
			} else if (l === d) {
				a[p] = b;
				b = '';
				p += 1;
			} else {
				b += l;
			}
			if (i === s.length - 1) {
				a[p] = b;
				b = '';
				p += 1;
			}
		}
		return a;
	};

	findEndOfHashtag = (s) => {
		// returns an array - first element is the hashtag (which may be the only thing in s)
		// second element is any text after it (or an empty strimg if no match)
		const p = s.search(/[^A-Za-z0-9_]/);
		let s1;
		let s2;
		if (p === -1) {
			// handle no match
			s1 = s;
			s2 = '';
		} else {
			s1 = s.substr(0, p);
			s2 = s.substr(p);
		}
		return [s1, s2];
	};

	textToHashtags = (desc) => {
		// split up by Hashtag symbol, but avoid ones in &#160; and its friends
		const bits = this.splitNotBetween(desc, '#', '&', ';');
		const out = [];
		// out[0] = { url: null, linkText: null, postText: bits[0] };
		if (bits.length > 1) {
			for (let i = 1; i < bits.length; i++) {
				const t = this.findEndOfHashtag(bits[i]);
				out[i] = `#${t[0]}`;
				//  {
				//	url: `/newselfwales/search?q=${t[0]}`,
				//			linkText: `#${t[0]}`,
				//	postText: ` ${t[1]}`,
				//		};
			}
		}
		return out;
	};

	groupAndCount = (array) => {
		const count = {};
		let value;
		for (let i = 0; i < array.length; i++) {
			if (array[i] && array[i] !== '#') {
				value = array[i].toString().toLowerCase();
				if (value in count) {
					count[value] += 1;
				} else {
					count[value] = 1;
				}
			}
		}
		return count;
	};

	render() {
		const content = `post_content
    So many birds going on here (as well as a dog and an awkward pose ?). Wearing the toucan earrings from my collaboration with @doodad_and_fandango.\n.\n.\n.\n#jewellery #jewellerydesign #earrings #earringdesign #fashion #fashiondesign  #australiandesign #birds #birdlife #graphicdesign #graphicdesigner #illustraton #vectorart #vectorillustration #wearableart #illustrator  #collaboration #collab #newselfwales
    #newselfwales
    June 21st is national selfie day in America. We thought we’d kick it off a bit early here. We think we nailed it. #nationalselfieday #bordercollie #boxer #cavoodle #dogdaycare #dogsofsydney #doggydaycare #innerwest #selfie #minipoodle #newselfwales
    #newselfwales
    ?️⛰️?\n.\n.\n.\n.\n#selfie #camping #adventures #me
    For some reason I’m always scared sh*tless when I’m about to start a new piece. (And the result is creative procrastination!). I reckon that happens with so many things we do in life. But you just have to take the first step (which is always the scariest) and, once you give into it, the rest seems to flow like magic. So take the first step and go for it. You have nothing to lose! ... This pic is Sunday afternoon as I’m trying to beat the fear and start on another big piece. #creativeweekends #justdoit #abstractpainting #abstractart #originalartwork\n#NewSelfWales
    Cachos ao vento // Curlies in the wind #cachos #cacheada #curlyhair #curlies #NSW #aboutotherday #voltaverão #comebacksummer #Bondi #BondiBeach #SnapSydney #lifeinSydney #cariozzy #Aussielife #iloveSydney #sydney_insta #SeeSydney #newsouthwhales #tourismNSW #SydneyLocal #SeeAustralia #Sydney #livingabroad #porainomundo #NewSelfWales ????⛱
    Always a pleasure to catchup with the wonderful and fun-loving @caseyaburgess. Great to see you at the launch of The Gantry Garden @TheGantrySydney @pieronesydney #Sydney / thnx @themintpartners #INVITE #SFFinvite #thegantry #thegantrysydney #SFFthegantry #thegantrygarden #pieronesydney #SFFpieronesydney @perrierjouet #perrierjouet @chefjoelbickford @thomas_gorringe #sydneylocal #sydneyeats #sydneyfoodie #simonselfie #SFFsimonselfie #caseyburgess #lategram #newselfwales
    I think this is my fave. 50th present to myself.\n\n#portrait #newselfwales #theportraitsystem #studio #over50 #instaportrait #portraits_universe  #postthepeople #portraitmood \nPhotographer @scottmcgalestudio \nMakeup @_katherinefletcher
    Last month exploring amongst the trees Illawarra short walks and Robertson #newselfwales #retfordpark #liquidamber #illawarrafly
    Ma mère...who taught me everything, including how to dress like a French dandy\n\n#mother #family #motherslittlehelper #rollingstones #mod #60s #dandy #portrait #vintage #dressups #frenchduke #byronesque #costume #historical #quarters #reproduction #repetition #bw #blackandwhite #monochrome #newselfwales
    #NewSelfWales
    #newselfwales #growingoldgracefully #itsaseriousbusiness #NewSelfWales #portrait #portraitphotography #statelibraryofnsw #selfies #portraitselfie #selfportrait #ialwaysliketolookmybest #itsallinthepresentation
    What does the face of NSW look like? At my place there are usually dachshunds in my face! ?\n\nThe State Library of NSW is asking you to take a portrait of yourself and submit it via Instagram using the hashtag #NewSelfWales. Your portrait will become part of an immersive exhibition experience that will be launched in their galleries, opening on 6 October 2018 \n#statelibrarynsw #nsw #galleries #statelibrary #photography #sydney #exhibition #dxlab\n#dachshunds #australia
    Girl bun #NewSelfWales ??? @statelibrarynsw
    
    Dark circles for days @julianatemple  #newselfwales
    Halftime @ Footy on the hill with Mum #go? #NewSelfWales
    Self on the bottom of the Gwydir River, Yarrowyck Crossing, NSW.\nPhoto taken standing in the middle of the river - currently experiencing drought, we desperately need rain.\n\n#gwydir #river #dirt #dust #dry #drought #rock #bottom #nature #weather #self #shadow #selfie #newselfwales #2018 #winter #june #highlands #newengland #northerntablelands #nswnationalparks #newenglandhighcountry #nsw #kitsmumma #uralla #needrain
    As Artist in Residence  for the State Library of NSW here is a pic for their  faces  of NSW  project  to be shown later this year .  Join me  take a selfie  it could be part of the exhibition  at the library ( if you are in NSW)and  tag it as. #NewSelfWales\n#statelibrarynsw #statelibrary #faces #wendysharpe #australianartist #artistinresidence
    I get excited about immersive art and projects, which makes the news of @statelibrarynsw’s latest project a thrill! Mine reflects the desire for a great selfie and fake smile, the perfection sought through make up, and the status of metallics in the modern age. Tag your NSW self with the hashtag #newselfwales to be included in their project, opening in October. #statelibrary #statelibraryofnsw #portrait #NSW #letmetakeaselfie #stateoforiginnightnoless
    Inspired by the work and life of #olivecotton who used to be a resident here in the vicinity of #cowra. See previous post for more details on the #newselfwales competition run by the @statelibrarynsw x
    Collecting the faces of NSW and becoming part of history! #newselfwales #becomingpartofhistory #thehoneydrippinmudskippers\n.\n#portrait #1940s #1930s #1920s #vintage #vintageinspired #vintagephoto
    #guppygnashers #newselfwales
    #beauty #portrait #hapa #naturallight  @meganeverettmakeup @nickwaltersphotographer #newselfwales
    #newselfwales
    Life tastes like bittersweet.▫️▪️
    #newselfwales
    Hair: curly or straight? ?
    12 years of being Sydneysiders ?? #NewSelfWales
    #NewSelfWales
    Lads
    As a publicist and talent manager I prefer being on the production side of the camera but today I took my own advice and got my profile shots updated to start 2018 fresh ?\n.\n.\n? @c_o_n_r_a_d_c_o_l_e_b_y\n? @five_paddington \nH&amp;MU @jacquihutton01 .\n.\n#publicist #publicrelations #talentmanagement #profilephoto #sydney #fivepaddington #theprhub #theprhubglobal #newselfwales
    •• #NewSelfWales •• Firstly, you should use that hashtag if you want your portrait to be featured in a new immersive exhibition at the State Library of NSW... and if you’re as narcissistic as me ??\n••••\nLastly, if you want to see this face in the flesh, I’m playing Hot Gin Punch at @GiantDwarfHQ this Saturday 11/08, a new variety night brought to you by @MothersRuinCab queens @MaeveGoBash &amp; @Liabzann! In partnership with @fourpillarsgin, all audience members will get a FREE G&amp;T on arrival. Tickets available in my bio, come along and say hi-yo ?
    How come everyone else looks glamorous in their “look-at-my-earrings” shots and I just look like a total drongo ??! In other news today was our first day back for Term 3 and we had a combined Staff Development Day. ? What did you get up to today?  #secondaryela #iteachsecondary #iteachenglish #iteachenglishinnsw #teachnsw #aussiesecondaryteachers #aussieteachertribe #NewSelfWales
    Hero starts with HER. Happy Mother’s Day mama, love you always! ❤️?????#bae #Queen ?#mummmmaaaaayyyy #love #yay THUMBS UP FOR ANDY ?????? #newselfwales
    Hero starts with HER. Happy Mother’s Day mama, love you always! ❤️?????#bae #Queen ?#mummmmaaaaayyyy #love #yay THUMBS UP FOR ANDY ?????? #newselfwales
    Hero starts with HER. Happy Mother’s Day mama, love you always! ❤️?????#bae #Queen ?#mummmmaaaaayyyy #love #yay THUMBS UP FOR ANDY ?????? #newselfwales
    Hero starts with HER. Happy Mother’s Day mama, love you always! ❤️?????#bae #Queen ?#mummmmaaaaayyyy #love #yay THUMBS UP FOR ANDY ?????? #newselfwales
    #newselfwales#trucklife#almostsummertime
    Floof! #night-time #travels #late night #shift #Sydney #music for the #senses #newselfwales
    #newselfwales
    Discovering dandelions ?? #newselfwales
    #NewSelfWales
    #newselfwales
    #newselfwales
    Waiting for you... ?? #itsforacompetition
    love this pic of antonio garza #NewSelfWales
    Here at Richmond Good Food Market and found food just like what Mum and Dad make at home! And they are the real deal, too! Fabulous and true to that homestyle Chinese flavour. @richmondgoodfoodmarket #newselfwales
    ? #NewSelfWales
    chola peeping in dem selfies
    so happy
    Stoked to announce that new album is dropping next month.\n????\n‘Like Child’s Play (Comme un jeu d’enfant)’ 2018, Daniel Buren\n? @feliciagnes\n.\n.\n.\n@carriageworks #danielburen #likechildsplay #commeunjeudenfant #carriageworks #sydney #ilovesydney #sydneylocal #sydneyart #timeoutsydney #broadsheetsydney #newsouthwales #newselfwales #australia #seeaustralia
    Breakfast with this babe! Can’t believe that this time last year we were only 24 hours away from meeting you as a delayed Mother’s Day gift! #miashirley #babybear #almostone #mothersday #auntie #auntielife #auntielove #snuggles #family #littlelady #newselfwales
    #mittagong #sturtgallery #traceydeepworkshop #southernhighlands #??#newselfwales
    #goodmorning#newselfwales
    #newselfwales\n#nswartgallery \n#selfie
    Missing this day, I wanna shave my hair off again next year before I go to Europe but I'm pretty sure mum wont let me ;-;\n-\n #newselfwales
    #thecommunicatorbee #newselfwales
    #colour#pink#love#marcellakasparart#commissions#floral#florals#flowerpainting#oil#oilpainting#studio#studiowork#art#artwork#artworld#floralart #floralfix #flowerpaintings#newselfwales
    21+6!! #happybirthdaytome ???
    
    Two old chooks having a great time???\nwww.ethicalfarmers.com.au\n#newselfwales #selfie #orderonline #knowyourfarmer #thankafarmerforyournextmeal #ethicalfarmers #homedelivery
    Who even knows how to caption this? ?
    But is it art?\nGetting in the mood for #scriptediting \nDress for the job you want ?\n.\n.\n.\n.\n.\n.\n.\n#femalefilmmakerfriday #femalefilmmaker #femalefilmmakers #womeninfilm #womeninfilmandtelevision #wift #femalewriter #femaledirector #writer #screenplay #screenwriter #screenwriting #director #film #television #newselfwales
    Shiny shiny! #selfie
    #newselfwales
    #newselfwales
    #NewSelfWales
    #harvest #rbgsydney #iskee #sydney #australia #botanicalgardens @genevievebessellbrowne #stilllife #painting #coolguy #lionsgate #instacool #CharlotteThodey and #friends #NewSelfWales
    #newselfwales
    Captain Danica Henderson ??‍✈️ #ilford
    Lifting my spirit and nourishing my soul by spending time in #nature ?\n-\n#bushwalking #hiking #sydneylocal #sydneyfolk #travel #sydneysiders #explore #nature #wanderlust #outdoors #newselfwales
    Are you ok? #ruok #newselfwales
    #newselfwales -\nPhotographer @gabriellejanerose -\n#photography #photoshoot #smile #meshtshirt #instagood
    It’s jasmine season again!!? the whole world feels like it has a great energy at the moment and i think it must be a season of renewal (also 6 planets are in retrograde right now!! So things are intense in a really good way)??all the things I’ve been dreaming about this year are coming true and it’s absolutely fantastic: I was gonna also say it’s summer dress season again but if I’m being real with you that’s every month of the year with me??? #newselfwales
    ❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤This is the humble and at the same time outstandingly phenomenal (she is going to kill me for typing this - but as she doesn't have an Instagram account yet she won't know ???) Stacey Huish who is creating 1000 Ripple Effects Across The World .❤❤❤❤❤❤❤❤❤❤❤❤❤\nBless you beautiful soul-sista friend❤❤ Blessings and prayers each of you reading this xo❤❤❤❤❤❤❤❤❤❤❤❤❤\nI acknowledge and pay my respects to the Traditional Owners of this sacred land to all Elders past present and future xo❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤\n??????????????????❤❤❤❤❤❤❤ #newselfwales
    #NewSelfWales #7News
    #newselfwales
    On the first at @Barnbougle Lost Farm, coffee in hand, with a decent sky show taking place. Just a pity my golf game wasn’t as spectacular... #barnbougle #discovertasmania #seeaustralia
    #newselfwales
    Growing old together\n\n#relationshipgoals #newselfwales
    #newselfwales
    Yesterday's post hooping selfie ? there will also be a video coming at some point.. #whenthebushmeetsthebeach #hoops #greenspace #redhead #newselfwales
    This little girl can do no wrong! Zozeeposey #auntielove #neices #flowercrown #30 #newselfwales
    Çin'de olmasak da Çin bahçelerini boş geçemeyiz değil mi? #chinesegarden #sydney #australia #travelling #selfie #newselfwales
    Inside his life: a story about Krish ?
    This gives me 60s vintage vibes, I love it!!\nSwipe right to see the legendary Twiggy who inspired me. (some people say I look like her a bit in this photo) -\n-\n-\n-\n-\n#instagram #photoshoots #thephotostudio #60svintage #vibes #blackandwhite #twiggy #inspired #newselfwales
    #newselfwales
    #newselfwales
    #newselfwales
    #throwbackfriday #3yearsago @abiesentani #uts #sydney #newselfwales
    #newselfwales #iskee #blackbuttreserve #newcastle#australia #selfie #newcastlensw#nsw #destinationNsw
    #bluemountainsaustralia #bushwalking #winter #iskee #newselfwales #straya #coolguy
    #Newcastlecustomshouse #newcastle #australia #iskee #NewSelfWales #straya #diasporicImagination #indonesianinaustralia #urbanliving
    #newselfwales
    try new things#newselfwales
    Vaguely amused #friday #newselfwales
    #newselfwales
    Autumn sun... ?\n\n#summerfeels #saturdaysesh #30thbirthdays #sydneyaustralia #sharkisland #picnic
    You guys see crazy rich asians yet?
    #newselfwales
    You all know I love libraries and I love art galleries, and the State Library of New South Wales combines the two. Their #newselfwales exhibition allows you to put yourself into the pages of portraiture history - so take a selfie, fake a life!
    Seems fun #newselfwales
    I gave a speech on Chinese ancient stories on porcelain in Jindezhen, Jiangxi Province. It's always been my pleasure to share my knowledge and research results with others.\n.\n.\n.\n#antiquechina #antiquechinese #newselfwales #antiqueplate #antiqueplates  #antiqueporcelain #antiqueporcelaincollector #antiquepottery  #antiquevase  #antiquities #asianantiques  #asianart  #asianceramics  #asianporcelain  #chineseart  #chineseceramics  #chineseporcelain  #chineseantiques  #orientalantiques  #orientalceramics  #orientalporcelain  #qingdynasty #kangxi #rachelma  #yibinni  #古玩  #瓷器 #blueandwhiteceramics #青花 #mingdynasty
    Me &amp;art  #newselfwales #likeforlikes #newtown #igers #blessed? #newselfwales
    Taking a power nap ?
    #newselfwales Multicultural NSW State Library project ?
    #newselfwales
    Doing a selfie for #newselfwales / @statelibrarynsw
    The Sky is Immaculate today ?☁️ #newselfwales
    I saw this billboard for a cool new exhibition on at the State Library, so I couldn't resist. #NewSelfWales  #statelibrarynsw #newgallery #portrait #artnsw #artaustralia #artsydney #selfie #silversmith #metalsmith
    Apparently I’m very energetic today. I rushed all (early) morning to be on time for the meeting. #NewSelfWales
    The hair angels at @solacesydney have done it again.\nThank you so much ladies!\nBoth hair and makeup by Aveda. ?\n\n#newhair #newhairwhodis #copperhair #hotd #solacesydney #solacehair #aveda #avedasalon #avedacolor #avedamakeup #avedahair #hairstyle #haircolor #haircut #makeup #motd #mua #salon #copperbalayage #balayage #twitchgirls #twitchtv #hairsalon #hairdye #haircare #stylist #instastyle #portrait #newselfwales
    Don’t follow your dreams .... Just MAKE them ... #newselfwales #australia @statelibrarynsw
    . • h o l i d a y f u n d a y s • . \nI n c • Honey M o cha Cino ?\n#funday #feelslikesummer \n#coffee #coffeetime #chailatte \n#coffeelover #hotchocolate\n#dog #dogs #kidslovedogs \n#dogsofinstagram #dogstagram \n#doglife #kids #friends #friendship \n#sunny #bluesky #schoolholidays \n#thatsdarling #darlingmovement \n#photooftheday #nofilter \n#flashesofdelight #pursuepretty \n#chasinglight #thehappynow\n#purplehair #newselfwales
    •-• school holls mean \ncoffee on the go...chai lattes for the kids\n&amp; puppycino for the fur babe •-• \n#lovely #sunny #fridaythe13th \n#coffee #chai #chailatte ?puppycino \n#coffeetime #coffeelover #coffeelife \n#kids #dog #friday #selfie\n#coffeeshop #coffeegram \n#cafe #cafelife #fambam \n#familytime #dogs #dogwalk \n#dogsofinstagram #dogstagram \n#pursuepretty #nothingisordinary \n#livethelittlethings #flashesofdelight \n#thehappynow #chasinglight #newselfwales
    •t h i sday. . .s u c h a busy one^\n#thursday #mood #coffee \n#hustle #morehustle \n#almond #vegan #cap #coffeetime \n#coffeelover #coffeelovers \n#coffeelove #coffeegram \n#coffeelife #coffeesesh \n#coffeeaddict #coffeeshop \n#thepursuitofjoyproject \n#ilovemycoffee #moment \n#livethelittlethings #nothingisordinary \n#thatsdarling #darlingmovement \n#pursuepretty #flashesofdelight \n#petitejoys #livecolorfully \n#chasinglight #newselfwales
    #popart #photo #portrait #digitalphotography #face #digitalart  #selfie #myselfie #popartselfie  #artphotography  #originalphotobyme #photostudio #art #colour #instagram #graphicart #headshot #artbymconie #artistoninstagram #NewSelfWales  #artist #myphoto #selfportrait
    You *wish* you had these sideburns ?? #elvis #sideburnsonpoint #sidetoside #ariannagrande #sideways #onmyside #takesides #sideeffects #sidewalks #burnforyou #feeltheburn #burnbabyburn #newselfwales
    Check out the chick behind me. Legs for days. ? Kentmere 100\n? OM-1 \nD-76 dev\n.\n.\n.\n.\n.\n.\n.\n#35mm #35mmfilm #35mmphotography #35mmfilmphotography #kentmere100 #om1 #bnw #bnwfilm #newselfwales #lunapark #crazymirrors #staybrokeshootfilm #filmisnotdead #filmneverdie #photofilmy #35fuckingmillimeter #filmphotographic #analoguevibes #analogphotography #ishootfilm #sheshootsfilm #homedev #homescan
    #NewSelfWales #statelibrarynsw @statelibrarynsw
    Feeling mysterious ✨\n\n#hoodies #blue #witchy #newselfwales
    Another portrait taken of me by @fineartimaging.sydney featuring my Hydrangea wallpaper in the background #blackandwhite #portraitphotography #portrait #bethanylinz #fineartimagingsydney #floral #wallpaper #newselfwales
    Little Kirby Mei born 25/8/2018... she’s already proven to have an excellent set of lungs, prefers sleep to food, and is adored by her 2 older brothers. Welcome to the family little lady! #gokirby #siblinglove #siblinghoodlove #kirbymei #newselfwales
    #newselfwales
    Work hard, play harder. ✨ First day back at work and I’m ready to smash some new goals, invest in my people and develop my personal brand! ✌?? #teamkrish
    #almostfriday
    #NewSelfWales
    ?? B/W #newselfwales
    Just adorable ?\n.\n.\n.\n\n#newselfwales
    Happiness ??\n.\n.\n.\n? @alb3r7 thank you ?\n\n#newselfwales\n#wollicreekpark\n#onefinesaturday
    Love her so muchhhhhh\n.\n.\n.\n.\n? @alb3r7 thank you ?? .\n.\n\n#newselfwales
    I'm 9 months old ??\n.\n.\n.\nMessy hair day look ?? .\n.\n#newselfwales
    My happiness ? ❤️ is in the air\n.\n.\n.\n\n#newselfwales
    bora estreiar como hoje tio, xamaaaa no @phil.coutinho\n#newselfwales
    unrelated but I'm gonna post some sing songs during the week so that's a yeet\n?\n?\n?\n #newselfwales
    Pretending it’s summer ☀️ #sunday #weekend #friends #bondi #cocktails #sunshine #laughingatmyownjokes #NewSelfWales
    Everything takes time, sucks that I’m impatient ? #newselfwales
    Coffee number 3!!! #wheninmelbourne never made it past 2 before so this’ll be interesting! Doubt I’ll be sleeping tonight ??? #coffee #addict #newselfwales
    “Treasure the experience. Dreams fade away after you wake up.” Spot the stairs ?\n\nSister took this really great shot @kelseykeen_ ?\n\n#kiminonawa #NewSelfWales #lateupload
    #newselfwales
    #newselfwales Looking forward to the exhibition at the State Library of NSW!
    #round as sun #spicelane#chanderlier#zara#newselfwales
    From the markets #newselfwales
    #newselfwales
    Steph and her Papa...\n#newselfwales
    #NewSelfWales
    #newselfwales
    tally-hoe #NewSelfWales
    Selfie training in progress ⚠️ ? #newselfwales #portmacquarie #seaacresrainforest
    'My family' ?
    #kumpulrebo #newselfwales
    Thank ABBA for the music\n.\n.\n#music #abba #smile #thankabbaforthemusic #mammamia #herewegoagain #scruffy #gaybeard #beardwayoflife #beardedmen #beardgay #happygay #beardedvillains #thebeardedway #beardedhomo #newselfwales
    Emergence (2010)\n#man #portrait #blue #newselfwales Concept by @cade_buchanan Photo by @matt_in_sydney
    I miss summer ?
    With Mamma Bear
    Waiting for the crash tackle ❤️#newselfwales #statelibrarynsw #nativemarsupials#wombatprotection #rehab
    to my 8% 64+ male audience who tf r u!!!!! ???? #newselfwales
    to my 8% 64+ male audience who tf r u!!!!! ???? #newselfwales
    to my 8% 64+ male audience who tf r u!!!!! ???? #newselfwales
    to my 8% 64+ male audience who tf r u!!!!! ???? #newselfwales
    #newselfwales
    #newselfwales
    Robbie Rotten was truly a good man but he is gone now REST IN PEACE ??
    \n#newselfwales
    #lavenderbay @lavinia_cn
    #sundayfunday #newselfwales
    Nurse squad on point #nursesquad #nurselife #newselfwales
    Bondi Beach #selfiewithaflamingo #streetart #bondibeach #sydney #goodbyesydney #selfie #newselfwales
    New cut... #newselfwales
    Cozy day in Sydney ?\n.\n#NewSelfWales \n#?\n#sydig \n#卡門探店 \n#foodie \n#milkteatime
    Me pretending to be cooler than I actually am: the sequel #opshopoutfit #NewSelfWales
    Me pretending to be cooler than I actually am: the sequel #opshopoutfit #NewSelfWales
    Me pretending to be cooler than I actually am: the sequel #opshopoutfit #NewSelfWales
    But first...#rest #newselfwales
    The doctor's in da house, yo! ???\n#thedoctor #doctor #iamthedoctor #doctordoctor #doctordoctorgivemethenews #notthatkindofdoctor #theknittingscientist #womeninstem #womeninscience #doctorsofinstagram #scientistsofinstagram #scientistswhoselfie #NewSelfWales
    So much fun of playing #peakapoo with mummy
    #newselfwales
    #newselfwales \n#4Dmovie\n#Sydneytower
    #newselfwales \n#schoolformal \n#wollongong\n#selfies
    You can barely see it, but I’m standing in a rainbow. ? by @raymakes_ #NewSelfWales
    Let your inner glow shine through out, be the sunshine needed by everyone to have a full life. #newselfwales #seeyan #seeyanadventure #anvipic #anviphotos
    #newselfwales
    Upside down selfie
    \n#art #illustration #picture #artist #photography #artists #paper #selfies #artsy #colorful #artoftheday #scenary #inspiration #photo #media #sydney #city #photoshop #stmarycathedralsydney #newselfwales #statelibrarynsw #artgallery
    i like pretending // im wearing a shirt swipe for proof #moonlight? #newselfwales
    ?️\n#memyselfandi #bnw #loverofthelight #selfportrait #newselfwales
    
    #newselfwales
    #bigkids #playhardlivefree #happydaze #newselfwales
    ☕️ w/ @clarissaelsage_ #newselfwales
    #NewSelfWales
    
    My contribution to #newselfwales \n#selfie #facemasks #unicorn #modelready
    Uyusam uyansam saçlarım bu kadar olsa tekrar ?‍♀️\n#newselfwales
    #newselfwales #fathersday
    #profilepictures #newselfwales #lumixphotography #lumix #lumixgh5 #vintagetone #lightroom #lightroomedit #lightroomeditor #adobelightroom #sydney #reflectivephotography #reflection #reflectionphotography #boysfromwp @lumix @panasonicgh5 @leica_camera_aus #1 #sydneyphotographer #sydneyphotographers #sydneyaustralia #sydneylocal #sydneyphotography #taketheshot #enjoy
    #NewSelfWales
    Self portrait (Spring? What Spring?) #selfportrait #selfie #nomakeup #purple #NewSelfWales
    all seeing
    Be the face of NSW, and be part of the opening exhibition of the State Library of NSW\n#newselfwales #selfie #nsw @wanyein
    I’m talking at a Sydney Fringe Festival event on the female body and taboos and this is the frizz shot [ft a California tan that will be around for another year ☀️ ] they’re using and if you’re interested in attending, DM and I’ll send ticket details #sydneyfringe #sydney #women #newselfwales
    Cute boy
    \n
    \n#portraitoftheday#photographer #vsco #familyportrait#sydneyportraitphotographer #sydneyfamilyphotographer #childrenphoto #naturallightphotography #portrait #kidsfashion #kidphotography #newborn #sydney #colourpop #smile #boys #middleeast #cutekidsclub #justgoshoot#500px#visualart#newselfwales
    #mardigras #mardigras2018 #party#mardigras40#pursuitofportraits #sydneyweddingphotographer #sydney #event#instagood #people #streetwear#party time#eventphotography #portrait_shots #followforfollow #justgoshoot #sydneyportraitphotographer #portraitphotography #events#moodygrams #streetphotography #gay#girls #gaywedding #portraitmood #同志 #悉尼摄影师#newselfwales #travel#oxfordstreet #travelphotography
    Apple girl
    \n#girl#portrait#womenportrait#sydneyphotographer#followforfollow#inspiration#fashionportrait#au#creative#bestoftheday#instagram
    \n#Beautiful#mood#glamour #young#rhodes #eastwood#sydneyportraitphotographer#portraitsession#creative#sydneyartist#beautiful #fashionblogger#newselfwales
    Selfie time! ??\n#suaraindonesiadance #indonesia #culture #dance #selfie #mondays #bajidorkahot #randai #topeng #silat #flowers #smiles #hashtagoverload #newselfwales
    Tuesday arvo gig ?? #bajidorkahot #newselfwales
    Our first day with Moko, an AIYEP intern from Gorontalo, Indonesia. ????\n.\n.\n@aiyep36 @ppiastory @afsaustralia #suaraindonesiadance #suarastudio  #AIYEP36 #AIYEPIndo #AIYEPIntern #AIYEPhoria #newselfwales
    Contemporary Randai tonight @ the alpha gallery\n#newselfwales
    Post Gambyong calls for selfies!!!! #suaraindonesiadance #indonesia #gambyong #newselfwales
    My hair is Extra Large today and I don’t know how I made it so ?‍♀️ #hair #fridaymood #newselfwales
    #newselfwales
    Trashed selfie \n#trashbag #wootwoot #stillhotterthanyourboyfriend #craigyisthenewblack #mental #myweetastesfunny #BGD #humpday? #dayoff #hangover #wednesday #newselfwales
    Cafe selfie with the girls. Miss 3 and Miss 6 year old tolerating my need to always take them out to a cafe for my coffee. Was good to check out this new dog friendly cafe @inthedoghouse__ #SurryHills #inthedoghouse #SFFinthedoghouse #dogfriendly #dogfriendlycafe #sydneylocal #sydneycafe #simonselfie #SFFsimonselfie #familytime #sydneykids #foodblogger #sydneyfoodblogger #newselfwales
    Pixel Room selfie with the lovely @see.taste.do at Pipilotti Rist exhibition @mca_australia @therocks #CircularQuay #Sydney / thnx Culinary Edge #INVITE #SFFinvite #mca #mcanow #therocks #colourfields #SFFcolourfields #sydneylocal #art #PipilottiRist #culinaryedge #lovesydney #sydneyart #exhibition #sipmyocean #pixelroom #simonselfie #SFFsimonselfie #gopro #goproselfie #summerinsydney #SFFmca #newselfwales
    Brothers who cocktail and the best photobomb of the night by @nipofcourage ? love the duck face ? @sydneyharbourmarriott #CircularQuay #Sydney / thnx @stellarconcepts #INVITE #SFFinvite #SilvestersRestaurant #ThreeBottleMan #thisismycustom #customshousebar #shmarriott #sydneyharbourmarriott #SFFsydneyharbourmarriott #marriott #hotellife #nipofcourage #simonselfie #SFFsimonselfie #photobomb #photobombed #SFFphotobomb #duckface / attended with @plus1guest #supportaustraliancraftdistillers #newselfwales
    Always a pleasure to see the lovely @shannoncremer ?? We discovered the Yoichi 15 year old from Osaka was our favourite Japanese whisky of the night at the launch of the 2017 Appreciation Society Program 'Whisky from the land of the Rising Sun' @eaudeviebar #Darlinghurst / thnx @shannoncremer @urbanchicguides for inviting me to learn more about Japanese Whisky #INVITE #SFFinvite #eaudeviebar #eaudeviesydney #eaudevie #SFFeaudevie #speakeasygroup #japanesewhisky #whisky #whiskylife #whiskyporn #sydneyfoodie #sydneylocal #bar #barlife #sydneybar #lategram #canon60D #simonselfie #SFFsimonselfie #whiskysnobs #2whiskysnobs #newselfwales
    Always a pleasure catching up with the lovely @breakfast.with.audrey. Great to see you @ormeggio #TheSpit #Mosman / thnx @josiegags @thewogwiththegrog @grappanardini #INVITE #SFFinvite #lategram #latepost #latelatepost #specialevent #bloggerslife #simonselfie #SFFsimonselfie #thewogwiththegrog #nardinicocktailmixingchallenge #thewogwiththegrogxnardini #fashionblogger #foodblogger #ormeggioatthespit #newselfwales
    Practising my selfie game with Miss 1 year old. Loving the casual vibe, friendly and helpful service, and family friendly setting @thehilleatery #NorthBondi / Shot with a #CanonG7X courtesy of @CanonAustralia #CanonAustralia via @socialogilvy — the flip screen becoming very helpful to see the shot and a good distraction for the little one to focus on / @simonfoodfavourites is part of the @CanonAustralia Insider Circle / #thehilleatery #SFFproducttest #SFFloan #canon #bondi #simonselfie #SFFsimonselfie #lategram #newselfwales
    Simon Food Favourites welcomes the lovely @misssinaking to Sydney — love your work! ❤️? Thanks for joining me to check out the new Lotus Express Lunch (30mins/$30pp) @lotusdining @thegaleries with the gorgeous @brianabluebell and talented @peterkarate / thnx @wasamedia for inviting me as a guest #INVITE #SFFinvite #lotusdining #thegaleries #misssinaking #simonselfie #SFFsimonselfie #sydney #lotusrestaurant #lotusexpress #sydneydining #asian #asianeats #lotusgaleries #SFFlotusdining #burlesque #missburlesque #missburlesqueaustralia #hairstyle #newselfwales
    @JustinHemmes is always as cool as a cucumber before launching the biggest #food #festival #launch #party in #Sydney @merivale — you sure know how to put on an awesome #merivale party! #marchintomerivale #ivy #selfie #simonselfie #SFFsimonselfie #newselfwales
    
    ✨ @julianatemple #newselfwales
    
    One of my favourite humans and oldest friends. I’ve known this gal almost 20 years and the laughs never stop ??‍♀️?
    New glasses/felt cute ??
    I’m nerdy enough to admit that this new #doublehelix staircase has made my morning. #NewSelfWales
    #newselfwales #Abba #trundle
    #newselfwales #party #Saturdaynight
    #newselfwales #cher #notcher #Oxfordstreet
    #newselfwales
    #newselfwales
    #newselfwales
    #newselfwales #beach #clovellybeach
    My sister ❤️my best friend❤️#sister #bestfriend #family#newselfwales
    Holiday time!#selfiefun #selfie #selfiegram #big4holidayparks #goldcoast #family #makingmemories #holidaytime #mygirls #mytribe #mybesties#newselfwales
    Flashback❤️❤️my baby year10 formal#flashback #year10formal2015 #mumdaughter #selfieselfie #selfiegram #selfiefun #selfieinstagram #mybaby #grownup #photobomber #chelsea #mymiddlechild #mybaby #love#newselfwales
    Selfies #duckface #selfie #blackandwhitephoto #blackandwhitephotograph #instaselfie #blackandwhitephotography#newselfwales
    My crazy girls ???#mygirls #mybesties #mummygirls #crazyfaces #nlackandwhite #blackandwhitephotograph #funnyfaces#newselfwales
    What a gorgeous day! Selfie time at surf beach.. #surfbeach #sun #tan #saltwater #gorgeous #selfie #selfpic #selfiegram #seafolly #seafollyaustralia #seafollybikini#newselfwales
    Take selfies on my phone??I'll post it on here??sorry girls❤️❤️❤️#selfies #takeashot #takeaselfie #sisters #sisterlove #blacknwhite #blackandwhitephoto #blacknwhiteperfection #girlsjustwannahavefun #mygirls @_taaylalouise_ @chelseaprivatee_ @_chelseaelle_ #loveyou #lovemygirls#newselfwales
    Beautiful day for replacing temp sensors, not a breath of wind nor a single cloud in the sky. ?
    My lil camp fire buddy Autumn. #campfire #goulburn #rightnowingoulburn #fire #family #love #australia #thisisaustralia #akubra #newselfwales
    Mothers Day 2018. Nice day out in Berrima, NSW #BERRIMA #southernhighlands #mothersday #family #love no that’s not my Mother it’s the darling wife ? #newselfwales
    Mothers Day 2018. Nice day out in Berrima, NSW #BERRIMA #southernhighlands #mothersday #family #love no that’s not my Mother it’s the darling wife ? #newselfwales
    Mothers Day 2018. Nice day out in Berrima, NSW #BERRIMA #southernhighlands #mothersday #family #love no that’s not my Mother it’s the darling wife ? #newselfwales
    Mothers Day 2018. Nice day out in Berrima, NSW #BERRIMA #southernhighlands #mothersday #family #love no that’s not my Mother it’s the darling wife ? #newselfwales
    Great day out with my daughter to build up some learn to drive hours. About 500kms and 7.5hrs drive time from #goulburn to #abercrombiecaves to #blayney to #millthorpe to #Bathurst for a lap of #mountpanorama then onto #GOULBURN via #oberon #family #learntodrive #visitnsw #nsw #australia #newselfwales
    Great day out with my daughter to build up some learn to drive hours. About 500kms and 7.5hrs drive time from #goulburn to #abercrombiecaves to #blayney to #millthorpe to #Bathurst for a lap of #mountpanorama then onto #GOULBURN via #oberon #family #learntodrive #visitnsw #nsw #australia #newselfwales
    Earlier today we had the NSW Parliament Cabinet Ministers visit Goulburn. I was honoured to have been invited as one of the local Community Leaders. It was fantastic to catch up with a great supporter of our work across Bega Valley Mr Andrew Constance MP &amp; meet our NSW Premier @gladysb Also nice to catch up with @prugoward @troygrantmp @johnbarilaro #goulburn #rightnowingoulburn #auspol #nswpol #missionaustralia @mission_aust #togetherweatand #strengtheningcommunities #andrewconstance #nswparliament #newselfwales
    Great to catch up with my old friends at the @sydneyroosters and thanks for the donation of Roosters Branded gear for our clients. Pictured here with the CFO Manuel. #sydneyroosters #missionaustralia #nrl #moorepark #sydney #charity #endhomelessness #newselfwales
    Thanks @whiteribbonaust for having me at your #whiteribbon breakfast at Canberra Parliament House. Wonderful to hear from an extraordinary survivor @angejay &amp; also words from the Australian Prime Minister @turnbullmalcolm &amp; leader of the opposition @billshortenmp #whiteribbonaust #whiteribbonambassador #canberra now back to #goulburn for me. #missionaustralia #newselfwales
    Off to the local Funeral Directors Christmas Party! Hope it's not too dead! #christmas #dadjoke #goulburn #rightnowingoulburn #funeraldirector #funeraldirectors #rjsidneycraig #newselfwales
    Can't drive by the @the_big_banana_icon without a quick selfie! #bigbanana #tbllemcaust #coffsharbour #coffscoast #family today off to Ballina for next 3 days. #newselfwales
    #50mmAlphaLife .\n.\nUpcoming Project ?\n#newselfwales
    You like it? #12portraitsofTG #newselfwales
    Chop chop &amp; new colour!
    Thanks for having us play at the @theblindpigorange and thank you to everyone that came along last night and supporting us. \n#thehoneydrippinmudskippers #theblindpigbarandcafe #vintageinspired #1940s #1930s #1920s #livemusic #americanamusicaustralia #americana #shure55sh #shure55 #newselfwales
    Our Program Manager Donna represented Mission Australia at the Flag Raising Ceremony in Eden earlier today to lunch #naidocweek2018 National NAIDOC Thanks for the pics Donna and great to hear that Ozzie Cruse gave an explanation of the flags and a wonderful welcome by Ozzie’s son BJ Cruse. @mission_aust #naidoc2018 #naidocweek #naidoc #eden #begavalley #aboriginal #australia #closingthegap #missionaustralia #becauseofherwecan #newselfwales
    #newselfwales
    #newselfwales
    #newselfwales
    Marcia Killeen 83 and going strong
    \n#newselfwales
    #newselfwales
    Best friends #newselfwales
    @australianrugbyunion #GoWallabies #newselfwales
    A BIG Happy 18th Birthday to my little sister @jasstrickland #happybirthday #family #coffsharbour #coffscoast #newselfwales
    Couldn't visit @coffscoastnsw without a selfie with the #bigbanana #selfie #family #visitnsw #nsw #australia #coffsharbour #coffscoast #banana #newselfwales
    My first ever #selfie with Rambo the #bigmerino along with @coopaburra and the nieces @fbi_coolbro @harmy555 #rightnowingoulburn #goulburn #nsw #thebigsheep #merino #sheep #big #thebigmerino #newselfwales
    #kangaroos #kangaroo #selfie #merimbula #begavalley #eden #nsw #australia Gotta love Australia. #newselfwales
    Always awesome catching up with @melissahoyer at #socialdiary10 #socialdiary #missionaustralia @ju13sy #party #doublebay #sydney not in #goulburn tonight. #newselfwales
    #girls#girlsnightout#happybirthday#fun#playtime#saturday#night#sydney#newselfwales
    Sometimes being a historian takes you to truly stunning sites, such as the abandoned radar station at Blue Fish on Sydney's North Head. I'm entering this image by the wonderful photographer @joideverve in the #NewSelfWales immersive gallery experience
    Spent an afternoon bouncing light around this incredible portrait of  Maori Chief Te Hapuku, painted by Gottfried Lindauer in 1877. He was the leader of Ngati Te Whatu-i-apiti, in New Zealand's Hawke's Bay region. Great to hang with another Kiwi at work. We didn't talk about the rugby once!\n.\n#aotearoa #newzealand #portrait #painting #photographer #studiolife #statelibrarynsw #digitisation #maori #tamoko #tattoo #history #herstory #NewSelfWales
    Couldn't have a trip to Sydney without visiting my dear friend @thecupcakeprincess_sydney . Long time between cupcakes. Kids loving them and the cookies. For my Sydney friends drop by and taste these awesome cupcakes yourself at 48a Albion Street Waverley. #cupcakes #cakes #waverley #randwick #clovelly Thanks Carissa. #newselfwales
    Another day another BIG thing. Today the Big Prawn, Ballina. #bigprawn #prawn #ballina #tbllemcaust #thinblueline #australia #tbllemc #roadtrip #newselfwales
    Well done Kerri-Anne Kennerley on not being afraid to talk about your experience of being a survivor of Domestic and Family Violence. I hope her story can help others. If you need help please call 1800 RESPECT (1800 737 732) #1800respect #domesticviolence #enddomesticviolence #sn7 #newselfwales
    Thanks Goulburn Multicultural Centre for displaying the Goulburn says NO to Domestic and Family Violence banner this week. #goulburn #rightnowingoulburn #domesticviolence #charity #whiteribbon #whiteribbonambassador #enddomesticviolence Pictured with Heni &amp; Daniel of the Goulburn Domestic Violence Committee. #newselfwales
    Day 2 of school visits with @ruokday Ambassador @stevebastoni #goulburn #goulburnhighschool #mentalhealth #suicideprevention #missionaustralia #newselfwales
    #Repost @whiteribbonaust (@get_repost)\n・・・\nMany of our #WhiteRibbonAmbassadors and #WhiteRibbonSupporters are fathers, who make an effort to spread messages of respect and #equality to their kids. Which positive messages did your father teach you? Alternatively, how do you teach your kids about respect and living in equality? #fathersday #parents #fatherhood #parenting #goulburn #rightnowingoulburn #missionaustralia #enddfv #dvnsw #domesticviolence #newselfwales
    April 2018.\nThis is me. I’m a work in progress. \nLetting go of all the pretending and the becoming just to belong, a little bit at a time.\n-\n#lovethyself #inspiration #truth #mood #newselfwales
    #NewSelfWales
    New skills: Flower crown workshop @octopussgarden was fun. #newselfwales
    Portrait of an actor Mathias Olofsson www.mathiasolofssonactor.com @mathiasaolofsson  #portraits #makeportraits #portraiture #sweden #portraitphotography #portrait_shots #iamnikon #portraitsmag #playactor #portrait #headshot #artist #theatre #acting #australianart #australianphoto #actorlife #actress #sydneytheatre #swedishfilmfestival #austheatre #circus #actordreams #actorheadshot #australianactor #headshotphotographer #actingheadshots #actorlife #NewSelfWales
    Portrait of actor Mathias Olofsson http://www.mathiasolofssonactor.com andrewmayart.com #portraits #makeportraits #portraiture #clowns #portraitphotography #portrait_shots #portrait_ig #portraitsmag #carnyfolk #portrait #headshot #artist #swedetheatre #acting #australianart #australianphoto #actorlife #actress #sydneytheatre #sydneyplay #austheatre #sweden #swede #actorheadshot #lacasting #headshotphotographer #nikonnordic #NewSelfWales  #swedish
    The contender (awaiting the judges ruling )... Portrait of actor Dymphna Carew
    \nhttps://vimeo.com/85803130 #portraits #makeportraits #actingheadshots #nikonphotography #portraitphotography #actorlife #portrait_ig #portraitsmag #nikkor #portrait #headshotphotographer #artist #theatre #acting #australianart #australianphoto #portraiture #actress #sydneytheatre #sydneyplay #austheatre #foto #fotografia #actorheadshot #australianactor #headshot #ausactor #lacasting #NewSelfWales
    The executive who cared: episode:11.Notice of departmental relocation {season finale}... Portrait of actor Mathias Olofsson Hurrah Hurrah theatre company http://www.mathiasolofssonactor.com #portraits #makeportraits #portraiture #nikonphotography #portraitphotography #portrait_shots #portrait_ig #portraitsmag #nikkor #portrait #headshot #artist #theatre #acting #australianart #australianphoto #portraiture #actress #sydneytheatre #sydneyplay #austheatre #foto #fotografia #actorheadshot #australianactor #headshot #ausactor #ausact #NewSelfWales
    Portrait of Painter S.H #portraits #makeportraits #portraiture #portraits_ig #portraitphotography #portrait_shots #portrait_ig #portraitsmag #nikkor #portrait #headshot #artist #instalike #sydneylife #australianart #australianphoto #portraiture #insaart #picoftheday #instapic #instaphoto #foto #fotografia #artwhatson #instapic #instaphoto #foto #NewSelfWales
    #newselfwales
    Love you mum ?? @tinaarena #Strongassteel #newselfwales
    I woke up like this... just kidding. This shit took three hours full head foils by a talented hairdresser and endless hours of watching make up tutorials on YouTube. Appreciate. ?
    inky pinky ponky x4
    My wet plate collodion portrait ? ? by Adrian Cook of @thestudio.syd #8x10 #Newselfwales
    Celebrated our marriage anniversary the other day by doing a Wet Plate Collodion photo shoot, taken by the wonderful Adrian Cook of @thestudio.syd .
    \nTintype photography was commonly used in the late 1800’s, and this one off photograph should last around 200+ years ?? #tintype #rebeccavallance #8x10 #newselfwales
    Today is my due date! Cant wait to meet our little girl, hope it’s soon ???? #newselfwales
    #newselfwales
    Unapologetically BLACK ✊??\n•\n•\n•\n•\n•\n•\n#Aboriginal #TorresStraitIslander #Indigenous #firstnations #ancestors #culture #Strength #protest #power #passion #pride #Sydney #Bondi #reconciliation #naidoc #atsi #blackpower #blackman #AboriginalFlag #alwayswasalwayswillbe #australiahasaBLACKhistory #blacklivesmatter #travelgram #igtravel #instatravel #wanderlust #traveller #Naidoc #Naidoc2018 #newselfwales
    and that's a wrap! 7th city2surf done. 50th medallion to the collection... all in a onesie!\n#poohbear #winniethepooh #onesie #funrun #city2surf2018 #city2surf #sydney2bondi #happiness #sydney #bondi #walking #cosplay #costumes #health #fitness #heartbreakhill #australia #canteen #newselfwales
    and that's a wrap! 7th city2surf done. 50th medallion to the collection... all in a onesie!\n#poohbear #winniethepooh #onesie #funrun #city2surf2018 #city2surf #sydney2bondi #happiness #sydney #bondi #walking #cosplay #costumes #health #fitness #heartbreakhill #australia #canteen #newselfwales
    Life is all about changing and growing... meet Jess 2.0, transformed myself just a little. Swipe right ;) #transformation #change #justalittlecut #byebyelonglocks #lob #newselfwales
    On my morning walk. It's cold and dry in my little town of Rylstone.  #newselfwales #portrait #selfie #newsouthwales #loveyourself
    #newselfwales
    My favourite bag lady ? \n#alldayinatree #mab #bagladiesofinstagram #futurehobo #NewSelfWales
    My favourites ❤️ #NewSelfWales
    My favourites ❤️ #NewSelfWales
    
    @sydneyrollerderby @frogmouthclothing #frogmouth #tgss2018 #sydneyrollerderby Sydney roller derby!??⚡️?? #NewSelfWales
    Sydney #cityofsydney #circularquay #operahouse #harbourbridge #goprohero3 #newselfwales
    #NewSelfWales the face of an absolute foodie?
    #oktoberfest#munich\nPeople who realise free will is a gift \nYou will never know how to use\nuntil you fight for it #newselfwales
    Finished taking selfies - ready to leave now @crazycatladyjunior
    Uncle X Faith • Hong Kong | 2018 ．\n．\n．\n．\n#HongKong #Asia #2018 #Travel #Baby #Niece #iwanttobiteyou #NewSelfWales
    In transit ?
    Spirit animal party.
    Acclimatisation is: watching the Ashes in full sun on the hottest day on record since 1939
    “Put your heart, mind, intellect and soul even to your smallest acts. This is the secret of success.” -Swami Sivananda\n\nMy first day of class for the second semester starts now. With a renewed drive and determination, I'm armed and ready. Game on! ?? @utsint #utsint #utslife #secondsemester #springsession #NewSelfWales #airmax #thegreathall #sydney #DarylJaramilla ? @jugnat.ion
    Just simple things - I like black and white, monochrome; I like suits.??\n#suits #photography #gayboy #pride? #gay  #pride #gayman #thattannedlife #models #sun #loveyourself #tanning #feelings #usa #gaylife #life #NewSelfWales #suitswag #sydney #australia #gayguy #summerdays #style #life #sunshine #takepride #suitstyle #photos #photography? #gayfitfamous
    #NewSelfWales
    #NewSelfWales
    #NewSelfWales
    #newselfwales
    Sunday stripes on route to the @sydneyveganmarket
    #NewSelfWales
    #newselfwales
    #thredbo #skiing #newselfwales
    Minimal with a pop of red ?
    Hi ! #newselfwales
    #NewSelfWales
    #NewSelfWales#
    Messssy hairrr don’t care coz last exam today yew yew! ???
    Exsqueeze me IG. Here’s my face. Kthxbye. #NewSelfWales\n?: @mateorad
    Skills acquired in this month\n✔️smile and say hi to strangers ✔️resistant to the ignorance ✔️competent in self talking and laughing at my own humor ✔️ capable of not giving a f*\nPs. Thanks CEO office for free portraits\n#tgif #selfportrait #NewSelfWales
    一个200斤的胖子。
    Invest in yourself !\nit always pays Dividends ??✅\n#NewSelfWales
    From time to time, it creeps back, messes with my head. I’ve started to documenting my struggles again, welcome to the dark side.\n.\n.\n.\n.\n.\n#moodygrams #selfportrait #portraitmood #moodyportraits #moodygrams #dailystruggle #depressionrecovery #fuckdepression #documentlife #mymentalhealth #nooneknows #amateurphotographer #sydneylocal #blackandwhitephoto #bnwphotography #bnw_demand #bnwmood #bnwsouls #peopleinframe #fujifilmx_au #fujifilm_xseries #fujifeed #fujilove #xe3 #newselfwales
    #NewSelfWales
    Regram from @colors828  @sydneyrollerderby @frogmouthclothing #frogmouth #tgss2018 #sydneyrollerderby Sydney roller derby!??⚡️?? #NewSelfWales #rollerderby #frogmouthclothing
    For the longest time I had been debating whether or not to post something that's quite personal because I'm usually not one to blast it all over social media, however I do feel I have a duty to open up the conversation.\nSame time last year, I wasn't in the right headspace: self-loathing and isolating, un-interested, a recluse, moody, more importantly I wasn't enjoying my family - the birth of my second child, the growth and development of my first; and the love and support of my husband. For the longest time I was in denial about any possibility of depression, more specifically Postnatal. It was inconceivable. Growing up as a God-fearing person, I thought I would be impervious to it.\nLate last year after wallowing and drowning in anxiety and thoughts of self-doubt and pity for a long period of time, I left myself vulnerable and asked for help. I went to the local Early childhood and Family Centre, and spoke to the nurses who were able to provide numerous resources that I was unaware of - apart from BeyondBlue and Helpline, I had to let go of my stubbornness and get a referral from the GP to see someone.\nIf you find yourself miserable days on end (its okay to have an 'off' day every once and while), know that you are not alone, valued and you are more than enough. Also, check up on each other - I know how busy we can all be with work and family, but even a quick check-in to see how loved ones are is sometimes is all it takes for someone to open up.\nTo my friends and family: thank you for your on-going love and support - even the occasional check-ins to see how I was helped me to open up and vent.\n•\n#Blessed #Humbled #Stronger #Overcome #Conquer #Empowered #Love #Valued #SelfWorth #SelfLove #SelfPortrait #BirthdayGirl #NewSelfWales
    Faded.\nFantasy.\nAtlantis.\nSilence.\nNo.\nD R o Wn iN G.\nC H ok inG.\n☠️.\n#NewSelfWales
    conference was a whirlwind ~ blessed words, anointed worship and lit dance circles. First conference, not my last ✨? #hillsongconf #vscox #blkgirls #newselfwales
    Today’s mantra: Don’t follow your dreams. Chase them. #glam #artist #painter #makeup #bepositive #vintage #smile #dress #navydress #gold #style #goodhairday #photoshoot #profile #instagood #studio #portrait #portraitlighting #monday @studio1000_photography #NewSelfWales
    Hej from #stockholm. I have found a way to hide my pimple ???
    SistaSista ? #newselfwales
    Selfies with my human #australianterrier #aussieterrier #dogsofsintagram #dogsoninstagram #pawtners #puppyselfie #doggyselfie #imreallyjustwatchingthemailman #hello #mynameisdallas #dallastheaussie #newselfwales
    #newselfwales
    #newselfwales
    #NewSelfWales
    Goodnight everyone!  Buenas noches  a todos #newselfwales
    #NewSelfWales
    Book fair was fairly done.\nadvice by @perusedletters\n\nPs. I have a lot of Dickens waiting for you.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n#bookstagram #igreads #bibliophile #australia #sydney #bookfair #dickens #shakespeare #hugo #NewSelfWales
    #NewSelfWales
    #NewSelfWales \nʕ·͡ˑ·ཻʔෆ⃛ʕ•̫͡•ོʔ
    Sunday ?#sydney#boy#sunday#asian#fresh#newselfwales
    #NewSelfWales
    I pretty much never post selfies these days but @statelibrarynsw project #newselfwales would be cool to be a part of, so here’s a selfie.
    #newselfwales
    Hero starts with HER. Happy Mother’s Day mama, love you always! ❤️?????#bae #Queen ?#mummmmaaaaayyyy #love #yay THUMBS UP FOR ANDY ?????? #newselfwales
    | TODAY’S WEDDING | Here I am preparing for today’s engagement party but really a wedding for Zoe &amp; Nathan. As guests arrived I acted more like a concierge so no one suspected. #newselfwales
    Some pics from last weekend taken by @braydenmcmahonphotography of a @canberraharley 2018 Fatboy 114ci. Beautiful bike to ride and attracted a bit of attention around town. #goulburn #rightnowingoulburn #rossibridge @therosescafe #harleydavidson #harleysofinstagram #instamotogallery @harleyaustralia #fatboy114 #harleyfatboy #dragginjeans @dragginjeans pics for upcoming AMCN Story #newselfwales
    #NewSelfWales
    #portrait #photography #NewSelfWales
    #newselfwales
    A beautiful autumn day. #NewSelfWales #reemahamdan
    Let's see what happens.\n#newselfwales
    #NewSelfWales 27 June 2018 Forest Lodge 2037
    Lovely boy walking on the street:) #NewSouthWhales #nikon #naturephotography #nikond200 #mynikonlife #portraitphotography #newselfwales
    #newselfwales newselfwales
    A happy restarantauer at Bankstown Bites\n#bankstown #OutdoorSydney #nofilter #sydeneybits #sydney #saturdays #explore #travel #weekends #newselfwales #nsw
    #newselfwales
    #NewSelfWales
    #newselfwales team portrait
    #newselfwales
    A selfie in the name of modern art! #newselfwales
    June 21st is national selfie day in America. We thought we’d kick it off a bit early here. We think we nailed it. #nationalselfieday #bordercollie #boxer #cavoodle #dogdaycare #dogsofsydney #doggydaycare #innerwest #selfie #minipoodle #newselfwales
    June 21st is national selfie day in America. We thought we’d kick it off a bit early here. We think we nailed it. #nationalselfieday #bordercollie #boxer #cavoodle #dogdaycare #dogsofsydney #doggydaycare #innerwest #selfie #minipoodle #newselfwales
    What does the face of NSW look like in 2018? \nTo find out, the State Library of NSW is inviting you to take a portrait of yourself and submit it via Instagram using the hashtag #newselfwales \nYour portrait will become part of an immersive exhibition experience that will be launched in the State Library’s new galleries, opening on 6 October 2018. \nFeaturing thousands of portraits from the Library’s collection, from people around NSW and yours, of course, this experience will become part of history as the State Library collects the face of NSW in 2018.\nThe State Library would love to see your creative photographs and re-gram them on their Instagram account. \nFor more enquiries  direct message @statelibrarynsw or email media@sl.nsw.gov.au\n\n#portraitphotography #portrait #portraits #selfie #newsouthwales #newselfwales
    #newselfwales
    Happy Father’s Day to this pawsome hooman ???#fathersday #newselfwales\n.\n.\n.\n#dorathedalmation #dalmation \n#dali #dalmationsofinstagram #dog #dogsofinstagram #dogslife #topdogphoto #dalmation_feature #spots #spotteddog #picoftheday  #traildog #adventurewithdogs #dogportrait #konaleashes
    Finally wearing a pair of my own earrings ✨ #newselfwales
    Positivity always wins!?.\n.\n. \n#globe_portraits #globe_visuals #sydney_insta #sydneyphotography #sydneyphotographer #portraitphotography #portraitphotographer #portrait #portrait_shots #portrait_mood #portrait_star #beauty #sydney_insta #sydneylife #sydneyfashion  #australiagram #artistsoninstagram #art #instaart #artist #topportraits #art_we_inspire #arte_of_nature #artofvisuals #artphotography #artoftheday @nikonaustralia #mynikonlife #sydneymodel #mof #madeoffashion #newselfwales
    Just me.\n#work #mugshot #blackandwhite #photography #toldnottosmile #itshardnottosmile #id #seriousstuff #newselfwales \nThanks for pic @jamieshootsstuff
    #newselfwales
    Little piece on vogue.com.au with my tips on kickstarting your career in the design industry. Thanks for the chat @thepowderpuffpost and @vogueaustralia Link in bio ????? #NewSelfWales
    Us #newselfwales
    Me good days and bad days #newselfwales
    ?Everything I am, you helped me to be.?. The middle of year 12 is tough, stressful and busy. To have someone there to talk to, support me, make me laugh and remind me why I am completing year 12 is crucial and is what keeps me smiling and striving to make the most of it. #5months3weeksandcounting #primaryschoolteacher #newselfwales
    ? #newselfwales
    #? #saturdaysarefortheboys #newselfwales
    Got the flu? You are way more dangerous than any shark. Statistically speaking, people may be safer underwater, because the average human has a 1 in 63 chance of dying from the flu. Compare that to a roughly 1 in 3,700,000 chance of being killed by a shark. At least underwater no one can cough on you.
    \n.
    \n.
    \n#wildaware #sharks #sharkwater #flu #NewSelfWales  #diving #animals #animalrights #activist #earthlings #plantbased #kindnessmatter #vegan #endangered #Robliveson
    #photography #moon #australia #eastcoastlife#newselfwales
    #asn#newselfwales
    Blueberry mess #newselfwales
    Loving this exhibition at @artgalleryofnsw!! All the colours giving me all the joy in the world✨ (swipe left for the joy) #whpcolorpalette
    #newselfwales @statelibrarynsw\n▪️\n▪️\n▪️\n▪️\n▪️\n▪️\n▪️\n#smartcasual #fashion #fashionsense #suit #nsw #newsouthwales #sydney #australia #statelibrarynsw #library #history #exhibition #collection #awesome #sallyboy #lit
    im really not comfortable being in the opposite side of the camera haha shot by @chikk_rose\n»\n»\n»\n#shotbypixel2#portrait#notamodel#likeaboss?#newselfwales
    
    #newselfwales
    Are you ready for #newselfwales @slnsw #dxlab ?
    home is where the books are... ? btw just ignore the same bomber ?? #newselfwales
    One of my favourite photo taken by ?@rubyandtedphoto ?? I would love to share ma new journey to ma new home ??. ( If you are interested to read it, check my instagram bio??). @newhumansofaustralia The reason behind sharing ma story is to let people know that, stars ⭐️ shine after dark.  which has been explained here ??( The darker times make the stars shine brighter because our eyes have adjusted to the light. The dark helps us to remember that the light has been shining on us throughout our journey, whether we acknowledged it or not.) Very thankful for the past for who I am today✌???. #kurdishgirl #kobani #دمشق #girl #motivationalspeaker #syriangirl #syrianrefugees #syrian_beauty #syrian_girl  #كردية  #قامشلو #روج_افا #rojava #سوريا?? #مغتربين #wollongong #qamishlo #australianrefugees " #سورية #followmenow  #refugees #sydney #illawarra #illawarraphotographer #picoftheday? #hijabfashion  #kurdishclothes #photooftheday #newhumansofaustralia #newselfwales
    More from the Corker Trail... ft. The gorgeous  Wombat Creek campsite, signs to Carey’s Peak, my makeshift buff/instant ice pack combo to sort out a rolled ankle and the big valley views that open up halfway back to the trailhead.
    In a train, visiting Grandma ?
    Boring train ride back. #ihatepublictransport #needashave
    ?
    Luncheon baby shower style #newselfwales
    1st outfit for #wearitpurple I am rocking this colour all week. Wear it #purple day is Friday 31 August. \nI want rainbow youth to be safe, supported and empowered.\n#rainbow #empowertogether #librarianswearpurple #librarian #selfie #wearitpurpleday2018 #wearitpurple2018 #NewSelfWales
    #newselfwales #iskee
    Vogue ?
    Vogue ?
    Check out the photobomber! 25 August 2018. #NewSelfWales
    Emo dog wanted a drive not a walk.  #NewSelfWales
    Being a behind the scene team comes with a privilege: taking photos before everyone else (meskipun dg muka kucel jam setengah 2 malam) ?\n\n#newselfwales
    Snuggling selfie in monochrome. #huskycross #dogstagram #onthecouch #newselfwales
    Griffin #newselfwales
    #newselfwales
    Dan Day #newselfwales
    Poppy #newselfwales
    @llsutton How lucky am I that my best friend is a make up artist &amp; pure amazing ??❤️? glamday #newselfwales
    #selfie 
    Puppy Love  #GrubTheDog #Grub #staffy #staffylove #puppy #gay #instagay #dog #dogsofinstagram #puppylove #sydney #australia #americanstaffy #americanstaffy #englishstaffy #englishstaffordshirebullterrier #weloveourpuppy #sydney #pottspoint #kingscross #kx #kingsx #newselfwales
    #twinpeaks #sydney #sydneyaustralia @kimmyrobertson #kimmyrobertson #newselfwales
    @sabrinasutherland2691 #sabrinasutherland #twinpeaks #sydney #sydneyaustralia #newselfwales
    @officialdeputyhawk #michaelhorse #sydney #sydneyaustralia #twinpeaks #newselfwales
    #alstrobel #twinpeaks #sydney #sydneyaustralia #newselfwales
    #danaashbrook #twinpeaks #sydneyaustralia #sydney #newselfwales
    #twinpeaks #sydney #sheryllee #laurapalmer #kimmyrobertson #danaashbrook #newselfwales
    On location at Avalon Beach. \n#filmindustry #onlocation #selfie #beach #smile #avalonbeach #northernbeaches
    ?\n#newselfwales
    한시도 얼굴을 가만히 두지 않는 아드님. ??‍♀️장래꿈은 dancer. 미래의 Justin Bieber를 기대해보마. ?? .\n.\n#longweekendfamilytime \n#marcusfamilyfun #newselfwales
    한시도 얼굴을 가만히 두지 않는 아드님. ??‍♀️장래꿈은 dancer. 미래의 Justin Bieber를 기대해보마. ?? .\n.\n#longweekendfamilytime \n#marcusfamilyfun #newselfwales
    한시도 얼굴을 가만히 두지 않는 아드님. ??‍♀️장래꿈은 dancer. 미래의 Justin Bieber를 기대해보마. ?? .\n.\n#longweekendfamilytime \n#marcusfamilyfun #newselfwales
    Do you enjoy the process as much as I do? ??‍♀️?⠀\n.⠀\n.⠀\n.⠀\n⠀\n#globe_portraits #globe_visuals #sydney_insta #sydneyphotography #sydneyphotographer #portraitphotography #portraitphotographer #portrait #portrait_shots #portrait_mood #portrait_star #sydney_insta #sydneylife #sydneyfashion #voguemagazine  #australiagram #artistsoninstagram #instaart #artist #artwork #topportraits #art_we_inspire #arte_of_nature #artofvisuals #artphotography #artoftheday @nikonaustralia #mynikonlife #sydneymodel #mof #madeoffashion #newselfwales
    I somehow wish my eyes can be a camera, capturing the best moments around with the best resolution. \n#fujifilm #fujifilmxt20 #xt20 #cherryblossom #newselfwales
    #newselfwales
    'Selfie'. Collage.\n#newselfwales #cristinajdoyleart #collage #papercollage
    'Selfie'. Collage.
    \n#newselfwales #cristinajdoyleart #collage #papercollage
    #NewSelfWales I think the reason why I love this picture so much is because this is one of the only times my soul is visible in my physical appearance, captured on camera. I can never express how I always felt I'm born in the wrong era- that I do things the old-fashioned way, I write on my typewriter, I hold values of the past.\n.\n.\nMy all time fave film Midnight in Paris (swipe) whisked me off on a time travel to the 1920s era. This film, it opens up a visual feast- so picturesque, imaginative, charming. Something realists would tell you to snap out of. But I just like to see the world like that, through those dreamy lens- dancing in the streets of Paris in the rain, live music in a pub, living as a broke artist but it's alright cos you have the antidote to the emptiness of existence. This film is literally how I see life. If you want to see life through my eyes watch this film.\n.\n.\n.\n#midnightinparis #throwback #1920s #filmreview #portraits #paris #timetravel #ootd #styleinspo #style #vintageclothing #vintage #oldsoul #soulful_moments #prettylittleiiinspo #newselfwales
    Taking advantage of company time to document the results of my weight loss program. Actually it’s just an illusion created by a curved mirror and some flattering neon lights. #newselfwales
    #throwbackthursday to our visit to #nutritionstation . So good having healthy options to choose from for the kids. Why is it so often nugs &amp; chips? .\n.\n.\n#nutritionststion #healthy #instafood #happy #photooftheday #tasty #eatclean #nutrition #healthyfood #fitness #health #eat #foodstagram #cleaneating #yum #fresh #lifestyle #instadaily #amazing #foodpics #picoftheday #lunch #fitfam #fun #instalike #nustation #snack  #newselfwales
    Anyone got some easy to follow healthy tips for a time deprived woman ? Also anyone else tried @livesoulara ?\n.\n#girl #browngirl #browngirls #browngirlbloggers #browngirlbloggers #melanin #melaninpoppin #melaninmagic #melaninqueen #buns #spacebuns  #hair #hairstyles #cute #ootd #ootdfashion #wiw #wiwt #whatiwore #whatiworetoday #makeup #indian #mum #mom #denim #newselfwales
    Ehhh\n\n#newselfwales
    #morningCoffee with #friends at #chapterfive #cafe #redfern #sydney #nsw #iskee #newselfwales @gregoriusragilw #flatwhite
    #migrantworkers #iskee #rozelle #kennard #storage #sundayFun #newSelfWales #diasporicimagination #indonesianinsydney #coolguy
    ? son we need to have a talk about the bees and the bees ?\n\n#flowerboy #beesknees #911 #newselfwales
    That portrait mode though...?\n.\n.\n.\n.\n.\n#newselfwales
    That face?? #sibel#faceshot#instablackandwhite#kidsfashionforall#kidsblogger#cutest_baby_on_ig#smile#lovehersomuch#mymodel#mysunshine#newselfwales
    Annabelle?? #smile#lovethatface#blessings#lovingtrain#babyphotoshoot#addidas#newselfwales
    Princess SIBEL?? #operahousesydney#sydney#photoshoot#mymodel#girlsfashion#dreamer#newselfwales
    Super hero week at day care!\nWith head-gear on, Ayla is @jthurston06 ... but when she takes it off she becomes @mattybow1 \n#newselfwales
    ?✨?
    miss days…@#NewSelfWales\n商业三巨头…也不知道跪了没…
    Feeling fancy for a Sunday #operanight #operaharbour #laboheme #datenight #workhardplayhard #newselfwales
    End of the winter. #usyd #usydbusiness #newselfwales
    Let’s give this insta-thing a go. Hello world from Damien Linnane ? #newselfwales
    #newselfwales
    #jumpforjoy
    #cockatoo #feeding ?
    Are you really scared or are you just afraid to feel fear?\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n#portrait #portraitphotography #portraits #self #selfportrait #selfportraitphotography #photography #portrait_vision #ig_portrait #instaportrait #retro #vintage #igportrait #selfportraitsociety #selfportrait_society #artofselfportraiture #me #newselfwales
    Staring at the ocean, thinking about the mountains. What's your #escape?\n.\n.\n.\n.\n#selfie #selfportrait #surfing #snowboarding #discovernsw #ilovesydney #explorecreate #exploreeverywhere #passionpassport #letsgosomewhere  #beautifuldestinations #dcw52 #keepexploring #getoutstayout #exklusive_shot #liveauthentic #symmetry #52sangas #travelbug #maroubra #seeaustralia #lumixgh5 #lumixlife #lumixlounge #changingphotography #primeshots #instagood #gramslayers #newselfwales
    The only selfie that I have genuinely smiled in #newselfwales
    #newselfwales
    #Newselfwales. My little Australian Dominican ?⠀
    \n.⠀
    \n.⠀
    \n.⠀
    \n.⠀
    \n#Australian #Australianbaby #Australianboy #Australiantoddler #Australiankids #summerbaby #icallaustraliahome #nsw #sydneybaby #hawkesburybaby #sydneykids #seedheritage #beautifulbabyboy #nswstatelibrary
    And like that, the blonde is back! @jordanhone you are a miracle worker ❤️ Thank you sooooo much ? Brunette to blonde in 6 hours with the help of @lorealpro and their smartbond tech! #newhair #coolforthesummer #sloanshairandbeauty #loreal #smartbond #smartbondloreal #blondehair #blondebalayage #blondehighlights #hair #miracleworker #greyhound #greyhoundsofinstagram #newselfwales
    วันนี้เป็นมีทที่มีทภูมิใจ :)\n.\n.\n.\n#NewSelfWales
    Some days I feel like my own girlboss ready to take on the world. Some days I feel like hiding away, reserved and obscure, posing against a floral backdrop with an i-know-what-you-did-last-summer look :) #seemsaccurate #flowerpower
    I'm in front of the night lamp next to a bunch of children's bedtime books reflecting on a day that felt outta control and exhausting and frustrating at the time. But it really wasn't so bad.\n\nKinda wish I was actually there to enjoy the topsy turvy adventure that it was...? #mumlife
    #newselfwales @statelibrarynsw #everydaywithxianyang
    Camoflaging into yo dreams (←_←)
    #newselfwales
    #NewSelfWales
    When the light is good #selfie.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n#selfportrait #me #iphonephoto #iphonephotography #blackandwhite #blackandwhitephoto #bnw #bnwphotography #bnw_captures #bnw_of_our_world #monochrome #mobilephotography #mobilepic #mobilephotography #light #moody #mood @angetaya #selfportraitsociety #selfportrait_society #newselfwales
    #newselfwales
    #ballet #swan ❤️#newselfwales
    #NewSelfWales
    THOSE CHEEKS. THOSE EYES. THAT SMILE. ??? forever mummy's little boy ? #AyrtonXavier #Xavi #goodmorning #babyboy
    Because if I can't protect YouTube, you can be damned well sure I'll Avenge it.\n\nThis weekend at #vidconau was an awesome time and definitely made me think about a lot of things, honestly there were some ups and downs but overall it was an awesome weekend.\n\nThat being said after walking around in my Civil War uniform for the weekend, I am now going to be known as the protector of YouTube, the Captain America of YouTube (hahahaha). Make sure to look out for some content really soon as this journey is going to be such a Marvelous time. ?@jrod_hd\n#captainamerica #youtube #cosplayer #marvel #cosplay #vidcon\n#newselfwales
    #newselfwales
    #portrait #photographer #instagood #instadaily #holiday #likes #likesforlike #likesforfollow #likes4like #fashion #camera #sydney #australia #sydneyphotographer #newselfwales #peopleofsydney
    #selfie after #work #newselfwales \n#daily #life #businesstrip #sydney #ootd #ootdfashion #purplehair #wearing #designer #syusyuhan #Thailand #travel #travelblogger #Bangkok #girl #selfies
    #selfie #selfportrait #portraitphotography #photography #australia #newselfwales #artgallery
    Selfie with mr rooo #newselfwales
    A.N.N.A.B.E.L.L.E\n\n#happymoments#funtime#cutest_baby_on_ig#kidsfashionforall#kidsblogger#instagram#explorepage#peppapig#bannasandpajamas#newselfwales#smile#myprinces
    #newselfwales
    #newselfwales
    Boogedyboogedyboo #newselfwales
    A big sloppy lick, or ‘kiss’ as a three year old calls it! .\n.\n.\n©️Karen OConnor \n#wildandfreechildren #bnw_life #bnw_planet  #bnw_greatshots #bnw_captures #familydog #bnw_society #candidchildhood #bnw_kids #bnw_magic #bnwphotography #thehonestlens #theeverydayportrait #NewSelfWales #pixel_kids #theabstractlens #instakids #magicofchildhood #bnwmood #kids_of_the_lens #kids_in_bnw #kids_of_our_world #jj_its_kids #wildandbravelittles #dearphotographer #childhoodunplugged #thesincerestoryteller #kidsofinstagram #lookslikefilmkids #themonochromaticlens
    #repost\nTrying to be the most #sparkling face of #newselfwales ?\n#putyourshadeson and join us \n#statelibraryofnsw
    'Sometimes the greatest miracle is being able to face exactly where you're at and say: this is where I am. no running, no hiding. There's gold for me here, and I intend to find it, no matter what.' ?✨?\n°\n°\n°\n#selfawareness#selflove #loveyourself #loveyourlife #universe
    #newselfwales
    #NewSelfWales
    face mask time #lush#australia#snapchat#face#facemask#travel#selfie#blueeyes#art#rainbow#lushcosmetics#quote#newselfwales
    Take 1 #anasaad #anasa3d #selfie #elevatorselfie #iwokeuplikethis #saadinaustralia #beard #beardgang #summeriscoming #beardedmen #sydney #sydneynights #newselfwales
    ⭐️?⚡️☀️#ASOS (The Bandana and Hoody)
    #NewSelfWales
    Who wore it better - Sez or The Table? #closecall #bankball #bankball2018 #cba #sequins #sequinsdress #sequinstablecloth #whoworeitbetter @commbank @iccsyd #newselfwales
    Oops, I love him. #NewSelfWales
    #tbt to one year ago  When I used to see fluffy often.... #thegrounds #workmate #loveanimals #birds #cute #omg #she #is #so #pretty #thepottingshade #old #job #memories #2017 #july #winter #fluffy #kevinbacon #thegarden #thegroundscafe #sydneyaustralia #sydney #australia #cold #newselfwales
    The crimp life is here #newselfwales
    @jamieleee.r chose it??‍♀️?? ~might delete later /: #newselfwales #madcuntstagged
    #NewSelfWales #newsouthwales #selfie #blackandwhite
    ?\n.\n.\n.\n.\n.\n.\n.\n#travel #canberra #canberralocals #australia_shotz #fashion #fashionblogger #travelblogger #travelgram #art #jamesturrell #jamesturrellskyspace #newselfwales
    #newselfwales
    #Jump or not #Waragamba #Dam Wara what?
    Mumma mia and the mini superstar ————————————————-\n@stylishkids_australia @cottononkids @myer #newselfwales
    Happy Saturday! All you gotta do is smile ?\n.\n. ▪️Dress Design: Ruth Fattal\nInstagram- @ruthfattalhautecouture \nhttp://www.facebook.com/ruthfattalhautecouture\n.\n. ▪️Miss Australia International 2018  #intlpageants #missinternational\n#missaustraliainternational ? .\n. ▪️Hair maintained by: #nak #nakhaircare #nakman1 #corieshairescape .\n.\n▪️Platform: Enough is Enough Anti Violence Movement??\n.\n.\n.\n.\n.\n.\n.\n.\n#pageants #pageantlife #pageantry #australiandesign #australiandesigner #ruthfattalhautecouture #ruthfattal #ruthfattaldesign #fashion #australianfashion #eveningwear #eveningdress #australianmodel #fashionshoot #enoughisenough #antibullyingawarespokesperson #antibullyingambassadors #newselfwales
    #newselfwales
    #newselfwales
    Heyo, the ghost (me) is back from the dead\n\nMood: Revival by Selena -rising from the ashes after finishing my last assignment yay\n\n#bluehairdontcare\n#newselfwales
    Speed pitching #gingerandsmart  #katemoss for #topshop #newselfwales
    New self ?Better self ??『 STATION』Dance MDV \n#newselfwales #betterself #life #newphoto
    24th birthday ?\n儿生母苦，愿母亲健康顺遂，感恩父母多年养育之恩 ，感谢身边的朋友、师长 ?? #newselfwales
    I know u guys watching the footy n stuff but here’s a pic of me smiling while extremely cold #newselfwales
    Don't play the odds, play the man?⚄\n#gayboy #feelslikesummer #pride? \n#gaysnap #gay #pride #gayman #model #sun #suits #newselfwales #fitnesslife #suits #instagrammodels #gaylife #life #gaypride #modeliwish #sydney #australia #gayguy #springtime #gayfitness #style #life #summerfeels #photo #gaymodel #gayhot #dressy #gay #suitsupply
    Chellisa is one of the women who play in the Hastings Rugby Country League.\nHastings League launched their first-ever Women’s Tackle Competition, with over 80 girls competing, on June 1st 2018.\n\n#NAIDOC2018 #becauseofherwecan #naidocweek #naidoc
    20% of the Australian population born in Italy are from Veneto. So are my mates in Port Macquarie. They are old gentlemen and I like to hang around with them. They have great stories and they tell me all about Australia and its people when I wasn't even born. Check out the link in bio for more of their stories.
    Okay I’m ready ??? #ballin #newselfwales
    ? ? #newselfwales
    Always happy to have an occasion to dress up for...?\n.\n.\n.\n#portraitphotography #portrait #photography #photoshoot #dress #dressup #formaldress #makeup #updo #updohairstyles #updohairstyle #ball #selfportrait #silverfoxmodel #silverfoxmgmt #40plusmodels #agepositive #newselfwales
    #newselfwales
    #canon_photos #cpcollectives #pursuitofportraits #theportraitpr0ject #quiethechaos #potraitmood #featurmeofh #discoverportrait #theimaged #weekly_feature #aov #artofvisuals #newselfwales
    ?Station - @musiclapsley ??Choreography : @zerocircle98 ?Shoot : Cai
    \n✂️Clip : @zerocircle98 ??Dancer : @piggy.729 / @xiaoqi9783 / @doddbozunsheng / @chongzichongzi7280 / Rinbo / Yuian / Danny / Simian/ @boogie_hopofficiail 
    \n@alex_lu1216 特此感谢我的Man!!!
    \n给我鼓励!!给我修改效果!!! @musiclapsley I like this song very much!! ?Its a very beautiful song!!!Thank you?
    \n
    \nIts New!!!!This is my new work!!!
    \nIm so happy dancing with everyone!!!Thank you all?
    \n
    \n#newselfwales #music #choreography #choreographer #dance #dancer #life #china
    "Go after dreams"\n\n#newselfwales
    tu me manques ? #loveyourselffirst #imcammy??#newselfwales
    #NewSelfWales
    #NewSelfWales
    •-•-•-•-•-• Pink Matter: Cotton Candy x Majin Buu x Thicc Girls are Made for Cuddlin’ •-•-•-•-•-• ? @andienothankyou
    #newselfwales ??????#polaroid #pola #goodolddays #sydneybiennale #cockatooislandsydney
    
    出國前 @its_minnielin @tzuyinglo @shihhehsean 一起陪我買的洋裝，昨天第一次穿受到各方盛讚❤️我覺得自己好像Mia\n#20180907#UNSW#QueerParty#Sydney#yellow#MC交換日記#NewSelfWales
    #newselfwales \nFirst birthday in Sydney
    Congratulations Griffith High School Class of 2017! We made it! ????#newselfwales
    Congratulations Griffith High School Class of 2017! We made it! ????#newselfwales
    Congratulations Griffith High School Class of 2017! We made it! ????#newselfwales
    Congratulations Griffith High School Class of 2017! We made it! ????#newselfwales
    Congratulations Griffith High School Class of 2017! We made it! ????#newselfwales
    Congratulations Griffith High School Class of 2017! We made it! ????#newselfwales
    Congratulations Griffith High School Class of 2017! We made it! ????#newselfwales
    Congratulations Griffith High School Class of 2017! We made it! ????#newselfwales
    Congratulations Griffith High School Class of 2017! We made it! ????#newselfwales
    Crystal eyes
    \n
    \n#portraitoftheday#photographer #vsco #familyportrait#sydneyportraitphotographer #sydneyfamilyphotographer #childrenphoto #naturallightphotography #portrait #kidsfashion #kidphotography #newborn #sydney #colourpop #smile #boys #middleeast #cutekidsclub #justgoshoot#500px#visualart#newselfwales
    Becoming a part of history at #statelibrarynsw sharing my portrait. Taken on a sojourn to #galway \nStopped into a fish and chip shop by the name of #hookedgalway “You need to come face-to-face with the past, not as some naive, easily wounded boy, but as a grown-up, independent professional. Not to see what you want to see, but what you must see. Otherwise you’ll carry around that baggage for the rest of your life.”\nHaruki Murakami.\n\nThose who smile will encourage others to do the same. \nHere’s to making history and being apart of it face-to-face.\n\n#newselfwales \n#citizenofsydney\n#sydney #sydneyselfie #sydney
    #newselfwales
    #newselfwales
    #surryhills #radp0traits #vape #retro #streetph0tography #newselfwales
    Marcel #portrait #German #traveler #newselfwales
    Need to get back to this place next winter! @bennybaha #travelgram #snowgumforestwalk #visitnsw #newselfwales
    Ya poor and cold girl #shotononeplus #newselfwales
    #newselfwales
    This hooman loves her #furbabies ???.\n.\n.\n.\n#newselfwales #dorathedalmation #dogsofinstagram #puppiesofinstagram #harleyanddora ##dalmationsofinstagram #dalmation #dalmationpuppy #darbythedalmation  #picoftheday #petportrait
    #newselfwales
    I’m not one for selfies either... but here I am, in my artwork @muse_contemporary_gallery ?Thanks @the_ginger_smitten for the inspiration for the state library of NSW interactive exhibition ? #newselfwales #sophieamelia #artlife #artblog #artshow #exhibition #artist #lismore #tophat #handmade #bespoke #lifeisart #iamart
    Not good at selfies but wanted to say that thanks to @plastic_cactus I have a pair of earrings for every brooch
    No place in the world can give you peace, which comes from within, and in an era where “meditation” is looked at as some hippie thing, this is what happens. It's become a habit to wake up to your phone and fall asleep with your phone, our minds have created patterns of thought that lead to anxiety, fear and depression but you don’t see physical damage so you let it be. \nToday I realize how detached from reality I am. I can be anywhere and not be present in the moment, because of constant planning, worrying, thinking. Every job comes with struggles and apparently, sometimes it costs you your mental health. Some people proudly say goodbye to their mental health to be great or successful at something. Careers require you to be beyond human, and thats a fact. Me personally, I just want to be okay, actually okay, while striving for greatness. I think We actually matter, just as much as your career does. And its time we start asking ourself questions about what is important to us, what are we worried about, what gives us anxiety? and give ourselves those answers and try to manage our emotions and take conscious efforts in order to take care of ourselves. Spending 5 mins everyday just to be mindful, is so absolutely healing, Please try it ? Even just reading a book ? What good is a great career when you are not even present inside your head? Hell any day can be our last day and it's like we weren’t even here. Lastly, I wanna let you know that you are enough, exactly as you are ? You. Are. Enough. \nJust. Be. In. The. Moment. And Relax.\n\nx
    Art: Look back through my feed - I'm not one for posting selfies(although maybe I should let you see me every now and then) but this ones for arts sake. The State Library of NSW is having an interactive exhibition. Post your selfie and tag it #newselfwales and be involved. Don't ask why, ask why not?
    #Newselfwales
    Finally brought a new phone now i can start posting again  #filmphotography #vsco #fiercefemininity #potraitpr0ject #tbthursday #retroart #postmypicsticks #newselfwales
    Sunday ?
    
    #newselfwales
    #burberryboy #burberry #iskee #newSelfwales #mensfashion #swagman #coolguy #campsie #nsw #australia #indonesianinaustralia #diasporicImagination
    #campsie #houseWarmingParty #iskee #newselfwales #australia
    #NewSelfWales
    #planeenthusiast #happy #newselfwales
    #newselfwales put me in a gallery?
    Emgraced.\nEmbracing my limitations,\nMy imperfections, my flaws\nIncluding acne/pimples ??? ••••••••••••••••••••••••• ••••••••••••••••••••••••• Seriously annoyed that at my late 30s, I’m still having acne/ pimples like 16, arrrg! \nAlthough its part of hormonal imbalance, I’m still trying to see the positive side of it, by listening to my body frequently, admitting that I’m guilty of staying up late, lack of sleep, binge watching Netflix and having all the excuses to exercise. \nOn a lighter note,  these 3major breakouts made me feel I’m still on my teens, hence the #90shairstyle ?\nOh well, #scrunchies are back!!! ••••••••••••••••••••••••••••\n•••••••••••••••••••••••••••• #cysticacne #cysterhood #cysters #PCOSuLUVME #pcos #pcosawareness #pcosweightloss #emGraced #gracified #graceaunlimited #GRACEward #selflove #selfcare #firstloveyourself #weekendvibes #thebodyloverevolution #morenaglow #diabetterG #diabetes #diabetesawareness #newselfwales
    What makes me smile?!? ? Its the opportunity to share at least 4hrs of my time weekly for a greater cause that money can’t buy ??The bonus part was meeting  these cool RedCross Shop ladies of Campbelltown ❤️ #RedCrossDay #RedCrossAu #redcrossvolunteer #graceaunlimited #newselfwales
    What makes me smile?!? ? Its the opportunity to share at least 4hrs of my time weekly for a greater cause that money can’t buy ??The bonus part was meeting  these cool RedCross Shop ladies of Campbelltown ❤️ #RedCrossDay #RedCrossAu #redcrossvolunteer #graceaunlimited #newselfwales
    My $2.60 #selfies ???Why is that? Becoz it only costs me that amount to #explore the #awesomeness of #newcastle ☀️??‍♀️??‍♀️?#sundayfunday #sundaytrip #discovernsw #1NSWsuburbeveryWeek #diabeticdoingthings #summadownunda #beachwalk #emGraced #gracified #firstloveyourself #GraceUnlimited #diabetterG #PCOSuLUVME #pcos #pcosawareness #cyster #cysterhood #morena #pinay #newselfwales
    Happy International Day of Peace! ?\n\nThis simple hand gesture✌?will definitely change your appearance as you can spot difference between the two photos. ?: Ms.Sleepy @eevonn_ng \n#fujilove #fujixt20 #fujifilm #atom #peace #newselfwales
    What a wonderful afternoon to spend checking out the entries of the Shoalhaven Wonders competition. Drop by and check it out or better yet get out there and experience the wonders for yourself! #shoalhavenwonders #visitshoalhaven #Shoalhaven #wombat #blockhead #teamshoalhaven #NewSouthWales #Australia #newselfwales
    #newselfwales
    Harita #newselfwales
    Harita #newselfwales
    #newselfwales so excited for the outdoor pool to open next week let’s hope it’s warm ?‍♀️?‍♀️
    Tari Payung - West Sumatra\nPerformed by @bra13vo &amp; @alettafauzi at Claudia and Aldo's Wedding 23/09/18 Le Montage, Sydney.\n.\n.\n.\n*Suara Indonesia Dance available for weddings across Sydney in various styles of Indonesian traditional and contemporary dance. Inbox us or email:info@suaraindonesiadance.com.au .\n.\n#indonesiandancesydney \n#weddings\n#indonesianweddings\n#indonesianweddingssydney\n#suaraindonesiadance \n#traditionaldance \n#traditionalweddingceremony\n#taripayung\n#westsumatra\n#newselfwales \n#weddingssydney\n#traditionalcostumes\n#taritradisional
    Details....\nLashes...\nThis is called a #suntiang. It is a crown worn by women of the #Minangkabau culture of West Sumatra for festive occasions.\nWorn here by @alettafauzi of #suaraindonesiadance for #taripayung performance at a recent #wedding in #Sydney.\n.\n.\n#suntiang \n#westsumatra \n#weddingssydney \n#traditionalcostumes \n#tradionalindonediandance\n#suaraindonesiadance \n#newselfwales
    #newselfwales
    My yellow pals and I ???#bufforpingtons #sisters #newselfwales
    Hanging at Sydney Contemporary with lovely Ingram
    #newselfwales
    Vidcon weekend was amazing! ? @davis_fang\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n#NewSelfWales #love #instagood #photooftheday #fashion #beautiful #followme #picoftheday #selfie #art #instadaily #fun #style #instalike #travel #igers #life #instamood #instagram #photography #ootd #model #motivation #party #vidcon #instapic #healthy #night #inspiration  #instacool
    Thanks to @tresbienmonsieur for the portrait. \n#newselfwales
    had to act like i was sidetracked to get that “unexpected shot” type of pic\n•\n#candid #trendytuesday #boysinturtlenecks #newselfwales
    Life of a innerwest kid #newselfwales
    
    ‘another bloody selfie’  my little oil painting awarded highly commended in John Copes Portrait Prize. #newselfwales
    #newselfwales #coogee #nsw #road2sydney #australia #travelismypassion #travelismylife #summer
    
    
    #NewSelfWales
    Hi, I am Lia. Mum of three beautiful souls. I have been a photographer since age 16 when I used to borrow a cool Pentax old fashion camera that my Dad had from Japan. Since then my passion evolved at a point that made me leave my 17 years in the advertising field to dedicate myself to what I love doing. That’s my story. I hope someday I can register your lifestyle to record your beautiful memories. Register people's lifestyle stories is a passion \nI inspire myself by the art of capturing the beauty of nature.\nWhere there is no posing, lighting effects, manipulation or any control over the natural environment.
    #HeadLikeADroppedPie #GoingGrey #Truth #KiwiKid #BeardedLife #BlackAndWhite #PeoplesEyebrow #Godisgood #NewSelfWales
    Thank you for capturing this ?\n? @karinasakura\n.\n.\n.\n#newselfwales
    Happy Birthday beloved Mum, the most caring, patience, loving, and loud ?? Love You Mama @krisnawatyhalim\n.\n.\n.\n#newselfwales
    Happy bdayy Wen2, hope you got spoilt lots on ur special day ^o^\n.\n.\n.\n#newselfwales
    On the H-Day ?\n.\n.\n.\n#newselfwales
    #hrosquad #trend #costume #xmas #luncheon #workplace #ladies #kriskringle #sydney #friendsarenewfamily #newselfwales
    #newselfwales
    The Golden Hour is da best ? #newselfwales
    Hands down this uncle makes the best biriyani on Haldon Street. #diaspora #migrants #westernsydney #islamicstateoflakemba #multiculturalism #crudelyislamifiedmannequinman #newselfwales
    Economically Australia is very different to rest of the Global North. It's true when they say Australia is first world country with third world economy.  Majority of Australian businesses are still independent and owner operated. I love connecting with them, help them to tell their stories. Where possible, always buy or use local. This is  Mick from Belconnen, ACT.  #localsmatters #madeinaustralia #newselfwales
    Neons &amp; Kebabs with Flavia\n\n#surryhills #ne0nart #newselfwales #canberracreatives #fiercefemininity #streetphotography #vsco #sigmaart #24mm
    My wings ?
    Self portrait to contribute to an exhibition at the @statelibrarynsw #NewSelfWales
    The look of love ?.\n.\n.\nBrielle is wearing:\n?flower crown @hopeslittlebowtique .\n? flutter romper @pennynco .\n?dress @arthur_ave_by_natasha_dwyer .\n.\n.\n.\n#toddlerfashion #toddler #toddlerootd #flowercrown #fluttersleeves #cutebaby
    Old School Hip Hop Party for the @brodypetersen birthday bash! #newselfwales
    Mojo Surf camp 2016!
    #newselfwales
    061215 612 once in a blue moon selfie 2 (possibly the last photo of 2015)? #newselfwales
    The joy that is colours, stripes and letting your inner child live.\n#sydney #carriageworks #stripes #colours #colors #art #artwork #instagood #instalove #instatravel #australia #igdaily #ignation #instagallery #instamood #happy #lines
    A rare shot of me in the wild ? #nationalparks #sydney #spring #sun #windy #daytrip #hiking #newselfwales
    Happy #newselfwales
    The look when I run out of rice :-) #NewSelfWales
    #newselfwales
    are you a freak? #newselfwales
    #newselfwales
    O my God... Now I see What I was actually missing before I wasn't making any choice on my own but Now I have learnt to make... and it really makes me feel better... Mr. Nobody ?... @broken_soul_believes  #self #improvement #selflove #selfacceptance #selfknowing #developer #selfmade #selfmadeking #learningselflove #selfreminder #selfconfidence #innerself #loveself #selfdiscipline #selfcare #selffitness #nobegging #selfawareness #dreamlife #loveofself #workharder #selfimprovment #selfknowledge #discoverself #newselfwales @unstoppableselfconfidence @selfmademillionairesofficial @kingsouthbeast @selfking347 @motivation_tip ..........
    ain’t got no cash, ain’t got no style\n.\n?: @nicko516\n#NewSelfWales
    Snuggles for #internationalcatday #newselfwales
    #newselfwales
    After work, done a photo shoot, and now going to the beach
    Many shades of Noor #newselfwales
    Many shades of Noor #newselfwales
    Tree hugger ? pic: @kit_kaattttt
    
    .\n.\n.\n.\n.\n.\n.\n.\n.\n#newselfwales
    ur mon chérie ??\n#newselfwales
    Selfie mood ? #hello #selfie #girl #smile #hat #dress #warm #spring #happy @kemella_ #polishgirl #polskadziewczyna #spam #sun #sunny #palm #huaweinova3i #cute #girly #Green #pink #blushy #blue #nature #pic #buttonup #sukienka #wiosna #Australia #newselfwales
    I've started making my Thursdays and Friday evenings matter. Investing 2hrs per day after work in reading stories exclusively by #australianwriters #visitorangensw #thepenismightierthanthesword #visitorangensw #reading #newselfwales
    Spring has sprung ?? #newselfwales #springtime #selfieskills #picoftheday #tulipseason #floriade2018
    #newselfwales
    #newselfwales
    Movie nights with the ladies ✌️
    Happy Friday ?
    Practicing my photography skills ??
    Happy birthday girlies ??
    My two favourite partners in crime ?
    Lunch with Mum &amp; Dad ❤️
    Aww too cute ?
    Best Dad in the world ? .\n.\n.\n.\n.\n#kurnell #sydney #cronulla #sutherlandshire #theshire #australia #beach #summer #ocean #nsw #nature #lovetheshire #australiaday #visitnsw #ilovekurnell #therealshire #igersydney #water #travel #kurnellbeach #sutherland #picoftheday #photography #newsouthwales #explore #landscape #sand #kurnellnationalpark #photooftheday #newselfwales
    ❤️ Happy Moments ❤️ .\n.\n.\n.\n.\n#kurnell #sydney #cronulla #sutherlandshire #theshire #australia #beach #summer #ocean #nsw #nature #lovetheshire #australiaday #visitnsw #ilovekurnell #therealshire #igersydney #water #travel #kurnellbeach #sutherland #picoftheday #photography #newsouthwales #explore #landscape #sand #kurnellnationalpark #photooftheday #newselfwales
    Me and the birthday girl ??\n.\n.\n.\n.\n#catchup #friends #love #food #drinks #weekend #brunch #happy #family #friendship #coffee #foodie #foodporn #goodtimes #sunday #laughs #lunch #instagood #selfie #besties #weekendvibes #sydney #oldfriends #2018 #instafood #photography #life #instagram #memories #newselfwales
    Self portrait from a personal project I started a few years back. Wasn’t sure I liked it back then? Shows what a few years can do to one’s perspective. ???\n.\n.\n#selfportraits #artproject #fineartphotography #portraits #personalproject #vsco #artistsoninstagram #femalephotographer #sydney
    Wish I got a pic all dolled up, lengha and all #foronce #actuallymadeaneffort But! End of the night and make up is still on point ?? Thank you @urbandecaycosmetics\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n#friends #wedding #makeup #indian #urbandecay #allnighter #anastasiabeverlyhills #nofilter  #suchaneffort #halfwaydecent #headtilt #thewaytogo #hidethatbirthmark #nevusofota #ysl #mac #toofaced #newselfwales
    #101piercings #bodymodification #bodymodified #bodymods #bodmod #punk #bodypiercings #piercingaddict #piercings #pierced #piercedman #facialpiercings #alternative #alternativemodel #alternativemalemodel  #custompiercings  #bodymodifiedmodel #altmodel #bodymodenthusiast #microdermal #macrodermal #dermalpiercing #modelwork #piercedmodel #piercingmodel #piercinglife #peircingaddiction #tattoosandpiercings #newselfwales
    Like my dress? It has pockets #dress #yellow #boots #bun #posebitch #lovethisdress #imageorgia #murderino #dresswithpockets #blackandyellow #messybun #indie #newselfwales
    Gunna steal the lobster ? @cassandr_n #newselfwales
    #newselfwales
    Women in the new picture gallery @statelibrarynsw #newselfwales
    #newselfwales
    View from between the barrels: @aretiefwines marking up bottles during a blend-your-own wine session! Head to our website to book in your session! #winemaker #eqmoorepark #urbanwinery #urbanwinerysydney #wine #blendyourown #bespoke #blendyourown #personalised #localmaker #winefun #winemakerlife #barrels #nswwine #newselfwales ?: @t_pennell
    #newselfwales
    The other side of Opera House and Harbour Bridge? #NewSelfWales #harbourbridge #operahouse
    ??????????????????????????? ????? Like if u agree #NewSelfWales
    New specs! #glasses can see clearly now near and far! #specs #selfie #marcjacobseyewear thanks for the confidence boost and great service from  the staff at Coady Davenport Optical Albury#newselfwales
    When you wake up feeling crappy with a 2 day headache and you visit your mum in the nursing home and the things she says makes you laugh again. Good on mum feelings, love and hate- goes a long way. \n@lmg.222 \n#NewSelfWales
    Miss 3 year old taking a rest in The Michael Crouch Room at Open Day @statelibrarynsw #Sydney #statelibrarynsw #openday #SFFstatelibrarynsw #familytime #familyfriendly #SFFfamily #sydneyevents #sydneylocal #cityofsydney #chillaxing #sydneykids #kidslife #kidsinsydney #newselfwales
    A food blogger between two bananas ??? Having fun at the State Library of NSW Open Day with B1 and B2 and checking out the new galleries with Miss 3 year old and family @statelibrarynsw #Sydney #statelibrarynsw #openday #SFFstatelibrarynsw #bananasinpyjamas #familytime #familyevent #familyfriendly #newselfwales / thnx @ness_bond for taking the photo
    #NewSelfWales
    The green unfurling of palpable heat / gentle radiance of multicoloured blooms / perfumed haze intoxicating / murmuring leaves harbouring crisp birdsong / days melding into each other, reality into reverie.
    Superlibrarian! #newselfwales #statelibrarynsw
    Library mouse #newselfwales #statelibrarynsw
    #NewSelfWales
    ?#newselfwales #likeforlikes #indonesianwoman #naturalmakeup
    #publiclibraryofnsw \n#newselfwales
    #publiclibraryofnsw \n#newselfwales
    Selfie @ Mitchell Library!! #newselfwales #mitchelllibrarysydney #slnsw #statelibraryofnsw
    Today was fun xx ❣️ @topmodelaustralia @parkbeachplaza @noirteethwhitening thanks to @vickiilokpo ? #newselfwales
    Straight from one flight ✈️ to another ? #newselfwales
    Zac Shaw  #NewSelfWales ?
    Miga linda, se fosse pra eu te definir em uma frase, ela seria “Become who you are.” Tenho um orgulho enorme de ver tua essência aflorar a cada passo novo, orgulho enorme de quem tu é. Feliz volta em torno do sol! Love yooou! ??? .\n.\n.\n#bdaygirl #libra #womenempowerment #lovelovelove #brasileiraspelomundo #newselfwales
    #newselfwales
    My babybells! ?\n.\n#bellamotu #cutiepie #bellamozzerella #babycakes #furbaby #newselfwales #latergram
    #newselfwales It's freezing!! ❄
    #NewSelfWales
    Strike a pose at the #NewSelfWales exhibition — Miss 3 year was captivated by the ever-changing projection @statelibrarynsw #Sydney #statelibrarynsw #openday #SFFstatelibrarynsw #familytime #familyfriendly #SFFfamily #sydneyevents #sydneylocal #cityofsydney #simonselfie #SFFsimonselfie
    ?情緣?臉跟橘子一樣圓\n#連續吃了四個月勾芡食物的成就?\n#backyard #nature #australia #coffsharbour #lifestylephotography #NewSelfWales #sunlight #coffsharbour #selfiequeen #chill #travelphoto #emeraldbeach #vacationmode #selfie #ootd #orangetree #outdoors #歐inaus2018??
    
    Hello friends and new followers!\nI'm a Sydney based Creative Artist, Illustrator, Mama, Life Lover + Founder of ‘A little bite by Grace’ and @alittlebitestudio. I am mostly known for my hand drawn line illustrations and watercolour. I tell stories with paint, pen, flowers + words and I love every second.\n\nI TRULY BELIEVE THAT EVERYONE HAS THEIR OWN STORY. MY MISSION IS TO TRANSLATE YOUR BEAUTIFUL STORY INTO A WORK OF ART THAT YOU WOULD WANT TO KEEP AND CHERISH FOREVER.\n\nSo what's coming up? \nYou will find me teaching Free Botanical Illustration workshop at @stivesvillage on the 11th of September and live illustrating at Spring Racing Style Brunch with @thestyledr on 22nd of September. I'd love you to join us! Just flick me a message!\n\nWith love,\nGrace x\n\nPhotos: @snapsby_tiffany \nFlowers: @stella_____j\n\n#newselfwales
    #newhairwhodis\n#newselfwales
    Just turned 39! #hangover gone. So time to learn about the history of #salt #reading #sunshine #sunset #tanning #pixel2 #ilovesydney #autumn #sunday #deewhybeach #wanderlust #travelbug #books #booklovers #readingroom
    look mum I'm apart of history \n#newselfwales
    Besties #newselfwales
    Two gorgeous girls! \nI had the honour of growing up with their Mummies @jac_x_xx @nat2230 .... and we’re like sisters! \nI hope Ash, Zali &amp; Kelsey will be the same ?? #newselfwales
    We may or may not be in the Daily Telegraph tomorrow!!!! ?? look out for our pic #5secondsoffame #newselfwales
    #vday2018 #1BillionRising #wewontwait #domesticviolence #justice #equality #solidarity #peace #newselfwales #hydeparksydneynsw @statelibrarynsw
    #NewSelfWales #zywko #arapamusic #heidimariearapa #sydney #instaparents #instagram #instagramfaces #migrants #migrantsfrom1950 #history #australian #instahistory #followyourdreams #happyfathersday #arapamusic #proudofmyheritage #proudaustralian #firstgenerationaustralian #myparents
    @devildriver #NewSelfWales
    #newselfwales #arapamusic #heidimariearapa #modernclassical #composers #composer #composersofinstagram #soundcloud #soundcloudartist #reverbnation #reverbnationartist #wikiloops #wikiloopsartist #collaborator #tosaglobalmusicnetwork #globalartist #globalcollaborator #instamusic #instamusician
    Bamboo carvings.? #al #botanicalgardens #sydney #lovenotes #nature #newselfwales #vscocam #vsco #bestofvsco #quickshot #lightroom #photooftheday #instashot
    red goes with everything ?#red #newselfwales
    Arguments over grammar and style are often as fierce as those over IBM versus Mac, and as fruitless as Coke versus Pepsi and boxers versus briefs.\n#pepsicommercial #fiercefemininity #postmypicssticks #newselfwales #retrosydney
    @sarakrgx_ \n#roommates #stupid #lovehaterelationship #momanddaughter #2brokegirls #newselfwales
    Tuesday got me feeling like ????????
    Ok you Sexy Snow Bunnies! One day\nto go to get your EARLY BIRD OFFER on cheap tickets for @heapsgay @rainbowmtn in Thredbo!\nLETS GET EM!!!??????\nHappy Gay Christmas in July!!! Watch this space...?\n???\n#thredbo #heapsgay #themagdaszubanskis #suspensionofdisbelieftour #drag #trashdrag #instadrag #instahair #instamakeup  #sydneydragqueens #sydneydrag #beardeddragqueen #beards #parody #queer #gay #lgbtq #lgbtqia #pride #80s #90s #sketchcomedy #comedy #sydney #australia #lipsync #lipsyncing #lipstick #glitter
    #Marg #themagdaszubanskis #carparkchic
    This is me arriving early at the Sydney Opera House before the crowds arrived to protest the gambling ads that the government forced the building to put on its sails tonight. Thousands turned up, to shine lights and cheer and boo, a great crowd. It was a lot of fun. People power!\n#NotABillboard\n#Sydney #SydneyOperaHouse #selfie #NewSelfWales
    Caveman  #beard#bondi#black#sydney#newselfwales
    Feeling refreshed after a weekend with family. \nCourtesy of @muzi_photography \n#easter#model#photography#fashion#beauty#naturephotography#sunday#instamood#love#life#black#african#australia#lawyer#nature#blackman#blessed#life#high#fitness#newselfwales
    What happens on Monday is not carried forward to Tuesday. #hillsongconference#Sydney#newselfwales
    RedHatters  #newselfwales
    #newselfwales
    #newselfwales
    #newselfwales
    #newselfwales
    Suns out ☀️ haha #spring\n.\n.\n.\n#fitness #photography #portrait #fujifilm #fujixt1 #fun #weekend #sydney #picoftheday #lifestyle #f45 #saturday #goodvibes #health #fitspo #newselfwales
    Beanie weather is still here! ?\n.\n.\n.\n.\n.\n.\n.\n.\n#newselfwales #hathair #beanieweather #tgif
    Beautiful #library ? swipe for more ? Thanks @katherineldale ???\n.\n.\n\n#sydney #oz #nsw #libraryporn #newselfwales
    #newselfwales @statelibrarynsw
    #artgalleryofnsw #aussiewinter #sunnydayinwinter #iloveaustralia #hangingoutwithmybestie #NewSelfWales #newselfwales
    A Bebe.  #tbt#newselfwales#queer#lgbt#makeup#selfie
    My Welshman  @newsouthwelshman #NewSelfWales #faceofnewsouthwales ?????????
    #NewSelfWales
    more film from my birthday ?? #newselfwales
    #NewSelfWales ya girl wants to be featured on the interactive selfie wall ?✌?
    #newselfwales
    #NewSelfWales \n#statelibrarynsw
    Flaws and all ? #NewSelfWales
    #newselfwales
    .\n? : @evelynjardim\n\n#newselfwales
    Portrait mode is a blessing #sunrise #mtkosciuszko #newselfwales
    Some amazing family friends of mine are off to run the Chicago marathon this weekend in the hope of raising as much as they can towards @kissgoodbyetoms !! I’m so unbelievably grateful, as I’m sure are the other 25,000 Australians suffering this shitty disease ? I’ve attached the link in my insta bio and below for anyone who has even a little bit to spare. Any donation can make the biggest difference and I honestly can’t thank @sallyanneawbery &amp; her lovely husband Jonathon enough for what they’re doing ?\nhttps://kissgoodbyetoms.org/fundraiser/sally-anne-hunter/ #newselfwales
    A great day at State with some of my friends !! #NewSelfWales
    It’s me with my creepy car mascot with no eyes #newselfwales
    #newselfwales
    Photographer: @jay_smolak_photography
    Candid #p0traitpr0ject #Viet #diasporakids #thirdculture  #newselfwales
    Where do I get back this innocent carefree smile?? It was pure happiness without adulting.☔ #tiffietravels\n»\n»\n»\n#unfoldtravellers#throwback#ayearago#sydneyroadtrip#nswroadtrip#eastcoast#happysmile#innocentme#travelgram#newselfwales
    Best time for photos ?#sunset #huntervalley .\n.\n.\n#photography #portrait #fujifilm #fujifilmxh1 #fun #weekend #sydney #picoftheday #lifestyle #f45 #saturday #goodvibes #nsw #health #fitspo #newselfwales
    #newselfwales
    Rolled my ankle ?#newselfwales
    cat fur on my shirt
    Doing what I can before I leave ! #keepsydneyopen
    My whole world ?? The most patient and understanding man there is. #dgronashimae #theone #myman #lovehim #bestfriend #love #holdmyhand #bnw #truelove #happiness #king #forever #amazing #newselfwales
    #myman #prettycity #newselfwales
    #mikir #tatapanmu #coolguy #iskee #october #newselfwales #australia
    My favourite people all in one shot\n\n#family #favourites #fabfour #teammitchell #lovesofmylife #newselfwales
    The #NewSelfWales selfie booth from the State Library of NSW has arrived at our Casino branch. Come in and take a selfie and be a part of a State Library exhibition by using #newselfwales . \n#nswpubliclibraries\n#rucrl #selfie #librarylife
    Eu sou do tipo de pessoa que só aprende fazendo, colocando a mão na massa mesmo sabe?\nSei também que é de experiência prática que o mercado de trabalho está à procura.\n.\nCom isso em mente, tenho me perguntado muito sobre como posso fazer algo pra ajudar quem ainda não tem práticas de mercado.\nQuem acabou de sair da faculdade, tem toda uma teoria de como fazer algo, mas não tem experiência real.\n.\nMeu sonho é criar um fellowship onde eu possa selecionar meninas (de preferência brasileiras) pra fazer uma espécie de intercâmbio, onde elas aprendam não só pela teoria, mas também pela prática.\n.\nImagina vc poder ir pra outro país, onde a tua área de estudos já está anos luz a frente, e poder adquirir experiência de mercado enquanto conhece uma nova cultura?\n.\nIsso é algo enrriquecedor não só pra quem faz o fellowship mas também pra quem recebe a pessoa. É uma troca muito importante pra expandir o conhecimento de forma global e inclusiva.\n.\nMas por enquanto, isso é só um sonho. Comenta aqui se você gostaria que esse programa existisse!\n♡\n♡\n♡\n#mulheresempoderadas #gauchanaaustralia #wanderlust #livingabroad #poliglota #aprendaidiomas #sonhosprofuturo #inclusaodigital #trabalhonoexterior #newselfwales
    Always grateful to have a mum like her. #newselfwales
    #newselfwales
    #newselfwales
    Spring brings new growth, weed out the bad and make room for something beautiful dang dang dang!! .\n.\n.\n#portrait #mondaymotivation #newselfwales #potd #springtime
    yes? #NewSelfWales
    Yes, I'm at kangaroo island. ?? #kangaroo #au #australia #Griffith #roadtrip #watchoutkangaroos #newselfwales
    Made a friend at museum??\n#newselfwales #australiamuseum
    Study time 原来悉尼也有古老的图书馆\n.\n.\n.\n#sydney #newselfwales #nswstatelibrary #statelibrary #studytime #sundayafternoon
    Holidays are not complete without a visit to @statelibrarynsw #newselfwales #librariansofinstagram #catalogue #statelibrarynsw
    #newselfwales #statelibrary
    “But what about that shadowy place?”\nMufasa: That’s beyond our borders. You must never go there Simba. #views #newselfwales
    Some days I shouldn’t be allowed out of the house #youcantsitwithus #onwednesdayswewearpink \n#shedoesntevengohere \n#ifyourefromafricawhyareyouwhite #newselfwales
    A great day at State with some of my friends !! #NewSelfWales
    The State Library of NSW - not just about books! Thanks for the tour @simonfoodfavourites #newselfwales #exhibitions #books #lockers #paintings #photographs #artifacts #getinthere #admiralgow #soserious
    This photo was taken of me at the Black Stump Rest Area on Coolah Road, NSW. Some locals say that it is here that the colloquial saying 'Beyond the Black Stump', meaning 'beyond the limits of civilisation,' is said to have originated. My late Grandfather, Gordon Bryant OAM, was one of the people responsible for dedicating the monument to Jerald James “Gerry” Sullivan for his services to the progress of the area. \n#newselfwales #coolah #monument #blackstump #newsouthwales
    Here are two of our beautiful participants from our Recipe Club at Casino Library giving our #NewSelfWales selfie booth a whirl.\n#nswpubliclibraries #rucrl #selfie #recipeclub #librarypatronsarethebest
    Here are some some more of our Recipe Club ladies getting their #NewSelfWales smiles on!\n#nswpubliclibraries #rucrl #selfie #recipeclub #lovelyladies
    children‘s reading time! ? #newselfwales
    #onthisday four years ago my family took me to my forever home #luckydog ???.\n.\n.\n.\n#dorathedalmation #dalmation #dali #dalmationpuppy #puppy #instadalmatian #dog #dalmationsofinstagram #dalmation_feature #spotteddog #instapuppy #mylilbuddy #throwback #puppiesofinstagram #b&amp;w #otd #theone #waybackwednesday #newselfwales
    Happiness where the sun shines ☀️ #sanandthesun #happysan #deewhybeach #nobeachbodythisyear #?#newselfwales
    The lovely members of the local Red Cross had a meeting with us yesterday and stopped to have their portrait taken. Thank you for being a part of #NewSelfWales .\n#nswpubliclibraries #rucrl #selfie #redcross #community
    Here’s 2 cute selfies before I go
    #NewSelfWales #doggo #night
    Experimenting with soft boxes ?#lighting .\n.\n.\n.\n#fitness #photography #portrait #fujifilm #fujixh1 #fun #exercise #sydney #picoftheday #lifestyle #pose #selfie #newselfwales #gym #fatness #goodvibes #health #fitspo #flash #softbox
    Football colours day at work today.. raising money for @cancercouncil @ssfcrabbitohs Also my last day of work before the big move! ??☺️ Happy Fri•yay All!! .\n.\n.\n.\n.\n.\n.\n#southsydney #rabbitohs #cancercouncil #cancerawareness #footy #footyfinals #brunette #ot #occupationaltherapy #lastday #boss #bossbabe #womenatwork #fridayselfie #nomakeup #thisisme #newselfwales
    I may not be a gold coin.. but I’m definitely a juicy strawberry! ? .\n.\n.\n.\n.\n.\n#strawberry #juicy #depression #anxiety #motivation #youdoyou #eatwellfeelwell #nutrition #getitgirl #selfie #empowerment #liveyoulife #joiedevivre #brunette #mentalhealth #mentalhealthawareness #food #foodporn #wellnesswarrior #greeneyes #lovelife #suicideprevention #family #health #healthy #wellbeing #womenshealth #newselfwales
    Summertime cannot come too soon. Bring on the balmy nights that make Australia the place that is better than any place on this planet. #newselfwales #sydney #australia #brisbane #travel #places #holiday #beer #drinks #happy #friends #discover.
    Here’s to friends who still insist on taking photos of you after you decline 46482910 times. Thanks m8  @starrmcg .\n.\n.\n.\n#newselfwales
    Autumn?\n #autumn #life #newselfwales #betterself
    Call the crib, same number, same hood, it’s all good. ??\n•\n•\n#Biggiesmalls #tupac #NotoriousBIG #2Pac #Rap #GangstaRap #Fave #Juicy #Changes #Hiphop #Life #Instagram #Actor #portrait #igers #Eyes #newselfwales
    Had the best day today with this one @nancyd2049 . Always full of good times and laughter. #friendsforlife #newselfwales
    Neck pain? Get a massage ? .\n.\n.\n#fitness #photography #portrait #fujifilm #fujixh1 #fun #exercise #sydney #picoftheday #lifestyle #pose #selfie #newselfwales #gym #fatness #goodvibes #health #fitspo #flash #carriageworks #confidence
    ????
    #newselfwales \nDashain , greatest festival of Nepalese people .
    #newselfwales
    Just a generic selfie. #Selfie #NewSelfWales
    #NewSelfWales #author #childrensbooks #stories
    Life evolves in colours ?\n#newselfwales
    Then all of a sudden It's Monday! May this week bring good things and much happiness?❤\n#shoppingcentreselfie #newselfwales
    Looking forward to doing this with my BFF again in 12 weeks... #cocktails #youcantsitwithus #cruiselife #cruiseship #selfie #bff #bffgoals? #sisters #sistersquad #holiday #newselfwales
    Besties don't let besties do silly things alone lol fun times.. Breast cancer cruise.. Love my besties.. Cathy can you see yourself there too @cathy13carroll @mrsdgoodlet @kellycamel ❤️❤️❤️❤️#bff #besties #bestiesforlife #memories #creatingmemories #instagood #instapic #instagram #instaface #newselfwales
    Laughter is the best medicine ??picture frame❤️❤️#laughteristhebestmedicine #laughter #friends #family #engagment #funtimes #friendshipgoals #friendship #instapeople #instagram #instapic #pictureperfect #pictureframe #pictureoftheday#newselfwales
    #newselfwales
    50% savage 50% sweetheart  @ekaterina_kosh\n\n#fiercefemininity #p0traits #elleestfierce  #shotbycanon #godsdaughter #slaygram #powerfulwoman #elleest #bossbabe #influence #sydneyharbour #milkbeach #skinnydip #newselfwales #shotbycanon
    ?
    Go wild for a while.\n\nModel: Phobe Claire Gear: mark 3 with 85mm sigma art f1.4 1/125 ISO100 #fiercefemininity #potraitpr0ject #slay #coloredsmokeau #smokey #wildflower #bewild #homeiswhereyouparkit #canberracreatives #naturegram #visitcanberra #newselfwales
    ⚽? .\n.\n.\n\n#newselfwales
    ???\nAnd only you can change yourself.\n.\n.\n.\n#newselfwales \n#betterself \n#girl \n#potography \n#new\n#sexy
    Rocky and I are glad it’s Spring again
    Who dat guy behind me ?
    #newselfwales
    ???\n.\n.\n.\n.\n#betterself \n#girl \n#newselfwales \n#blue
    Duco porn series
    But I was cold
    But I was cold
    ?
    A day to remember: Bachelor of Arts (Australian History) graduation, University of New England, Armidale, 27th October 2017.\n#graduation #university #universityofnewengland #newselfwales #hardworkpaysoffs
    #newselfwales
    #newselfwales #newsouthwales #nsw #roadtrip
    ?
    Photoshopped\n#art #picture #artist #photography #artists #paper #selfies #blackandwhite #modeling #personality #character #artoftheday #myself #inspiration #photo #media #sydney #city #photoshop #sundayfunday #iloveaustralia #piercing #newselfwales #sydneyoperahouse #sydneyharbourbridge #posing #tattoos #photoshop
    IT’S BEEN A WHILE SINCE YOU MET SOMEONE ORIGINAL. •\n#Yachtlife #NotreallymyYacht #Actuallydidntgetononeatall \n#IhearNYCcalling #Instagram\n#Newselfwales\n•\nAlso, thumbs up to those bum ass friends that don’t tell you to fix ya baby hairs ?
    What weekends are for ??\n.\n.\n.\n#photography #portrait #fujifilm #fujifilmxh1 #fun #weekend #sydney #picoftheday #lifestyle #spring #saturday #goodvibes #nsw #australia #photowalk  #photoshoot #city #newselfwales
    ‘Modern Romance’ 120x140 artwork is attracting a lot of attention @fernstreetgallery in Gerringong. Pop in and view all the stunning art by our resident Artists @by_holly_pinzone @jonharris_photography @kristaldelvillarart @gittebackhausenart OPEN 10 -5 Mon-Fri #southcoastartist #kerrybruceart #florals #newartgallery #gerringong #mixedmediaartist #localart #kiama #shellharbourvillage #shellharbour #artforsale #newselfwales
    Chubby baby Ara and chubby Aunty Raz
    Max being a ninky nonk ???
    #NewSelfWales
    What every library needs. #newselfwales
    #newselfwales #australiatrip #guidedcitytour #wakeuphostel #girl
    [ You carry both lightning and thunder in that space between your bones and soul ]\n?\nThis gorgeous dress is from @turquoise.and.stardust who recently had her (my_hippy_heart) account hacked and deleted. Love and support always Melissa ????
    Ever featured in an exhibition? Upload your selfie with #newselfwales and you’ll be on show at the State Library of New South Wales. .\n.\n.\n#newselfwales #statelibrarynsw #bethefaceofnsw #digitalgallery #librarylady #libraryland #ilovemylibrary #mustlovelibraries
    Last night, I had the pleasure of joining my hubby at his Ship's Cocktail Ball.\nIt's always so wonderful to meet the people he works with and their partners. We all have an instant connection and understanding of what each other has been through and had to deal with throughout the year.\nMilitary life is definitely not for everyone and sometimes it's hard to know if it's for us, but I love seeing the bonds and friendships that are made. They are built on sometimes, a life and death situational trust and that to me is a life long friendships.\n\nThank you to all who have served and those currently serving to defend our country.\n\n#SamiSparrow #art #creativecolourcollective
    #newSelfWales is about telling the story of now. Upload your selfie and become part of the real-time exhibition alongside thousands of others at the State Library of NSW. #kiamalibrary #nswpubliclibraries
    #newselfwales
    New South Wales Library \n#newselfwales
    Zero……o…o…Orange…????\n.\n.\n.\n#newselfwales \n#betterself \n#potography \n#october \n#goodbye \n#autumn \n#china \n#sun
    Birds of a feather flock together, especially at family celebrations like this ? #NewSelfWales  @statelibrarynsw
    Stevie somewhere near Adaminaby #newselfwales
    Somewhere near Adaminaby #newselfwales
    #newselfwales
    Christ is all about grace! #NewSelfWales #grace #kiama #kiamalibrary #jesus
    Courtney. Newtown. Courtney is a music photographer. He covers lots of live music and has been doing it for a few years. We get to chatting and reflect on the changes in the world, specifically Sydney in the last few years. The changes are profound and remarkable we agree. The battles / definitions / constraints of gender, orientation, preference and manifestations of these have been settled. Certainly in the inner city world of music and culture that we both inhabit. And of course these changes have flowed outward into mainstream culture. The next big issue that we will be working through is how we live with the realities of our countries contemporary history of genocide, occupation and colonialism. The systemic advantages of being born into power, (often described in terms of the colour of your skin) and how we and the institutions we work within can become part of a meaningful rebalancing. #fbiradio #dispossessed #genderbalance #colonialism #massacres #frontierwars @manningbar #fbiturns15 @musicology.xyz #newselfwales
    ?✌? #newselfwales
    #NewSelfWales
    #NewSelfWales
    Afternoon wander to the @statelibrarynsw to check the exhibitions - Newselfwales is a collection of portraits and selfies - and you can add your own to the archives :) #newselfwales . .\n.\n.\n.\n.\n #selfie #streetlife #streetportrait  #lensculturestreets #dailylife #beststreets #exploringtheglobe #everybodystreet  #seeaustralia #exploreaustralia #australiagram #ilovesydney #ig_australia  #focalmarked #photography #selfportrait
    Brazilian beauty. ®\n.\nWith @civeuleorit &amp; @thaysramos\n.\n?? ?? ?? ?️ ?\n.\n#bondibeach #streetart #sun #sunglasses #sydney #newselfwales #australia #nofilterneeded
    Brazilian beauty. ®\n.\nWith @civeuleorit &amp; @thaysramos\n.\n?? ?? ?? ?️ ?\n.\n#bondibeach #streetart #sun #sunglasses #sydney #newselfwales #australia #nofilterneeded
    end of uni week thirteen ? // trying my best to stay productive and motivated bc the end is so near (3 days to the start of exams) happy mugging y’all??‍? #sydney #australia #university #study #studygram #studymotivation #library #weekend #weekendvibes #vsco #vscocam #travelgoals #wander #wanderlust #wanderer #adventuretime #adventure #adventurer #travelblogger #travelphotography #travelblogger #architecturephotography #architecture #newselfwales #speechpathology #spring #exam #stress #stressrelief
    ?
    ☀️??Ocean day with some jazz music .\n.\n.\n#blueocean #bliss #blues #sunbath #whitevintageswimsuit #Manlybeach #Auslifestyle #Ausweekend #NewSelfWales
    4-11-2018 Checking out the state library and their awesome exhibition #newselfwales #sydney #statelibrary #artexhibition
    NZ WWII (Bougainville/Guadalcanal/Korea) Veteran 439873 Ken Frank-93 Years Old\n\n#newselfwales
    #selfie after #work #newselfwales \n#daily #life #businesstrip #sydney #ootd #ootdfashion #purplehair #wearing #designer #syusyuhan #Thailand #travel #travelblogger #Bangkok #girl #selfies
    Keep your face always\nTowards the sunshine ? \nAnd shadow will fall behind you!\nBTW swipe the pic and see my reaction when there is sunshine on my eyes ? ?- @itstenga \n#holiday #shadow #chatswood #beautifulday #abouttoday #hadfun #enjoyed #niceweather #hot #sunshinemadetheday #newmonthvibes #october #like #followme #iwill #followback #happiness #neverend #newselfwales
    @me_mr_gee @nswstatelibrary #exhibition #newselfwales #art #nswlibrary #sydneylocal #keepsydneyopen #queenofsurryhills
    And the sky was made of amethyst ?\nAnd all the stars were just like little fish ?
    “i am water\n\nsoft enough\nto offer life\ntough enough\nto drown it away” \nModel: Kahryn Milham #rupikaur #fiercefemininity #milkandhoney #poetry #centralcoast #weekendvibe #alltheoceanblues #photohunted #weekendvibes #poolparty #postmypicsticks #newselfwales #visitnsw
    Sip Sip Hooray and enroute to @dinerenblancsydney 2017 #throwback / thnx @historywbk @MarriottPacific #INVITE #SFFinvite #dinerenblanc #SFFdinerenblanc #DinerEnBlancSYD #dinerenblancsydney #debsydney #debsydney2017 #MarriottPacific #SFFMarriottPacific #TheOnlyIngredient #sydney #debfemme #debhomme #moetmoment #lategram @sheratongrandsydney @plus1guest @msvanessaroberts @breakfast.with.audrey @christopherhaggarty @iamjillwright @tizkai #SFFsimonselfie #newselfwales
    #newselfwales Andrea and I at the State Library NSW
    Family selfie with Yiayia ? \n#newselfwales
    The Gallery at the State Library of New South Wales ?️\n.\nBeautiful paintings of Australians from times past and their respective legacy. Beside these collections was an interactive zone where you can take your selfie and place it on their digital collection. They said that everyone is a part of #newselfwales ?\n.\nThey provided a blank canvas for the children to draw a portrait of their own. Reminds me of Charlotte Mason's picture study. ❤️\n.\n#statelibrarynsw\n#newselfwales\n#charlottemason\n#picturestudy
    #newselfwales #NewSelfWales
    Summer or Winter? Confusion ?\n#art #picture #artist #photography #artists #paper #selfies #color #modeling #personality #character #artoftheday #myself #inspiration #photo #media #sydney #city #iloveaustralia #today #newselfwales #sundayfunday #posing #tattoos #sundayvibes #fourseasons #fashion #menclothing #summercollection #style
    #newselfwales
    #newselfwales ??
    Okul çıkışı ?\n#newselfwales
    #newselfwales
    It was a beautiful day in Sydney to celebrate the wedding of Tim ( the son of my lifelong friend’s Cigdem and Haluk) and Ellen . This is me with my mum @hatice.ozcan45 and husband @marcus_testoni ?. #newselfwales
    It was a beautiful day in Sydney to celebrate the wedding of Tim ( the son of my lifelong friend’s Cigdem and Haluk) and Ellen . This is me with my mum @hatice.ozcan45 and husband @marcus_testoni ?. #newselfwales
    ? My lecture on last weekend was successful. Many thanks to the organiser Yun Shu Fang and everyone who came to share views with me. ?\n.\n.\n.\n#antiquechina #antiquechinese #antiquechineseporcelain  #asianart  #asianceramics  #asianporcelain  #chineseart  #chinesepottery  #chineseceramics  #chineseporcelain  #chinesevase  #chinesebowl  #敦煌莫高窟 #mingdynasty #qingdynasty #kangxi #rachelma  #yibinni  #陶瓷器 #newselfwales #blueandwhiteceramics #青花  #sothebys #sothebysnewyork #sothebysauction #sothebysart #dunhuang #dunhuangcaves #dunhuangacademy #mogaoku
    ? My lecture on last weekend was successful. Many thanks to the organiser Yun Shu Fang and everyone who came to share views with me. ?\n.\n.\n.\n#antiquechina #antiquechinese #antiquechineseporcelain  #asianart  #asianceramics  #asianporcelain  #chineseart  #chinesepottery  #chineseceramics  #chineseporcelain  #chinesevase  #chinesebowl  #敦煌莫高窟 #mingdynasty #qingdynasty #kangxi #rachelma  #yibinni  #陶瓷器 #newselfwales #blueandwhiteceramics #青花  #sothebys #sothebysnewyork #sothebysauction #sothebysart #dunhuang #dunhuangcaves #dunhuangacademy #mogaoku
    Exploring Sydney City this afternoon ??? #seaenglish #belongenjoysucceed #plantswithbite #newselfwales
    Exploring Sydney City this afternoon ??? #seaenglish #belongenjoysucceed #plantswithbite #newselfwales
    Exploring Sydney City this afternoon ??? #seaenglish #belongenjoysucceed #plantswithbite #newselfwales
    Exploring Sydney City this afternoon ??? #seaenglish #belongenjoysucceed #plantswithbite #newselfwales
    ආදරේයි කියා ඔබ සෙල්ලමක් කලා,\nඅවන්කවූ  නිසා පරාද වී ගියා,... #instgram#instagood#newtshirtdesign#newselfwales#newphotographer#newsong#newadan#follwback#4follow#followforfollowback#follo4follow#like4likealways#likes#like4followback#like4likes#
    ???\n.\n.\n.\n#2018\n#newselfwales \n#life
    #newselfwales
    @stadivariusfashion #marketing #socjalmedia #blondehair #blogerka #fashion #promowanie #promowanieprofilu #blondhair #newstyle #goodmorning #blogerka #promowanie #modelka #swojstyl #mojstyl #iphone7 #iphone #fotografia #vana #fajnyprofil #f4f #4f4 #loving #flowers #blogowanie #promotions #socialmedia #promowanie #promotion #newselfwales
    Play date with cousin at the Zoo ? .\n.\n.\n\n#family\n#cousins\n#tarongazoo \n#newselfwales
    Culture &amp; Creativity team loving new galleries @statelibrarynsw #newselfwales
    Play date with cousin at the Zoo ? .\n.\n.\n\n#family\n#cousins\n#tarongazoo \n#newselfwales
    #NewSelfWales #sydney #booklovers
    Good vibes only #newselfwales#mirrorselfie#daily#sydneyaustralia#library#gallery
    Enjoying a quiet weekend having coffee. My mum ❤️ one of the hardest working persons I know\n.\n.\n.\n.\n.\n#portraitphotography #portraits #portraits_ig #portraiture #portraitures #womensportraiture #portraiturephotography #cafelife #coffeeshop #coffeetime #coffeegram #coffee_inst #igerscoffee #peoplescreative #weekender #bokehphotography #eatout #enjoyyourself #enjoythelittlethings #quietweekend #haveabreak #dayoffvibes #noworktoday
    Walked to the highest peak of Australia! ? My another view of NSW ? One of the world's summit points completed. .\n.\n.\n#Beautiful #MtKosciuszko #snow #hot #sunny #windy all in one ^^ #Jindabyne #Snowymountains #NSW #Australiahighestpoint #Thredbo #mtkosciuszkosummit  #hikingroute #newselfwales #AdayinaHike
    ?Meeting real estate colleagues on a Christmas party cruise, boarding at King Street wharf. ?️\n.\n.\n.\n#nswproperty #propertysydney #sydneyproperty #sydneyrealestate #brisbaneproperty #brisbanerealestate #newselfwales #realestatebrisbane #realestatequeensland  #ausliveshere #australiahouse #australianhouseandgarden #australianhouses #australianliving #australianproperty  #australianrealestate #australiaproperty #australiarealestate #realestateau #realestateaustralia  #adelaiderealestate #perthhome #perthhomes #perthproperty #perthrealestate #rachelma #melbourneproperty #melbournerealestate #melbrealestate #pickahouse
    Casually creeping back into your Insta-feed after weeks of silence to share some news with you guys. And what better way to do it than as a shameless tourist in the city that's my new home, apparently?!!? Oh yeah, that's the news, btw. And I've got the pinch scars on my arm to prove this isn't a dream. After years of deliberation, months of slightly-miserable-but-optimistic long distancing with hubs, heartfelt praying, a smattering of anxiety attacks and cramming the sum total of my most prized possessions into 30 kgs worth of luggage, here I am. For the foreseeable future. It's been a whirlwind of emotions and to-do lists but more on that tomorrow. In the meanwhile, I want to know what's been going on with YOU guys? And if you're not in the mood to share deets, I will accept a virtual cookie instead, thanks ?\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n#pixel3xl #pixel3 #pixel3photography #pakistanibloggers #newselfwales #sydneyaustralia #sydneyblogger #australiablogger #newbeginning #karachiblogger #travelbloggerlife #sydneyoperahouse #bloggerstyles #ootdaustralia #styleblogger #everydayfashion #casualstyle #ilovesydney #visitsydney #visitaustralia #visitnsw #sydneytourism #everydaystyle  #pakistanicelebrities #pakistanistreetstyle #pakistanistylelookbook #summerfashion2018 #sydneyaustralia
    like #fowlerindustries #fortnitememes #fowling #folikes #fg4 #forfollowback #folikes #forfollowers #forfollow #forfokssake #forfollowme #folbackforfolback #forfolkssake #4kingdomsadventurepark #4like4like #4lovers???????? #4lovers????????❤❤❤❤❤❤❤❤❤???☺☺☺??????? #4loveofinknburn #4likesfor4likes #4likesfor4likes #firndlike #firndlikes #4forlikes4❤️❤️❤️❤️☀️☀️☀️☀️☀️#kikesperformancefabandtune #4lovelovelove??? #fff?ff?ff?ff?4f❤️???44follow４followforfollow４f4frs4likeforlikeforfollow4likeforlikesback44likes4me4lramahhits #newselfwales #likesforfollow #likesforlikesback #likesforlike
    I was here. #newselfwales @statelibrarynsw #myllathetraveller #escapesolo #exploresydney #summeratsydney #sydneysummerchristmas
    The body corporate. .... Portrait of an actor Mathias Olofsson www.mathiasolofssonactor.com @mathiasaolofsson  #portraits #makeportraits #portraiture #sweden #portraitphotography #portrait_shots #iamnikon #portraitsmag #playactor #portrait #headshot #artist #theatre #acting #australianart #australianphoto #actorlife #actress #sydneytheatre #swedishfilmfestival #greatshots  #NikonAustralia #actordreams #actorheadshot #hollywood #headshotphotographer #actingheadshots #actorlife #NewSelfWales
    The body corporate. .... Portrait of an actor Mathias Olofsson www.mathiasolofssonactor.com @mathiasaolofsson  #portraits #makeportraits #portraiture #sweden #portraitphotography #portrait_shots #iamnikon #portraitsmag #playactor #portrait #headshot #artist #theatre #acting #australianart #australianphoto #actorlife #actress #sydneytheatre #swedishfilmfestival #greatshots  #NikonAustralia #actordreams #actorheadshot #hollywood #headshotphotographer #actingheadshots #actorlife #NewSelfWales
    No, I don't read books... I see books...\n.\n.\n#NewSelfWales #NSW #australia #statelibraryofnsw
    A life lived in fear is a life half lived // Introducing the thing I did in 2018 which I feared the most: posing nude for @niqolet_lewis at @nas_au // XXI • The World • 168 x 102cm // ? @alt_jdk
    Crouching Tiger, Hidden Dancer. Somewhere in Bondi #bondi #art #mural #sydneylocal #sydneykids #kidslife #sisters #SFFart #SFFbondi #SFFfamily #bondibeach #sydney #bondilife #newselfwales #lovesydney
    #newselfwales #statelibrarynsw
    Exploring Sydney City this afternoon ??? #seaenglish #belongenjoysucceed #plantswithbite #newselfwales
    Exploring Sydney City this afternoon ??? #seaenglish #belongenjoysucceed #plantswithbite #newselfwales
    Life happens, gummies helps.\n\n#fiercefemininity #girlsgonewild #girlsjustwannahavefun #goodtimes #majestic #ikissedagirl #afterparty #wranglerjeans #alltheoceanblues #xmastime #festiveseason #lovestories #newselfwales #summervibe
    #newselfwales #haveaniceyear #blondlonghair
    #NewSelfWales
    Reading gives us a lot of company, freedom to be different and be more. Pedro Laín Entralgo #newselfwales
    Using this dorky self portrait to say THANK YOU to everyone who sent me private messages yesterday &amp; today to check on me. I had a planned iron infusion booked for Wednesday but when I woke up yesterday my body said NUH UH so I headed into the emergency room with my iron infusion script and had it done straight away. Some have been asking about what was going on - basically because of my Von Willebrand Disease (a bleeding disorder), I lose iron heaps quicker than normal during my period. (Do I need to elaborate? Lol). I had an iron infusion last year, I was told I need one yearly but obviously with my symptoms I should have had it sooner. (I also need to look into treating my bleeding disorder better!). I saw my GP on Thursday and had a blood test to check my iron levels. Results came back the next day with my ferritin at 6 (should be 15-200). My symptoms have been - extreme tiredness, napping HARD every day for months, headaches every day, vertigo, head to toe muscle aches (feels like a struggle, concrete like heaviness), shortness of breath, heart palpitations. Yes, I have tried all kinds of iron supplements and nutrition over the last 20 years but I don’t seem to absorb enough to maintain good levels. SO ANYWAY, spent yesterday having my infusion and should start to feel better next week or so. Still feeling like a zombie but I’m so grateful to have been able to go in and get some help straight away. I need to learn to trust my instincts and take better care of myself, I bet some of you do too. ? Please go get yourself checked out if you’ve been feeling crappy like this - it’s no way to live #vonwillebranddisease #irondeficiency #lowferritin #takebettercareofyourself #zombiemum #NewSelfWales
    #NewSelfWales
    Selfie #newselfwales #statelibrary #statelibrarynsw #sydney
    #newselfwales #statelibrary #statelibrarynsw #sydney #artproject
    Me, two kids and a camera. This is how I roll. Lovely space retained which used to be @baristaandcook. Doesn't seem to be much change in decor if at all but it was always looking good before. Friendly service and here for a coffee hit @_hungrychefs_cafe #Waterloo #hungrychefs #SFFhungrychefs #sydneylocal #sydneyeats #sydneyfoodie #instafoodie #SFFfamily #foodblogger #sydneyfoodblogger #SFFsimonselfie #newselfwales
    ☀️???‍♀️ The sun is shinning in my heart.\n.\nI will miss my outdoor pool routine when I leave. .\n.\n.\nphoto by @icehahaha ;) .\n#Sydneylife #Summer #newselfwales #grill #sunbath #bythepool
    State Library of New South Wales...not as impressive as Victoria’s but still pretty cool! \n#newselfwales, #statelibrarynsw, #trinitydreamer, #gayman, #library, #rainydayadventures, #travelblogger
    ???
    ?Dressed up in a costume for Peking Opera. Can you still tell it's me? ?\n.\n.\n.\n#chinesegirls #chinesegirlsrock #chinesedrama #peking #pekingopera #chinesecostume #chinesecostumes #asianart  #chineseart  #artappreciation  #artappreciationday #artappreciators #newselfwales #iloveshanghai #iloveshanghai❤️ #shanghainese #shanghaipeople #loveshanghai #shanghailove  #chinesegirl #selfportrait  #selfies #funshots #funshot #rachelma #photoshop #photoedit #photography?  #studiophotography #studiophotoshoot
    점심에 스테이크?먹구  아트갤러리 가서 엽서사구 도서관이랑 성당 갔다~☀️?\n,\n,\n,\n#아트갤러리#메리성당#시드니도서관#시드니#날씨#더움#호주#엽서#시드니일상 #newselfwales #시드니여행 #대학생 #일상 #스테이크#starbar#금요일#예쁨#셀스타그램 #거울샷
    ?
    #newselfwales #fridaynightlights #sydneyfuntimes
    Contributing to the #NewSelfWales wall at the #sydfest Silent Disco #statelibrarynsw #sydfest19 #Sydney
    A great day at State with some of my friends !! #NewSelfWales
    #weekend #newselfwales #happy#polishwoman #brunette #wintertime #coffeetime #frozen ❄️❄️❄️☃️⛄
    #NewSelfWales
    #newselfwales
    Getting our inner nerd on ??? @eclectiquedesigns - you might have yourself an apprentice ?\n•\n#statelibrarynsw | #newselfwales | #librarylife
    Bom domingo p vcs aii!!!\n????? .\n.\n.\n.\n.\n.\n.\n#mg10k, #goodvibes2018, #goodvibes?, #goodvibes❤️, #newfhoto, #newselfwales, #tumblr2019,  #tumblr2018, #domingo!, #sóvocê
    It's a black and white kinda day... but still colourful! ? #smiles #tigerlily #murkanijewellery #sheike #maccosmetics #tartecosmetics #newselfwales
    Historians enjoying the Mitchell Galleries @statelibrarynsw #newselfwales
    Take me back to the  #island #novysworld #flowjoy #nammyohorengekyo #wednesday #nobasiczone #iamiloilo #pearlyshell #bestisland #islandofpanay #lgbtq #naturalbeauty #longhair #newselfwales
    Happy 45th @deirdre.east
    #newselfwales
    `;
		const stuff = this.textToHashtags(content);
		const data = this.groupAndCount(stuff);
		const dataArray = Object.keys(data).map((key) => {
			return { hashtag: key, count: data[key] };
		});
		const sorted = dataArray.sort((a, b) => {
			if (a.count < b.count) {
				return 1;
			}
			if (a.count > b.count) {
				return -1;
			}
			if (a.count === b.count) {
				return 0;
			}
		});

		return (
			// <ApolloProvider client={this.props.apolloClient}>
			// <TestFeed />
			// </ApolloProvider>
			<div className="">
				{content &&
					sorted.map((s) => {
						return (
							<p
								dangerouslySetInnerHTML={{
									__html: `${s.hashtag} ${s.count}`,
								}}
							/>
						);
					})}
			</div>
		);
	}
}
const PAGE_QUERY = gql`
	query getFeed {
		pages(slug: "newselfwales") {
			id
			title
			excerpt
			content
		}
	}
`;

export default graphql(PAGE_QUERY)(Test);
