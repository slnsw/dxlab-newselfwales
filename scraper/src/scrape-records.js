import scrapeRecord from './scrape-record';
import fs from 'fs';
import axios from 'axios';
import getPortraitIds from './utils/get-portrait-ids';

// Naughty hack to get local http server to access https endpoint
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export default async (ids, offset, limit, max, term) => {

	let o;
	let fails = '';
	const nl = '\n';
	let errr;
	let t;
	

	if (ids) {

	  

				  let log = '=========================================================' + nl;
				  let dt = new Date().toLocaleString("en-AU", {timeZone: "Australia/Sydney"});
				  log += 'Beginning scrape of ' + ids.length + ' records at ' + dt + nl;

				  for (const id of ids) {
				  	log += '-----------------------------------------------' + nl + id + nl;
					  try {
					    const response = await axios.get(process.env.WP_API_ENDPOINT + '/wp/v2/portraits/?meta_key=primo_ref&meta_value=' +  id);
					    if (response.data && response.data.length) {
					    	console.log(response.data.length + ' records already exist with ID: ' + id);
					    	log += response.data.length + ' records already exist with ID: ' + id + nl;
					    	for (const data of response.data) {
					    		console.log('Wordpress ID: ' + data.id);
					    		log += 'Wordpress ID: ' + data.id + nl;
					    	}
					    	log += nl;
					    } else {
					    	t = await scrapeRecord(id);
					    	o = t.log;
					    	errr = t.err.toString();
					    	log += o;
					    	
					    	if (errr && errr.substring(0,5).toLowerCase() == 'error') {
					    		fails += id + nl;
					    	}
					    }
					  } catch (error) {
					    console.error(error);
					    log += error + nl;
					    fails += id + nl;
					  }

				  }

				  fs.appendFile('log/log.txt', log, function (err) {
			  		if (err) return console.log(err);
					});
				


	

	} else {

		while (offset <= max) {

			try {
				
				  const { data: { primoSearch: { records } } } = await getPortraitIds(term, offset, limit);
				  ids = records.map((record)=>record.id);
			    console.log(ids);
			    if (!ids || !records) {
			    	console.log('Error! Could not obtains IDs or Records with offset: ' + offset);
			    	fails += 'Error! Could not obtains IDs or Records with offset: ' + offset + nl;
			    }
				

				if (ids) {

				  let log = '=========================================================' + nl;
				  let dt = new Date().toLocaleString("en-AU", {timeZone: "Australia/Sydney"});
				  log += 'Beginning scrape of ' + ids.length + ' records at ' + dt + nl;

				  for (const id of ids) {
				  	log += '-----------------------------------------------' + nl + id + nl;
					  try {
					    const response = await axios.get(process.env.WP_API_ENDPOINT + '/wp/v2/portraits/?meta_key=primo_ref&meta_value=' +  id);
					    if (response.data && response.data.length) {
					    	console.log(response.data.length + ' records already exist with ID: ' + id);
					    	log += response.data.length + ' records already exist with ID: ' + id + nl;
					    	for (const data of response.data) {
					    		console.log('Wordpress ID: ' + data.id);
					    		log += 'Wordpress ID: ' + data.id + nl;
					    	}
					    	log += nl;
					    } else {
					    	t = await scrapeRecord(id);
					    	o = t.log;
					    	errr = t.err.toString();
					    	log += o;
					    	if (errr && errr.substring(0,5).toLowerCase() == 'error') {
					    		fails += id + nl;
					    	}
					    }
					  } catch (error) {
					    console.error(error);
					    log += error + nl;
					    fails += id + nl;
					  }


				  }

					  fs.appendFile('log/log.txt', log, function (err) {
				  		if (err) return console.log(err);
						});

				}



		  } catch (error) {
		    console.error(error);
		  }
		  offset += limit;
		  console.log(offset);
		}  

	}
	




  fs.appendFile('log/fails.txt', fails, function (err) {
		if (err) return console.log(err);
	});

};
