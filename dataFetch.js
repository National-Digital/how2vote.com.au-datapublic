const
fs = require('fs-extra'),
axios = require('axios');

let completedArray = new Array();
const apiKey = fs.readFileSync('apikey.conf'); 
const baseUrl = `https://theyvoteforyou.org.au/api/v1/policies.json?key=` + apiKey;
async function getPolicy() {
	try {
		//get all the policies
	    let policies = await axios.get(`${baseUrl}`);
	    for(let policy of policies.data) {
	    	let policyNumber = policy.id;
	    	//get all of the information
	    	let 
    		policyInfo = await axios.get(`https://theyvoteforyou.org.au/api/v1/policies/ ${policyNumber} .json?key=` + apiKey); 
			buildPolicyArray(policyInfo.data);
	    }
	} catch (error) {
	    console.error(error);
	}
};
getPolicy().then(function(result) {
	//write to the json file here
	let politics = JSON.stringify(completedArray);
	fs.outputFile('./data/rawdata.json', politics, function (err) {
		if (err) throw err;
		console.log('File saved as rawdata.json');
	});
});
function buildPolicyArray(policyContent) {
	let
	description = policyContent.description,
	id = policyContent.id,
	comparisons = new Array();
			
	policyContent.people_comparisons.forEach(function(people, index){ 
		comparisons.push({
			'party': people.person.latest_member.party,
			'aggreement': people.agreement
		});
		return comparisons;
	})
	completedArray.push(
		{'id': id, 'policy': description, 'comparisons':comparisons}
	);
	return completedArray;
}
