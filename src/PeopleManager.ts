import 'google-apps-script';

interface ConnectionParameters {
	personFields: string
	pageSize: number
	pageToken: string
}

interface UpdateParameters {
	updatePersonFields: string
}

interface CreateParameters {
	personFields: string
}

export function getPeoples(): Array<GoogleAppsScript.People.Schema.Person> {
	var peoples: Array<GoogleAppsScript.People.Schema.Person> = []
	const params = {
		personFields: "names,emailAddresses,biographies",
		pageSize: 100,
	} as ConnectionParameters

	var data: GoogleAppsScript.People.Schema.ListConnectionsResponse | undefined = undefined
	for (data = listPeopleApi(params); data !== undefined && data.connections !== undefined; data = listPeopleApi(params)) {
		peoples = peoples.concat(data.connections)
		if (data.nextPageToken === undefined) {
			break ;
		}
		params.pageToken = data.nextPageToken
	}

	return peoples
}

function listPeopleApi(params: ConnectionParameters): GoogleAppsScript.People.Schema.ListConnectionsResponse | undefined {
	Utilities.sleep(1000)
	try {
		return People.People!.Connections!.list('people/me', params);
	} catch (err) {
		console.log('Failed to get the connection with an error %s', err);
	}
}

export function updateContact(contact: GoogleAppsScript.People.Schema.Person): GoogleAppsScript.People.Schema.Person {
	const params: UpdateParameters = {
		updatePersonFields: "names,biographies",
	}
	if (contact.resourceName === undefined) {
		throw new Error("invalid contact for update with an empty resourceName")
	}
	Utilities.sleep(1000)
	const updatedContact = People.People!.updateContact(contact, contact.resourceName, params)
	if (updatedContact === undefined) {
		throw new Error("contact updater has failed. contact informations: " + contact)
	}
	// contact has been succefull updated 
	contact = updatedContact
	return contact
}

export function createContact(contact: GoogleAppsScript.People.Schema.Person): GoogleAppsScript.People.Schema.Person {
	const params: CreateParameters = {
		personFields: "names,emailAddresses,biographies"
	}
	Utilities.sleep(1000)
	const newContact = People.People!.createContact(contact, params)
	if (newContact === undefined) {
		throw new Error("contact creator has failed. contact informations: " + contact)
	}
	// contact has been succefull created
	contact = newContact
	return contact
}

export function debugPeoples(peoples: Array<GoogleAppsScript.People.Schema.Person>): void {
	for (var i = 0; i < peoples.length; i++) {
		console.log(peoples[i])
	}
}