/* You could contribute with a PR on github https://github.com/ymohl-cl/ffvlToGoogleContact. Never update the files directly from the google app script. */

import 'google-apps-script';
import { Member } from 'Models';
//import { sendWelkomeEmail } from './Mailer';
//import { addMemberToContactGroup, provideContactGroup } from 'ContactGroupManager';
//import {getMembers} from 'FfvlMailReader';
//import {getPeoples, debugPeoples, createContact, updateContact} from 'src/PeopleManager';

const mailSubjectLicence = "[FFVL] Récapitulatif des licences et/ou adhésions du";
const mailSubjectNotice = "[FFVL] Debut de prise de licence en ligne";
const mailLabelName = "new_memberships";
const suffixLabelContactGroup = "_members";

function run(): void {
	const mailLabel: GoogleAppsScript.Gmail.GmailLabel = GmailApp.getUserLabelByName(mailLabelName)
	const threads: GoogleAppsScript.Gmail.GmailThread[] = mailLabel.getThreads()
	const gmailPeoples: Array<GoogleAppsScript.People.Schema.Person> = getPeoples()

	for (var i = 0; i < threads.length; i++) {
		if (!threads[i].isUnread()) {
			// skip message already read
			continue ;
		}
		var subject: string = threads[i].getFirstMessageSubject()
		if (subject.includes(mailSubjectLicence)) {
			// ffvl licence validation
			var body: string = threads[i].getMessages()[0].getPlainBody()
			var members: Array<Member> = getMembers(body);

			try {
				recordContacts(gmailPeoples, members)
				threads[i].markRead();
			} catch (err) {
				console.log("does something here with the err: ", err)
			}
		} else if (subject.includes(mailSubjectNotice)) {
			// ffvl notice
			threads[i].markRead();
		}
	}
}

function recordContacts(gmailPeoples: Array<GoogleAppsScript.People.Schema.Person>, contacts: Array<Member>): void {
	const groupName = contacts[0].licenceYear+suffixLabelContactGroup
	const contactGroup: GoogleAppsScript.People.Schema.ContactGroup = provideContactGroup(groupName)
	const peoplesList: Array<GoogleAppsScript.People.Schema.Person> = []

	for (var i = 0; i < contacts.length; i++) {
		var contact = contacts[i]
		peoplesList.push(recordContact(gmailPeoples, contact))
		sendWelkomeEmail(contact)
	}
	addMembersToContactGroup(contactGroup, peoplesList)
}

function recordContact(gmailPeoples: Array<GoogleAppsScript.People.Schema.Person>, contact: Member): GoogleAppsScript.People.Schema.Person {
	var finderPeople: GoogleAppsScript.People.Schema.Person | undefined = gmailPeoples.find((p: GoogleAppsScript.People.Schema.Person) => (p.emailAddresses && p.emailAddresses[0].value === contact.mail));
	var gmailPeople = memberToPeople(contact, finderPeople)
	if (finderPeople === undefined) {
		gmailPeople = createContact(gmailPeople)
	} else {
		gmailPeople = updateContact(gmailPeople)
	}

	return gmailPeople
}

// member to people copy the member data to the people data from google people api
// if people is undefined because does not exist in contact list, memberToPeople create a new one
// else the update will be done on the names and biographies (to save the licence number)
function memberToPeople(member: Member, gmailPeople: GoogleAppsScript.People.Schema.Person | undefined): GoogleAppsScript.People.Schema.Person {
	var people = {} as GoogleAppsScript.People.Schema.Person
	if (gmailPeople !== undefined) {
		// member already exist
		people = gmailPeople
	} else {
		// member is new, record the email address
		people.emailAddresses= [{
			value: member.mail,
		}]
	}

	// update the names and biographies
	if (people.names === undefined) {
		people.names = [{
			familyName: member.lastName,
			givenName: member.firstName,
		}]
	} else {
		people.names[0].familyName = member.lastName
		people.names[0].givenName = member.firstName
	}

	const labelLicence = member.licenceYear + "_licence: " + member.licence
	if (people.biographies === undefined) {
		people.biographies = [{
			value: labelLicence,
		}]
	} else {
		people.biographies[0].value = labelLicence+"\n"+people.biographies[0].value
	}

	return people
}