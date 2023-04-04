import 'google-apps-script';

export function provideContactGroup(groupName: string): GoogleAppsScript.People.Schema.ContactGroup {
	var group = getContactGroup(groupName)
	if (group !== undefined) {
		return group
	}

	return createContactGroup(groupName)
}

function getContactGroup(name: string): GoogleAppsScript.People.Schema.ContactGroup | undefined {
		const groupList = People.ContactGroups?.list();
		if (groupList === undefined) {
			return undefined
		}
		// Finds the contact group for the person where the name matches.
		const group: GoogleAppsScript.People.Schema.ContactGroup | undefined = groupList['contactGroups']?.find((group) => group['name'] === name);

		return group 
}

function createContactGroup(name: string): GoogleAppsScript.People.Schema.ContactGroup {
	const groupRequest = {
		contactGroup: {
			name: name,
		} as GoogleAppsScript.People.Schema.ContactGroup
	} as GoogleAppsScript.People.Schema.CreateContactGroupRequest
	const newGroup = People.ContactGroups?.create(groupRequest)
	if (newGroup === undefined) {
		throw new Error("contact group creation has failed")
	}

	return newGroup
}

export function addMemberToContactGroup(group: GoogleAppsScript.People.Schema.ContactGroup, member: GoogleAppsScript.People.Schema.Person): void {
	const dataRequest = {
		resourceNamesToAdd: [
			member.resourceName,
		]
	} as GoogleAppsScript.People.Schema.ModifyContactGroupMembersRequest
	if (group.resourceName === undefined) {
		throw new Error("could add member to the contact group with an empty group")
	}
	People.ContactGroups?.Members?.modify(dataRequest, group.resourceName)
}