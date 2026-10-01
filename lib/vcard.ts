import { UserProfile } from '@/types/taplink';

/**
 * Generates an RFC 6350 standard vCard 3.0 string and triggers download
 */
export function generateVCardString(profile: UserProfile): string {
  const parts: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile.fullName}`,
    `N:${profile.fullName.split(' ').reverse().join(';')};;;`,
  ];

  if (profile.company) {
    parts.push(`ORG:${profile.company}`);
  }

  if (profile.jobTitle) {
    parts.push(`TITLE:${profile.jobTitle}`);
  }

  if (profile.contacts.phone) {
    parts.push(`TEL;TYPE=CELL,VOICE:${profile.contacts.phone}`);
  }

  if (profile.contacts.email) {
    parts.push(`EMAIL;TYPE=INTERNET,PREF:${profile.contacts.email}`);
  }

  if (profile.contacts.website) {
    parts.push(`URL:${profile.contacts.website}`);
  }

  if (profile.location) {
    parts.push(`ADR;TYPE=WORK:;;;${profile.location};;;`);
  }

  if (profile.bio) {
    parts.push(`NOTE:${profile.bio.replace(/\n/g, '\\n')}`);
  }

  // Social handles & extended vCard properties
  if (profile.contacts.linkedin) {
    parts.push(`X-SOCIALPROFILE;type=linkedin:https://linkedin.com/in/${profile.contacts.linkedin}`);
  }
  if (profile.contacts.instagram) {
    parts.push(`X-SOCIALPROFILE;type=instagram:https://instagram.com/${profile.contacts.instagram}`);
  }
  if (profile.contacts.telegram) {
    parts.push(`X-SOCIALPROFILE;type=telegram:https://t.me/${profile.contacts.telegram.replace('@', '')}`);
  }
  if (profile.contacts.whatsapp) {
    parts.push(`X-SOCIALPROFILE;type=whatsapp:https://wa.me/${profile.contacts.whatsapp.replace(/[^0-9]/g, '')}`);
  }

  parts.push(`REV:${new Date().toISOString()}`);
  parts.push('END:VCARD');

  return parts.join('\r\n');
}

export function downloadVCard(profile: UserProfile): void {
  const vcardText = generateVCardString(profile);
  const blob = new Blob([vcardText], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  
  const sanitizedName = profile.fullName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  anchor.href = url;
  anchor.setAttribute('download', `${sanitizedName}_contact.vcf`);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
