import 'google-apps-script';
import { Member } from 'Models';

const subjectMail = "[Face Planète] Bienvenue "
const pathMailTemplate = "template/welkome"

export function sendWelkomeEmail(member: Member): void {
	const temp = HtmlService.createTemplateFromFile(pathMailTemplate)
	temp.member = member
	const message = temp.evaluate().getContent()

	MailApp.sendEmail({
		to: member.mail,
		subject: subjectMail + member.firstName,
		htmlBody: message,
	} as GoogleAppsScript.Mail.MailAdvancedParameters)
}