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
	let	comparisons = new Array();

	//get the date from the policy_divisions array and find the latest
	let date = policyContent.policy_divisions.map(item => new Date(item.division.date));
	let first_division = new Date(Math.min.apply(null,date));
	let last_division = new Date(Math.max.apply(null,date));
			
	policyContent.people_comparisons.forEach(function(people, index){
		//if it's an independant then change the party with the politicians name
		if(people.person.latest_member.party == 'Independent') {
			if(people.person.latest_member.house == 'representatives') {
				people.person.latest_member.party = Object.values(people.person.latest_member.name).join(' ') + ' MP';
			}
			if(people.person.latest_member.house == 'senate') {
				people.person.latest_member.party = 'Senator ' + Object.values(people.person.latest_member.name).join(' ');
			}
		}
		//push all results into the final array
		comparisons.push({
			'party': people.person.latest_member.party.replace(/\s+/g, '_').replace(/'+/g, '').toLowerCase(),
			'aggreement': people.agreement
		});

		return comparisons;
	})
	completedArray.push(
		{'id': policyContent.id, 'issue_title': policyContent.name, 'issue_description': policyContent.description, 'division_count': policyContent.policy_divisions.length, 'division_first': first_division, 'division_last': last_division, 'comparisons': comparisons}
	);

	return completedArray;
}
