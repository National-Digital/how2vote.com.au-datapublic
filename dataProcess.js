const
fs = require('fs');

async function buildUniqueList() {
	try {

		//get the raw data
		let rawData =  fs.readFileSync('./data/rawdata.json'); 
		let policies = JSON.parse(rawData);  

		//generate unique list of items
		let finiteList = new Array();
		for(let items of policies) {
			finiteList.push(items.comparisons.map(item => item.party));
		}

		//get a unique list of parties
		let uniqueList = [... new Set([].concat.apply([], finiteList))];

		const buildPoliticsArray = policies.map(item => {
			let compare = item.comparisons;

			//construct a new array to match the comparisons array
			const array = new Array();
			uniqueList.forEach(item => {
				array.push({
					'party': item,
					'aggreement': -1
				})
			});


			const { assign } = Object;
			const map = new Map();

			const addToMap = (detail) => {
				const {party: name } = detail;
				if(map.has(name)) {
					//if detail already exists create a new object by merging the current detail and the new detail
					detail = assign({}, map.get(name), detail);
				}
				map.set(name, detail); 
			};
			//add the first and then the second details to a map
			array.concat(compare).forEach(addToMap);

			//sort the keys and add them to the map
			const result = [...map.keys()].sort().map(key => map.get(key));

			//loop through and push the missing array items into the comparisons array
			compare.forEach((item, index)=>result.forEach((value)=>{
				if(item.party !== value.party && value.aggreement === -1) {
					compare.push(value);
				}
			}));



			//create add agreement together for party members and calculate total party counts
			const count = compare.reduce((accumulator, currentValue) => {
				
				if (!accumulator[currentValue.party]) {
					accumulator[currentValue.party] = 
					{	
						'agreement': Number(currentValue.aggreement),
						'count': 1,
						'party': currentValue.party
					}
				}
				if (accumulator[currentValue.party] && accumulator[currentValue.party].agreement > -1) {
					accumulator[currentValue.party].agreement += Number(currentValue.aggreement);
					accumulator[currentValue.party].count += 1;
				}

				return accumulator;
			} , {})	

			//generate object with id, question and party count
			const keys = Object.values(count);
			let party = new Array();
			var obj = {};

			for(const key of keys) {
				obj['id'] = item.id;
				obj['issue_title'] = item.issue_title;
				obj['issue_description'] = item.issue_description;
				obj['division_count'] = item.division_count;
				obj['division_last'] = item.division_last;
				obj['division_first'] = item.division_first;

				let vote = Number(key.agreement / key.count);				
				if(vote == 0) {
					vote = 0.01;
				}
				if(vote > 0) {
					vote = Math.ceil((vote / 100) * 5);
				}
				obj[key.party] = vote; 
			}

			return obj;
		});

	  	
		return buildPoliticsArray;
	}
	catch (error) {
		console.error(error);
	}
}

buildUniqueList().then(function(result){
	// write to the json file here
	let politics = JSON.stringify(result);
	fs.writeFile('./data/output.json', politics, function (err) {
		if (err) throw err;
		console.log('File saved as output.json');
	});
})


																											
