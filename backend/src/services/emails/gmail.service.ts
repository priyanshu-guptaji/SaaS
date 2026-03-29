import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify', 'https://www.googleapis.com/auth/gmail.send'];

export class GmailService {
  private oauth2Client: OAuth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    );
  }

  getAuthUrl(tenantId: string) {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      state: tenantId,
      prompt: 'consent'
    });
  }

  async setTokens(refreshToken: string) {
    this.oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });
  }

  async fetchNewEmails(userId: string = 'me', lastSyncTime?: Date) {
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    
    // Query: only unread or after a certain date
    const q = lastSyncTime ? `after:${Math.floor(lastSyncTime.getTime() / 1000)}` : 'is:unread';
    
    const response = await gmail.users.messages.list({
      userId,
      q,
      maxResults: 10
    });

    const messages = response.data.messages || [];
    const results = [];

    for (const msg of messages) {
       if (msg.id) {
         const detail = await gmail.users.messages.get({
           userId,
           id: msg.id,
           format: 'full'
         });
         results.push(this.parseEmail(detail.data));
       }
    }

    return results;
  }

  private parseEmail(message: any) {
    const headers = message.payload.headers;
    const subject = headers.find((h: any) => h.name === 'Subject')?.value || 'No Subject';
    const from = headers.find((h: any) => h.name === 'From')?.value || 'Unknown';
    const to = headers.find((h: any) => h.name === 'To')?.value || 'Unknown';
    
    // Simple body extraction (handling multipart/alternative)
    let body = '';
    const parts = message.payload.parts || [message.payload];
    
    function extractBody(parts: any[]) : string {
      for (const part of parts) {
        if (part.mimeType === 'text/plain' && part.body.data) {
          return Buffer.from(part.body.data, 'base64').toString();
        } else if (part.parts) {
          const result = extractBody(part.parts);
          if (result) return result;
        }
      }
      return '';
    }

    body = extractBody(parts);

    return {
      externalId: message.id,
      threadId: message.threadId,
      subject,
      from,
      to,
      body,
      receivedAt: new Date(parseInt(message.internalDate)),
    };
  }

  async sendReply(threadId: string, to: string, subject: string, body: string) {
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    
    const rawSubject = subject.startsWith('Re:') ? subject : `Re: ${subject}`;
    const utf8Subject = `=?utf-8?B?${Buffer.from(rawSubject).toString('base64')}?=`;
    
    const str = [
      `Content-Type: text/plain; charset="UTF-8"`,
      `MIME-Version: 1.0`,
      `Content-Transfer-Encoding: 7bit`,
      `to: ${to}`,
      `subject: ${utf8Subject}`,
      `In-Reply-To: ${threadId}`,
      `References: ${threadId}`,
      ``,
      body
    ].join('\n');

    const encodedMessage = Buffer.from(str)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
        threadId: threadId,
      },
    });
  }
}
