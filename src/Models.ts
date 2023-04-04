/*
** Create a new Member instance
** @param {string} firstName The first name member.
** @param {string} lastName The last name member.
** @param {string} licence The licence number.
** @param {string} email The member's email.
** @param {string} licenceYear The licence year for validation.
*/
export interface Member {
	firstName: string;
	lastName: string;
	licence: string;
	mail: string;
	licenceYear: string;
}
