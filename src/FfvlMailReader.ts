import 'google-apps-script';
import { Member } from 'Models';

/* regex list to parse a FFVL message
example format: (Sections in the example to see the splitting line traitment)

```
** Section 0
Bonjour, 

Voici la liste des licences souscrites dans votre structure commençant le 
22/12/2022
** Section 0
** Section 1
- 0000000A PRENOM COMPOSE-NAME Pratiquant parapente, delta, speed-riding 
2023 E-mail : part1.part2@gmail.com
** Section 1
** Section 2
- 0000000A PRENOM COMPOSE NAME Pratiquant parapente, delta, speed-riding 
2023 E-mail : part1.part2@gmail.com
** Section 2
** Section 3
- 0000000A PRENOM NAME E-mail : part1.part2@gmail.com
** Section 3
...
```

lineSplitterFormula split the message to given the sections
dateRegxpFormula parse the Section 0 to get the licence date

Each section (for this example 1,2 and 3) which start by '-' will parse with the following formulas:
licenceRegxpFormula get the licence number
nameRegxpFormula get the full name (first name and last name)
mailRegxpFormula get the mail
*/
const lineSplitterFormula: RegExp = /(?=- )/g
const dateRegxpFormula = "([0-9]{2})\/([0-9]{2})\/([0-9]{4})"
const dateRegxp = new RegExp(dateRegxpFormula)
const licenceRegxpFormula = "(?<=^- )[a-zA-Z0-9]+(?= )"
const licenceRegxp = new RegExp(licenceRegxpFormula)
const nameRegxpFormula = "(?<= )[A-Z \-]+(?= .)+"
const nameRegxp = new RegExp(nameRegxpFormula)
const mailRegxpFormula = "[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+"
const mailRegxp = new RegExp(mailRegxpFormula)

// charLineMemberDetector is use to check the type of section
const charLineMemberDetector = '-'
// charNameSeparator is use to separate the first name and the last name
const charNameSeparator = ' '

/* dateToSwitchLicence (month-day) is use to check if the licence year need to update for one year or not
** Example:
Note: After the first october, the licence is valid for the next month of the same year and for the next year (15 months)
if the licence date is 2022-12-20 the licence recorded should be 2023
if the licence date is 2023-02-15 the licence recorded should be 2023
So the dateToSwitchLicence take the same year than the current licence date. If the current date is >= of dateToSwitchLicence,
the year licence used should be upgrade by 1
see parseLicenceYearFromMessage function */
const dateToSwitchLicence = "-10-01"

export function getMembers(body: string): Array<Member> {
	var members:Array<Member> = []
	const lines = body.split(lineSplitterFormula)

	if (lines.length < 2) {
		throw new Error("invalid line parsing to record a new member. line lenght: " +
			lines.length + " line content: " +
			lines)
	}
	const licenceYear = parseLicenceYearFromMessage(lines[0])
	for (var i = 0; i < lines.length; i++) {
		if (lines[i].charAt(0) != charLineMemberDetector) {
			// skip invalid line for parsing member
			continue
		}
		var member = parseMemberFromMessage(lines[i])
		member.licenceYear = licenceYear
		members.push(member)
	}

	return members
}

function parseLicenceYearFromMessage(line: string): string {
	const date = dateRegxp.exec(line);
	if (date == null ) {
		throw new Error("invalid line to parse licence year, content: " + line)
	}
	
	var licenceYear = date[3]
	const switchLicence: Date = new Date(date[3]+dateToSwitchLicence)
	const licenceDate: Date = new Date(date[3]+"-"+date[2]+"-"+date[1])
	if (licenceDate >= switchLicence) {
		licenceYear = (licenceDate.getFullYear()+1).toString()
	}
	return licenceYear
}

function parseMemberFromMessage(line: string): Member {
	const licence = licenceRegxp.exec(line)
	if (licence == null) {
		throw new Error("invalid line to parse licence number, content: " + line)
	}
	const name = nameRegxp.exec(line)
	if (name == null) {
		throw new Error("invalid line to parse name, content: " + line)
	}
	const mail = mailRegxp.exec(line)
	if (mail == null) {
		throw new Error("invalid line to parse mail, content: " + line)
	}
	const names: Array<string> = name[0].split(charNameSeparator)
	if (names.length < 2) {
		throw new Error("invalid names for the member, content: " + line)
	}
	var lastName = ""
	for (var i = 1; i < names.length; i++) {
		lastName += names[i]
	}

	return {
		licence: licence[0],
		mail: mail[0],
		lastName: lastName,
		firstName: names[0],
	} as Member
}
