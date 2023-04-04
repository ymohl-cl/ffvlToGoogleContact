import 'google-apps-script';

export function provideContactGroup(groupName: string): GoogleAppsScript.People.Schema.ContactGroup {
	var group = getContactGroup(groupName)
	if (group !== undefined) {
		return group
	}

	return createContactGroup(groupName)
}

function getContactGroup(name: string): GoogleAppsScript.People.Schema.ContactGroup | undefined {
	Utilities.sleep(1000)
	const groupList = People.ContactGroups!.list();
	if (groupList === undefined) {
		return undefined
	}
	// Finds the contact group for the person where the name matches.
	const group: GoogleAppsScript.People.Schema.ContactGroup | undefined = groupList['contactGroups']!.find((group) => group['name'] === name);
	return group 
}

function createContactGroup(name: string): GoogleAppsScript.People.Schema.ContactGroup {
	Utilities.sleep(1000)
	const groupRequest = {
		contactGroup: {
			name: name,
		} as GoogleAppsScript.People.Schema.ContactGroup
	} as GoogleAppsScript.People.Schema.CreateContactGroupRequest
	const newGroup = People.ContactGroups!.create(groupRequest)
	if (newGroup === undefined) {
		throw new Error("contact group creation has failed")
	}

	return newGroup
}

export function addMembersToContactGroup(group: GoogleAppsScript.People.Schema.ContactGroup, members: Array<GoogleAppsScript.People.Schema.Person>) {
	const dataRequest = {
		resourceNamesToAdd: [],
	} as GoogleAppsScript.People.Schema.ModifyContactGroupMembersRequest

	for (var i = 0; i < members.length; i++) {
		dataRequest.resourceNamesToAdd!.push(members[i].resourceName!)
	}

	if (group.resourceName === undefined) {
		throw new Error("could add member to the contact group with an empty group")
	}
	Utilities.sleep(1000)
	People.ContactGroups!.Members!.modify(dataRequest, group.resourceName)
}