import 'google-apps-script';
import { Member } from 'Models';

const subjectMail = "[Face Planète] Bienvenue "
const pathMailTemplate = "template/welkome"
const templateHTML = HtmlService.createTemplateFromFile(pathMailTemplate)

export function sendWelkomeEmail(member: Member): void {
	templateHTML.member = member

	MailApp.sendEmail({
		to: member.mail,
		subject: subjectMail + member.firstName,
		htmlBody: templateHTML.evaluate().getContent(),
	} as GoogleAppsScript.Mail.MailAdvancedParameters)
}